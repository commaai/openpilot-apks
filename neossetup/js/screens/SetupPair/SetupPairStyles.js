import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    setupPairing: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 0,
    },
    setupPairingHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 80,
        paddingTop: 10,
    },
    setupPairingBody: {
        flex: 1,
        flexDirection: 'row',
    },
    setupPairingCode: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 5,
        height: 260,
        width: 260,
    },
    setupPairingContext: {
        flex: 1,
        padding: 30,
        paddingTop: 0,
    },
    setupPairingText: {
        marginBottom: 20,
    },
    setupPairingIcons: {
        height: 100,
        flexDirection: 'row',
        paddingRight: 20,
    },
    setupPairingIconsApp: {
        height: 100,
        marginRight: 20,
        width: 100,
    },
    setupPairingIconsStores: {
        flex: 1,
    },
    setupPairingButtons: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    setupPairingButtonsBack: {
        display: 'flex',
        height: '100%',
        width: 100,
    },
    setupPairingButtonsContinue: {
        display: 'flex',
        height: '100%',
        width: 160,
    },
    setupPairingLoadingIndicator: {
        height: 26,
        width: 26,
    },
});
