import { DeviceEventEmitter } from 'react-native';
import { ACTION_SIM_STATE_CHANGED } from '../store/host/actions';

let listener;

function onSimStateChange(dispatch) {
    return simState => {
        dispatch({
            type: ACTION_SIM_STATE_CHANGED,
            simState,
        });
    }
}

function register(dispatch) {
    if (listener) unregister();

    listener = onSimStateChange(dispatch);
    DeviceEventEmitter.addListener('SIM_STATE_CHANGED', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('SIM_STATE_CHANGED', listener);
    listener = null;
}

export default { register, unregister };