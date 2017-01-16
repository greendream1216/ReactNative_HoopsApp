import { createStore, applyMiddleware } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import { composeWithDevTools } from 'remote-redux-devtools';

import {startupActions} from './actions';
import config from './config';

export default (rootReducer) => {
  const middleware = [
    createLogger(config.LOGGER),
    thunk
  ];
  const enhancers = [];

  enhancers.push(applyMiddleware(...middleware));

  const composeEnhancers = composeWithDevTools({ realtime: true });

  if (config.REDUCER_PERSIST) {
    enhancers.push(autoRehydrate());
  }

  const store = createStore(rootReducer, composeEnhancers(...enhancers));

  if (config.REDUCER_PERSIST) {
    updateReducers(store);
  }

  return store;
};

/* Rehydration + Reducer Version */
const updateReducers = (store) => {
  const reducerVersion = config.REDUCER_VERSION;
  const storeConfig = config.REDUCER_CONFIG;
  const startup = () => store.dispatch(startupActions.startup());

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      // Purge store
      persistStore(store, storeConfig, startup).purge();
      AsyncStorage.setItem('reducerVersion', reducerVersion);
    } else {
      persistStore(store, storeConfig, startup);
    }
  }).catch(() => {
    persistStore(store, storeConfig, startup);
    AsyncStorage.setItem('reducerVersion', reducerVersion);
  });
};