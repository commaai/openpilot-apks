import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { refreshDeviceInfo } from '../../store/host/actions';
import X from '../../themes';
import SetupTerms from '../SetupTerms';
import SetupWifi from '../SetupWifi';
import SetupSim from '../SetupSim';
import SetupPair from '../SetupPair';

import Styles from './SetupStyles';

const Step = {
    WIFI: 'WIFI',
    REVIEW_TERMS: 'REVIEW_TERMS',
    PAIR: 'PAIR',
    INSTALL: 'INSTALL',
};

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

    handleSetupPairCompleted() {
        this.setStep(Step.INSTALL);
    }

    renderContentForStep() {
        const { step } = this.state;
        switch (step) {
            case Step.WIFI:
                return <SetupWifi onContinue={ () => this.handleSetupWifiCompleted() } />;
            case Step.REVIEW_TERMS:
                return <SetupTerms onAccept={ () => this.handleSetupTermsCompleted() } />;
            case Step.PAIR:
                return <SetupPair onContinue={ () => this.handleSetupPairCompleted() } />;
            case Step.INSTALL:
                return <View><X.Text color='white'>Install Software</X.Text></View>;
        }
    }


    render() {
        return (
            <View>
                { this.renderContentForStep() }
            </View>
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


//
// { tabs.map((text, idx) =>
//     <View key={ idx } style={ [Styles.tab, idx === 0 ? Styles.selectedTab : null ] }>
//         <X.Text
//             color='white'
//             size='small'
//             style={ idx === 0 ? Styles.selectedTabText : Styles.tabText }
//             weight={ idx === 0 ? 'regular' : 'light' }>
//             { text }
//         </X.Text>
//     </View>
// ) }
