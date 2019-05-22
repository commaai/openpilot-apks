import { NavigationActions } from 'react-navigation';

import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';
import { launchRouteForTrainingVersion } from '../../utils/version';

export const resetToLaunch = () => {
    return async dispatch => {
        const paramHasCompletedSetup = await ChffrPlus.readParam(Params.KEY_HAS_COMPLETED_SETUP);
        const paramIsPassive = await ChffrPlus.readParam(Params.KEY_IS_PASSIVE);

        const isPassive = (paramIsPassive === "1");
        const hasCompletedSetup = (paramHasCompletedSetup === "1");
        const trainingLaunchRoute = await launchRouteForTrainingVersion();
        const hasCompletedTraining = (trainingLaunchRoute === null);

        let launchRoute;
        if (hasCompletedSetup && (hasCompletedTraining || isPassive)) {
            launchRoute = 'Home';
        } else if (hasCompletedSetup && !isPassive) {
            launchRoute = trainingLaunchRoute;
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
