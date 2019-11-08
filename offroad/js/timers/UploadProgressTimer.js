import { ACTION_UPLOAD_SUMMARY_UPDATED } from '../store/uploads/actions';
import ChffrPlus from '../native/ChffrPlus';
import Logging from '../native/Logging';

const INTERVAL_MILLIS = 10000;

let timer = null;

const update = async (dispatch) => {
    try {
        const txSpeedKbps  = await ChffrPlus.getNetworkTxSpeedKbps();

        dispatch({
            type: ACTION_UPLOAD_SUMMARY_UPDATED,
            txSpeedKbps,
        });
    } catch(err) {
        Logging.cloudLog('Failed to get unuploaded files', { err: err.message });
    }
}

export const start = dispatch => {
    if (timer != null) stop();

    timer = setInterval(() => update(dispatch), INTERVAL_MILLIS);
    update(dispatch);
}

export const stop = () => clearInterval(timer);

export default { start, stop };