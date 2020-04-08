import { DeviceEventEmitter } from 'react-native';
import { resetToLaunch } from '../store/nav/actions';

let listener;

function navigateToHomeScreen(dispatch) {
    dispatch(resetToLaunch());
}

function register(dispatch) {
    if (listener) unregister();

    listener = () => navigateToHomeScreen(dispatch);
    DeviceEventEmitter.addListener('onHomePress', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('onHomePress', listener);
    listener = null;
}

export default { register, unregister };
