import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    setupWifi: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
    },
    setupWifiHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 80,
        paddingTop: 10,
    },
    setupWifiHeaderButton: {
        width: 140,
    },
    setupWifiNetworks: {
        backgroundColor: 'rgba(3, 4, 4, 0.16)',
        borderColor: '#1D2225',
        borderWidth: 1,
        borderRadius: 13,
        flex: 0.65,
    },
    setupWifiNetwork: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#1D2225',
        flexDirection: 'row',
        height: 65,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        width: '100%',
    },
    setupWifiNetworkIcon: {
        resizeMode: 'contain',
        height: 30,
        alignSelf: 'center',
    },
    setupWifiNetworkDetails: {},
    setupWifiNetworkStatus: {
        alignItems: 'center',
        height: 60,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    setupWifiNetworkButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: 120,
    },
    setupWifiNetworkButtonConnected: {
        alignItems: 'center',
        backgroundColor: 'rgba(3, 4, 4, 0.16)',
        justifyContent: 'center',
        flexDirection: 'row',
        width: 160,
    },
    setupWifiNetworkButtonConnectedIcon: {
        alignSelf: 'center',
        marginRight: 15,
        height: 30,
        width: 30,
    },
    setupWifiButtons: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    setupWifiBackButton: {
        display: 'flex',
        height: '100%',
        width: 160,
    },
    setupWifiContinueButton: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 320,
    },
    passwordDialog: {
        padding: 20,
        marginTop: -100,
        marginLeft: -25,
    },
    dialogButton: {
        flex: 0.4,
    },
    setupWifiConnectingIndicator: {
        height: 26,
        width: 26,
    },
});
