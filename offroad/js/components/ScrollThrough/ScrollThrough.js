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
        enabled: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            isAtBottom: false,
            reachedBottom: false,
        };
    }

    onScroll = ({ nativeEvent }) => {
        const isAtBottom = (nativeEvent.contentSize.height - nativeEvent.contentOffset.y - this.scrollViewHeight) < 10;
        if (this.state.isAtBottom !== isAtBottom) {
            this.setState({ isAtBottom });
        }
        if (!this.state.reachedBottom) {
            this.setState({ reachedBottom: isAtBottom });
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
            scrollViewStyles,
            enabled,
        } = this.props;

        const { isAtBottom, reachedBottom } = this.state;

        let acceptButtonEnabled = enabled || reachedBottom;

        return (
            <View style={ Styles.root }>
                <View style={ Styles.scrollContainer }>
                    <ScrollView
                        onScroll={ this.onScroll }
                        style={ scrollViewStyles }
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
                            color={ acceptButtonEnabled ? 'setupPrimary' : 'setupDefault' }
                            onPress={ acceptButtonEnabled ? onPrimaryButtonClick : null }>
                            { acceptButtonEnabled ? primaryButtonText : primaryButtonTextDisabled }
                        </X.Button>
                    </View>
                </View>
            </View>
        );
    }
}
