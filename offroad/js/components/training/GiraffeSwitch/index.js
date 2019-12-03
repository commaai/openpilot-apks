import React, { Component } from 'react';
import { connect } from 'react-redux';

import { completeTrainingStep } from '../step';
import Styles from '../Onboarding/OnboardingStyles';
import X from '../../../themes';

class GiraffeSwitch extends Component {
  render() {
    return (
      <X.Entrance style={ Styles.onboardingContainer }>
        <X.Text color='white'>Before driving with openpilot 0.5.5, ensure your giraffe switches are configured like so: </X.Text>
        <X.Button onPress={ this.props.completeTrainingStep }></X.Button>
      </X.Entrance>
    );
  }
}

const dispatchToProps = function(dispatch) {
  return {
    completeTrainingStep: completeTrainingStep('GiraffeSwitch', dispatch)
  }
};

export default connect(undefined, dispatchToProps)(GiraffeSwitch);
