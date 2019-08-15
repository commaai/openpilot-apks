import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginBottom: 20,
    },
    statusRow: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 30,
        paddingBottom: 20,
    },
    titleText: {
        marginBottom: 10,
    },
    detailText: {
        width: 350,
    },
    status: {
        backgroundColor: 'rgba(0,0,0,0.09)',
        borderRadius: 13,
        borderColor: 'rgba(255,255,255,0.11)',
        borderWidth: 1,
        alignItems   : 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 0.75,
    },
    checkmarkImage: {
        height: 30,
        width: 30,
        marginLeft: 15,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
    },
    simImageContainer: {
        flex: 0.25,
        marginRight: 20,
    },
    simImage: {
        flex: 1,
        resizeMode: 'contain',
    },
    skipButtonContainer: {
        flex: 0.4,
    },
    skipButton: {
        borderRadius: 13,
        borderColor: 'rgba(255,255,255,0.11)',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonsRight: {
        flex: 0.6,
        paddingLeft: 20,
    },
    buttonRight: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
    },
    arrowImageContainer: {
        width: 33,
        marginRight: 35,
        flex: 1,
        alignSelf: 'flex-end',
        position: 'relative',
    },
    arrowImageGradient: {
        position: 'absolute',
        flex: 1,
        height: '150%',
        zIndex: 2,
    },
    arrowImage: {
        position: 'absolute',
        flex: 1,
        width: 33,
        zIndex: 1,
        resizeMode: 'contain',
    }
});
