import ChffrPlus from '../native/ChffrPlus';
import { Params } from '../config';

let _isPassive = false;
let initPromise = init();

async function init() {
  const paramIsPassive = await ChffrPlus.readParam(Params.KEY_IS_PASSIVE);
  _isPassive = paramIsPassive === "1";
}

export const checkHasCompletedTraining = async () => {
  const latestVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TRAINING_VERSION);
  const completedVersion = await ChffrPlus.readParam(Params.KEY_COMPLETED_TRAINING_VERSION);

  return latestVersion !== null && latestVersion === completedVersion;
}

export async function checkIsPassive() {
  await initPromise;

  return _isPassive;
}

const routeByTrainingVersion = {
  0: 'Onboarding',
  1: 'GiraffeSwitch',
};
const trainingVersionByRoute = Object.entries(routeByTrainingVersion).reduce(function(obj, version, route) {
  obj.route = version;
  return obj;
}, {});

export async function launchRouteForTrainingVersion() {
  const latestVersion = await ChffrPlus.readParam(Params.KEY_LATEST_TRAINING_VERSION);
  const completedVersion = await ChffrPlus.readParam(Params.KEY_COMPLETED_TRAINING_VERSION);

  if (completedVersion === null) {
    return 'Onboarding';
  } else if (parseInt(latestVersion) > parseInt(completedVersion)) {
    return routeByTrainingVersion[parseInt(completedVersion) + 1];
  } else {
    return null;
  }
}

export async function onTrainingRouteCompleted(routeName) {
  let version = trainingVersionByRoute[routeName];
  if (version == null || routeName === 'Onboarding') {
      version = await ChffrPlus.readParam(Params.KEY_LATEST_TRAINING_VERSION);
  }
  ChffrPlus.writeParam(Params.KEY_COMPLETED_TRAINING_VERSION, version);
}
