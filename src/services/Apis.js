import {create} from 'apisauce';
import {pageLimits} from '../constants/Common';
import Config from 'react-native-config';
import {logToConsole} from '../configs/ReactotronConfig';

export const api = create({baseURL: Config.BASE_URL, timeout: 60000 * 2});

//---------------------------------AUTH APIS------------------------------------

const REFRESH_TOKEN = params =>
  api.post('user/refreshToken', params, {headers: {}});

const LOGIN_API = params => api.post('auth/login', params, {headers: {}});
const SIGNUP_API = params => api.post('auth/signup', params, {headers: {}});
const GUEST_SIGN_UP = params =>
  api.post('auth/guestSignup', params, {headers: {}});
const FORGOT_PASSWORD_API = params =>
  api.post('auth/verification', params, {headers: {}});
const IS_CODE_VALID_API = params =>
  api.post('auth/isCodeValid', params, {headers: {}});
const RESET_PASSWORD_API = params =>
  api.post('auth/resetPassword', params, {headers: {}});
const CHANGE_PASSWORD = params => api.put('user/passwordReset', params);
const DEACTIVATE_ACCOUNT = () => api.post('user/deleteAccount', {});

//-------------------------------------USER-------------------------------------

const UPDATE_USER = params => api.put('user', params);

const TOGGLE_SNAP_ELIGIBILITY_FLAG = body =>
  api.post(`user/flipUserSnapStatus?id=${body?.userId}`, body);

//---------------------------------ZIP CODES------------------------------------

const GET_ZIP_CODES_STORES = params => api.post('zipcode/getZipCodes', params);

//---------------------------------DEPARTMENTS----------------------------------

const GET_DEPARTMENTS = ({page, limit}) =>
  api.post(`department/featured?page=${page}&limit=${limit}`);
// /department/featured?page=1&limit=7&PARTY_TRAY_FLAG=true&store=${storeNum}

const GET_DEPARTMENTS_FOR_SHOP_SCREEN = ({page, limit}) =>
  api.post(`department?page=${page}&limit=${limit}`);

const GET_DEPARTMENTS_PRODUCTS = ({page, limit}) =>
  api.post('storeItem/algolia/getItemsByDepartments');

const GET_POPULAR_ITEMS = ({store = ''}, options) =>
  api.get(`storeItem/algolia/getPopularItems?STORE=${store}`, {}, options);

//------------------------------------PRODUCTS----------------------------------

const GET_PROMOS = ({storeNumber}) =>
  api.get(`promos/getPromoArray?storeNumber=${storeNumber}`);

const GET_PRODUCT = params => api.get('storeItem/getProduct', params);

const GET_ITEMS = (
  {
    store = '',
    search = '',
    deptId = '',
    order = '',
    page = '',
    limit = '',
    sort = '',
    classId = '',
    trendingSearch = true,
    SKU = '',
    isPartyEligible = '',
  },
  options,
) => {
  let filteredClassId;
  if (Array.isArray(classId)) {
    filteredClassId = classId.filter(id => id?.trim() !== '');
  } else if (typeof classId === 'string') {
    filteredClassId = classId.split(',').filter(id => id.trim() !== '');
  } else {
    filteredClassId = [];
  }

  return api.post(
    `storeItem/algolia?STORE=${store}&DEPT_ID=${deptId}&CLASS_ID=${filteredClassId}&PAGE=${page}&LIMIT=${limit}&SORT=${sort}&ORDER=${order}&TRENDING_SEARCH=${
      search ? trendingSearch : false
    }&SKU=${SKU}&PARTY_TRAY_FLAG=${isPartyEligible ?? false}`,
    {
      SEARCH_STRING: search,
    },
    options,
  );
};

const TRIGGER_ITEM_CLICKED_EVENT = params =>
  api.post('storeItem/algolia/clickedEvent', params);

