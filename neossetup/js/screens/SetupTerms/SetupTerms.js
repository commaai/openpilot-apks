import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import Documents from './Documents';
import X from '../../themes';
import Styles from './SetupTermsStyles';

class SetupTerms extends Component {
    static navigationOptions = {
        header: null,
    };

    static propTypes = {
        handleSetupTermsCompleted: PropTypes.func,
        handleSetupTermsBackPressed: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            hasScrolled: false,
            isAtBottom: false,
            terms: "",
        };
    }

    async componentDidMount() {
        const _terms = await fetch('https://chffrdist.blob.core.windows.net/setup/op_terms.json');
        const terms = await _terms.json();
        this.setState({ terms: terms.text });
    }

    onScroll = ({ nativeEvent }) => {
        const isAtBottom = (nativeEvent.contentSize.height - nativeEvent.contentOffset.y - this.scrollViewHeight) < 10;
        if (!this.state.isAtBottom) {
            this.setState({ isAtBottom });
        }
        if (!this.state.hasScrolled) {
            this.setState({ hasScrolled: true });
        }
    }

    onScrollViewLayout = ({ nativeEvent: { layout: { width, height }}}) => {
        this.scrollViewHeight = height;
    }

    render() {
        const {
          hasScrolled,
          isAtBottom,
          terms,
        } = this.state;

        return (
            <X.Gradient
                color='dark_black'>
                <X.Entrance style={ Styles.setupTerms }>
                    <View style={ Styles.setupTermsHeader }>
                        <X.Text
                            color='white'
                            size='big'
                            weight='bold'>
                            Review Terms
                        </X.Text>
                    </View>
                    <View style={ Styles.setupTermsScroll }>
                        <ScrollView
                            onScroll={ this.onScroll }
                            style={ Styles.setupTermsScrollView }
                            onLayout={ this.onScrollViewLayout }>
                            { terms == "" ? (
                                <X.Text weight='semibold' color='white'>Please wait...</X.Text>
                            ) : (
                                <X.Text size='small' color='white'>{ terms }</X.Text>
                            ) }
                        </ScrollView>
                    </View>
                    <View style={ Styles.setupTermsButtons }>
                        <X.Button
                            color='setupInverted'
                            onPress={ this.props.handleSetupTermsBackPressed }
                            style={ Styles.setupTermsButtonsDecline }>
                            { 'Go back' }
                        </X.Button>
                        <X.Button
                            color={ isAtBottom ? 'setupPrimary' : 'setupDefault'}
                            onPress={ isAtBottom ? this.props.handleSetupTermsCompleted : null }
                            style={ Styles.setupTermsButtonsAccept }>
                            { isAtBottom ? 'I agree to the terms' : 'Read to Continue' }
                        </X.Button>
                    </View>
                </X.Entrance>
            </X.Gradient>
        );

    }
}

const mapDispatchToProps = dispatch => ({
    handleSetupTermsCompleted: async () => {
        const termsVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TERMS_VERSION);
        ChffrPlus.writeParam(Params.KEY_ACCEPTED_TERMS_VERSION, termsVersion);
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
    handleSetupTermsBackPressed: () => {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({
                    routeName: 'SetupWifi',
                })
            ]
        }))
    },
});

export default connect(null, mapDispatchToProps)(SetupTerms);
