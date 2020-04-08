import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import X from '../../themes';
import ChffrPlus from '../../native/ChffrPlus';

import ScrollThrough from '../ScrollThrough';

class UpdatePrompt extends Component {
    static navigationOptions = {
        header: null,
    };

    onUpdatePressed = () => {
        this.props.dismiss();
        ChffrPlus.reboot();
    }

    render() {
        return (
            <X.Gradient
                color='dark_blue'
                style={ { padding: 26, paddingTop: 10 } }>
                <ScrollThrough
                    onPrimaryButtonClick={ this.onUpdatePressed }
                    onSecondaryButtonClick={ this.props.dismiss }
                    primaryButtonText={ 'Reboot and Update' }
                    secondaryButtonText={ 'Later' }
                    onScroll={ this.onScroll }
                    enabled={ true }>
                    <X.Text color='white' size='big' weight='semibold'>Update Available</X.Text>
                    <X.Line />
                    <X.Text color='white'>
                        { this.props.releaseNotes }
                    </X.Text>
                </ScrollThrough>
            </X.Gradient>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    dismiss: () => dispatch(NavigationActions.navigate({ routeName: 'Home' })),
});
const stateToProps = (state) => ({
    releaseNotes: state.host.updateReleaseNotes,
});
export default connect(stateToProps, mapDispatchToProps)(UpdatePrompt);
