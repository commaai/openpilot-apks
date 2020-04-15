import { NavigationActions } from 'react-navigation';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { getCurrentRouteName } from '../../utils/nav';
import { checkHasCompletedTraining } from '../../utils/version';

const STICKY_ROUTE_NAMES = ['DriveRating', 'UpdatePrompt'];

export const resetToLaunch = () => {
    return async (dispatch, getState) => {

        const paramHasCompletedSetup = await ChffrPlus.readParam(Params.KEY_HAS_COMPLETED_SETUP);
        const paramIsPassive = await ChffrPlus.readParam(Params.KEY_IS_PASSIVE);
        const latestTermsVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TERMS_VERSION);
        const acceptedTermsVersion = await ChffrPlus.readParam(Params.KEY_ACCEPTED_TERMS_VERSION);

        const isPassive = (paramIsPassive === "1");
        const hasCompletedSetup = (paramHasCompletedSetup === "1");
        const hasCompletedTraining = await checkHasCompletedTraining();
        const hasAcceptedLatestTerms = (latestTermsVersion === acceptedTermsVersion);
        const hasInternetConnection = getState().host.isConnected;

        const currentRoute = getCurrentRouteName(getState().nav);
        if (STICKY_ROUTE_NAMES.some(function(route) { return route === currentRoute })) {
            return;
        }

        let launchRoute;
        if (hasCompletedSetup && (hasCompletedTraining || isPassive) && hasAcceptedLatestTerms) {
            launchRoute = 'Home';
        } else if (hasCompletedSetup && !isPassive && !hasCompletedTraining) {
            launchRoute = 'Onboarding';
        } else if (!hasAcceptedLatestTerms) {
            launchRoute = 'SetupTerms';
        } else if (!hasCompletedSetup && hasInternetConnection) {
            launchRoute = 'SetupQr';
        } else {
            launchRoute = 'SetupWifi';
        }

        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [ NavigationActions.navigate({ routeName: launchRoute }) ]
        }));
    }
}
