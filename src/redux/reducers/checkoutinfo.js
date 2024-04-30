// reducers.js

import {SET_CHECKOUT_INFO} from '../types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer} from "redux-persist";
import whitelist from "validator/es/lib/whitelist";

const initialState = {
  checkoutInformation: {},
  deliveryDetail: {},
  address: {},
  instruction: '',
};

const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHECKOUT_INFO:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default checkoutReducer;
// const providerPersistConfig = {
//   key: 'checkoutinfo',
//   storage: AsyncStorage,
// whitelist:['checkoutInformation',]
// };
// export default persistReducer(providerPersistConfig, checkoutReducer);



