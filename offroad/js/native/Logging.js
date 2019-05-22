import { NativeModules } from 'react-native';

const LoggingModule = NativeModules.LoggingModule;

function cloudLog(event, props = null) {
    if(__DEV__) {
        console.log(`cloudLog ${event} ${JSON.stringify(props)}`)
    }
    try {
        if(props != null) {
            LoggingModule.cloudLogWithProperties(event, props);
        } else {
            LoggingModule.cloudLog(event);
        }
    } catch(err) {
        // Can fail on android if activity is not available
        // https://sentry.io/commaai/chffr/issues/346054222/
        console.warn(err);
    }
}

function mixpanel(event, props = null) {
    if(__DEV__) {
        console.log(`mixpanel ${event} ${JSON.stringify(props)}`);
    }

    try {
        if (props != null) {
            LoggingModule.mixpanelTrackWithProperties(event, props);
        } else {
            LoggingModule.mixpanelTrack(event);
        }
    } catch(err) {
        console.warn(err);
    }
}

const bind = LoggingModule && LoggingModule.bind;

export default { cloudLog, bind, mixpanel };