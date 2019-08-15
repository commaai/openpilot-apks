import { AppState } from 'react-native';
import { updateDate } from '../store/environment/actions';

let onAppStateChange;
let appState;

function register(dispatch) {
    onAppStateChange = connectedListener(dispatch);
    AppState.addEventListener('change', onAppStateChange);
}

function unregister() {
    AppState.removeEventListener('change', onAppStateChange);
}

function connectedListener(dispatch) {
    return function (nextAppState) {
        if (!appState || (appState.match(/inactive|background/) && nextAppState === 'active')) {
            // App has returned to foreground
            dispatch(updateDate());
        }
        appState = nextAppState;
    }
}

export default { register, unregister };