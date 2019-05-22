import {
    ACTION_UPDATE_CHECKED,
    ACTION_UPDATE_PROMPTED,
} from './actions';

const initialUpdaterState = {
    isUpdateAvailable: false,
    lastUpdatePromptMillis: 0,
    releaseNotes: '',
};

export default (state = initialUpdaterState, action) => {
    switch (action.type) {
        case ACTION_UPDATE_CHECKED:
            return {
                ...state,
                isUpdateAvailable: action.isUpdateAvailable,
                releaseNotes: action.releaseNotes,
            };
        case ACTION_UPDATE_PROMPTED:
            return {
                ...state,
                lastUpdatePromptMillis: Date.now(),
            }
        default:
            return state;
    }
}