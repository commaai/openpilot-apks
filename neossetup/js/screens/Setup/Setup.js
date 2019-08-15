import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { refreshDeviceInfo } from '../../store/host/actions';
import X from '../../themes';
import SetupContainer from '../SetupContainer';
import SetupTerms from '../SetupTerms';
import SetupWifi from '../SetupWifi';
import SetupSim from '../SetupSim';
import SetupQr from '../SetupQr';

import Styles from './SetupStyles';

const Step = {
    WIFI: 'WIFI',
    SIM: 'SIM',
    REVIEW_TERMS: 'REVIEW_TERMS',
    PAIR: 'PAIR',
    INSTALL: 'INSTALL',
};

const TabsByStep = {
    WIFI: [
        'Select WiFi',
        'Add SIM Card',
        'Review Terms',
        'Pair EON',
        'Install',
    ],
    SIM: [
        'Add SIM Card',
        'Review Terms',
        'Pair EON',
        'Install',
    ],
    REVIEW_TERMS: [
        'Review Terms',
        'Pair EON',
        'Install',
    ],
    PAIR: [
        'Pair EON',
        'Install',
    ],
    INSTALL: [
        'Install'
    ],
}

class Setup extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            step: Step.WIFI,
        };
    }

    renderTabs() {
        const tabs = TabsByStep[this.state.step];
        return (
            <View style={ Styles.tabs }>
                { tabs.map((text, idx) =>
                    <View key={ idx } style={ [Styles.tab, idx === 0 ? Styles.selectedTab : null ] }>
                        <X.Text
                            color='white'
                            size='small'
                            style={ idx === 0 ? Styles.selectedTabText : Styles.tabText }
                            weight={ idx === 0 ? 'regular' : 'light' }>
                            { text }
                        </X.Text>
                    </View>
                ) }
                <View style={ Styles.selectedTabBorder } />
                <View style={ Styles.tabsBorder } />
            </View>
        );
    }

    setStep(step) {
        this.setState({ step });
    }

    handleSetupWifiCompleted() {
        this.setStep(Step.SIM);
    }

    handleSetupSimCompleted() {
        this.props.refreshDeviceInfo();
        this.setStep(Step.REVIEW_TERMS);
    }

    handleSetupTermsCompleted() {
        this.props.acceptTerms();
        this.setStep(Step.PAIR);
    }

    handleSetupQrCompleted() {
        this.setStep(Step.INSTALL);
    }

    renderContentForStep() {
        const { step } = this.state;
        switch (step) {
            case Step.WIFI:
                return <SetupWifi onContinue={ () => this.handleSetupWifiCompleted() } />;
            case Step.SIM:
                return <SetupSim onContinue={ () => this.handleSetupSimCompleted() } />;
            case Step.REVIEW_TERMS:
                return <SetupTerms onAccept={ () => this.handleSetupTermsCompleted() } />;
            case Step.PAIR:
                return <SetupQr onContinue={ () => this.handleSetupQrCompleted() } />;
            case Step.INSTALL:
                return <View><X.Text color='white'>Install Software</X.Text></View>;
        }
    }


    render() {
        return (
            <SetupContainer>
                { this.renderTabs() }
                { this.renderContentForStep() }
            </SetupContainer>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    navigateHome: async () => {
        ChffrPlus.writeParam(Params.KEY_HAS_COMPLETED_SETUP, "1");

        let destRoute = 'Onboarding';

        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: destRoute })
            ]
        }));
    },
    acceptTerms: async () => {
        const termsVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TERMS_VERSION);
        ChffrPlus.writeParam(Params.KEY_ACCEPTED_TERMS_VERSION, termsVersion);
    },
    refreshDeviceInfo: () => {
        dispatch(refreshDeviceInfo());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Setup);
