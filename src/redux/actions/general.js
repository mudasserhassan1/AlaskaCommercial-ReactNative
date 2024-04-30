import {
  ADD_TO_LIST,
  CHANGE_CART_ITEMS,
  CHANGE_LIST,
  CHANGE_NOTIFICATIONS_SETTINGS,
  CHANGE_PAYMENT_OPTION,
  CHANGE_PROMO_VISIBILITY,
  CHANGE_SELECTED_DELIVERY_SEGMENT,
  LOGOUT,
  REMOVE_LIST,
  SAVE_PREVIOUS_SEARCHES,
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
  TOGGLE_API_ERROR_DIALOG,
  TOGGLE_UNDER_MAINTENANCE,
  UPDATE_CART_ITEMS_COUNT,
  UPDATE_ZIP_CODE_DETAILS,
  ALL_DEPARTMENTS,
  DISABLED_DATES,
} from '../types';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import {getOrderType} from '../../utils/addressUtils';
import {generateUserToken} from '../../utils/generateToken';
import { logToConsole } from "../../configs/ReactotronConfig";

export const addItemsToList = data => dispatch => {
  dispatch({
    type: ADD_TO_LIST,
    payload: data,
  });
};
export const removeList = data => dispatch => {
  dispatch({
    type: REMOVE_LIST,
    payload: data,
  });
};
export const changeList = data => dispatch => {
  dispatch({
    type: CHANGE_LIST,
    payload: data,
  });
};

export const changeCartItems = data => dispatch => {
  dispatch({
    type: CHANGE_CART_ITEMS,
    payload: data,
  });
};
export const updateCartItemsCount = data => dispatch => {
  dispatch({
    type: UPDATE_CART_ITEMS_COUNT,
    payload: data,
  });
};
export const updateZipCodeDetails = data => (dispatch, getState) => {
  const orderType = data?.zipCodeDetail?.orderType;
  if (orderType) {
    const previousSegments = getState?.()?.general?.segments || [];
    getOrderType(dispatch, data?.zipCodeDetail.orderType, previousSegments);
  }
  dispatch({
    type: UPDATE_ZIP_CODE_DETAILS,
    payload: data,
  });
};
export const setEligibleRefundOrders = data => dispatch => {
  dispatch({
    type: SET_ELIGIBLE_REFUND_ORDERS,
    payload: data,
  });
};
export const saveZipCodes = data => dispatch => {
  dispatch({
    type: SAVE_ZIP_CODES,
    payload: data,
  });
};

export const saveLoginInfo = data => dispatch => {
  let token = generateUserToken(data?.userInfo);
  data.userInfo = {...data.userInfo, token: token};
  MixPanelInstance.setMixPanelProfile({user: data?.userInfo || {}});
  dispatch({
    type: SET_LOGIN_INFO,
    payload: data,
  });
};
export const saveLoginTokens = data => dispatch => {
  dispatch({
    type: SET_LOGIN_TOKENS,
    payload: data,
  });
};

export const changeNotificationSetting = data => dispatch => {
  dispatch({
    type: CHANGE_NOTIFICATIONS_SETTINGS,
    payload: data,
  });
};

export const savePreviousSearches = data => dispatch => {
  dispatch({
    type: SAVE_PREVIOUS_SEARCHES,
    payload: data,
  });
};

export const changePaymentOptions = data => dispatch => {
  dispatch({
    type: CHANGE_PAYMENT_OPTION,
    payload: data,
  });
};

export const setDefaultOption = data => dispatch => {
  dispatch({
    type: SET_DEFAULT_PAYMENT_OPTION,
    payload: data,
  });
};

export const changeSelectedSegment = data => dispatch => {
  dispatch({
    type: CHANGE_SELECTED_DELIVERY_SEGMENT,
    payload: data,
  });
};
export const setDeliveryType = data => dispatch => {
  dispatch({
    type: SET_DELIVERY_TYPE,
    payload: data,
  });
};
export const setDeliverySegments = data => dispatch => {
  dispatch({
    type: SET_SEGMENTS,
    payload: data,
  });
};

export const setTimeFormatAction = data => dispatch => {
  dispatch({
    type: SET_TIME_FORMAT,
    payload: data,
  });
};

export const setNotificationAllowed = enabled => dispatch => {
  dispatch({
    type: SET_NOTIFICATION_ALLOWED,
    payload: enabled,
  });
};

export const setNotificationBadge = enabled => dispatch => {
  dispatch({
    type: SET_NOTIFICATION_BADGE,
    payload: enabled,
  });
};

export const toggleNetworkErrorDialog = data => dispatch => {
  dispatch({
    type: TOGGLE_API_ERROR_DIALOG,
    payload: data,
  });
};

export const toggleUnderMaintenance = data => dispatch => {
  dispatch({
    type: TOGGLE_UNDER_MAINTENANCE,
    payload: data,
  });
};

export const changePromoVisibility = data => dispatch => {
  dispatch({
    type: CHANGE_PROMO_VISIBILITY,
    payload: data,
  });
};

export const setDeeplinkData = data => dispatch => {
  dispatch({
    type: SET_DEEPLINK_DATA,
    payload: data,
  });
};

export const setIsBiometrics = data => dispatch => {
  dispatch({
    type: SET_IS_BIOMETRICS_MODAL,
    payload: data,
  });
};

export const logoutUser = data => dispatch => {
  dispatch({
    type: LOGOUT,
    payload: data,
  });
};

export const setAllDepartments = data => dispatch => {
  dispatch({
    type: ALL_DEPARTMENTS,
    payload: data,
  });
};

export const setDisabledDates = data => dispatch => {
  logToConsole({data})
  dispatch({
    type: DISABLED_DATES,
    payload: data,
  });
};
