import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, NetInfo, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { resetToLaunch } from '../../store/nav/actions';
import X from '../../themes';
import Styles from './SetupQrStyles';
import { updateConnectionState, refreshDeviceInfo } from '../../store/host/actions';

class SetupPair extends Component {
    static navigationOptions = {
        header: null,
    };

    static propTypes = {
        onContinue: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            pairToken: null,
        }
    }

    async componentDidMount() {
        this.checkPaired = setInterval(async () => {
            this.props.refreshDeviceInfo();
        }, 5000);
        NetInfo.isConnected.addEventListener('connectionChange', this.props.handleConnectionChange);
        NetInfo.isConnected.fetch().then(this.props.handleConnectionChange);
        ChffrPlus.createJwt({ pair: true }).then((pairToken) => {
            this.setState({ pairToken });
        });
    }

    componentWillUnmount() {
        clearInterval(this.checkPaired);
        NetInfo.isConnected.removeEventListener('connectionChange', this.props.handleConnectionChange);
    }

    render() {
        const { serial, imei, isPaired} = this.props;
        return (
            <X.Gradient
                color='flat_blue'>
                <X.Entrance style={ Styles.setupPairing }>
                    <View style={ Styles.setupPairingHeader }>
                        <X.Text
                            color='white'
                            size='big'
                            weight='bold'>
                            Pair Your Account
                        </X.Text>
                    </View>
                    <View style={ Styles.setupPairingBody }>
                        <View style={ Styles.setupPairingCode }>
                            { this.state.pairToken && serial && imei ? (
                                <View style={ Styles.setupPairingCodeWrapper }>
                                    { isPaired ? (
                                      <View style={ Styles.setupPairingCodeOverlay }>
                                          <View style={ Styles.setupPairingCodeOverlayBar }>
                                              <View style={ Styles.setupPairingCodeOverlayBarCheckmark }>
                                                  <X.Image
                                                      source={ require('../../img/icon_checkmark.png') }
                                                      style={ Styles.setupPairingCodeOverlayBarCheckmarkIcon } />
                                              </View>
                                              <X.Text
                                                  color='whiteFieldLabel'
                                                  size='tiny'
                                                  weight='semibold'>
                                                  Succesfully paired to account
                                              </X.Text>
                                          </View>
                                      </View>
                                    ) : null }
                                    <QRCode
                                        value={ this.props.imei + '--' + this.props.serial + '--' + this.state.pairToken }
                                        size={ 232 } />
                                </View>
                            ) : (
                                <ActivityIndicator
                                    color='#ACB7BD'
                                    refreshing={ true }
                                    size={ 37 }
                                    style={ Styles.setupPairingLoadingIndicator } />
                            ) }
                        </View>
                        <View style={ Styles.setupPairingContext }>
                            <View style={ Styles.setupPairingText }>
                                <X.Text>
                                    <X.Text
                                        color='white'>
                                        { isPaired ? 'Successfully paired to an account in ' : 'Download ' }
                                    </X.Text>
                                    <X.Text
                                        color='white'
                                        weight='bold'>
                                        { 'comma connect ' }
                                    </X.Text>
                                    { isPaired ? null : (
                                      <X.Text
                                          color='white'>
                                          { 'and scan this code to pair.' }
                                      </X.Text>
                                    ) }
                                </X.Text>
                            </View>
                            <View style={ Styles.setupPairingIcons }>
                                <View style={ Styles.setupPairingIconsApp }>
                                    <X.Image
                                        source={ require('../../img/icon_connect_app.png') }
                                        style={ Styles.setupPairingIconsApp } />
                                </View>
                                <View style={ Styles.setupPairingIconsStores }>
                                    <X.Image
                                        source={ require('../../img/icon_app_store.png') }
                                        style={ Styles.setupPairingIconsAppStore } />
                                    <X.Image
                                        source={ require('../../img/icon_play_store.png') }
                                        style={ Styles.setupPairingIconsPlayStore } />
                                </View>
                            </View>
                            <View style={ Styles.setupPairingButtons }>
                                { isPaired ? (
                                    <X.Button
                                        color='setupPrimary'
                                        onPress={ this.props.handleSetupComplete }
                                        style={ Styles.setupPairingButtonsContinue }>
                                        Continue
                                    </X.Button>
                                ) : (
                                    <X.Button
                                        color='setupInverted'
                                        onPress={ this.props.handleSetupComplete }
                                        style={ Styles.setupPairingButtonsContinue }>
                                        Skip for Now
                                    </X.Button>
                                ) }
                            </View>
                        </View>
                    </View>
                </X.Entrance>
            </X.Gradient>
        );

    }
}

function mapStateToProps(state) {
    return {
        imei: state.host.imei,
        serial: state.host.serial,
        isConnected: state.host.isConnected,
        isPaired: state.host.device && state.host.device.is_paired,
    }
}

const mapDispatchToProps = dispatch => ({
    handleConnectionChange: (isConnected) => {
        dispatch(updateConnectionState(isConnected));
    },
    handleSetupComplete: async () => {
        await ChffrPlus.writeParam(Params.KEY_HAS_COMPLETED_SETUP, "1");
        dispatch(resetToLaunch());
    },
    refreshDeviceInfo: () => dispatch(refreshDeviceInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupPair);
