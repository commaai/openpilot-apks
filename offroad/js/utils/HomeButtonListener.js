import { DeviceEventEmitter } from 'react-native';
import { NavigationActions } from 'react-navigation';

import ChffrPlus from '../native/ChffrPlus';
import { checkHasCompletedTraining, checkIsPassive } from './version';
import { Params } from '../config';
import { resetToLaunch } from '../store/nav/actions';

let listener;

function checkHasCompletedSetup() {
    return ChffrPlus.readParam(Params.KEY_HAS_COMPLETED_SETUP).then(param => param === "1");
}

function onHomePress(dispatch) {
    return () => {
      navigateToHomeScreen(dispatch);
    }
}

function navigateToHomeScreen(dispatch) {
    dispatch(resetToLaunch());
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
