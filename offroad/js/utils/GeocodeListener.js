import { DeviceEventEmitter } from 'react-native';

import { updateLocation } from '../store/environment/actions';

let listener;

function onGeocodeChanged(dispatch) {
    return (location) => {
        dispatch(updateLocation(location));
    }
}

function register(dispatch) {
    if (listener) unregister();

    listener = onGeocodeChanged(dispatch);
    DeviceEventEmitter.addListener('onGeocodeChanged', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('onGeocodeChanged', listener);
    listener = null;
}

export default { register, unregister };