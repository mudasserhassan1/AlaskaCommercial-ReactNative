import {NOTIFICATIONS_SETTINGS_DATA} from '../../constants/Common';

import {
  ADD_PAYMENT_OPTION,
  ADD_TO_CART,
  ADD_TO_LIST,
  CHANGE_API_ERROR_DIALOG,
  CHANGE_AUTH_ERROR_DIALOG,
  CHANGE_CART_ITEMS,
  CHANGE_LIST,
  CHANGE_LOGIN_STATUS,
  CHANGE_NOTIFICATIONS_SETTINGS,
  CHANGE_PAYMENT_OPTION,
  CHANGE_PROMO_VISIBILITY,
  CHANGE_SELECTED_DELIVERY_SEGMENT,
  GET_LIST,
  LOGOUT,
  REMOVE_LIST,
  SAVE_BEARER_TOKEN,
  SAVE_PREVIOUS_SEARCHES,
  SAVE_USER_INFO,
  SAVE_ZIP_CODES,
  SET_DEEPLINK_DATA,
  SET_DEFAULT_PAYMENT_OPTION,
  SET_DELIVERY_TYPE,
  SET_ELIGIBLE_REFUND_ORDERS,
  SET_IS_BIOMETRICS_MODAL,
  SET_LOGIN_INFO,
  SET_LOGIN_TOKENS,
  SET_NOTIFICATION_ALLOWED,
  SET_NOTIFICATION_BADGE,
  SET_SEGMENTS,
  SET_TIME_FORMAT,
  SET_USER_TYPE,
  TOGGLE_API_ERROR_DIALOG,
  TOGGLE_UNDER_MAINTENANCE,
  UPDATE_CART_ITEMS_COUNT,
  UPDATE_ZIP_CODE_DETAILS,
  ALL_DEPARTMENTS,
  DISABLED_DATES,
} from '../types';

import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import { logToConsole } from "../../configs/ReactotronConfig";

const initialState = {
  listItems: [],
  cartItems: [],
  isFirstVisitToHome: true,
  zipCodeDetail: {},
  storeDetail: {},
  cartItemsCount: 0,
  loggedIn: false,
  is24Hour: false,
  showBadge: false,
  zipCodes: [],
  previousSearches: [],
  loginInfo: {
    userToken: null,
    userId: null,
    userInfo: {},
  },
  paymentOptions: [],
  defaultPaymentOption: {},
  notificationSettings: NOTIFICATIONS_SETTINGS_DATA,
  guestSelectedSegmentIndex: 0,
  selectedDeliveryType: '',
  segments: [],
  isApiErrorDialogVisible: false,
  isAuthErrorDialogVisible: false,
  isNetworkErrorDialogVisible: false,
  isNotificationAllowed: Platform.OS === 'android',
  eligibleRefundOrders: {orders: [], length: 0},
  isPromoVisible: true,
  isBiometricsModal: false,
  isShownAddToCartGuestConfirmation: false,
  allDepartments: [],
  disabledDates: [],
};

const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST:
      return {...state, listItems: action.payload};
    case ADD_TO_LIST:
      return {...state, listItems: [action.payload, ...state.listItems]};
    case CHANGE_LIST:
      return {
        ...state,
        listItems: action.payload,
      };
    case REMOVE_LIST:
      return {
        ...state,
        listItems: state.listItems.filter((_, i) => i !== action.payload),
      };
    case SET_USER_TYPE:
      return {...state, userType: action.payload};
    case SET_TIME_FORMAT:
      return {...state, is24Hour: action.payload};
    case SET_LOGIN_INFO:
      return {...state, loginInfo: action.payload};
    case SET_LOGIN_TOKENS:
      return {...state, loginInfo: {...state.loginInfo, ...action.payload}};
    case CHANGE_LOGIN_STATUS:
      return {...state, loggedIn: action.payload};
    case SAVE_BEARER_TOKEN:
      return {...state, bearerToken: action.payload};
    case ADD_TO_CART:
      const newCart = [...state.cartItems, action.payload];
      return {
        ...state,
        cartItems: newCart,
        cartItemsCount: newCart?.length ?? 0,
      };
    case UPDATE_CART_ITEMS_COUNT:
      return {...state, cartItemsCount: action.payload};
    case CHANGE_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
        // cartItemsCount: action.payload?.length,
      };
    case UPDATE_ZIP_CODE_DETAILS:
      return {...state, ...action?.payload};
    case SAVE_USER_INFO:
      return {...state, userInfo: action.payload};
    case SAVE_ZIP_CODES:
      return {...state, zipCodes: action.payload};
    case CHANGE_NOTIFICATIONS_SETTINGS:
      return {...state, notificationSettings: action.payload};
    case SAVE_PREVIOUS_SEARCHES:
      return {...state, previousSearches: action.payload};
    case CHANGE_PAYMENT_OPTION:
      return {...state, paymentOptions: action.payload};
    case ADD_PAYMENT_OPTION:
      return {
        ...state,
        paymentOptions: [...state.paymentOptions, action.payload],
      };
    case SET_DEFAULT_PAYMENT_OPTION:
      return {
        ...state,
        defaultPaymentOption: action.payload,
      };
    case CHANGE_SELECTED_DELIVERY_SEGMENT:
      return {...state, guestSelectedSegmentIndex: action.payload};
    case SET_DELIVERY_TYPE:
      return {...state, selectedDeliveryType: action.payload};
    case SET_SEGMENTS:
      return {...state, segments: action.payload};
    case CHANGE_API_ERROR_DIALOG:
      return {...state, isApiErrorDialogVisible: action.payload};
    case CHANGE_AUTH_ERROR_DIALOG:
      return {...state, isAuthErrorDialogVisible: action.payload};
    case TOGGLE_API_ERROR_DIALOG:
      return {
        ...state,
        isNetworkErrorDialogVisible: action.payload.visible,
        networkErrorData: action.payload?.error,
      };
    case TOGGLE_UNDER_MAINTENANCE:
      return {
        ...state,
        isUnderMaintenance: action.payload,
      };
    case SET_NOTIFICATION_ALLOWED:
      return {...state, isNotificationAllowed: action.payload};
    case SET_NOTIFICATION_BADGE:
      return {...state, showBadge: action.payload};
    case SET_ELIGIBLE_REFUND_ORDERS:
      return {
        ...state,
        eligibleRefundOrders: {
          orders: action.payload.orders ?? [],
          length: action.payload.length,
        },
      };
    case CHANGE_PROMO_VISIBILITY:
      return {
        ...state,
        isPromoVisible: action.payload,
      };
    case SET_DEEPLINK_DATA:
      return {
        ...state,
        deeplinkData: action.payload || {},
      };
    case SET_IS_BIOMETRICS_MODAL:
      return {
        ...state,
        isBiometricsModal: !!action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        ...initialState,
        isNotificationAllowed: state.isNotificationAllowed,
        isPromoVisible: state.isPromoVisible,
      };
    case ALL_DEPARTMENTS:
      return {
        ...state,
        allDepartments: action.payload,
      };

    case DISABLED_DATES:
      return {
        ...state,
        disabledDates: action.payload,
      };
    default:
      return state;
  }
};
export default generalReducer;

// const providerPersistConfig = {
//   key: 'general',
//   storage: AsyncStorage,
//   blacklist:['isGuest']
// };
// export default persistReducer(providerPersistConfig, generalReducer);
