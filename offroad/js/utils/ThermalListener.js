import { DeviceEventEmitter } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { thermalDataChanged } from '../store/host/actions';

let listener;

function onThermalDataChanged(dispatch) {
    return thermalData => {
        dispatch(thermalDataChanged(thermalData));
    }
}

function register(dispatch) {
    if (listener) unregister();

    listener = onThermalDataChanged(dispatch);
    DeviceEventEmitter.addListener('onThermalDataChanged', listener);
}

function unregister() {
    DeviceEventEmitter.removeListener('onThermalDataChanged', listener);
    listener = null;
}

export default { register, unregister };