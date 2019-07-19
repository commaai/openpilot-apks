import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { refreshDeviceInfo } from '../../store/host/actions';
import { checkIsPassive } from '../../utils/version';
import X from '../../themes';
import SetupContainer from '../SetupContainer';
import SetupTerms from '../SetupTerms';
import SetupWifi from '../SetupWifi';
import SetupSim from '../SetupSim';
import SetupQr from '../SetupQr';

import Styles from './SetupStyles';

const Step = {
    REVIEW_TERMS: 'REVIEW_TERMS',
    WIFI: 'WIFI',
    SIM: 'SIM',
    PAIR: 'PAIR',
};

const TabsByStep = {
    REVIEW_TERMS: [
        'Review Terms',
        'Select WiFi',
        'Add SIM Card',
        'PAIR EON',
    ],
    WIFI: [
        'Select WiFi',
        'Add SIM Card',
        'PAIR EON',
    ],
    SIM: [
        'Add SIM Card',
        'PAIR EON',
    ],
    PAIR: [
        'PAIR EON',
    ]
}

class Setup extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            step: Step.REVIEW_TERMS,
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
        // TODO fancy anim
        this.setState({ step });
    }

    renderContentForStep() {
        const { step } = this.state;
        switch (step) {
            case Step.REVIEW_TERMS:
                return <SetupTerms onAccept={ () => {
                    this.props.acceptTerms();
                    this.setStep(Step.WIFI);
                } } />
            case Step.WIFI:
                return <SetupWifi onContinue={ () => this.setStep(Step.SIM) } />
            case Step.SIM:
                return <SetupSim onContinue={ () => {
                        this.props.refreshDeviceInfo();
                        this.setStep(Step.PAIR);
                    } } />
            case Step.PAIR:
                return <SetupQr onContinue={ () => this.props.navigateHome() } />
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

        const isPassive = await checkIsPassive();
        let destRoute = 'Onboarding';
        if (isPassive) {
            destRoute = 'Home';
        }

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
