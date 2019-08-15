import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexBasis:165,
    },
    qrContainer: {
        flex:1.5,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    qrBoarder: {
        padding:10,
        backgroundColor: 'white',
    },
    scanText: {
        flex:1,
        textAlign: 'right',
        paddingRight: 10,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
    },
    continueButton: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'stretch',
    },

});
