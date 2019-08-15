import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        flex: 1,
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        maxHeight: '50%',
        flex: 0.5,
    },
    done: {
        alignSelf: 'flex-end',
    },
    tabs: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 10,
        marginBottom: 20,
        position: 'relative',
    },
    tabsBorder: {
        position: 'absolute',
        width: '100%',
        height: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        borderBottomWidth: 3,
        bottom: 0,
    },
    tab: {
        paddingLeft: 10,
        width: 130,
    },
    tabText: {
        textAlign: 'center',
    },
    selectedTab: {

    },
    selectedTabBorder: {
        position: 'absolute',
        bottom: 0,
        height: 1,
        width: 130,
        borderBottomColor: 'rgba(255,255,255,0.32)',
        borderBottomWidth: 3,
    },
    selectedTabText: {
        textAlign: 'left',
    },
});
