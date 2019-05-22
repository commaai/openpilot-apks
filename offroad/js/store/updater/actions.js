import { NavigationActions } from 'react-navigation';
import { resetToLaunch } from '../nav/actions';
import ChffrPlus from '../../native/ChffrPlus';
import Logging from '../../native/Logging';
import { Params } from '../../config';

export const ACTION_UPDATE_CHECKED = 'ACTION_UPDATE_CHECKED';
export const ACTION_UPDATE_PROMPTED = 'ACTION_UPDATE_PROMPTED';

const PROMPT_INTERVAL_MILLIS = 86400 * 1000; // 1 day

export const didCheckUpdate = (isUpdateAvailable) => {
    return async (dispatch, getState) => {
        let releaseNotes = '';

        if (isUpdateAvailable) {
            try {
                const { gitBranch } = await ChffrPlus.getGitVersion();
                const isPassive = (await ChffrPlus.readParam(Params.KEY_IS_PASSIVE)) === "1";
                const base = isPassive ? 'chffrplus' : 'openpilot';

                const releasesUrl = `https://raw.githubusercontent.com/commaai/${base}/${gitBranch}/RELEASES.md`;
                const resp = await fetch(releasesUrl);
                const releasesMd = await resp.text();

                const firstBlockEndIdx = releasesMd.indexOf('\n\n');
                if (firstBlockEndIdx !== -1) {
                    releaseNotes = releasesMd.substring(0, firstBlockEndIdx);
                }
            } catch(err) {
                Logging.cloudLog('Could not get release notes', { err: err.toString() })
            }
        }

        dispatch({
            type: ACTION_UPDATE_CHECKED,
            isUpdateAvailable,
            releaseNotes,
        });

        const { lastUpdatePromptMillis } = getState().updater;
        const shouldShowUpdatePrompt = (
            isUpdateAvailable &&
            (Date.now() - lastUpdatePromptMillis) > PROMPT_INTERVAL_MILLIS
        );

        if (shouldShowUpdatePrompt) {
            dispatch({ type: ACTION_UPDATE_PROMPTED });
            dispatch(NavigationActions.navigate({ routeName: 'UpdatePrompt' }));
        }
    }
}

export const dismissUpdatePrompt = () => {
    return dispatch => {
        dispatch(resetToLaunch());
    }
};
