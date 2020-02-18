import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { request as Request, devices as Devices } from '@commaai/comma-api';
import ChffrPlus from '../../native/ChffrPlus';
import Geocoder from '../../native/Geocoder';
import { Params } from '../../config';

export const ACTION_HOST_IS_SSH_ENABLED = 'ACTION_HOST_IS_SSH_ENABLED';
export const ACTION_SIM_STATE_CHANGED = 'ACTION_SIM_STATE_CHANGED';
export const ACTION_NAV_AVAILABILITY_CHANGED = 'ACTION_NAV_AVAILABILITY_CHANGED';
export const ACTION_CONNECTION_STATUS_CHANGED = 'ACTION_CONNECTION_STATUS_CHANGED';
export const ACTION_THERMAL_DATA_CHANGED = 'ACTION_THERMAL_DATA_CHANGED';
export const ACTION_WIFI_STATE_CHANGED = 'ACTION_WIFI_STATE_CHANGED';
export const ACTION_DEVICE_IDS_AVAILABLE = 'ACTION_DEVICE_IDS_AVAILABLE';
export const ACTION_DEVICE_REFRESHED = 'ACTION_DEVICE_REFRESHED';
export const ACTION_ACCOUNT_CHANGED = 'ACTION_ACCOUNT_CHANGED';
export const ACTION_DEVICE_STATS_CHANGED = 'ACTION_DEVICE_STATS_CHANGED';
export const ACTION_UPDATE_IS_AVAILABLE_CHANGED = 'ACTION_UPDATE_IS_AVAILABLE_CHANGED';
export const ACTION_LAST_ROUTE_NAME_CHANGED = 'ACTION_LAST_ROUTE_NAME_CHANGED';

export function thermalDataChanged(thermalData) {
    return async (dispatch, getState) => {
        const oldThermal = getState().host.thermal;
        dispatch({
            type: ACTION_THERMAL_DATA_CHANGED,
            thermalData,
        });

        if (oldThermal.started === true && thermalData.started === false) {
            Geocoder.requestLocationUpdate();
            dispatch(fetchDeviceStats());
            dispatch(updateUpdateIsAvailable());
            await dispatch(updateLastRouteName());
            dispatch(NavigationActions.navigate({ routeName: 'DriveRating' }));
        }
    }
}

export function updateLastRouteName() {
    return async dispatch => {
        const lastRouteName = await ChffrPlus.getLastRouteName();
        dispatch({
            type: ACTION_LAST_ROUTE_NAME_CHANGED,
            payload: { lastRouteName }
        });
    }
}

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

export function updateNavAvailability() {
    return async dispatch => {
        const isNavAvailable = await ChffrPlus.isNavAvailable();

        dispatch({
            type: ACTION_NAV_AVAILABILITY_CHANGED,
            isNavAvailable,
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

        dispatch({
            type: ACTION_DEVICE_IDS_AVAILABLE,
            imei,
            serial,
        });
    }
}

export function updateUpdateIsAvailable() {
    return async (dispatch, getState) => {
        const isUpdateAvailableStr = await ChffrPlus.readParam(Params.KEY_IS_UPDATE_AVAILABLE);
        const updateIsAvailable = ((isUpdateAvailableStr && isUpdateAvailableStr.trim() === "1") || false);
        const updateReleaseNotes = await ChffrPlus.readParam(Params.KEY_RELEASE_NOTES);
        dispatch({
            type: ACTION_UPDATE_IS_AVAILABLE_CHANGED,
            updateIsAvailable,
            updateReleaseNotes,
        });
    }
}

export function fetchAccount() {
    return async (dispatch, getState) => {
        try {
            const dongleId = await ChffrPlus.readParam("DongleId");
            const account = await Devices.fetchDeviceOwner(dongleId);
            dispatch({
                type: ACTION_ACCOUNT_CHANGED,
                account,
            });
        } catch(error) {
            console.log('error fetching account profile', error);
        }
    }
}

export function fetchDeviceStats() {
    return async (dispatch, getState) => {
        try {
            const dongleId = await ChffrPlus.readParam("DongleId");
            const deviceStats = await Devices.fetchDeviceStats(dongleId);
            dispatch({
                type: ACTION_DEVICE_STATS_CHANGED,
                deviceStats,
            });
        } catch(error) {
            console.log('error fetching device stats', error);
        }
    }
}

export function updateSshEnabled(isSshEnabled) {
    return async dispatch => {
        if (isSshEnabled !== undefined) {
            ChffrPlus.setSshEnabled(!!isSshEnabled);
        } else {
            isSshEnabled = await ChffrPlus.getSshEnabled();
        }

        dispatch({type: ACTION_HOST_IS_SSH_ENABLED, isSshEnabled: !!isSshEnabled });
    }
}

export function refreshDeviceInfo() {
    return async (dispatch, getState) => {
        const dongleId = await ChffrPlus.readParam("DongleId");
        Sentry.setUser({
          dongleId,
        });

        const token = await ChffrPlus.createJwt({"identity": dongleId});
        await Request.configure(token);

        const device =  await Devices.fetchDevice(dongleId);
        dispatch({
            type: ACTION_DEVICE_REFRESHED,
            device,
        })
    }
}
