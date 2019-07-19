import React, { Component } from 'react';
import ScrollThrough from '../ScrollThrough';

import PropTypes from 'prop-types';

import { ScrollView, View, Text } from 'react-native';
import Documents from './Documents';

import X from '../../themes';
import SetupStyles from '../Setup';
import Styles from './SetupTermsStyles';

export default class SetupTerms extends Component {
    static propTypes = {
        onAccept: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            hasScrolled: false,
        };
    }

    onScroll = ({ nativeEvent }) => {
        if (!this.state.hasScrolled) {
            this.setState({ hasScrolled: true });
        }
    }

    render() {
        const { hasScrolled } = this.state;

        return (
            <ScrollThrough
                onPrimaryButtonClick={ this.props.onAccept }
                primaryButtonText={ hasScrolled ? 'I agree to the terms' : 'Read to Continue' }
                secondaryButtonText={ 'Decline' }
                onScroll={ this.onScroll }
                primaryButtonEnabled={ hasScrolled }>
                <X.Text weight='semibold' color='white'>Comma.ai, Inc. Terms & Conditions</X.Text>
                <X.Text size='small' color='white' style={ Styles.tosText }>{ Documents.TOS }</X.Text>
                <X.Text size='small' color='white'>Privacy policy available at https://my.comma.ai/privacy.html</X.Text>
            </ScrollThrough>
        );

    }
}
