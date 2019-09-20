import React, { Component } from 'react';
import { View, NetInfo } from 'react-native';
import { connect } from 'react-redux';

import { updateConnectionState } from '../../store/host/actions';
import X from '../../themes';
import Styles from './LoaderStyles';

class Loader extends Component {
    static navigationOptions = {
        header: null,
    };

    async componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
        await NetInfo.isConnected.fetch().then(this._handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }

    _handleConnectionChange = (isConnected) => {
        console.log('Connection status is ' + (isConnected ? 'online' : 'offline') + ' ' + isConnected);
        this.props.updateConnectionState(isConnected);
    };

    render() {
        return (
            <X.Gradient color='dark_blue'>
                <View style={ Styles.loader } />
            </X.Gradient>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateConnectionState: (isConnected) => {
        dispatch(updateConnectionState(isConnected));
    },
});

export default connect(null, mapDispatchToProps)(Loader);
