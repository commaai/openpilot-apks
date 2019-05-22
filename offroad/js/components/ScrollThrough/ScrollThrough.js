import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollView, View, Text } from 'react-native';

import X from '../../themes';
import Styles from './ScrollThroughStyles';
import { BUTTON_CONTINUE_GRADIENT } from '../../styles/gradients';

export default class ScrollThrough extends Component {
    static propTypes = {
        onPrimaryButtonClick: PropTypes.func.isRequired,
        onSecondaryButtonClick: PropTypes.func,
        primaryButtonText: PropTypes.string.isRequired,
        primaryButtonTextDisabled: PropTypes.string,
        secondaryButtonText: PropTypes.string.isRequired,
        onScroll: PropTypes.func,
        primaryButtonEnabled: PropTypes.bool,
    };

    static defaultProps = {
        primaryButtonEnabled: true,

    };

    constructor(props) {
        super(props);

        this.state = {
            isAtBottom: false,
        };
    }

    onScroll = ({ nativeEvent }) => {
        const isAtBottom = (nativeEvent.contentSize.height - nativeEvent.contentOffset.y - this.scrollViewHeight) < 10;
        if (this.state.isAtBottom !== isAtBottom) {
            this.setState({ isAtBottom });
        }

        if (this.props.onScroll) {
            this.props.onScroll({ nativeEvent });
        }
    }

    onScrollViewLayout = ({ nativeEvent: { layout: { width, height }}}) => {
        this.scrollViewHeight = height;
    }

    render() {
        const {
            primaryButtonText,
            primaryButtonTextDisabled,
            secondaryButtonText,
            onPrimaryButtonClick,
            onSecondaryButtonClick,
            primaryButtonEnabled,
        } = this.props;

        const { isAtBottom } = this.state;

        const primaryButtonGradientColors = primaryButtonEnabled ? BUTTON_CONTINUE_GRADIENT : ['#8C959B', '#8C959B'] ;

        return (
            <View style={ Styles.root }>
                <View style={ Styles.scrollContainer }>
                    <ScrollView
                        onScroll={ this.onScroll }
                        style={ Styles.text }
                        onLayout={ this.onScrollViewLayout }>
                        { this.props.children }
                    </ScrollView>
                    { isAtBottom ? null : <View style={ Styles.scrollBorder } />}
                </View>
                <View style={ Styles.buttons }>
                    <View style={ Styles.declineButton }>
                        <X.Button
                            color='setupInverted'
                            onPress={ this.props.onSecondaryButtonClick || (() => {}) }>
                            { secondaryButtonText }
                        </X.Button>
                    </View>
                    <View style={ Styles.acceptButton }>
                        <X.Button
                            color={ primaryButtonEnabled ? 'setupPrimary' : 'setupDefault'}
                            onPress={ primaryButtonEnabled ? onPrimaryButtonClick : null }>
                            { primaryButtonEnabled ? primaryButtonText : primaryButtonTextDisabled }
                        </X.Button>
                    </View>
                </View>
            </View>
        );
    }
}
