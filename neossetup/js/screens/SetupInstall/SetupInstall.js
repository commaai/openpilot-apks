import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChffrPlus from '../../native/ChffrPlus';
import { updateSoftwareUrl } from '../../store/host/actions';
import { Params } from '../../config';
import X from '../../themes';
import Styles from './SetupInstallStyles';

class SetupInstall extends Component {
    static navigationOptions = {
        header: null,
    };

    static propTypes = {
        handleSetupInstallCompleted: PropTypes.func,
        handleSetupInstallBackPressed: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
        };
    }

    handleInstallOptionPressed(selectedOption) {
        this.setState({ selectedOption });
        if (selectedOption == 'dashcam') {
            this.props.handleSoftwareUrlChanged('https://chffrplus.comma.ai');
        }
    }

    render() {
        const { selectedOption } = this.state;
        return (
            <X.Gradient
                color='dark_black'>
                <X.Entrance style={ Styles.setupInstall }>
                    <View style={ Styles.setupInstallHeader }>
                        <X.Text
                            color='white'
                            size='big'
                            weight='bold'>
                            Choose Software to Install
                        </X.Text>
                    </View>
                    <View style={ Styles.setupInstallOptions }>
                        <TouchableOpacity
                            activeOpacity={ 0.9 }
                            style={ [Styles.setupInstallOption, selectedOption == 'dashcam' && Styles.setupInstallOptionSelected ] }
                            onPress={ () => this.handleInstallOptionPressed('dashcam') }>
                            <View style={ [ Styles.setupInstallOptionBubble, selectedOption == 'dashcam' && Styles.setupInstallOptionBubbleSelected ] }>
                                <View style={ [Styles.setupInstallOptionBubbleCenter, selectedOption == 'dashcam' && Styles.setupInstallOptionBubbleCenterSelected ] }>
                                </View>
                            </View>
                            <X.Text
                                color='white'
                                size='medium'
                                weight='semibold'
                                style={ Styles.setupInstallOptionText }>
                                Dashcam Software
                            </X.Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={ 0.9 }
                            style={ [Styles.setupInstallOption, selectedOption == 'custom' && Styles.setupInstallOptionSelected] }
                            onPress={ () => this.handleInstallOptionPressed('custom') }>
                            <View style={ [Styles.setupInstallOptionBubble, selectedOption == 'custom' && Styles.setupInstallOptionBubbleSelected] }>
                                <View style={ [Styles.setupInstallOptionBubbleCenter, selectedOption == 'custom' && Styles.setupInstallOptionBubbleCenterSelected] }>
                                </View>
                            </View>
                            <X.Text
                                color='white'
                                size='medium'
                                weight='semibold'
                                style={ Styles.setupInstallOptionText }>
                                Custom Software (Advanced)
                            </X.Text>
                        </TouchableOpacity>
                    </View>
                    <View style={ Styles.setupInstallButtons }>
                        <X.Button
                            color='setupInverted'
                            onPress={ this.props.handleSetupInstallBackPressed }
                            style={ Styles.setupInstallButtonsBack }>
                            Go back
                        </X.Button>
                        <X.Button
                            color={ selectedOption !== '' ? 'setupPrimary' : 'setupDisabled' }
                            onPress={ () => this.props.handleSetupInstallCompleted(selectedOption) }
                            style={ Styles.setupInstallButtonsContinue }>
                            <X.Text
                                color={ selectedOption !== '' ? 'white' : 'setupDisabled' }
                                weight='semibold'>
                                { selectedOption == 'custom' ? 'Continue' : 'Install Software' }
                            </X.Text>
                        </X.Button>
                    </View>
                </X.Entrance>
            </X.Gradient>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    handleSoftwareUrlChanged: (softwareUrl) => {
        dispatch(updateSoftwareUrl(softwareUrl));
    },
    handleSetupInstallCompleted: async (selectedOption) => {
        const destination = selectedOption == 'custom' ? 'SetupInstallCustom' : 'SetupInstallConfirm';
        if (selectedOption !== '') {
            dispatch(NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({
                        routeName: destination,
                    })
                ]
            }))
        }
    },
    handleSetupInstallBackPressed: () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: 'SetupPair',
                })
            ]
        }))
    },
});

export default connect(null, mapDispatchToProps)(SetupInstall);
