import {
  ADD_ITEMS_TO_CART,
  ADD_PRODUCTS_TO_LIST,
  api as API,
  CHANGE_PASSWORD,
  COMPLETE_ORDER,
  CREATE_LIST,
  CREATE_REFUND_REQUEST,
  DEACTIVATE_ACCOUNT,
  DELETE_CART_ITEM,
  DELETE_LIST,
  DELETE_NOTIFICATION,
  DELETE_NOTIFICATIONS,
  DELETE_PAYMENT_METHOD,
  DUPLICATE_LIST,
  FORGOT_PASSWORD_API,
  GET_CAKE_FILLING,
  GET_CAKE_FLAVOURS,
  GET_CAKE_FROSTINGS,
  GET_CART_ITEMS,
  GET_DEPARTMENTS,
  GET_EIGEN_BALANCE,
  GET_VW_BALANCE,
  GET_ITEMS,
  GET_ITEMS_YOU_MIGHT_ALSO_LIKE,
  GET_LISTS,
  GET_NOTIFICATION_SETTINGS,
  GET_NOTIFICATIONS_LISTING,
  GET_ON_SALE_DEPARTMENTS,
  GET_ON_SALE_ITEMS,
  GET_ORDER_DETAILS,
  GET_ORDER_HISTORY,
  CANCEL_ORDER,
  GET_PAYMENT_METHODS,
  GET_PROMOS,
  GET_REFUND_ELIGIBLE_ORDERS,
  GET_REFUND_HISTORY,
  GET_REFUND_DETAILS,
  GET_SINGLE_LIST,
  GET_SNAP_BALANCE,
  GET_PAYMENTS_CONFIG,
  GET_TRENDING_SEARCH_RESULT,
  GET_ZIP_CODES_STORES,
  GUEST_SIGN_UP,
  IS_CODE_VALID_API,
  LOGIN_API,
  LOGOUT,
  FIS_PIN_TO_PAN,
  POST_GIFT_CARD,
  POST_STORE_CHARGE,
  POST_SNAP_CARD_TOKEN,
  POST_SNAP_PIN_TOKEN,
  QUALTRICS_TOUCH_POINT_ONE,
  QUALTRICS_TOUCH_POINT_Two,
  REMOVE_ITEMS_FROM_LIST,
  RENAME_LIST,
  RESET_PASSWORD_API,
  SEND_EMAIL,
  SEND_FCM,
  SET_NOTIFICATION_SETTINGS,
  SIGNUP_API,
  UPDATE_LIST_PRODUCTS,
  UPDATE_NOTIFICATION_STATUS,
  UPDATE_USER,
  VERIFY_EMAIL,
  GET_PRODUCT,
  TOGGLE_SNAP_ELIGIBILITY_FLAG,
  GET_APP_LATEST_VERSION,
  LIST_TO_STORE,
  SEND_LIST_TO_EXTERNAL_EMAIL,
  TRIGGER_ITEM_CLICKED_EVENT,
  GET_POPULAR_ITEMS,
  GET_DEPARTMENTS_FOR_SHOP_SCREEN,
  GET_DEPARTMENTS_PRODUCTS,
  GET_SUBDEPARTMENTS_PRODUCTS,
  GET_ALL_POPULAR_ITEMS,
  FILTER_GET_DEPARTMENTS_PRODUCTS,
} from './Apis';
import {
  changeNotificationSetting,
  updateZipCodeDetails,
} from '../redux/actions/general';
import {snakeToCamelCase} from '../utils/transformUtils';
import {getFcmToken} from '../utils/notificationsUtils';
import {logToConsole} from '../configs/ReactotronConfig';
import {
  ASYNC_STORAGE_KEYS,
  NOTIFICATIONS_SETTINGS_DATA,
} from '../constants/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCaller} from './interceptors';

export const setAPIHeaders = async response => {
  const {token = '', refreshToken} = response?.data || {};
  if (token) {
    API?.setHeader?.('Authorization', `Bearer ${token}` || '');
  }
  if (refreshToken) {
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
      refreshToken || '',
    );
  }
  return {token, refreshToken};
};

export const login = async params => {
  const {response} = await apiCaller(LOGIN_API, params);
  await setAPIHeaders(response);
  return {response};
};

export const signup = async params => {
  const {response} = await apiCaller(SIGNUP_API, params);
  await setAPIHeaders(response);
  return {response};
};

export const guestSignup = async params => {
  const {response} = await apiCaller(GUEST_SIGN_UP, params);
  await setAPIHeaders(response);
  return {response};
};

export const forgotPassword = async params =>
  await apiCaller?.(FORGOT_PASSWORD_API, params);

export const isCodeValid = async params =>
  await apiCaller(IS_CODE_VALID_API, params);

export const resetPassword = async params =>
  await apiCaller(RESET_PASSWORD_API, params);

export const updateUser = async params => await apiCaller(UPDATE_USER, params);

export const toggleSnapEligibilityFlag = async params =>
  await apiCaller(TOGGLE_SNAP_ELIGIBILITY_FLAG, params);

