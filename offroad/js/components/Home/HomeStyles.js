import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    home: {
        flex: 1,
        padding: 15,
    },
    homeHeader: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 80,
    },
    homeHeaderSmall: {
        height: 60,
    },
    homeHeaderIntro: {},
    homeHeaderIntroDate: {
        marginBottom: 5,
    },
    homeHeaderIntroCity: {},
    homeHeaderDetails: {
        alignItems: 'flex-end',
    },
    homeHeaderDetailsVersion: {
        flexDirection: 'row',
    },
    homeHeaderDetailsVersionIcon: {
        height: 16,
        marginRight: 5,
        width: 16,
    },
    homeHeaderDetailsAction: {
        marginTop: 5,
    },
    homeBody: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
    },
    homeBodyDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    homeBodyAlerts: {
        flex: 1,
        padding: 20,
        paddingBottom: 60,
    },
    homeBodyAlert: {
        borderRadius: 10,
        borderColor: '#A1AEB4',
        borderWidth: 2,
        flexDirection: 'row',
        marginBottom: 10,
        padding: 20,
        width: '100%',
    },
    homeBodyAlertRed: {
        backgroundColor: '#8F1F2F',
        borderWidth: 0,
    },
    homeBodyAlertIcon: {
        height: 50,
        width: 55,
    },
    homeBodyAlertText: {
        paddingLeft: 20,
        paddingRight: 40,
    },
    homeBodyAlertActions: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    homeBodyAlertAction: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    homeBodyDisconnected: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeBodyDisconnectedContext: {
        textAlign: 'center',
        padding: 40,
        paddingTop: 20,
    },
    homeBodyStats: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderRadius: 8,
        flex: 0.52,
        paddingLeft: 10,
        paddingRight: 10,
    },
    homeBodyStatsError: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeBodyStatsUnpaired: {
        opacity: 0.25,
    },
    homeBodyStatsHeader: {
        flexDirection: 'row',
        paddingBottom: 6,
        paddingTop: 12,
        paddingLeft: 12,
    },
    homeBodyStatsRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    homeBodyStat: {
        flex: 1,
    },
    homeBodyStatNumber: {
        textAlign: 'center',
    },
    homeBodyStatLabel: {
        paddingTop: 3,
        textAlign: 'center',
    },
    homeBodyAccount: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderRadius: 8,
        flex: 0.45,
    },
    homeBodyAccountDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderWidth: 0,
    },
    homeBodyAccountPairButton: {
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'center',
        padding: 20,
    },
    homeBodyAccountPairButtonHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    homeBodyAccountUpgrade: {
        alignItems: 'center',
        padding: 15,
    },
    homeBodyAccountUpgradeTitle: {
        textAlign: 'center',
        paddingBottom: 8,
    },
    homeBodyAccountUpgradeContext: {
        textAlign: 'center',
        marginBottom: 18,
    },
    homeBodyAccountUpgradeFeature: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 8,
    },
    homeBodyAccountUpgradeIcon: {
        height: 14,
        marginRight: 10,
        opacity: 0.4,
        width: 16,
    },
    homeBodyAccountPairButtonIcon: {
        height: 16,
        marginLeft: 8,
        opacity: 0.5,
        width: 14,
    },
    homeBodyAccountPairButtonContext: {
        textAlign: 'center',
    },
    homeBodyAccountPoints: {
        paddingTop: 36,
    },
    homeBodyAccountPointsNumber: {
        textAlign: 'center',
    },
    homeBodyAccountPointsLabel: {
        paddingTop: 3,
        textAlign: 'center',
    },
    homeBodyAccountDetails: {
        paddingTop: 20,
    },
    homeBodyAccountDetailsName: {
        textAlign: 'center',
        paddingBottom: 12,
    },
    homeBodyAccountDetailsAlias: {
        textAlign: 'center',
        paddingBottom: 6,
    },
    homeBodyAccountDetailsVehicle: {
        textAlign: 'center',
    },
})
