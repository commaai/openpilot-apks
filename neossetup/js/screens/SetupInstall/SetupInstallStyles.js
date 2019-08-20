import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    setupInstall: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
    },
    setupInstallHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 80,
        paddingTop: 10,
    },
    setupInstallOptions: {
        backgroundColor: 'rgba(3, 4, 4, 0.16)',
        borderColor: '#1D2225',
        borderWidth: 1,
        borderRadius: 13,
        flex: 0.65,
        position: 'relative',
        padding: 10,
    },
    setupInstallOption: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#30373B',
        borderRadius: 10,
        borderWidth: 1,
        height: 75,
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        paddingLeft: 20,
    },
    setupInstallOptionSelected: {
        backgroundColor: '#16181A',
    },
    setupInstallOptionBubble: {
        alignItems: 'center',
        borderColor: '#30373B',
        borderWidth: 1,
        borderRadius: 40,
        height: 40,
        justifyContent: 'center',
        marginRight: 20,
        width: 40,
    },
    setupInstallOptionBubbleSelected: {
        borderColor: '#fff',
    },
    setupInstallOptionBubbleCenter: {
        backgroundColor: 'transparent',
        borderRadius: 28,
        height: 28,
        margin: 1,
        width: 28,
    },
    setupInstallOptionBubbleCenterSelected: {
        backgroundColor: '#fff',
    },
    setupInstallButtons: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    setupInstallButtonsBack: {
        display: 'flex',
        height: '100%',
        width: 160,
    },
    setupInstallButtonsContinue: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 320,
    },
});
