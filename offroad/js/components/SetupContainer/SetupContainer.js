import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import X from '../../themes';

const Styles = StyleSheet.create({
    root: {
        padding: 26,
        paddingTop: 10,
    },
});

export default class SetupContainer extends Component {
    render() {
        return (
            <X.Gradient
                color='dark_blue'
                style={ [Styles.root, this.props.style || null] }>
                { this.props.children }
            </X.Gradient>
        );
    }
}
