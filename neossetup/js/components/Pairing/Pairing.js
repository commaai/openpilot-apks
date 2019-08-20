import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { View, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import X from '../../themes';
import Styles from './PairingStyles';
import ChffrPlus from '../../native/ChffrPlus';
import { refreshDeviceInfo, updateConnectionState } from '../../store/host/actions';
import { Colors } from '../../../node_modules/comma-x-native/x/themes/Base/BaseColors';

class Pairing extends Component {
  static propTypes = {
    onPairConfirmed: PropTypes.func,
    onContinueButton: PropTypes.func,
    skipText: PropTypes.string,
    continueText: PropTypes.string,
  };

  componentDidMount() {
    this.checkPaired = setInterval(() => {
      this.props.refreshDeviceInfo();
    }, 2500);
    NetInfo.isConnected.addEventListener('connectionChange', this.props.handleConnectionChange);
    NetInfo.isConnected.fetch().then(this.props.handleConnectionChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPaired) {
      this.props.onPairConfirmed();
    }
  }

  componentWillUnmount() {
    clearInterval(this.checkPaired);
    NetInfo.isConnected.removeEventListener('connectionChange', this.props.handleConnectionChange);
  }

  renderQR() {
    return (
      <View style={ Styles.qrContainer }>
        <View style={ Styles.qrBoarder }>
          <QRCode
            value={ this.props.imei + '--' + this.props.serial }
            size={ 165 }
            style={{ padding:10 }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={ Styles.root }>
        <View style={ Styles.content }>
          <X.Text
            color='white'
            size='medium'
            style={ Styles.scanText }>
            { this.props.isConnected ? 'Scan with \ncomma connect \non iOS or Android' : '' }
          </X.Text>
          { this.props.isConnected ? this.renderQR() : null }
        </View>
        <View style={ Styles.buttons }>
          <View style={ Styles.continueButton }>
            <X.Button onPress={ this.props.onContinueButton }
              color={ this.props.isPaired ? 'setupPrimary': 'setupInverted' }>
              { this.props.isPaired || ! this.props.isConnected ? this.props.continueText : this.props.skipText }
            </X.Button>
          </View>
        </View>
      </View>
    );
  }
}

let mapStateToProps = function(state) {
  return {
    imei: state.host.imei,
    serial: state.host.serial,
    isPaired: state.host.device && state.host.device.is_paired,
    isConnected: state.host.isConnected,
  }
}

let mapDispatchToProps = function(dispatch) {
  return {
    refreshDeviceInfo: () => dispatch(refreshDeviceInfo()),
    handleConnectionChange: (isConnected) => dispatch(updateConnectionState(isConnected)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pairing);
