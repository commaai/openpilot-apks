import React, { Component } from 'react';
import {
    StatusBar,
    Platform,
} from 'react-native';
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import RootReducer from './js/store';
import StackNavigator from './js/navigators/StackNavigator';
import SimStateListener from './js/utils/SimStateListener';
import AppStateListener from './js/utils/AppStateListener';
import WifiStateListener from './js/utils/WifiStateListener';

import { refreshParams } from './js/store/params/actions';
import {
    updateSimState,
    updateWifiState,
    setDeviceIds,
    refreshDeviceInfo,
} from './js/store/host/actions';

import { Sentry } from 'react-native-sentry';

if (!__DEV__) {
    // const sentryDsn = Platform.select({
    //   "ios":"https://50043662792c42558b59f761be477b71:79b74f53eaae4b5494e2a3a12b307453@sentry.io/257901",
    //   "android":"https://50043662792c42558b59f761be477b71:79b74f53eaae4b5494e2a3a12b307453@sentry.io/257901"
    // });
    // Sentry.config(sentryDsn).install();
}

function createNeosSetupStore() {
    let transforms = compose(applyMiddleware(thunk));
    const store = createStore(RootReducer,
                              undefined,
                              transforms);
    let persistor = persistStore(store, { debug: true });
    return { store, persistor };
}

export default class App extends Component {
    constructor(props) {
        super(props);

        const { store, persistor } = createNeosSetupStore();
        this.store = store;
        this.persistor = persistor;
        this.onBeforeLift = this.onBeforeLift.bind(this);
    }

    async onBeforeLift() {
        // Called after store is rehydrated from disk
        this.store.dispatch(setDeviceIds()).then(() => this.store.dispatch(refreshDeviceInfo()));
        this.store.dispatch(refreshParams());
        AppStateListener.register(this.store.dispatch);
        SimStateListener.register(this.store.dispatch);
        WifiStateListener.register(this.store.dispatch);
    }

    componentDidMount() {
        this.store.dispatch(updateSimState());
        this.store.dispatch(updateWifiState());
        StatusBar.setHidden(true);
    }

    componentWillUnmount() {
        SimStateListener.unregister();
        WifiStateListener.unregister();
    }

    render() {
        return (
            <Provider store={ this.store }>
                <PersistGate
                    persistor={ this.persistor }
                    onBeforeLift={ this.onBeforeLift }>
                    <StackNavigator />
                </PersistGate>
            </Provider>
        );
    }

}
