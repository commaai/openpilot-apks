import React from 'react';
import PropTypes from 'prop-types';
import {
    StackNavigator as RNStackNavigator,
    addNavigationHelpers,
} from 'react-navigation';
import { connect } from 'react-redux';

import SetupWelcome from '../screens/SetupWelcome';
import SetupWifi from '../screens/SetupWifi';
import SetupTerms from '../screens/SetupTerms';
import SetupPair from '../screens/SetupPair';
import SetupInstall from '../screens/SetupInstall';
import SetupInstallCustom from '../screens/SetupInstallCustom';
import SetupInstallConfirm from '../screens/SetupInstallConfirm';

export const StackNavigator = RNStackNavigator({
    SetupWelcome: { screen: SetupWelcome },
    SetupWifi: { screen: SetupWifi },
    SetupTerms: { screen: SetupTerms },
    SetupPair: { screen: SetupPair },
    SetupInstall: { screen: SetupInstall },
    SetupInstallCustom: { screen: SetupInstallCustom },
    SetupInstallConfirm: { screen: SetupInstallConfirm },
});


const StackNavigatorWithHelpers = ({ dispatch, nav }) => (
    <StackNavigator
        navigation={ addNavigationHelpers({ dispatch, state: nav }) } />
);

StackNavigatorWithHelpers.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({ nav });
export default connect(mapStateToProps)(StackNavigatorWithHelpers);