const GET_ALL_POPULAR_ITEMS = ({store = '', page = ''}, options) => {
  return api.get(`storeItem/algolia?PAGE=${page}&STORE=${store}`, {}, options);
};

//---------------------------------------ON SALE--------------------------------

const GET_ON_SALE_ITEMS = (
  {
    store = '',
    deptId = '',
    classId = '',
    searchString = '',
    isPartyEligible,
    order = '',
    page = '',
    sort = '',
    userId = '',
  },
  options,
) => {
  // classId && classId.length > 0
  //   ? classId.filter(id => id?.trim() !== '')
  //   : [];
  let filteredClassId;
  if (Array.isArray(classId)) {
    filteredClassId = classId.filter(id => id?.trim() !== '');
  } else if (typeof classId === 'string') {
    filteredClassId = classId.split(',').filter(id => id.trim() !== '');
  } else {
    filteredClassId = [];
  }

  return api.get(
    `storeItem/algolia/getSaleItems?STORE=${store}&DEPT_ID=${deptId}&CLASS_ID=${filteredClassId}&SEARCH_STRING=${searchString}&ORDER=${order}&PARTY_TRAY_FLAG=${
      isPartyEligible ?? false
    }&PAGE=${page}&SORT=${sort}&userId=${userId}`,
    {},
    options,
  );
};

const FILTER_GET_DEPARTMENTS_PRODUCTS = body =>
  api.post('storeItem/algolia/getItemsByDepartments', body);

const GET_ON_SALE_DEPARTMENTS = params =>
  api.get(`department/filtered-departments?storeId=${params?.storeId}`);

const GET_SUBDEPARTMENTS_PRODUCTS = body =>
  api.post('storeItem/algolia/getItemsByDepartments', body);

//--------------------------------------LIST------------------------------------

const CREATE_LIST = ({...rest}) => api.post('list', rest);

const GET_LISTS = () => api.get('list');
const DELETE_LIST = ({id}) => api.delete(`list/${id}`, {});
const GET_SINGLE_LIST = ({id}) => api.get(`list/getSingle?id=${id}`, {});
const RENAME_LIST = ({id, ...rest}) =>
  api.post(`list/rename?listId=${id}`, rest);

const DUPLICATE_LIST = ({id}) => api.post(`list/duplicateList/${id}`, {});
const ADD_PRODUCTS_TO_LIST = ({...rest}) =>
  api.post('list/addListsProducts', rest);

const UPDATE_LIST_PRODUCTS = ({id, ...rest}) =>
  api.put(`list/updateListProducts?id=${id}`, rest);

const REMOVE_ITEMS_FROM_LIST = ({listId, sku}) =>
  api.put(`list/deleteItems?listId=${listId}&sku=${sku}`, {});
//------------------------------------CART--------------------------------------

const ADD_ITEMS_TO_CART = (params, options) =>
  api.put('cart/addToCart', params, options);

const GET_CART_ITEMS = () => api.get('cart', {});

const DELETE_CART_ITEM = ({id, ...rest}) =>
  api.put(`cart/removeFromCart?id=${id}`, rest);

//-----------------------------You MIGHT ALSO LIKE------------------------------

const GET_ITEMS_YOU_MIGHT_ALSO_LIKE = ({
  store = '',
  deptId = '',
  classId = '',
  id = '',
  sku,
}) =>
  api.get(
    `storeItem/algolia/getItemsMayYouLike?STORE=${store}&SKU=${sku}&DEPT_ID=${parseInt(
      String(deptId),
      10,
    )}&CLASS_ID=${classId}&id=${id}`,
  );

//--------------------------------ORDER--------------------------------

const COMPLETE_ORDER = params =>
  api.post('order', params, {timeout: 5 * 60000});

const GET_ORDER_HISTORY = ({limit, page}) =>
  api.get(`order/orderHistory?page=${page}&limit=${limit}`, {});

const CANCEL_ORDER = params => api.get('cart/emptyCart', params);

