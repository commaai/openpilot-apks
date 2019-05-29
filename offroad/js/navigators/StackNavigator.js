import React from 'react';
import PropTypes from 'prop-types';
import {
    StackNavigator as RNStackNavigator,
    addNavigationHelpers,
} from 'react-navigation';
import { View } from 'react-native';
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper';
import { connect } from 'react-redux';

import PairAfterSetup from '../components/PairAfterSetup';
import Home from '../components/Home';
import Settings from '../components/Settings';
import Setup from '../components/Setup';
import SetupWelcome from '../components/SetupWelcome';
import Onboarding from '../components/training/Onboarding';
import GiraffeSwitch from '../components/training/GiraffeSwitch'
import UpdatePrompt from '../components/UpdatePrompt';

export const StackNavigator = RNStackNavigator({
    Home: { screen: Home },
    Setup: { screen: Setup },
    SetupWelcome: { screen: SetupWelcome },
    Onboarding: { screen: Onboarding },
    PairAfterSetup: { screen: PairAfterSetup },
    GiraffeSwitch: { screen: GiraffeSwitch },
    Settings: { screen: Settings },
    SettingsStandalone: { screen: Settings },
    UpdatePrompt: { screen: UpdatePrompt },
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
