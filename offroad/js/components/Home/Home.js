import React, { Component } from 'react';
import {
    Linking,
    Text,
    View,
    ScrollView,
    NetInfo,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Native Modules
import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';

import {
    fetchAccount,
    fetchDeviceStats,
    updateConnectionState,
    updateUpdateIsAvailable,
} from '../../store/host/actions';
import { refreshParams } from '../../store/params/actions';

// UI
import { HOME_BUTTON_GRADIENT } from '../../styles/gradients';
import X from '../../themes';
import Styles from './HomeStyles';
import { formatCommas } from '../../utils/number';

class Home extends Component {
    static navigationOptions = {
      header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            alertsVisible: false,
            alerts: [],
        };
    }

    async componentWillMount() {
        await this.props.fetchAccount();
        await this.props.refreshParams();
        await this.props.fetchDeviceStats();
        await this.props.updateUpdateParams();
    }

    async componentDidMount() {
        await this.refreshOffroadParams();
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
        await NetInfo.isConnected.fetch().then(this._handleConnectionChange);
        this.checkOffroadParams = setInterval(() => {
            this.refreshOffroadParams();
        }, 5000);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
        clearInterval(this.checkOffroadParams);
    }

    _handleConnectionChange = (isConnected) => {
        console.log('Connection status is ' + (isConnected ? 'online' : 'offline') + ' ' + isConnected);
        this.props.updateConnectionState(isConnected);
    };

    refreshOffroadParams = async () => {
        console.log('refreshing offroad params...');
        await this.props.refreshParams();
        const { params } = this.props;
        Object.keys(params).map((param) => {
            const { alerts } = this.state;
            let _alerts = [...this.state.alerts];
            if (param.includes('Offroad_')) {
                const _alert = JSON.parse(params[param]);
                if (_alert.severity > -1) {
                    if (alerts.filter((a) => { return a.name == param; }).length == 0) {
                        _alerts.push({ name: param, ..._alert });
                        this.setState({
                            alerts: _alerts,
                            alertsVisible: _alerts.length > alerts.length,
                        });
                    }
                } else {
                    _alerts = alerts.filter(a => a.name !== param);
                    this.setState({ alerts: _alerts });
                    if (_alerts.length == 0) {
                        this.setState({ alertsVisible: false });
                    }
                }
            }
        })
    }

    handleAlertButtonPressed = () => {
        this.setState({ alertsVisible: true });
    }

    handleHideAlertsPressed = () => {
        this.setState({ alertsVisible: false });
    }

    handleFinishPairingPressed = () => {
        this.props.openPairing();
    }

    checkIsInAmerica = () => {
        const { latitude, longitude } = this.props;
        const top = 49.3457868; // north lat
        const left = -124.7844079; // west long
        const right = -66.9513812; // east long
        const bottom =  24.7433195; // south lat

        return ((bottom <= latitude) && (latitude <= top) && (left <= longitude) && (longitude <= right));
    }

    render() {
        const {
            alerts,
            alertsVisible,
        } = this.state;

        const {
            hasPrime,
            isPaired,
            isNavAvailable,
            summaryDate,
            summaryCity,
            params,
            isConnected,
            deviceStats,
            username,
            commaPoints,
            updateIsAvailable,
            updateReleaseNotes,
        } = this.props;

        const softwareName = !!parseInt(params.Passive) ? 'dashcam' : 'openpilot';
        const softwareString = `${ softwareName } v${ params.Version }`;
        const isAmerica = this.checkIsInAmerica();
        const hasDeviceStats = typeof(deviceStats.all) !== 'undefined';

        const homeHeaderStyles = [
            Styles.homeHeader,
            alertsVisible && Styles.homeHeaderSmall,
        ];

        const homeBodyStyles = [
            Styles.homeBody,
            (alertsVisible || !isConnected) && Styles.homeBodyDark,
        ];

        return (
            <X.Gradient color='flat_blue'>
                <View style={ Styles.home }>
                    <View style={ homeHeaderStyles }>
                        <View style={ Styles.homeHeaderIntro }>
                            <View style={ Styles.homeHeaderIntroDate }>
                                <X.Text
                                    color='white'
                                    weight='light'>
                                    { summaryDate }
                                </X.Text>
                            </View>
                            <View style={ Styles.homeHeaderIntroCity }>
                                { !alertsVisible ? (
                                    <X.Text
                                        color='white'
                                        size={ summaryCity.length > 20 ? 'big' : 'jumbo' }
                                        numberOfLines={ 1 }
                                        weight='semibold'>
                                        { summaryCity }
                                    </X.Text>
                                ) : null }
                            </View>
                        </View>
                        <View style={ Styles.homeHeaderDetails }>
                            <View style={ Styles.homeHeaderDetailsVersion }>
                                { !updateIsAvailable ? (
                                    <X.Image
                                        style={ Styles.homeHeaderDetailsVersionIcon }
                                        isFlex={ false }
                                        source={ require('../../img/icon_checkmark.png') } />
                                ) : null }
                                <X.Text
                                    color='white'
                                    size='tiny'>
                                    { softwareString }
                                </X.Text>
                            </View>
                            { updateIsAvailable ? (
                                <View style={ Styles.homeHeaderDetailsAction }>
                                    <X.Button
                                        size='smaller'
                                        color='lightGrey'
                                        onPress={ () => this.props.handleUpdateButtonPressed(updateReleaseNotes) }>
                                        <X.Text
                                            color='darkBlue'
                                            size='tiny'
                                            weight='semibold'>
                                            Update Available
                                        </X.Text>
                                    </X.Button>
                                </View>
                            ) : null }
                            { alerts.length > 0 && !alertsVisible ? (
                                <View style={ Styles.homeHeaderDetailsAction }>
                                    <X.Button
                                        size='smaller'
                                        color='redAlert'
                                        onPress={ this.handleAlertButtonPressed }>
                                        <X.Text
                                            color='white'
                                            size='tiny'
                                            weight='semibold'>
                                            { alerts.length } { alerts.length > 1 ? 'ALERTS' : 'ALERT' }
                                        </X.Text>
                                    </X.Button>
                                </View>
                            ) : null }
                        </View>
                    </View>
                    { alertsVisible ? (
                        <View style={ homeBodyStyles }>
                            <ScrollView style={ Styles.homeBodyAlerts }>
                                { alerts.sort((a, b) => (a.severity > b.severity) ? -1 : 1).map((alert, i) => {
                                    const alertStyle = [
                                        Styles.homeBodyAlert,
                                        alert.severity == 1 && Styles.homeBodyAlertRed,
                                    ];
                                    return (
                                        <View
                                            style={ alertStyle }
                                            key={ `alert_${ i }` }>
                                            <X.Image
                                                isFlex={ false }
                                                style={ Styles.homeBodyAlertIcon }
                                                source={ require('../../img/icon_warning.png') } />
                                            <X.Text
                                                color='white'
                                                size='medium'
                                                weight='semibold'
                                                style={ Styles.homeBodyAlertText }>
                                                { alert.text }
                                            </X.Text>
                                        </View>
                                    )
                                })}
                                <View style={ Styles.homeBodyAlertActions }>
                                    <X.Button
                                        size='tiny'
                                        onPress={ this.handleHideAlertsPressed }
                                        style={ Styles.homeBodyAlertAction }>
                                        Hide Alerts
                                    </X.Button>
                                </View>
                            </ScrollView>
                        </View>
                    ) : !isConnected ? (
                        <View style={ homeBodyStyles }>
                            <View style={ Styles.homeBodyDisconnected }>
                                <X.Text
                                    color='white'
                                    size='jumbo'
                                    weight='semibold'>
                                    No Network Connection
                                </X.Text>
                                <X.Text
                                    color='lightGrey700'
                                    size='medium'
                                    style={ Styles.homeBodyDisconnectedContext }>
                                    Connect to a WiFi or cellular network to upload and review your drives.
                                </X.Text>
                            </View>
                        </View>
                    ) : (
                      <View style={ homeBodyStyles }>
                          <View style={ [Styles.homeBodyStats, !isPaired && Styles.homeBodyStatsUnpaired ] }>
                              <View style={ Styles.homeBodyStatsHeader }>
                                  <X.Text
                                      color='white'
                                      size='tiny'
                                      weight='semibold'>
                                      PAST WEEK
                                  </X.Text>
                              </View>
                              <View style={ Styles.homeBodyStatsRow }>
                                  <View style={ Styles.homeBodyStat }>
                                      <X.Text
                                          color='white'
                                          size='big'
                                          weight='semibold'
                                          style={ Styles.homeBodyStatNumber }>
                                          { hasDeviceStats ? formatCommas(deviceStats.week.routes) : '0' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyStatLabel }>
                                          DRIVES
                                      </X.Text>
                                  </View>
                                  <View style={ Styles.homeBodyStat }>
                                      <X.Text
                                          color='white'
                                          size='big'
                                          weight='semibold'
                                          style={ Styles.homeBodyStatNumber }>
                                          { hasDeviceStats ? formatCommas(Math.floor(deviceStats.week.distance)) : '0' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyStatLabel }>
                                          MILES
                                      </X.Text>
                                  </View>
                                  <View style={ Styles.homeBodyStat }>
                                      <X.Text
                                          color='white'
                                          size='big'
                                          weight='semibold'
                                          style={ Styles.homeBodyStatNumber }>
                                          { hasDeviceStats ? formatCommas(Math.floor(deviceStats.week.minutes / 60)) : '0' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyStatLabel }>
                                          HOURS
                                      </X.Text>
                                  </View>
                              </View>
                              <X.Line
                                  color='light'
                                  spacing='none' />
                              <View style={ Styles.homeBodyStatsHeader }>
                                  <X.Text
                                      color='white'
                                      size='tiny'
                                      weight='semibold'>
                                      ALL TIME
                                  </X.Text>
                              </View>
                              <View style={ Styles.homeBodyStatsRow }>
                                  <View style={ Styles.homeBodyStat }>
                                      <X.Text
                                          color='white'
                                          size='medium'
                                          weight='semibold'
                                          style={ Styles.homeBodyStatNumber }>
                                          { hasDeviceStats ? formatCommas(deviceStats.all.routes) : '0' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyStatLabel }>
                                          DRIVES
                                      </X.Text>
                                  </View>
                                  <View style={ Styles.homeBodyStat }>
                                      <X.Text
                                          color='white'
                                          size='medium'
                                          weight='semibold'
                                          style={ Styles.homeBodyStatNumber }>
                                          { hasDeviceStats ? formatCommas(Math.floor(deviceStats.all.distance)) : '0' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyStatLabel }>
                                          MILES
                                      </X.Text>
                                  </View>
                                  <View style={ Styles.homeBodyStat }>
                                      <X.Text
                                          color='white'
                                          size='medium'
                                          weight='semibold'
                                          style={ Styles.homeBodyStatNumber }>
                                          { hasDeviceStats ? formatCommas(Math.floor(deviceStats.all.minutes / 60)) : '0' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyStatLabel }>
                                          HOURS
                                      </X.Text>
                                  </View>
                              </View>
                          </View>
                          { isPaired && (!hasPrime || !isAmerica) ? (
                              <View style={ Styles.homeBodyAccount }>
                                  <View style={ Styles.homeBodyAccountPoints }>
                                      <X.Text
                                          color='white'
                                          size='big'
                                          weight='semibold'
                                          style={ Styles.homeBodyAccountPointsNumber }>
                                          { typeof(commaPoints) !== 'undefined' ? (
                                            formatCommas(commaPoints)
                                          ) : '--' }
                                      </X.Text>
                                      <X.Text
                                          color='lightGrey700'
                                          size='tiny'
                                          style={ Styles.homeBodyAccountPointsLabel }>
                                          COMMA POINTS
                                      </X.Text>
                                  </View>
                                  <View style={ Styles.homeBodyAccountDetails }>
                                      { typeof(username) !== 'undefined' ? (
                                          <X.Text
                                              color='white'
                                              size='small'
                                              weight='semibold'
                                              style={ Styles.homeBodyAccountDetailsName }>
                                              @{ username }
                                          </X.Text>
                                      ) : null }
                                  </View>
                              </View>
                          ) : isPaired ? (
                              <View style={ [Styles.homeBodyAccount, Styles.homeBodyAccountDark] }>
                                  <View style={ Styles.homeBodyAccountUpgrade }>
                                      <X.Text
                                          color='white'
                                          size='medium'
                                          weight='semibold'
                                          style={ Styles.homeBodyAccountUpgradeTitle }>
                                          Upgrade Now
                                      </X.Text>
                                      <X.Text
                                          color='white'
                                          size='tiny'
                                          weight='light'
                                          style={ Styles.homeBodyAccountUpgradeContext }>
                                          Become a comma prime member in the comma app and get premium features!
                                      </X.Text>
                                      <View style={ Styles.homeBodyAccountUpgradeFeatures }>
                                          <View style={ Styles.homeBodyAccountUpgradeFeature }>
                                              <X.Image
                                                  isFlex={ false }
                                                  style={ Styles.homeBodyAccountUpgradeIcon }
                                                  source={ require('../../img/icon_checkmark.png') } />
                                              <X.Text
                                                  color='white'
                                                  size='tiny'
                                                  weight='semibold'>
                                                  Remote Access
                                              </X.Text>
                                          </View>
                                          <View style={ Styles.homeBodyAccountUpgradeFeature }>
                                              <X.Image
                                                  isFlex={ false }
                                                  style={ Styles.homeBodyAccountUpgradeIcon }
                                                  source={ require('../../img/icon_checkmark.png') } />
                                              <X.Text
                                                  color='white'
                                                  size='tiny'
                                                  weight='semibold'>
                                                  14 days of storage
                                              </X.Text>
                                          </View>
                                          <View style={ Styles.homeBodyAccountUpgradeFeature }>
                                              <X.Image
                                                  isFlex={ false }
                                                  style={ Styles.homeBodyAccountUpgradeIcon }
                                                  source={ require('../../img/icon_checkmark.png') } />
                                              <X.Text
                                                  color='white'
                                                  size='tiny'
                                                  weight='semibold'>
                                                  Developer perks
                                              </X.Text>
                                          </View>
                                      </View>
                                  </View>
                              </View>
                          ) : (
                              <View style={ Styles.homeBodyAccount }>
                                  <X.Button
                                      color='transparent'
                                      size='full'
                                      onPress={ this.handleFinishPairingPressed }>
                                      <X.Gradient
                                          colors={ HOME_BUTTON_GRADIENT }
                                          style={ Styles.homeBodyAccountPairButton }>
                                          <View style={ Styles.homeBodyAccountPairButtonHeader }>
                                              <X.Text
                                                  color='white'
                                                  size='medium'
                                                  weight='semibold'>
                                                  Finish Setup
                                              </X.Text>
                                              <X.Image
                                                  isFlex={ false }
                                                  style={ Styles.homeBodyAccountPairButtonIcon }
                                                  source={ require('../../img/icon_chevron_right.png') } />
                                          </View>
                                          <X.Text
                                              color='white'
                                              size='tiny'
                                              weight='light'
                                              style={ Styles.homeBodyAccountPairButtonContext }>
                                              Pair your comma account with comma connect
                                          </X.Text>
                                      </X.Gradient>
                                  </X.Button>
                              </View>
                          ) }
                      </View>
                    )}
                </View>
            </X.Gradient>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.host.account && state.host.account.username,
        commaPoints: state.host.account && state.host.account.points,
        hasPrime: state.host.device && state.host.device.sim_id !== null,
        isPaired: state.host.device && state.host.device.is_paired,
        isNavAvailable: state.host.isNavAvailable,
        latitude: state.environment.latitude,
        longitude: state.environment.longitude,
        summaryCity: state.environment.city,
        summaryDate: state.environment.date,
        params: state.params.params,
        isConnected: state.host.isConnected,
        deviceStats: state.host.deviceStats,
        account: state.host.account,
        updateIsAvailable: state.host.updateIsAvailable,
        updateReleaseNotes: state.host.updateReleaseNotes,
    };
};

const mapDispatchToProps = (dispatch) => ({
    openPairing: () => {
        dispatch(NavigationActions.navigate({ routeName: 'SetupQr' }))
    },
    updateConnectionState: (isConnected) => {
        dispatch(updateConnectionState(isConnected));
    },
    updateUpdateParams: async () => {
        await dispatch(updateUpdateIsAvailable());
    },
    fetchAccount: async () => {
        await dispatch(fetchAccount());
    },
    fetchDeviceStats: async () => {
        await dispatch(fetchDeviceStats());
    },
    refreshParams: async () => {
        await dispatch(refreshParams());
    },
    handleUpdateButtonPressed: (releaseNotes) => {
        dispatch(NavigationActions.navigate({
            routeName: 'UpdatePrompt',
            params: { releaseNotes }
        }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
