import { AsyncStorage } from 'react-native';
import { request as Request, devices as Devices } from '@commaai/comma-api';
import ChffrPlus from '../../native/ChffrPlus';

export const ACTION_SIM_STATE_CHANGED = 'ACTION_SIM_STATE_CHANGED';
export const ACTION_CONNECTION_STATUS_CHANGED = 'ACTION_CONNECTION_STATUS_CHANGED';
export const ACTION_WIFI_STATE_CHANGED = 'ACTION_WIFI_STATE_CHANGED';
export const ACTION_DEVICE_IDS_AVAILABLE = 'ACTION_DEVICE_IDS_AVAILABLE';
export const ACTION_DEVICE_REFRESHED = 'ACTION_DEVICE_REFRESHED';
export const ACTION_SOFTWARE_URL_CHANGED = 'ACTION_SOFTWARE_URL_CHANGED';

export function updateWifiState() {
    return async dispatch => {
        const wifiState = await ChffrPlus.getWifiState();

        dispatch({
            type: ACTION_WIFI_STATE_CHANGED,
            wifiState,
        });
    }
}

export function updateSimState() {
    return async dispatch => {
        const simState = await ChffrPlus.getSimState();

        dispatch({
            type: ACTION_SIM_STATE_CHANGED,
            simState,
        });
    }
}

export function updateConnectionState(status) {
    return function (dispatch) {
        dispatch({
            type: ACTION_CONNECTION_STATUS_CHANGED,
            isConnected: status,
        });
    }
}

export function setDeviceIds() {
    return async dispatch => {
        const imei = await ChffrPlus.getImei();
        const serial = await ChffrPlus.getSerialNumber();
        const deviceJwt = await ChffrPlus.readParam("AccessToken");
        await Request.configure(deviceJwt);

        dispatch({
            type: ACTION_DEVICE_IDS_AVAILABLE,
            imei,
            serial,
            deviceJwt,
        });
    }
}

export function refreshDeviceInfo() {
    return async (dispatch, getState) => {
        const dongleId = await ChffrPlus.readParam("DongleId");
        const device =  await Devices.fetchDevice(dongleId);

        dispatch({
            type: ACTION_DEVICE_REFRESHED,
            device,
        })
    }
}

export function resetSoftwareUrl() {
    return (dispatch, getState) => {
        dispatch({
            type: ACTION_SOFTWARE_URL_CHANGED,
            softwareUrl: 'https://',
        })
    }
}

export function updateSoftwareUrl(softwareUrl) {
    return (dispatch, getState) => {
        dispatch({
            type: ACTION_SOFTWARE_URL_CHANGED,
            softwareUrl,
        })
    }
}
