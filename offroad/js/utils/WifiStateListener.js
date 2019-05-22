import { DeviceEventEmitter } from 'react-native';
import { ACTION_WIFI_STATE_CHANGED } from '../store/host/actions';

let listener;

function onWifiStateChange(dispatch) {
    return wifiState => {
        dispatch({
            type: ACTION_WIFI_STATE_CHANGED,
            wifiState,
        });
    }
}

function register(dispatch) {
    if (listener) unregister();

    listener = onWifiStateChange(dispatch);
    DeviceEventEmitter.addListener('WIFI_STATE_CHANGED', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('WIFI_STATE_CHANGED', listener);
    listener = null;
}

export default { register, unregister };