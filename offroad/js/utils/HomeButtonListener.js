import { DeviceEventEmitter } from 'react-native';
import { NavigationActions } from 'react-navigation';

import ChffrPlus from '../native/ChffrPlus';
import { checkHasCompletedTraining, checkIsPassive } from './version';
import { Params } from '../config';

let listener;

function checkHasCompletedSetup() {
    return ChffrPlus.readParam(Params.KEY_HAS_COMPLETED_SETUP).then(param => param === "1");
}

function onHomePress(dispatch) {
    return () => {
        Promise.all([checkHasCompletedSetup(), checkHasCompletedTraining(), checkIsPassive()])
            .then(([hasCompletedSetup, hasCompletedTraining, isPassive]) =>
                navigateToHomeScreen(dispatch, hasCompletedSetup, hasCompletedTraining, isPassive)
        );
    }
}

function navigateToHomeScreen(dispatch, hasCompletedSetup, hasCompletedTraining, isPassive) {
    if (hasCompletedSetup && (hasCompletedTraining || isPassive)) {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Home' })
            ]
        }));
    } else if (hasCompletedSetup && !isPassive) {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Onboarding' })
            ]
        }));
    } else {
        dispatch(NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: 'Setup' })
            ]
        }));
    }
}

function register(dispatch) {
    if (listener) unregister();

    listener = onHomePress(dispatch);
    DeviceEventEmitter.addListener('onHomePress', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('onHomePress', listener);
    listener = null;
}

export default { register, unregister };
