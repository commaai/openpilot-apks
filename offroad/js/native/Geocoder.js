import { NativeModules } from 'react-native';
const OfflineGeocoder = NativeModules.OfflineGeocoder;

export default {
    ...OfflineGeocoder,
};