export const getZipCodes = async (params, dispatch) => {
  let response = await apiCaller(GET_ZIP_CODES_STORES, params);
  const {data: {Zipcodes = []} = {}} = response ?? {};
  if (Zipcodes?.[0]) {
    dispatch?.(updateZipCodeDetails(snakeToCamelCase(Zipcodes?.[0] ?? {})));
  }
  return response;
};

export const changePassword = async params =>
  await apiCaller(CHANGE_PASSWORD, params);

export const getDepartments = async params => {
  let {response} = await apiCaller(GET_DEPARTMENTS, params);
  const {ok, status = 0, data = {}} = response ?? {};
  if (ok) {
    return {data, status};
  }
  return response;
};

export const getDepartmentsProducts = async params => {
  let {response} = await apiCaller(GET_DEPARTMENTS_PRODUCTS);
  const {ok, status = 0, data = {}} = response ?? {};
  if (ok) {
    return {data, status};
  }
  return response;
};

export const getSubDepartmentsProducts = async (body, options) =>
  await apiCaller(GET_SUBDEPARTMENTS_PRODUCTS, body, false, options);

export const getDepartmentsForShopScreen = async params => {
  let {response} = await apiCaller(GET_DEPARTMENTS_FOR_SHOP_SCREEN, params);
  const {ok, status = 0, data = {}} = response ?? {};
  if (ok) {
    return {data, status};
  }
  return response;
};
export const getFilterDepartmentsProducts = async (body, options) =>
  await apiCaller(FILTER_GET_DEPARTMENTS_PRODUCTS, body, false, options);
export const getAllPopularItems = async (params, options) =>
  await apiCaller(GET_ALL_POPULAR_ITEMS, params, false, options);
export const getPopularItems = async (params, options) =>
  await apiCaller(GET_POPULAR_ITEMS, params, false, options);

export const deactivateAccount = async () =>
  await apiCaller(DEACTIVATE_ACCOUNT);

export const getDepartmentsOnSale = async params =>
  await apiCaller(GET_ON_SALE_DEPARTMENTS, params);

export const getItems = async (params, options) =>
  await apiCaller(GET_ITEMS, params, false, options);

export const triggerItemClickedEvent = async params =>
  await apiCaller(TRIGGER_ITEM_CLICKED_EVENT, params);

export const getOnSaleProducts = async (params, options) =>
  await apiCaller(GET_ON_SALE_ITEMS, params, false, options);

// -------------------Lists------------------------
export const createList = async params =>
  await apiCaller(CREATE_LIST, {...params});

export const renameList = async params =>
  await apiCaller(RENAME_LIST, {...params});

export const duplicateList = async params =>
  await apiCaller(DUPLICATE_LIST, {...params});

export const deleteList = async listId =>
  await apiCaller(DELETE_LIST, {id: listId});

export const getListsOfUser = async userId =>
  await apiCaller(GET_LISTS, {userId});

export const getSingleList = async listId =>
  await apiCaller(GET_SINGLE_LIST, {id: listId});

export const getProduct = async params => await apiCaller(GET_PRODUCT, params);

export const addProductsToList = async (products, listIds) =>
  await apiCaller(ADD_PRODUCTS_TO_LIST, {
    listIds,
    products,
  });

export const updateListItems = async (products, listId) =>
  await apiCaller(UPDATE_LIST_PRODUCTS, {
    id: listId,
    products: products,
  });

export const removeItemsFromList = async (listId, sku) =>
  await apiCaller(REMOVE_ITEMS_FROM_LIST, {
    listId,
    sku,
  });

//--------------------------------- CART -----------------------------------

export const addItemsToCart = async (params, options) =>
  await apiCaller(ADD_ITEMS_TO_CART, params, false, options);

export const getCartItems = async () => await apiCaller(GET_CART_ITEMS);

export const removeItemFromCartAPI = async sku =>
  await apiCaller(DELETE_CART_ITEM, sku);

export const updateCart = async products =>
  await apiCaller(ADD_ITEMS_TO_CART, products);

export const getItemsYouMayLike = async params =>
  await apiCaller(GET_ITEMS_YOU_MIGHT_ALSO_LIKE, params);

//-----------------------------ORDER ----------------------------------

export const completeOrder = async params =>
  await apiCaller(COMPLETE_ORDER, params);

export const getOrderHistory = async params =>
  await apiCaller(GET_ORDER_HISTORY, params);

export const cancelOrder = async params =>
  await apiCaller(CANCEL_ORDER, params);

//--------------------------------REFUND REQUESTS-------------------------------

export const getRefundEligibleOrders = async params =>
  await apiCaller(GET_REFUND_ELIGIBLE_ORDERS, params);

export const createRefundRequest = async params =>
  await apiCaller(CREATE_REFUND_REQUEST, params);

export const getRefundHistory = async params =>
  await apiCaller(GET_REFUND_HISTORY, params);

export const getRefundDetails = async params =>
  await apiCaller(GET_REFUND_DETAILS, params);

//--------------------------------Trending Search Result-------------------------------

export const getTrendingSearchResult = async () =>
  await apiCaller(GET_TRENDING_SEARCH_RESULT);

