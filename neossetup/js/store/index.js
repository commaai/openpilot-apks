import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'

import environment from './environment/reducer';
import host from './host/reducer';
import nav from './nav/reducer';
import params from './params/reducer';

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
    environment: persistReducer(persistConfig('environment'), environment),
    host,
    log,
    nav,
    params,
});
