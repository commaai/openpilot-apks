import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    setupInstallCustom: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
    },
    setupInstallCustomHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        paddingTop: 10,
    },
    setupInstallCustomBody: {
        backgroundColor: 'rgba(3, 4, 4, 0.16)',
        borderColor: '#1D2225',
        borderWidth: 1,
        borderRadius: 13,
        flex: 0.65,
        position: 'relative',
        padding: 30,
    },
    setupInstallCustomTitle: {
        marginBottom: 20,
    },
    setupInstallCustomButtons: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    setupInstallCustomButtonsBack: {
        display: 'flex',
        height: '100%',
        width: 160,
    },
    setupInstallCustomButtonsContinue: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: 320,
    },
    setupInstallCustomInput: {
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderRadius: 8,
    },
});
