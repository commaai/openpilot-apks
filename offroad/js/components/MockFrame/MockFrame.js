import React from 'react';
import { View, StyleSheet } from 'react-native';
import X from '../../themes';

export default (Component) => (props) => (
    <X.Gradient color='dark_blue'>
        <View style={ Styles.frame }>
            <View style={ Styles.sidebar } />
            <View style={ Styles.window }>
                <View style={ Styles.windowStatusbar } />
                <Component {...props} />
            </View>
        </View>
    </X.Gradient>
);


const Styles = StyleSheet.create({
    frame: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        backgroundColor: '#000000',
        height: '100%',
        opacity: 0.33,
        width: 100,
    },
    window: {
        flex: 1,
    },
    windowStatusbar: {
        height: 30,
    },
})