//------------------------------- REFUND REQUESTS -----------------------------

const GET_REFUND_ELIGIBLE_ORDERS = params => api.get('refund/orders', params);

const CREATE_REFUND_REQUEST = params =>
  api.post('refund', params, {timeout: 10 * 60000});

const GET_REFUND_HISTORY = params => api.get('refund/submitted', params);

const GET_REFUND_DETAILS = params => api.get('refund/getRefundDetails', params);

//------------------------------- Trending Search Result -----------------------------
const GET_TRENDING_SEARCH_RESULT = () => api.get('TrendingSearchRouter/');

//----------------------------------- Custom cakes -----------------------------------
const GET_CAKE_FLAVOURS = body => api.post('cakes/flavours', body);

const GET_CAKE_FROSTINGS = body => api.post('cakes/frostings', body);

const GET_CAKE_FILLING = body => api.post('cakes/fillings', body);

const GET_CAKE_DECORATIONS_TYPE = params => api.post('cakes/types', params);

const GET_CAKE_DECORATION_DESCRIPTIONS = body =>
  api.post('cakes/description', body);

//---------------------------Qualtrics --------------------------------

const QUALTRICS_TOUCH_POINT_ONE = body =>
  api.post('qualtrics/contactUsForm', body);

const QUALTRICS_TOUCH_POINT_Two = body =>
  api.post('qualtrics/contactUsFormGuest/', body);

//---------------------------------FCM TOKEN----------------------------

const SEND_FCM = fcm => api.post('firebase/addFcm', fcm);

const GET_NOTIFICATION_SETTINGS = id => api.get(`notifications?userId=${id}`);

const SET_NOTIFICATION_SETTINGS = body => api.post('notifications', body);

const GET_NOTIFICATIONS_LISTING = ({
  page = 1,
  limit = pageLimits.MEDIUM,
} = {}) =>
  api.get(`inAppNotifications/getNotification?page=${page}&limit=${limit}`);

const DELETE_NOTIFICATION = ({notificationId}) =>
  api.delete(
    `inAppNotifications/deleteNotification?notificationId=${notificationId}`,
  );

const UPDATE_NOTIFICATION_STATUS = body =>
  api.post(
    `inAppNotifications/updateNotificationStatus?lastDate=${body?.lastTime}`,
    body,
  );

const DELETE_NOTIFICATIONS = body =>
  api.delete(
    `inAppNotifications/deleteAllNotifications?lastDate=${body?.lastDate}`,
  );

const GET_ORDER_DETAILS = orderId =>
  api.get(`order/orderDetail?orderId=${orderId}`);

//--------------------------------PAYMENT--------------------------------

const GET_PAYMENT_METHODS = () => api.get('payment/paymentmethods');

const GET_SNAP_BALANCE = params =>
  api.get('payment/snapbalanceinquiry', params);

const GET_EIGEN_BALANCE = body => api.post('payment/eigenbalanceinquiry', body);

const GET_VW_BALANCE = () => api.get('payment/vwBalanceInquiry');

const GET_PAYMENTS_CONFIG = params => api.get('payment/fisConfigData', params);

const POST_SNAP_PIN_TOKEN = body => api.post('payment/tokenizesnappin', body);

const POST_SNAP_CARD_TOKEN = body => api.post('payment/tokenizesnapcard', body);

const FIS_PIN_TO_PAN = body => api.post('payment/FisPinToPan', body);

const POST_GIFT_CARD = body => api.post('payment/registerGiftCard', body);

const POST_STORE_CHARGE = body => api.post('payment/registerStoreCharge', body);

const DELETE_PAYMENT_METHOD = params =>
  api.delete(`payment/removePaymentMethod/${params?._id}`, params);

const GET_APP_LATEST_VERSION = params =>
  api.get('version/getAppLatestVersion', params, {headers: {}});

//--------------------------------EMAIL--------------------------------

