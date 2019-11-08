import { NativeEventEmitter, NativeModules } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { Params } from '../config';
import ChffrPlus from '../native/ChffrPlus';

const SETTINGS_CLICK_EVENT = 'onSettingsClick';
const eventEmitter = new NativeEventEmitter(NativeModules.ChffrPlus);
let listener;
let subscription;

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
    subscription = eventEmitter.addListener(SETTINGS_CLICK_EVENT, listener);
}

function unregister() {
    listener = null;
    subscription.remove();
}

export default { register, unregister };