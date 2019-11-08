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

const bind = LoggingModule && LoggingModule.bind;

export default { cloudLog, bind };