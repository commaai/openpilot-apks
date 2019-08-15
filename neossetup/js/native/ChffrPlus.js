import { NativeModules } from 'react-native';
const ChffrPlus = NativeModules.ChffrPlus;
import { Params } from '../config';

const doUpdate = () => {
    ChffrPlus.writeParam(Params.KEY_SHOULD_DO_UPDATE, '1');
    ChffrPlus.reboot();
}

export default {
    ...ChffrPlus,
    doUpdate,
};