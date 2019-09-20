import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    setupPairing: {
        flex: 1,
        paddingLeft: 10,
    },
    setupPairingHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        marginBottom: 10,
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
        borderWidth: 4,
        height: 240,
        marginTop: 5,
        width: 240,
    },
    setupPairingCodeWrapper: {
        position: 'relative',
        height: '100%',
        width: '100%',
    },
    setupPairingCodeOverlay: {
        alignItems: 'center',
        backgroundColor: '#F8F9FA97',
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 10,
    },
    setupPairingCodeOverlayBar: {
        alignItems: 'center',
        bottom: 0,
        backgroundColor: '#F8F9FA',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 30,
        position: 'absolute',
        width: '100%',
    },
    setupPairingCodeOverlayBarCheckmark: {
        alignItems: 'center',
        backgroundColor: '#49545B',
        borderRadius: 8,
        height: 15,
        justifyContent: 'center',
        marginRight: 8,
        width: 15,
    },
    setupPairingCodeOverlayBarCheckmarkIcon: {
        width: 10,
    },
    setupPairingContext: {
        flex: 1,
        paddingTop: 0,
        paddingRight: 10,
        paddingBottom: 30,
        paddingLeft: 20,
    },
    setupPairingText: {
        marginBottom: 25,
    },
    setupPairingIcons: {
        height: 90,
        flexDirection: 'row',
    },
    setupPairingIconsApp: {
        height: 90,
        marginRight: 10,
        width: 90,
    },
    setupPairingIconsStores: {
        flex: 1,
        paddingRight: 10,
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
        width: 80,
    },
    setupPairingButtonsContinue: {
        display: 'flex',
        height: '100%',
        width: 240,
    },
    setupPairingLoadingIndicator: {
        height: 26,
        width: 26,
    },
});
