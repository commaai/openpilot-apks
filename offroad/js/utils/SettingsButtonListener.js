import { DeviceEventEmitter } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { Params } from '../config';
import ChffrPlus from '../native/ChffrPlus';

const SETTINGS_CLICK_EVENT = 'onSettingsClick';

let listener;

function onSettingsPress(dispatch) {
    return () => {
        checkHasCompletedSetup().then((hasCompletedSetup) => {
            if (hasCompletedSetup) {
                dispatch(NavigationActions.navigate({ routeName: 'Settings', key: null }));
            }
        });
    }
}

function checkHasCompletedSetup() {
    return ChffrPlus.readParam(Params.KEY_HAS_COMPLETED_SETUP).then(param => param === "1");
}

function register(dispatch) {
    if (listener) unregister();

    listener = onSettingsPress(dispatch);
    DeviceEventEmitter.addListener(SETTINGS_CLICK_EVENT, listener);
}

function unregister() {
    DeviceEventEmitter.removeListener(SETTINGS_CLICK_EVENT, listener);
    listener = null;
}

export default { register, unregister };