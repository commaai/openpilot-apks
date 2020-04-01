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
import { updateConnectionState, updateSidebarCollapsed } from '../../store/host/actions';
import { resetToLaunch } from '../../store/nav/actions';
import { Params } from '../../config';
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
            attemptedNetworkSsid: null,
            connectedNetworkSsid: null,
            connectingNetwork: null,
            hasAuthProblem: false,
            password: '',
            showPassword: false,
            errorMessage: '',
        };

        this.updateAvailableNetworks = this.updateAvailableNetworks.bind(this);
    }

    componentWillMount() {
        this.refreshNetworks();
        DeviceEventEmitter.addListener('onWifiStateChange', this.onWifiStateChange);
    }

    componentDidMount() {
        this.checkWifiEnabled = setInterval(() => {
            if (this.state.isLoading && this.state.networks.length < 1) {
                this.setState({
                    isLoading: false,
                    errorMessage: 'There was a problem scanning WiFi networks. \nMake sure WiFi is enabled in \"More Options\" above.',
                })
            }
        }, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.checkWifiEnabled);
        DeviceEventEmitter.removeListener('onWifiStateChange', this.onWifiStateChange);
    }

    onWifiStateChange = ({ isConnected, connectedSsid, hasAuthProblem }) => {
        let { connectingNetwork } = this.state;
        let _attemptedNetworkSsid = null;
        let _connectedNetworkSsid = null;
        let _connectingNetwork = { ...connectingNetwork };
        let _hasAuthProblem = false;

        if (isConnected && !hasAuthProblem) {
            _connectedNetworkSsid = connectedSsid;
            _connectingNetwork = null;
        } else if (hasAuthProblem) {
            _attemptedNetworkSsid = connectedSsid;
            _hasAuthProblem = true;
            _connectingNetwork = null;
        } else {
            _attemptedNetworkSsid = connectedSsid;
        }

        this.setState({
            attemptedNetworkSsid: _attemptedNetworkSsid,
            connectedNetworkSsid: _connectedNetworkSsid,
            connectingNetwork: _connectingNetwork,
            hasAuthProblem: _hasAuthProblem,
        }, () => this.updateAvailableNetworks());
    }

    updateAvailableNetworks = (networks) => {
        if (networks === undefined) {
            networks = this.state.networks;
        };

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
            this.setState({ connectingNetwork: network });
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
                this.setState({
                    connectingNetwork: network,
                    password: '',
                }, () => {
                    if (network.security === SECURITY_UNSECURED) {
                        this.connectToNetwork(network);
                    } else {
                        this.popupDialog.show();
                        this.passwordInput.focus();
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
        Keyboard.dismiss();
    }

    onDismissPasswordPrompt = () => {
        Keyboard.dismiss();
        this.popupDialog.dismiss();
        this.setState({ connectingNetwork: null });
    }

    renderNetwork = ({ item }) => {
        const { attemptedNetworkSsid, connectedNetworkSsid, connectingNetwork, hasAuthProblem } = this.state;
        const hasAttempted = item.ssid == attemptedNetworkSsid && hasAuthProblem;
        const isConnected = item.ssid === connectedNetworkSsid;
        const isConnecting = connectingNetwork && item.ssid === connectingNetwork.ssid;

        return (
            <TouchableOpacity
                key={ item.ssid }
                activeOpacity={ 0.8 }
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
                            { isConnected ? 'Connected'
                                : isConnecting ? 'Authenticating...'
                                : hasAttempted ? 'Authentication problem'
                                : item.security }
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

    handleShowPasswordToggled = () => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    keyExtractor = item => item.ssid;

    render() {
        const { networks, connectingNetwork, connectedNetworkSsid, showPassword, isLoading } = this.state;
        const hasBackButton = typeof this.props.handleBackPressed === 'function';
        return (
            <X.Gradient
                color='flat_blue'>
                <X.Entrance style={ Styles.setupWifi }>
                    <PopupDialog
                        onDismissed={ this.onDismissPasswordPrompt }
                        ref={ (ref) => this.popupDialog = ref }
                        height={ 0.5 }
                        dialogStyle={ Styles.setupWifiPasswordDialog }
                        haveOverlay={ true }
                        dismissOnTouchOutside={ false }
                        actions={ [
                            <View
                                key="dialog_buttons"
                                style={ Styles.setupWifiPasswordDialogButtons }>
                                <View style={ Styles.setupWifiPasswordDialogCheckbox }>
                                    <X.CheckboxField
                                        size='tiny'
                                        color='dark'
                                        isChecked={ showPassword }
                                        onPress={ this.handleShowPasswordToggled }
                                        label='Show password' />
                                </View>
                                <X.Button
                                    key='cancel'
                                    size='small'
                                    color='setupInvertedLight'
                                    onPress={ this.onDismissPasswordPrompt }
                                    style={ Styles.setupWifiPasswordDialogButton }>
                                    <X.Text
                                        color='lightGrey700'
                                        size='small'
                                        weight='semibold'>
                                        Cancel
                                    </X.Text>
                                </X.Button>
                                <X.Button
                                    key='connect'
                                    size='small'
                                    color='setupPrimary'
                                    onPress={ () => this.onPasswordPromptConnectPressed() }
                                    style={ Styles.setupWifiPasswordDialogButton }>
                                    <X.Text
                                        color='white'
                                        size='small'
                                        weight='semibold'>
                                        Connect
                                    </X.Text>
                                </X.Button>
                            </View>
                        ] }>
                        <X.Text
                            size='small'
                            weight='semibold'>
                            The network "{ connectingNetwork ? connectingNetwork.ssid : '' }" requires a password.
                        </X.Text>
                        <View style={ Styles.setupWifiPasswordInputRow }>
                            <View style={ Styles.setupWifiPasswordInputLabel }>
                                <X.Text
                                    size='small'
                                    color='whiteFieldLabel'
                                    style={ Styles.setupWifiPasswordInputLabelText }>
                                    Password:
                                </X.Text>
                            </View>
                            <TextInput
                                onChangeText={ (password) => this.setState({ password }) }
                                value={ this.state.password }
                                secureTextEntry={ !showPassword }
                                ref={ ref => this.passwordInput = ref }
                                disableFullscreenUI={ true }
                                style={ Styles.setupWifiPasswordInputField }
                                underlineColorAndroid='transparent'
                                keyboardType={ showPassword ? 'email-address' : null }
                                autoCapitalize='none'
                            />
                        </View>
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
                            data={ networks }
                            renderItem={ this.renderNetwork }
                            style={ Styles.setupWifiNetworksList }
                            keyExtractor={ this.keyExtractor }
                            extraData={ this.state }
                            refreshControl={
                                <RefreshControl
                                    refreshing={ isLoading }
                                    onRefresh={ this.refreshNetworks } />
                            }
                            ListEmptyComponent={
                                <View style={ Styles.setupWifiNetworksEmpty }>
                                    <X.Text
                                        color='white'
                                        size='small'>
                                        { isLoading && networks.length == 0 ? 'Scanning WiFi Networks...'
                                            : !isLoading && networks.length == 0 ?
                                            this.state.errorMessage : '' }
                                    </X.Text>
                                </View>
                            }>
                        </FlatList>
                    </View>
                    <View style={ hasBackButton ? Styles.setupWifiButtonsWithBack : Styles.setupWifiButtons }>
                        { hasBackButton ? (
                            <X.Button
                                color='setupInverted'
                                onPress={ this.props.handleBackPressed }
                                style={ Styles.setupWifiBackButton }>
                                <X.Text
                                    color='white'
                                    weight='semibold'>
                                    Go Back
                                </X.Text>
                            </X.Button>
                        ) : null }
                        <X.Button
                            color={ connectedNetworkSsid ? 'setupPrimary' : 'setupInverted' }
                            onPress={ connectedNetworkSsid ? () => this.props.handleSetupWifiCompleted(hasBackButton) : () => this.props.handleSetupWifiSkip(hasBackButton) }
                            style={ Styles.setupWifiContinueButton }>
                            <X.Text
                                color='white'
                                weight='semibold'>
                                { !connectedNetworkSsid ? 'Skip For Now' : 'Continue' }
                            </X.Text>
                        </X.Button>
                    </View>
                </X.Entrance>
            </X.Gradient>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

const mapDispatchToProps = dispatch => ({
    handleSetupWifiMoreOptionsPressed: () => {
        ChffrPlus.openWifiSettings();
    },
    handleSetupWifiCompleted: async (hasBackButton) => {
        await dispatch(updateSidebarCollapsed(false));
        await dispatch(updateConnectionState(true));
        await dispatch(resetToLaunch());
        ChffrPlus.emitSidebarExpanded();
        if (hasBackButton) {
            ChffrPlus.emitHomePress();
        }
    },
    handleSetupWifiSkip: async (hasBackButton) => {
        await ChffrPlus.writeParam(Params.KEY_HAS_COMPLETED_SETUP, "1");
        await dispatch(updateSidebarCollapsed(false));
        await dispatch(resetToLaunch());
        ChffrPlus.emitSidebarExpanded();
        if (hasBackButton) {
            ChffrPlus.emitHomePress();
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupWifi);
