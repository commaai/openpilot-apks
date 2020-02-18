import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    driveRating: {
        flex: 1,
        padding: 26,
        paddingTop: 34,
    },
    driveRatingTitle: {
        alignItems: 'center',
        height: 50,
        justifyContent: 'center',
    },
    driveRatingSubtitle: {
        alignItems: 'center',
        height: 60,
        justifyContent: 'center',
    },
    driveRatingSelections: {
        flexDirection: 'row',
        flex: 1,
        paddingTop: 6,
        paddingBottom: 18,
        width: '100%',
    },
    driveRatingSelection: {
        height: '100%',
        opacity: 0.4,
        padding: 13,
        width: '33.3%',
    },
    driveRatingSelectionSelected: {
        opacity: 1,
    },
    driveRatingSelectionImage: {
        height: '100%',
        width: '100%',
    },
})
