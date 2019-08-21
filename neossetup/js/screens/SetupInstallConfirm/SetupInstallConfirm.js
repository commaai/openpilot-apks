import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { Params } from '../../config';
import ChffrPlus from '../../native/ChffrPlus';
import X from '../../themes';
import Styles from './SetupInstallConfirmStyles';

class SetupInstallConfirm extends Component {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        const { softwareUrl } = this.props;
        this.props.handleSetupInstallConfirmCompleted(softwareUrl);
    }

    render() {
        return (
            <X.Gradient
                color='dark_black'
                style={ Styles.setupInstallConfirm }>
                <X.Entrance style={ Styles.setupInstallConfirmBody }>
                    <X.Text
                        size='jumbo'
                        weight='bold'
                        color='white'
                        style={ Styles.setupInstallConfirmHeadline }>Starting installation...</X.Text>
                    <X.Text
                        size='medium'
                        color='white'
                        weight='light'
                        style={ Styles.setupInstallConfirmIntro }>
                        Make sure EON is connected to power. EON will reboot and install your software.
                    </X.Text>
                    <View style={ Styles.setupInstallConfirmButton }>
                        <X.Button
                            color='setupInverted'
                            size='small'
                            onPress={ this.props.handleSetupInstallConfirmBackPressed }>
                            Cancel
                        </X.Button>
                    </View>
                </X.Entrance>
            </X.Gradient>
        );
    }
}

let mapStateToProps = function(state) {
    return {
        softwareUrl: state.host.softwareUrl,
    }
}


const mapDispatchToProps = dispatch => ({
    handleSetupInstallConfirmCompleted: (softwareUrl) => {
        ChffrPlus.startInstaller(softwareUrl);
        // ChffrPlus.writeParam(Params.KEY_HAS_COMPLETED_SETUP, "1");
    },
    handleSetupInstallConfirmBackPressed: () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: 'SetupInstall',
                })
            ]
        }))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupInstallConfirm);
