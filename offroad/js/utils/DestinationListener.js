import { DeviceEventEmitter } from 'react-native';

import { updateDestination } from '../store/driving/actions';

let listener;

function onDestinationChanged(dispatch) {
    return (destination) => {
        dispatch(updateDestination(destination));
    }
}

function register(dispatch) {
    if (listener) unregister();

    listener = onDestinationChanged(dispatch);
    DeviceEventEmitter.addListener('onDestinationChanged', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('onDestinationChanged', listener);
    listener = null;
}

export default { register, unregister };