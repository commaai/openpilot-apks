import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Styles from './AppWindowStyles';

class AppWindow extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const appWindowStyles = [
            Styles.appWindow,
            this.props.sidebarCollapsed && Styles.appWindowWide,
        ];
        return (
            <View style={ appWindowStyles }>
                { this.props.children }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sidebarCollapsed: state.host.sidebarCollapsed,
    };
};

export default connect(mapStateToProps, null)(AppWindow);
