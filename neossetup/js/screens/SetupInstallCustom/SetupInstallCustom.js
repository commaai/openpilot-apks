import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import X from '../../themes';
import Styles from './SetupInstallCustomStyles';

class SetupInstallCustom extends Component {
    static navigationOptions = {
        header: null,
    };

    static propTypes = {
        handleSetupInstallCustomCompleted: PropTypes.func,
        handleSetupInstallCustomBackPressed: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            softwareUrl: 'https://',
        };
    }

    handleSoftwareUrlChanged(softwareUrl) {
       this.setState({ softwareUrl })
    }

    render() {
        const { softwareUrl } = this.state;
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
                            onChangeText={ (softwareUrl) => this.handleSoftwareUrlChanged(softwareUrl) }
                            value={ this.state.softwareUrl }
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

const mapDispatchToProps = dispatch => ({
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

export default connect(null, mapDispatchToProps)(SetupInstallCustom);
