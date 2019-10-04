import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'

import driving from './driving/reducer';
import environment from './environment/reducer';
import host from './host/reducer';
import nav from './nav/reducer';
import params from './params/reducer';
import uploads from './uploads/reducer';

const persistConfig = (key) => ({
    key,
    storage: FilesystemStorage,
    debug: true,
});

const log = (state = {}, action) => {
    console.log('dispatched', action.type);
    return state
};

export default combineReducers({
    driving,
    environment: persistReducer(persistConfig('environment'), environment),
    host,
    log,
    nav,
    params,
    uploads,
});
