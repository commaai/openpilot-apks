import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Layout from '../../native/Layout';

import { View } from 'react-native';

import X from '../../themes';
import SetupWifi from '../SetupWifi';

class SettingsWifi extends Component {
    static navigationOptions = {
        header: null,
    }

    async componentWillUnmount() {
        await Layout.emitSidebarExpanded();
    }

    render() {
        return (
            <View>
                <SetupWifi
                    handleBackPressed={ this.props.handleBackPressed } />
            </View>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        handleBackPressed: async () => {
            await dispatch(NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({ routeName: 'Settings' })
                ]
            }));
            Layout.emitSidebarExpanded();
        },
    }
}

export default connect(null, mapDispatchToProps)(SettingsWifi);