const SEND_EMAIL = () => api.post('user/resendVerificationEmail');

const VERIFY_EMAIL = body => api.post('user/verifyEmail', body);

//--------------------------------LOGOUT--------------------------------

const LOGOUT = () => api.post('auth/logout');

const LIST_TO_STORE = body => api.post('list/sendListToStore', body);

const SEND_LIST_TO_EXTERNAL_EMAIL = body =>
  api.post('list/sendListToExternalEmail', body);

export {
  LOGIN_API,
  SIGNUP_API,
  GUEST_SIGN_UP,
  FORGOT_PASSWORD_API,
  IS_CODE_VALID_API,
  RESET_PASSWORD_API,
  UPDATE_USER,
  TOGGLE_SNAP_ELIGIBILITY_FLAG,
  GET_ZIP_CODES_STORES,
  CHANGE_PASSWORD,
  GET_DEPARTMENTS,
  GET_ON_SALE_ITEMS,
  DEACTIVATE_ACCOUNT,
  GET_ITEMS,
  GET_ON_SALE_DEPARTMENTS,
  ADD_ITEMS_TO_CART,
  GET_CART_ITEMS,
  DELETE_CART_ITEM,
  CREATE_LIST,
  DELETE_LIST,
  GET_LISTS,
  GET_SINGLE_LIST,
  DUPLICATE_LIST,
  RENAME_LIST,
  UPDATE_LIST_PRODUCTS,
  ADD_PRODUCTS_TO_LIST,
  GET_ITEMS_YOU_MIGHT_ALSO_LIKE,
  REMOVE_ITEMS_FROM_LIST,
  COMPLETE_ORDER,
  GET_ORDER_HISTORY,
  GET_REFUND_ELIGIBLE_ORDERS,
  CREATE_REFUND_REQUEST,
  GET_REFUND_HISTORY,
  GET_REFUND_DETAILS,
  GET_TRENDING_SEARCH_RESULT,
  GET_CAKE_FILLING,
  GET_CAKE_FLAVOURS,
  GET_CAKE_FROSTINGS,
  GET_CAKE_DECORATIONS_TYPE,
  GET_CAKE_DECORATION_DESCRIPTIONS,
  QUALTRICS_TOUCH_POINT_ONE,
  QUALTRICS_TOUCH_POINT_Two,
  GET_PROMOS,
  GET_PRODUCT,
  SEND_FCM,
  LOGOUT,
  GET_NOTIFICATION_SETTINGS,
  SET_NOTIFICATION_SETTINGS,
  GET_NOTIFICATIONS_LISTING,
  GET_ORDER_DETAILS,
  DELETE_NOTIFICATION,
  UPDATE_NOTIFICATION_STATUS,
  DELETE_NOTIFICATIONS,
  GET_PAYMENT_METHODS,
  GET_SNAP_BALANCE,
  GET_EIGEN_BALANCE,
  GET_VW_BALANCE,
  GET_PAYMENTS_CONFIG,
  SEND_EMAIL,
  VERIFY_EMAIL,
  POST_SNAP_PIN_TOKEN,
  POST_SNAP_CARD_TOKEN,
  FIS_PIN_TO_PAN,
  POST_GIFT_CARD,
  DELETE_PAYMENT_METHOD,
  POST_STORE_CHARGE,
  CANCEL_ORDER,
  GET_APP_LATEST_VERSION,
  LIST_TO_STORE,
  SEND_LIST_TO_EXTERNAL_EMAIL,
  REFRESH_TOKEN,
  TRIGGER_ITEM_CLICKED_EVENT,
  GET_POPULAR_ITEMS,
  GET_DEPARTMENTS_FOR_SHOP_SCREEN,
  GET_DEPARTMENTS_PRODUCTS,
  GET_SUBDEPARTMENTS_PRODUCTS,
  GET_ALL_POPULAR_ITEMS,
  FILTER_GET_DEPARTMENTS_PRODUCTS,
};
