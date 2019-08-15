import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        flex: 1,
    },
    listContainer: {
        backgroundColor: 'rgba(0,0,0,0.06)',
        borderColor: 'rgba(255,255,255,0.09)',
        borderWidth: 1,
        borderRadius: 13,
        flex: 0.9,
        padding: 10,
        paddingLeft: 0,
        paddingBottom: 5,
    },
    buttons: {
        flex: 0.3,
        flexDirection: 'row',
        marginTop: 15,
    },
    moreOptionsButton: {
        flex: 0.4,
        paddingRight: 10,
    },
    nextButton: {
        flex: 0.6,
    },
    networkRow: {
        flexDirection: 'row',
        height: 62,
        width: '100%',
    },
    barImage: {
        resizeMode: 'contain',
        height: 37,
        alignSelf: 'center',
    },
    connectedImage: {
        alignSelf: 'center',
        height: 37,
    },
    networkRowRight: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    passwordDialog: {
        padding: 20,
        marginTop: -100,
        marginLeft: -25,
    },
    dialogButton: {
        flex: 0.4,
    }
});
