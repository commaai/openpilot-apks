import React from 'react';
import PropTypes from 'prop-types';
import {
    StackNavigator as RNStackNavigator,
    addNavigationHelpers,
} from 'react-navigation';
import { View, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';

import Loader from '../components/Loader';
import Home from '../components/Home';
import Settings from '../components/Settings';
import SettingsWifi from '../components/SettingsWifi';
import SetupTerms from '../components/SetupTerms';
import SetupWifi from '../components/SetupWifi';
import SetupQr from '../components/SetupQr';
import Onboarding from '../components/training/Onboarding';
import UpdatePrompt from '../components/UpdatePrompt';
import DriveRating from '../components/DriveRating';

export const StackNavigator = RNStackNavigator({
    Loader: { screen: Loader },
    Home: { screen: Home },
    SetupTerms: { screen: SetupTerms },
    SetupWifi: { screen: SetupWifi },
    SetupQr: { screen: SetupQr },
    Onboarding: { screen: Onboarding },
    Settings: { screen: Settings },
    SettingsWifi: { screen: SettingsWifi },
    UpdatePrompt: { screen: UpdatePrompt },
    DriveRating: { screen: DriveRating },
}, {
    transitionConfig : () => ({
        transitionSpec: {
            duration: 0,
            timing: Animated.timing,
            easing: Easing.step0,
        },
    }),
});


const StackNavigatorWithHelpers = ({ dispatch, nav }) => (
    <StackNavigator
        navigation={ addNavigationHelpers({ dispatch, state: nav })}
    />
);

StackNavigatorWithHelpers.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({ nav });
export default connect(mapStateToProps)(StackNavigatorWithHelpers);
