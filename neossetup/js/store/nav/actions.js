import { NavigationActions } from 'react-navigation';

export const resetToLaunch = () => {
    return async dispatch => {
        let launchRoute = 'SetupWelcome';
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [ NavigationActions.navigate({ routeName: launchRoute }) ]
        }));
    }
}
