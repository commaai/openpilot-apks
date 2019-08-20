import { StyleSheet } from 'react-native';

export default StyleSheet.create({
     setupInstallConfirm: {
       alignItems: 'center',
       justifyContent: 'center',
       display: 'flex',
     },
     setupInstallConfirmBody: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 50,
        paddingTop: 80,
        width: 420,
     },
     setupInstallConfirmHeadline: {
        flex: 0.3,
     },
     setupInstallConfirmIntro: {
        flex: 0.5,
        textAlign: 'center',
     },
     setupInstallConfirmButton: {
        flex: 0.5,
        width: 100,
     },
});
