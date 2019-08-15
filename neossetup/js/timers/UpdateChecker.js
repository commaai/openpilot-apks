import ChffrPlus from '../native/ChffrPlus';
import { Params } from '../config';
import { didCheckUpdate } from '../store/updater/actions';

const CHECK_INTERVAL = 60000;
let timer = null;

const update = async (dispatch) => {
    const isUpdateAvailableStr = await ChffrPlus.readParam(Params.KEY_IS_UPDATE_AVAILABLE);
    const isUpdateAvailable = ((isUpdateAvailableStr && isUpdateAvailableStr.trim() === "1") || false);
    dispatch(didCheckUpdate(isUpdateAvailable));
}

export const start = (dispatch) => {
    if (timer !== null) stop();

    timer = setInterval(() => update(dispatch), CHECK_INTERVAL);
}

export const stop = () => {
    clearInterval(timer);
    timer = null;
}

export default { start, stop };