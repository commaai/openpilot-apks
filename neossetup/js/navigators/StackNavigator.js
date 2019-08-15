import React from 'react';
import PropTypes from 'prop-types';
import {
    StackNavigator as RNStackNavigator,
    addNavigationHelpers,
} from 'react-navigation';
import { connect } from 'react-redux';

import Setup from '../screens/Setup';
import SetupWelcome from '../screens/SetupWelcome';

export const StackNavigator = RNStackNavigator({
    SetupWelcome: { screen: SetupWelcome },
    Setup: { screen: Setup },
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
