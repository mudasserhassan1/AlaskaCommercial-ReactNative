import {
  ADD_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  SAVE_CART_INVOICE,
  SAVE_PAYMENT_METHODS,
  ADD_CART_PAYMENT,
  UPDATE_PAYMENT_METHOD,
  REMOVE_CART_ALL_PAYMENTS,
  REMOVE_CART_PAYMENT,
  SAVE_PAYMENTS_CONFIG,
} from '../types';
import {PAYMENT_METHODS} from '../../constants/Common';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer} from "redux-persist";

const initialState = {
  payments: {},
  cartInvoice: {},
  cartPayments: {},
  paymentsConfig: {},
};

const paymentReducer = (state = initialState, action) => {
  const {type, payload} = action || {};
  const {method, _id, details} = payload || {};
  switch (type) {
    case ADD_PAYMENT_METHOD:
      if (method) {
        const payments = {
          ...state.payments,
          [method]: Array.isArray(details)
            ? details //Add Multiple and Removing Previous
            : [payload.details, ...(state.payments[method] || [])], //Enqueue Single
        };
        return {...state, payments};
      }
      break;
    case UPDATE_PAYMENT_METHOD:
      if (method) {
        const updatedMethod = (state.payments[method] || []).map(payment => (payment?._id === _id ? details : payment));
        return {...state, payments: {...state.payments, [method]: updatedMethod}};
      }
      break;
    case DELETE_PAYMENT_METHOD:
      if (method) {
        const updatedMethod = state.payments[method].filter(payment => payment?._id !== _id);
        return {...state, payments: {...(state.payments || {}), [method]: updatedMethod}};
      }
      break;
    case SAVE_PAYMENT_METHODS:
      const payments = payload.methods.reduce((acc, payment) => {
        const {type: method} = payment ?? {};
        if (PAYMENT_METHODS[method]) {
          acc[method] = acc[method] ?? [];
          acc[method].push(payment);
        }
        return acc;
      }, {});
      return {...state, payments: payments ?? state.payments};
    case SAVE_PAYMENTS_CONFIG:
      return {...state, paymentsConfig: payload.config ?? {}};
    case SAVE_CART_INVOICE:
      return {...state, cartInvoice: payload ?? {}};
    case ADD_CART_PAYMENT:
      const cartPayments = state.cartPayments || [];
      return {...state, cartPayments: {...(cartPayments || []), [method]: payload.details}};
    case REMOVE_CART_ALL_PAYMENTS:
      return {...state, cartPayments: {}};
    case REMOVE_CART_PAYMENT:
      const addedPayments = state.cartPayments;
      for (let methodType of payload?.methods) {
        delete addedPayments[methodType];
      }
      return {...state, cartPayments: addedPayments};
    default:
      return state;
  }
};

export default paymentReducer;

// const providerPersistConfig = {
//   key: 'payment',
//   storage: AsyncStorage,
// };
// export default  persistReducer(providerPersistConfig, paymentReducer);



