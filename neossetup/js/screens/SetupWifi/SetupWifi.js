import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
import Styles from './SetupWifiStyles';

const SECURITY_UNSECURED = 'Unsecured';
const BarImagesByLevel = {
  0: require('../../img/indicator_wifi_25.png'),
  1: require('../../img/indicator_wifi_50.png'),
  2: require('../../img/indicator_wifi_75.png'),
  3: require('../../img/indicator_wifi_100.png'),
};

class SetupWifi extends Component {
    static navigationOptions = {
        header: null,
    };

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
                <View style={ Styles.setupWifiNetwork } key={ item.ssid }>
                    <Image
                        source={ BarImagesByLevel[item.level] }
                        style={ Styles.setupWifiNetworkIcon }
                        resizeMode='contain' />
                    <View style={ Styles.setupWifiNetworkDetails }>
                        <X.Text
                            color='white'
                            size='small'
                            weight='semibold'>
                            { item.ssid }
                        </X.Text>
                        <X.Text
                            size='tiny'
                            color='lightGrey200'
                            weight='light'>
                            { isConnected ? 'Connected' : item.security }
                        </X.Text>
                    </View>
                    <View style={ Styles.setupWifiNetworkStatus }>
                        { isConnected ? (
                            <X.Button
                                color='setupInverted'
                                size='small'
                                style={ Styles.setupWifiNetworkButtonConnected }>
                                <Image
                                    source={ require('../../img/circled-checkmark.png') }
                                    style={ Styles.setupWifiNetworkButtonConnectedIcon }
                                    resizeMode='contain' />
                                <X.Text
                                    color='white'
                                    size='small'
                                    weight='semibold'>
                                    Connected
                                </X.Text>
                            </X.Button>
                        ): null }
                        { isConnecting ? (
                            <X.Button
                                color='setupInverted'
                                size='small'
                                onPress={ () => this.onTapToConnect(item) }
                                style={ Styles.setupWifiNetworkButton }>
                                <ActivityIndicator
                                    color='white'
                                    refreshing={ true }
                                    size={ 37 }
                                    style={ Styles.setupWifiConnectingIndicator }/>
                            </X.Button>
                        ): null }
                        { !isConnected && !isConnecting ? (
                            <X.Button
                                color='setupInverted'
                                size='small'
                                onPress={ () => this.onTapToConnect(item) }
                                style={ Styles.setupWifiNetworkButton }>
                                Connect
                            </X.Button>
                        ) : null }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    keyExtractor = item => item.ssid;

    render() {
        const { connectedNetworkSsid, showPasswordPrompt } = this.state;

        return (
            <X.Gradient
                color='dark_black'>
                <X.Entrance style={ Styles.setupWifi }>
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
                    <View style={ Styles.setupWifiHeader }>
                        <X.Text
                            color='white'
                            size='big'
                            weight='bold'>
                            Connect to WiFi
                        </X.Text>
                        <X.Button
                            size='small'
                            color='setupInverted'
                            onPress={ this.props.handleSetupWifiMoreOptionsPressed }
                            style={ Styles.setupWifiHeaderButton }>
                            More Options
                        </X.Button>
                    </View>
                    <View style={ Styles.setupWifiNetworks }>
                        <FlatList
                            data={ this.state.networks }
                            renderItem={ this.renderNetwork }
                            style={ Styles.setupWifiNetworksList }
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
                    <View style={ Styles.setupWifiButtons }>
                        <X.Button
                            color='setupInverted'
                            onPress={ () => this.props.handleSetupWifiBackPressed(this.state.isLoading) }
                            style={ Styles.setupWifiBackButton }>
                            Go Back
                        </X.Button>
                        <X.Button
                            color={ connectedNetworkSsid ? 'setupPrimary' : 'setupDisabled' }
                            onPress={ connectedNetworkSsid ? this.props.handleSetupWifiCompleted : null }
                            style={ Styles.setupWifiContinueButton }>
                            <X.Text
                                color={ connectedNetworkSsid ? 'white' : 'setupDisabled' }
                                weight='semibold'>
                                Continue
                            </X.Text>
                        </X.Button>
                    </View>
                </X.Entrance>
            </X.Gradient>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    handleSetupWifiMoreOptionsPressed: () => {
        ChffrPlus.openWifiSettings();
    },
    handleSetupWifiCompleted: () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: 'SetupTerms',
                })
            ]
        }))
    },
    handleSetupWifiBackPressed: (isLoading) => {
        if (!isLoading) {
            dispatch(NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'SetupWelcome',
                    })
                ]
            }))
        }
    },
});

export default connect(null, mapDispatchToProps)(SetupWifi);
