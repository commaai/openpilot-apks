import React, { Component } from 'react';
import {
    Linking,
    Text,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// Native Modules
import ChffrPlus from '../../native/ChffrPlus';

// UI
import { HOME_BUTTON_GRADIENT } from '../../styles/gradients';
import X from '../../themes';
import Styles from './HomeStyles';

class Home extends Component {
    static navigationOptions = {
      header: null,
    };

    handlePressedStartDrive = () => {
        this.props.onNewDrivePressed();
    }

    handlePressedSettings = () => {
        ChffrPlus.sendBroadcast("ai.comma.plus.offroad.NAVIGATED_TO_SETTINGS");
        this.props.openSettings();
    }

    renderDrivePrompt() {
        return (
            <X.Button
                color='transparent'
                size='full'
                onPress={ this.handlePressedStartDrive }>
                <X.Gradient
                    colors={ HOME_BUTTON_GRADIENT }
                    style={ Styles.homeActionsPrimaryButton }>
                    <View style={ Styles.homeActionsPrimaryButtonBody }>
                        <View style={ Styles.homeActionsPrimaryButtonIcon }>
                            <X.Image
                                source={ require('../../img/icon_plus.png') } />
                        </View>
                        <X.Text
                            color='white'
                            weight='semibold'
                            size='medium'>
                            New Drive
                        </X.Text>
                    </View>
                </X.Gradient>
            </X.Button>
        );
    }

    render() {
        const {
            isPaired,
            isNavAvailable,
            summaryDate,
            summaryCity,
        } = this.props;

        return (
            <X.Gradient color='dark_blue'>
                <View style={ Styles.home }>
                    <View style={ Styles.homeWelcome }>
                        <View style={ Styles.homeWelcomeSummary }>
                            <View style={ Styles.homeWelcomeSummaryDate }>
                                <X.Text
                                    color='white'
                                    weight='light'>
                                    { summaryDate }
                                </X.Text>
                            </View>
                            <View style={ Styles.homeWelcomeSummaryCity }>
                                <X.Text
                                    color='white'
                                    size={ summaryCity.length > 20 ? 'big' : 'jumbo' }
                                    numberOfLines={ 1 }
                                    weight='semibold'>
                                    { summaryCity }
                                </X.Text>
                            </View>
                        </View>
                    </View>
                    <View style={ Styles.homeActions }>
                        <View style={ Styles.homeActionsPrimary }>
                            { this.renderDrivePrompt() }
                        </View>
                        <View style={ Styles.homeActionsSecondary }>
                            <View style={ Styles.homeActionsSecondaryAction }>
                                <X.Button
                                    color='transparent'
                                    size='full'
                                    onPress={ isPaired ? null : this.props.openPairing }>
                                    <X.Gradient
                                        colors={ HOME_BUTTON_GRADIENT }
                                        style={ Styles.homeActionsSecondaryButton }>
                                        { isPaired ?
                                            <View style={ Styles.homeActionsSecondaryButtonBody }>
                                                <View style={ Styles.homeActionsSecondaryButtonIcon }>
                                                    <X.Image
                                                        source={ require('../../img/icon_road.png') } />
                                                </View>
                                                <X.Text
                                                    color='white'
                                                    weight='semibold'>
                                                    EON Paired
                                                </X.Text>
                                            </View>
                                            :
                                            <View style={ Styles.homeActionsSecondaryButtonBody }>
                                                <View style={ Styles.homeActionsSecondaryButtonIcon }>
                                                    <X.Image
                                                        source={ require('../../img/icon_user.png') } />
                                                </View>
                                                <X.Text
                                                    color='white'
                                                    weight='semibold'>
                                                    Pair EON
                                                </X.Text>
                                            </View>
                                        }
                                    </X.Gradient>
                                </X.Button>
                            </View>
                            <View style={ Styles.homeActionsSecondaryAction }>
                                <X.Button
                                    color='transparent'
                                    size='full'
                                    onPress={ this.handlePressedSettings }>
                                    <X.Gradient
                                        colors={ HOME_BUTTON_GRADIENT }
                                        style={ Styles.homeActionsSecondaryButton }>
                                        <View style={ Styles.homeActionsSecondaryButtonBody }>
                                            <View style={ Styles.homeActionsSecondaryButtonIcon }>
                                                <X.Image
                                                    source={ require('../../img/icon_settings.png') } />
                                            </View>
                                            <X.Text
                                                color='white'
                                                weight='semibold'>
                                                Settings
                                            </X.Text>
                                        </View>
                                    </X.Gradient>
                                </X.Button>
                            </View>
                        </View>
                    </View>
                </View>
            </X.Gradient>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isPaired: state.host.device && state.host.device.is_paired,
        isNavAvailable: state.host.isNavAvailable,
        latitude: state.environment.latitude,
        longitude: state.environment.longitude,
        summaryCity: state.environment.city,
        summaryDate: state.environment.date,
    };
};

const mapDispatchToProps = (dispatch) => ({
    openSettings: () => {
        dispatch(NavigationActions.navigate({ routeName: 'Settings' }));
    },
    openPairing: () => {
        dispatch(NavigationActions.navigate({ routeName: 'SetupQr' }))
    },
    openDrives: () => {
        dispatch(NavigationActions.navigate({ routeName: 'DrivesOverview' }));
    },
    onNewDrivePressed: () => {
        ChffrPlus.sendBroadcast("ai.comma.plus.frame.ACTION_SHOW_START_CAR");
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
