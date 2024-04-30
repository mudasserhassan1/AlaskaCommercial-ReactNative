import {combineReducers} from 'redux';
import general from './general';
import payment from './payment';
import search from './search';
import config from './config';
import checkoutinfo from './checkoutinfo';

export default combineReducers({
  general,
  payment,
  search,
  config,
  checkoutinfo,
});

// import {persistReducer} from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {combineReducers} from 'redux';
//
// import general from './general';
// import payment from './payment';
// import search from './search';
// import config from './config';
// import checkoutinfo from './checkoutinfo';
//
// const guestWhiteList = ['config'];
// const loginWhiteList = ['general', 'config'];
//
// // const whiteList= reduxStore.getState().general.isGuest?guestWhiteList:loginWhiteList
// const rootReducer = combineReducers({
//   general,
//   payment,
//   search,
//   config,
//   checkoutinfo,
// });
//
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['general', 'config'],
// };
//
// const persistedReducer = persistReducer(persistConfig, rootReducer);
//
// export default persistedReducer;
