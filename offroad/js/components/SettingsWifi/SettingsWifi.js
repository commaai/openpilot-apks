import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import ChffrPlus from '../../native/ChffrPlus';

import { View } from 'react-native';

import X from '../../themes';
import SetupWifi from '../SetupWifi';
import { updateSidebarCollapsed } from '../../store/host/actions';

class SettingsWifi extends Component {
    static navigationOptions = {
        header: null,
    }

    async componentWillUnmount() {
        await this.props.handleSidebarExpanded();
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
            await dispatch(updateSidebarCollapsed(false));
            ChffrPlus.emitSidebarExpanded();
        },
        handleSidebarExpanded: async () => {
            await dispatch(updateSidebarCollapsed(false));
            await ChffrPlus.emitSidebarExpanded();
        }
    }
}

export default connect(null, mapDispatchToProps)(SettingsWifi);
