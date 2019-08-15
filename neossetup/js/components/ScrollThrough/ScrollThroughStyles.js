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
        flex: 0.3,
        flexDirection: 'row',
        marginTop: 15,
    },
    declineButton: {
        flex: 0.25,
        marginRight: 20,
    },
    acceptButton: {
        flex: 0.75,
    },
    scrollBorder: {
        borderTopColor: 'rgba(255,255,255,0.08)',
        borderTopWidth: 2,
        width: '100%',
        height: 1,
        position: 'absolute',
        bottom: 0,
    },
});
