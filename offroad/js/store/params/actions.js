import ChffrPlus from '../../native/ChffrPlus';
import { Params } from '../../config';

export const ACTION_PARAM_CHANGED = 'ACTION_PARAM_CHANGED';
export const ACTION_PARAM_DELETED = 'ACTION_PARAM_DELETED';

export const ALERT_PARAMS = [
  Params.KEY_OFFROAD_CHARGE_DISABLED,
  Params.KEY_OFFROAD_TEMPERATURE_TOO_HIGH,
  Params.KEY_OFFROAD_CONNECTIVITY_NEEDED_PROMPT,
  Params.KEY_OFFROAD_CONNECTIVITY_NEEDED,
  Params.KEY_OFFROAD_PANDA_FIRMWARE_MISMATCH,
  Params.KEY_OFFROAD_INVALID_TIME,
  Params.KEY_OFFROAD_IS_TAKING_SNAPSHOT,
];
const PARAMS = [
  "AccessToken",
  "CalibrationParams",
  "CompletedTrainingVersion",
  "ControlsParams",
  "DongleId",
  "GitBranch",
  "GitCommit",
  "GitRemote",
  "HasAcceptedTerms",
  "HasCompletedSetup",
  "IsGeofenceEnabled",
  "IsMetric",
  "LimitSetSpeed",
  "LiveParameters",
  "LongitudinalControl",
  "Passive",
  "RecordFront",
  "SpeedLimitOffset",
  "TrainingVersion",
  "Version",
  "OpenpilotEnabledToggle",
  "PandaFirmware",
  "PandaFirmwareHex",
  "PandaDongleId",
  "CommunityFeaturesToggle",
  "IsLdwEnabled",
].concat(ALERT_PARAMS);

export function refreshParams(params) {
  if (!Array.isArray(params)) {
    params = PARAMS;
  }

  return async function(dispatch, getState) {
    await Promise.all(params.map(function(param) {
      return ChffrPlus.readParam(param).then(function(value) {
        if (value !== getState().params.params[param]) {
          dispatch({ type: ACTION_PARAM_CHANGED, payload: { param, value }});
        }
      });
    }));
  }
}

export function updateParam(param, value) {
  return function(dispatch) {
    dispatch({ type: ACTION_PARAM_CHANGED, payload: { param, value }});
    setTimeout(() => {
      ChffrPlus.writeParam(param, value);
    }, 0);
  }
}

export function deleteParam(param) {
  return function(dispatch) {
    dispatch({ type: ACTION_PARAM_DELETED, payload: { param }});
    setTimeout(function() {
      ChffrPlus.deleteParam(param);
    }, 0);
  }
}
