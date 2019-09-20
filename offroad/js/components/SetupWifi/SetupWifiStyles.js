import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    setupWifi: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    setupWifiHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        marginBottom: 10,
    },
    setupWifiHeaderButton: {
        width: 140,
    },
    setupWifiNetworks: {
        backgroundColor: 'rgba(3, 4, 4, 0.16)',
        borderColor: '#272D30',
        borderWidth: 1,
        borderRadius: 13,
        flex: 0.75,
    },
    setupWifiNetworksEmpty: {
        padding: 20,
    },
    setupWifiNetwork: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#272D30',
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
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    setupWifiButtonsWithBack: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    setupWifiBackButton: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 160,
    },
    setupWifiContinueButton: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 320,
    },
    setupWifiPasswordDialog: {
        padding: 20,
        marginTop: -160,
        width: 540,
    },
    setupWifiPasswordInputRow: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
        paddingTop: 10,
    },
    setupWifiPasswordInputLabel: {
        paddingRight: 10,
        width: 90,
    },
    setupWifiPasswordInputLabelText: {
    },
    setupWifiPasswordInputField: {
        backgroundColor: '#EEF0F1',
        borderColor: '#80909A',
        borderRadius: 8,
        borderWidth: 1,
        flexGrow: 1,
        height: 40,
    },
    setupWifiPasswordInputFieldFocused: {
        borderColor: '#258FDA',
    },
    setupWifiPasswordDialogCheckbox: {
        width: 200,
    },
    setupWifiPasswordDialogButtons: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        height: 160,
        paddingTop: 10,
    },
    setupWifiPasswordDialogButton: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 10,
        width: 140,
    },
    setupWifiConnectingIndicator: {
        height: 26,
        width: 26,
    },
});
