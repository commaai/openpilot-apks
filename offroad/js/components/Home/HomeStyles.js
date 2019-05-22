import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    home: {
        flex: 1,
        padding: 25,
        paddingTop: 15,
        paddingBottom: 15,
    },
    homeWelcome: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        height: 100,
    },
    homeWelcomeSummary: {
        flex: 1,
        justifyContent: 'center',
    },
    homeWelcomeSummaryDate: {
        marginBottom: 5,
    },
    homeWelcomeSummaryCity: {
        marginBottom: 5,
    },
    homeActions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    homeActionsPrimary: {
        flex: 0.53,
    },
    homeActionsPrimaryButton: {
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,.03)',
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeActionsPrimaryButtonBody: {
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    homeActionsPrimaryButtonHeader: {
        marginBottom: 8,
    },
    homeActionsPrimaryButtonOption: {
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, .1)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        opacity: 0.45,
        paddingTop: 13,
        width: 180,
    },
    homeActionsPrimaryButtonOptionIcon: {
        height: 30,
        width: 30,
        marginRight: 12,
        opacity: 0.45,
    },
    homeActionsPrimaryButtonIcon: {
        height: 65,
        marginBottom: 12,
        opacity: 0.45,
    },
    homeActionsSecondary: {
        justifyContent: 'space-between',
        flex: 0.44,
    },
    homeActionsSecondaryAction: {
        flex: 0.47,
    },
    homeActionsSecondaryButton: {
        alignItems: 'center',
        borderColor: 'rgba(0,0,0,.03)',
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        shadowColor: '#000',
    },
    homeActionsSecondaryButtonBody: {
        flexDirection: 'row',
    },
    homeActionsSecondaryButtonIcon: {
        height: 30,
        marginRight: 12,
        opacity: 0.45,
        width: 30,
    },
})
