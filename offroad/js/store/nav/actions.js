import { NavigationActions } from 'react-navigation';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { launchRouteForTrainingVersion } from '../../utils/version';

export const resetToLaunch = () => {
    return async dispatch => {
        const paramHasCompletedSetup = await ChffrPlus.readParam(Params.KEY_HAS_COMPLETED_SETUP);
        const paramIsPassive = await ChffrPlus.readParam(Params.KEY_IS_PASSIVE);
        const latestTermsVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TERMS_VERSION);
        const acceptedTermsVersion = await ChffrPlus.readParam(Params.KEY_ACCEPTED_TERMS_VERSION);

        const isPassive = (paramIsPassive === "1");
        const hasCompletedSetup = (paramHasCompletedSetup === "1");
        const trainingLaunchRoute = await launchRouteForTrainingVersion();
        const hasCompletedTraining = (trainingLaunchRoute === null);
        const hasAcceptedLatestTerms = (latestTermsVersion === acceptedTermsVersion);

        let launchRoute;
        if (hasCompletedSetup && (hasCompletedTraining || isPassive) && hasAcceptedLatestTerms) {
            launchRoute = 'Home';
        } else if (hasCompletedSetup && !isPassive && !hasCompletedTraining) {
            launchRoute = trainingLaunchRoute;
        } else if (hasCompletedSetup && !hasAcceptedLatestTerms) {
            launchRoute = 'SetupTermsStandalone';
        } else {
            launchRoute = 'SetupWelcome';
        }

        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [ NavigationActions.navigate({ routeName: launchRoute }) ]
        }));
    }
}
