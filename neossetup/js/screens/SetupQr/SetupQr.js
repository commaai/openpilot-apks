import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { View, NetInfo } from 'react-native';

import X from '../../themes';
import Pairing from '../../components/Pairing';
import ScrollThrough from '../../components/ScrollThrough';
import SetupStyles from '../Setup';
import Styles from './SetupQrStyles';
import { updateConnectionState} from '../../store/host/actions';

class SetupQr extends Component {
    static propTypes = {
        onContinue: PropTypes.func,
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
        NetInfo.isConnected.fetch().then(this._handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }

    _handleConnectionChange = (isConnected) => {
        console.log('Connection status is ' + (isConnected ? 'online' : 'offline') + ' ' + isConnected);
        this.props.dispatch(updateConnectionState(isConnected));
    };

    render() {
      console.log('Render: Connection status is ' + (this.props.isConnected ? 'online' : 'offline') + ' ' + this.props.isConnected);
        return (
            <View style={ Styles.root }>
                <Pairing
                    onPairConfirmed={ this.props.onContinue }
                    skipText='Skip'
                    onContinueButton={ this.props.onContinue}
                    continueText='Continue' />
            </View>
        );

    }
}

function mapStateToProps(state) {
    return {
        isPaired: state.host.device && state.host.device.is_paired,
        isConnected: state.host.isConnected,
    }
}

export default connect(mapStateToProps)(SetupQr);
