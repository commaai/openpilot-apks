import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import X from '../../themes';
import { HOME_BUTTON_GRADIENT } from '../../styles/gradients';

import Styles from './PrimaryButtonStyles';

export default class PrimaryButton extends Component {
    static propTypes = {
        onPress: PropTypes.func,
    };

    render() {
        return (
            <X.Button
                color='transparent'
                size='full'
                onPress={ this.props.onPress }
                style={ this.props.style }>
                <X.Gradient
                    colors={ HOME_BUTTON_GRADIENT }
                    style={ Styles.primaryButton }>
                    { this.props.children }
                </X.Gradient>
            </X.Button>
        );
    }
}