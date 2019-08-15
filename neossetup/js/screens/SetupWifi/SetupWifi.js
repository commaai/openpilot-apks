import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    FlatList,
    Image,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
} from 'react-native';
import PopupDialog, { DialogButton } from 'react-native-popup-dialog';
import { NetworkInfo } from 'react-native-network-info';
import Logging from '../../native/Logging';

import WifiModule from '../../native/Wifi';

import X from '../../themes';
import ChffrPlus from '../../native/ChffrPlus';

import SetupStyles from '../Setup/SetupStyles';
import Styles from './SetupWifiStyles';

const BarImagesByLevel = {
    0: require('../../img/indicator_wifi_25.png'),
    1: require('../../img/indicator_wifi_50.png'),
    2: require('../../img/indicator_wifi_75.png'),
    3: require('../../img/indicator_wifi_100.png'),
};

const SECURITY_UNSECURED = 'Unsecured';

class SetupWifi extends Component {
    static propTypes = {
        onContinue: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            networks: [],
            connectedNetworkSsid: null,
            connectingNetwork: null,
            password: '',
        };

        this.updateAvailableNetworks = this.updateAvailableNetworks.bind(this);
    }

    componentWillMount() {
        this.refreshNetworks();

        DeviceEventEmitter.addListener('onWifiStateChange', this.onWifiStateChange);
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeListener('onWifiStateChange', this.onWifiStateChange);
    }

    onWifiStateChange = ({ isConnected, connectedSsid, hasAuthProblem }) => {
        let { connectedNetworkSsid, connectingNetwork } = this.state;

        let isActiveConnectAttemptFulfilled = connectingNetwork && connectingNetwork.ssid === connectedSsid;
        let ssidDidChange = connectedSsid !== '<unknown ssid>' && connectedSsid !== this.state.connectedNetworkSsid
        if (isActiveConnectAttemptFulfilled || ssidDidChange) {
            connectingNetwork = null;
        }

        if (isConnected && !hasAuthProblem) {
            connectedNetworkSsid = connectedSsid;
        } else {
            connectedNetworkSsid = null;
        }

        this.setState({
            connectedNetworkSsid,
            connectingNetwork,
        }, () => this.updateAvailableNetworks());
    }

    updateAvailableNetworks = (networks) => {
        if (networks === undefined) networks = this.state.networks;

        const { connectedNetworkSsid } = this.state;
        networks = networks.sort((lhs, rhs) => {
            if (lhs.ssid === connectedNetworkSsid) {
                return -1;
            } else {
                return rhs.level - lhs.level;
            }
        });

        this.setState({ networks, isLoading: false });
    }

    refreshNetworks = () => {
        this.setState({ isLoading: true });

        WifiModule.listAvailableNetworks().then(networks => {
            let { connectedNetworkSsid } = this.state;
            const connectedNetwork = networks.find(network => network.isConnected);
            connectedNetworkSsid = (connectedNetwork && connectedNetwork.ssid) || connectedNetworkSsid;

            this.setState({ connectedNetworkSsid, networks }, this.updateAvailableNetworks);
        });
    }

    connectToNetwork = (network, password) => {
        try {
            WifiModule.connect(network.ssid, password || null);
            this.setState({ connectingNetwork: network});
        } catch(err) {
            this.setState({ connectingNetwork: null });
            if (err.code === 'E_WIFI_ERR') {
                Logging.cloudLog('Failed to connect to network', { network });
            } else {
                throw err;
            }
        }
    }

    onTapToConnect = async (network) => {
        if (this.state.connectingNetwork !== null) {
            // currently can only connect to 1 network at a time
            // todo, cancel existing
            return;
        }

        NetworkInfo.getSSID(ssid => {
            if (ssid === network.ssid) {
                // Already connected
                this.setState({ connectedNetworkSsid: ssid }, this.updateAvailableNetworks);
            } else {
                this.setState({ connectingNetwork: network}, () => {
                    if (network.security === SECURITY_UNSECURED) {
                        this.connectToNetwork(network);
                    } else {
                        this.popupDialog.show();
                    }
                });
            }
        });
    }

    onPasswordPromptConnectPressed = () => {
        const { password, connectingNetwork } = this.state;
        if (password.length < 8 || connectingNetwork == null) return;

        this.popupDialog.dismiss();
        this.connectToNetwork(connectingNetwork, password);
    }

    onDismissPasswordPrompt = () => {
        this.popupDialog.dismiss();
        this.setState({ connectingNetwork: null });
    }

    renderNetwork = ({ item }) => {
        const { connectedNetworkSsid, connectingNetwork } = this.state;

        const isConnected = item.ssid === connectedNetworkSsid;
        const isConnecting = connectingNetwork && item.ssid === connectingNetwork.ssid;

        return (
            <TouchableOpacity
                key={ item.ssid }
                onPress={ () => this.onTapToConnect(item) }>
                <View style={ Styles.networkRow } key={ item.ssid }>
                    <Image
                        source={ BarImagesByLevel[item.level] }
                        style={ Styles.barImage }
                        resizeMode='contain' />
                    <View style={ Styles.networkDetails }>
                        <X.Text size='medium' color='white'>{ item.ssid }</X.Text>
                        <X.Text size='small' color='white'>{ isConnected ? 'Connected' : item.security }</X.Text>
                    </View>
                    <View style={ Styles.networkRowRight }>
                        { isConnected ?
                            <Image
                                source={ require('../../img/circled-checkmark.png') }
                                style={ Styles.connectedImage }
                                resizeMode='contain' />
                        : null }
                        { isConnecting ?
                            <ActivityIndicator
                                color='white'
                                refreshing={ true }
                                size={ 37 }
                                style={ Styles.connectingIndicator }/>
                        : null }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    keyExtractor = item => item.ssid

    render() {
        const { connectedNetworkSsid, showPasswordPrompt } = this.state;

        return (
            <View style={ Styles.root }>
                <PopupDialog
                    onDismissed={ this.onDismissPasswordPrompt }
                    ref={ (ref) => this.popupDialog = ref }
                    width={ 0.75 }
                    height={ 0.5 }
                    dialogStyle={ Styles.passwordDialog }
                    haveOverlay={ false }
                    dismissOnTouchOutside={ true }
                    actions={ [
                        <View key="dialog_buttons" style={ { flexDirection: 'row' } }>
                            <DialogButton
                                key="cancel"
                                text="Cancel"
                                align="center"
                                buttonStyle={ Styles.dialogButton }
                                onPress={ this.onDismissPasswordPrompt }/>
                            <DialogButton
                                key="connect"
                                text="Connect"
                                align="center"
                                buttonStyle={ Styles.dialogButton }
                                onPress={ this.onPasswordPromptConnectPressed }/>
                        </View>
                    ] }>
                    <X.Text>
                        Password
                    </X.Text>
                    <TextInput
                        onChangeText={ (password) => this.setState({ password }) }
                        value={ this.state.password }
                        secureTextEntry={ true }
                        ref={ ref => this.passwordInput = ref }
                    />
                </PopupDialog>
                <View style={ Styles.listContainer }>
                    <FlatList
                        data={ this.state.networks }
                        renderItem={ this.renderNetwork }
                        style={ Styles.list }
                        keyExtractor={ this.keyExtractor }
                        extraData={ this.state }
                        refreshControl={
                            <RefreshControl
                                refreshing={ this.state.isLoading }
                                onRefresh={ this.refreshNetworks }
                            />
                        }
                     />
                </View>
                <View style={ Styles.buttons }>
                    <View style={ Styles.moreOptionsButton }>
                        <X.Button
                            color='setupInverted'
                            onPress={ this.props.onMoreOptionsPress }>
                            More Options
                        </X.Button>
                    </View>
                    <View style={ Styles.nextButton }>
                        <X.Button
                            color={ connectedNetworkSsid ? 'setupPrimary' : 'setupInverted' }
                            onPress={ this.props.onContinue }>
                            { connectedNetworkSsid === null ? 'Skip for now' : 'Continue' }
                        </X.Button>
                    </View>
                </View>
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onMoreOptionsPress: () => {
        ChffrPlus.openWifiSettings();
    },
});

export default connect(null, mapDispatchToProps)(SetupWifi);
