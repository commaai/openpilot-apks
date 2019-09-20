import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        flex: 1,
    },
    tosText: {
        opacity: 0.75,
    },
    scrollContainer: {
        position: 'relative',
        flex: 1,
    },
    buttons: {
        alignItems: 'center',
        flex: 0.3,
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 20,
    },
    declineButton: {
        flex: 0.25,
        marginRight: 20,
    },
    acceptButton: {
        flex: 0.75,
    },
    scrollBorder: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        borderRadius: 2,
        bottom: 0,
        height: 3,
        position: 'absolute',
        width: '100%',
    },
});