//-----------------------------------Custom Cakes ------------------------------------

export const getCakesFlavours = async params =>
  await apiCaller(GET_CAKE_FLAVOURS, params);

export const getCakeFrostings = async params =>
  await apiCaller(GET_CAKE_FROSTINGS, params);

export const getCakesFillings = async params =>
  await apiCaller(GET_CAKE_FILLING, params);
//--------------------------------Qualtrics TouchPoints-------------------------------

export const postContactUsFormForUser = async params =>
  await apiCaller(QUALTRICS_TOUCH_POINT_ONE, params);

export const postContactUsFormForGuest = async params =>
  await apiCaller(QUALTRICS_TOUCH_POINT_Two, params);

export const getPromos = async params => await apiCaller(GET_PROMOS, params);

//-------------------------------------FCM TOKEN------------------------------

export const sendFcmTokenToServer = async refreshedToken => {
  let token;
  if (!refreshedToken) {
    token = await getFcmToken();
  }
  if (token || refreshedToken) {
    return await apiCaller(SEND_FCM, {FCM: refreshedToken || token});
  }
};
//-------------------------------------GET_NOTIFICATION_SETTINGS------------------------------

export const getNotificationSettings = async (userId, dispatch) => {
  try {
    const apiResponse =
      (await apiCaller(GET_NOTIFICATION_SETTINGS, userId)) ?? {};
    const {response: {data: {response} = {}} = {}} = apiResponse || {};
    const {
      InAppNotification = false,
      OrderNotification = false,
      EmailNotification = false,
      TextNotification = false,
    } = response || {};
    dispatch(
      changeNotificationSetting([
        {...NOTIFICATIONS_SETTINGS_DATA[0], isEnabled: InAppNotification},
        {...NOTIFICATIONS_SETTINGS_DATA[1], isEnabled: EmailNotification},
        {...NOTIFICATIONS_SETTINGS_DATA[2], isEnabled: TextNotification},
        {...NOTIFICATIONS_SETTINGS_DATA[3], isEnabled: OrderNotification},
      ]),
    );
    return response;
  } catch (e) {
    logToConsole({ErrorGetNotificationSettings: e, message: e?.message});
    return {response: e};
  }
};

//-------------------------------------SET_NOTIFICATION_SETTINGS------------------------------

export const setNotificationSettings = async settings =>
  await apiCaller(SET_NOTIFICATION_SETTINGS, settings);

//-------------------------------------SET_NOTIFICATION_SETTINGS------------------------------

export const getNotificationsListing = async params =>
  await apiCaller(GET_NOTIFICATIONS_LISTING, params);

//-------------------------------------SET_NOTIFICATION_SETTINGS------------------------------

export const getOrderDetails = async orderId =>
  (await apiCaller(GET_ORDER_DETAILS, orderId))?.response?.data ?? {};

//----------------------------------- DELETE NOTIFICATION------------------------------

export const deleteNotificationApiCall = async params =>
  await apiCaller(DELETE_NOTIFICATION, params);

export const deleteNotifications = async params =>
  await apiCaller(DELETE_NOTIFICATIONS, params);

export const updateNotificationStatus = async params =>
  await apiCaller(UPDATE_NOTIFICATION_STATUS, params);

//----------------------------------- Email APIS------------------------------

export const sendEmail = async params => await apiCaller(SEND_EMAIL, params);

export const verifyEmail = async body => await apiCaller(VERIFY_EMAIL, body);

//-----------------------------------PAYMENT---------------------------------

export const getPaymentMethods = async () =>
  await apiCaller(GET_PAYMENT_METHODS);

export const getSnapBalance = async params =>
  await apiCaller(GET_SNAP_BALANCE, params);

export const getEigenBalance = async params =>
  await apiCaller(GET_EIGEN_BALANCE, params);

export const getVwBalance = async params =>
  await apiCaller(GET_VW_BALANCE, params);

export const getPaymentsConfig = async params =>
  await apiCaller(GET_PAYMENTS_CONFIG, params);

export const postSnapPinToken = async params =>
  await apiCaller(POST_SNAP_PIN_TOKEN, params);

export const postSnapCardToken = async params =>
  await apiCaller(POST_SNAP_CARD_TOKEN, params);

export const postDebitCardToken = async params =>
  await apiCaller(FIS_PIN_TO_PAN, params);

export const postGiftCard = async params =>
  await apiCaller(POST_GIFT_CARD, params);

export const postStoreCharge = async params =>
  await apiCaller(POST_STORE_CHARGE, params);

export const deletePaymentMethodCall = async params =>
  await apiCaller(DELETE_PAYMENT_METHOD, params);

export const getAppLatestVersion = async params =>
  await apiCaller(GET_APP_LATEST_VERSION, params, true);

//-----------------------------------LOGOUT---------------------------------

export const logoutApiCall = async () => await apiCaller(LOGOUT, {}, true);

export const shareCartToStore = async params =>
  await apiCaller(LIST_TO_STORE, params);

export const sendListToExternalEmail = async params =>
  await apiCaller(SEND_LIST_TO_EXTERNAL_EMAIL, params);
