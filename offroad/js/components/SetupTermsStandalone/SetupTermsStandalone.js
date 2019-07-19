import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import SetupContainer from '../SetupContainer';
import SetupTerms from '../SetupTerms';

class SetupTermsStandalone extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <SetupContainer style={ { padding: 0 } }>
        <SetupTerms onAccept={ this.props.onAccept } />
      </SetupContainer>
    );
  }
}

function mapStateToProps(state) {
  return ({
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    onAccept: async function() {
      const termsVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TERMS_VERSION);
      ChffrPlus.writeParam(Params.KEY_ACCEPTED_TERMS_VERSION, termsVersion);

      dispatch(
        NavigationActions.reset({
          index: 0,
          key: null,
          actions: [
              NavigationActions.navigate({ routeName: 'Home' })
          ]
      }));
    }
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupTermsStandalone);