import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChffrPlus from '../../native/ChffrPlus';
import { updateSoftwareUrl, resetSoftwareUrl } from '../../store/host/actions';
import { Params } from '../../config';
import X from '../../themes';
import Styles from './SetupInstallCustomStyles';

class SetupInstallCustom extends Component {
    static navigationOptions = {
        header: null,
    };

    static propTypes = {
        softwareUrl: PropTypes.string,
        handleSetupInstallCustomCompleted: PropTypes.func,
        handleSetupInstallCustomBackPressed: PropTypes.func,
    };

    componentDidMount() {
        this.props.handleSoftwareUrlReset();
    }

    render() {
        const { softwareUrl } = this.props;
        return (
            <X.Gradient
                color='dark_black'>
                <X.Entrance style={ Styles.setupInstallCustom }>
                    <View style={ Styles.setupInstallCustomHeader }>
                    </View>
                    <View style={ Styles.setupInstallCustomBody }>
                        <X.Text
                            color='white'
                            size='medium'
                            weight='bold'
                            style={ Styles.setupInstallCustomTitle }>
                            Custom Software URL:
                        </X.Text>
                        <TextInput
                            onChangeText={ (softwareUrl) => this.props.handleSoftwareUrlChanged(softwareUrl) }
                            value={ this.props.softwareUrl }
                            ref={ ref => this.softwareUrlInput = ref }
                            style={ Styles.setupInstallCustomInput }
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={ Styles.setupInstallCustomButtons }>
                        <X.Button
                            color='setupInverted'
                            onPress={ this.props.handleSetupInstallCustomBackPressed }
                            style={ Styles.setupInstallCustomButtonsBack }>
                            Go back
                        </X.Button>
                        <X.Button
                            color={ softwareUrl !== 'https://' ? 'setupPrimary' : 'setupDisabled' }
                            onPress={ softwareUrl !== 'https://' ? this.props.handleSetupInstallCompleted : null }
                            style={ Styles.setupInstallCustomButtonsContinue }>
                            <X.Text
                                color={ softwareUrl !== 'https://' ? 'white' : 'setupDisabled' }
                                weight='semibold'>
                                Install Software
                            </X.Text>
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
    handleSoftwareUrlReset: () => {
        dispatch(resetSoftwareUrl());
    },
    handleSoftwareUrlChanged: (softwareUrl) => {
        dispatch(updateSoftwareUrl(softwareUrl));
    },
    handleSetupInstallCompleted: async () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: 'SetupInstallConfirm',
                })
            ]
        }))
    },
    handleSetupInstallCustomBackPressed: () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: 'SetupInstall',
                })
            ]
        }))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupInstallCustom);
