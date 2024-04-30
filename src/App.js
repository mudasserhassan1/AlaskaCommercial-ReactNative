// import React, {PureComponent} from 'react';
// import {LogBox, Text} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
// import thunk from 'redux-thunk';
// import {applyMiddleware, compose, createStore} from 'redux';
// import {Provider} from 'react-redux';
// import Gleap from 'react-native-gleapsdk';
//
// import RootNavigator from './navigation/RootNavigator';
// import Geocoder from 'react-native-geocoding';
// import Reactotron from './configs/ReactotronConfig';
// import {
//   ENVIRONMENTS,
//   GEO_CODING_APIKEY,
//   GLEAP_TOKEN,
//   SPLASH_TIME,
// } from './constants/Common';
// import {requestNotificationPermission} from './utils/notificationsUtils';
// import {setNotificationAllowed} from './redux/actions/general';
// import RootContainer from './containers/RootContainer';
// import crashlytics from '@react-native-firebase/crashlytics';
// import AppUpdateHandler from './containers/AppUpdateHandler';
// import Config from 'react-native-config';
// import {persistStore} from 'redux-persist';
// import persistReducer from './redux/reducers';
// import {PersistGate} from 'redux-persist/integration/react';
//
// const enhancer = compose(applyMiddleware(thunk), Reactotron.createEnhancer());
// export const reduxStore = createStore(persistReducer, enhancer);
// const persistor = persistStore(reduxStore);
//
// export default class App extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isStoreLoading: false,
//       store: reduxStore,
//     };
//   }
//
//   componentDidMount() {
//     Geocoder.init(GEO_CODING_APIKEY, {language: 'en'});
//     setTimeout(async () => {
//       SplashScreen.hide();
//       const hasPermission = await requestNotificationPermission();
//       this.state.store?.dispatch?.(setNotificationAllowed(hasPermission));
//     }, SPLASH_TIME);
//     if (!__DEV__) {
//       crashlytics().setCrashlyticsCollectionEnabled(true);
//       if (Config.ENV !== ENVIRONMENTS.PRODUCTION) {
//         Gleap.initialize(GLEAP_TOKEN);
//       }
//     }
//     LogBox.ignoreAllLogs();
//   }
//   render() {
//     const {store = {}, isStoreLoading = false} = this.state ?? {};
//     return (
//       <>
//         {isStoreLoading ? (
//           <Text>Loading.....</Text>
//         ) : (
//           <Provider store={store}>
//             <PersistGate
//               loading={<Text>Loading...</Text>}
//               persistor={persistor}>
//               <AppUpdateHandler />
//               <RootNavigator />
//               <RootContainer />
//             </PersistGate>
//           </Provider>
//         )}
//       </>
//     );
//   }
// }

import React, {PureComponent} from 'react';
import {AppState, LogBox, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import thunk from 'redux-thunk';
import {applyMiddleware, compose, createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import Gleap from 'react-native-gleapsdk';

import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';
import Geocoder from 'react-native-geocoding';
import Reactotron, {logToConsole} from './configs/ReactotronConfig';
import {
  ASYNC_STORAGE_KEYS,
  ENVIRONMENTS,
  GEO_CODING_APIKEY,
  GLEAP_TOKEN,
  SPLASH_TIME,
} from './constants/Common';
import {requestNotificationPermission} from './utils/notificationsUtils';
import {api} from './services/Apis';
import {getApiToken} from './utils/userUtils';
import {setNotificationAllowed} from './redux/actions/general';
import RootContainer from './containers/RootContainer';
import crashlytics from '@react-native-firebase/crashlytics';
import AppUpdateHandler from './containers/AppUpdateHandler';
import Config from 'react-native-config';

const enhancer = compose(applyMiddleware(thunk), Reactotron.createEnhancer());
export let reduxStore = createStore(reducers, enhancer); //create initial store

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isStoreLoading: false,
      store: reduxStore,
    };
  }

  //Persisted state Logic
  UNSAFE_componentWillMount() {
    let self = this;
    this.stateListner = AppState.addEventListener(
      'change',
      this._handleAppStateChange.bind(this),
    );
    this.setState({isStoreLoading: true});
    AsyncStorage.getItem(ASYNC_STORAGE_KEYS.GLOBAL_STATE)
      .then(async value => {
        if (value && value.length) {
          let initialStore = JSON.parse(value);
          const {general: {loginInfo: {userToken = ''} = {}} = {}} =
            initialStore ?? {};
          const token = await getApiToken();
          if (userToken || token) {
            api?.setHeader?.(
              'Authorization',
              `Bearer ${userToken || token}` || '',
            );
          }
          self.setState({
            store: createStore(reducers, initialStore, enhancer),
          });
        } else {
          self.setState({store: reduxStore});
        }
        self.setState({isStoreLoading: false});
      })
      .catch(() => {
        self.setState({store: reduxStore});
        self.setState({isStoreLoading: false});
      });
  }

  componentWillUnmount() {
    this.stateListner.remove();
    // AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  async _handleAppStateChange() {
    let storeState = this.state.store.getState();
    const {general = {}, config = {}} = storeState ?? {};
    const {loginInfo: {userInfo: {isGuest = false} = {}} = {}} = general || {};
    let storeToSave = {config};
    if (!isGuest) {
      storeToSave = {general, config};
    }
    AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.GLOBAL_STATE,
      JSON.stringify(storeToSave),
    )
      .then(() => {})
      .catch(e => {
        logToConsole({e});
      });
  }

  componentDidMount() {
    Geocoder.init(GEO_CODING_APIKEY, {language: 'en'});
    setTimeout(async () => {
      SplashScreen.hide();
      const hasPermission = await requestNotificationPermission();
      this.state.store?.dispatch?.(setNotificationAllowed(hasPermission));
    }, SPLASH_TIME);
    if (!__DEV__) {
      crashlytics().setCrashlyticsCollectionEnabled(true);
      if (Config.ENV !== ENVIRONMENTS.PRODUCTION) {
        Gleap.initialize(GLEAP_TOKEN);
      }
    }
    LogBox.ignoreAllLogs();
  }
  render() {
    const {store = {}, isStoreLoading = false} = this.state ?? {};
    return (
      <>
        {isStoreLoading ? (
          <Text allowFontScaling={false}>Loading.....</Text>
        ) : (
          <Provider store={store}>
            <AppUpdateHandler />
            <RootNavigator />
            <RootContainer />
          </Provider>
        )}
      </>
    );
  }
}
