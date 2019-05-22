import { DeviceEventEmitter } from 'react-native';
import { ACTION_THERMAL_DATA_CHANGED } from '../store/host/actions';

let listener;

function onThermalDataChanged(dispatch) {
    return thermalData => {
        if (thermalData) {
            thermalData.unuploadedBytes = parseInt(thermalData.unuploadedBytes);
        }
        dispatch({
            type: ACTION_THERMAL_DATA_CHANGED,
            thermalData,
        });
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