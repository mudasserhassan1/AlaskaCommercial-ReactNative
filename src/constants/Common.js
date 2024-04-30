import {APP_CONSTANTS} from './Strings';
import {COLORS, FONTS, IMAGES} from '../theme';
import {Dimensions} from 'react-native';
import Config from 'react-native-config';

export const NOTIFICATION_KEYS = {
  IN_APP_NOTIFICATION: 'InAppNotification',
  EMAIL_NOTIFICATION: 'EmailNotification',
  TEXT_NOTIFICATION: 'TextNotification',
  ORDER_NOTIFICATION: 'OrderNotification',
};

export const NOTIFICATIONS_SETTINGS_DATA = [
  {
    id: 'inAppNotification',
    key: NOTIFICATION_KEYS.IN_APP_NOTIFICATION,
    name: 'Push Notification',
    isEnabled: false,
    extraInformation: '',
  },
  {
    id: 'emailNotification',
    key: NOTIFICATION_KEYS.EMAIL_NOTIFICATION,
    name: 'Email Notification',
    isEnabled: false,
    extraInformation: '',
  },
  {
    id: 'textNotification',
    key: NOTIFICATION_KEYS.TEXT_NOTIFICATION,
    name: 'Text Notification',
    isEnabled: false,
    extraInformation: '',
  },
  {
    id: 'orderNotification',
    key: NOTIFICATION_KEYS.ORDER_NOTIFICATION,
    name: 'Order Verification (Phone)',
    isEnabled: false,
    extraInformation:
      'Enable "Order Verification (Phone)" if you would like your AC store to call you and review your online orders',
  },
];

export const topicsData = [
  {
    id: '1',
    topic: 'I have an issue with my order',
  },
  {
    id: '2',
    topic: 'I have a shipping/delivery issue',
  },
  {
    id: '3',
    topic: 'I have a product request',
  },
  {
    id: '4',
    topic: 'I have a customer service issue',
  },
  {
    id: '5',
    topic: 'I have a technical issue with the app/website',
  },
  {
    id: '6',
    topic: 'I have a general question or comment',
  },
];

export const aboutData = [
  {
    id: '1',
    name: APP_CONSTANTS.ABOUT_US,
  },
  {
    id: '2',
    name: APP_CONSTANTS.FAQS,
  },
  {
    id: '3',
    name: APP_CONSTANTS.TERMS,
  },
  {
    id: '4',
    name: APP_CONSTANTS.PRIVACY_POLICY,
  },
  {
    id: '5',
    name: APP_CONSTANTS.SHIPPING_AND_FREIGHT,
  },
];

export const actualPriceInclusionsForRandomWeightItems = [
  'Order Fulfilled',
  'Order Delivered to Airline',
  'Order Out for Delivery',
  'Order Ready for Pickup',
  'Order Completed',
];
export const estimatedTotalAmountInclusions = ['Order Submitted', 'Order Picking in Progress', 'Order Cancelled'];

export const pageLimits = {
  SMALL: 8,
  MEDIUM: 15,
  BULK: 25,
};

export const SETTINGS_SCREEN_SECTIONS = [
  {
    id: '1',
    name: APP_CONSTANTS.PROFILE,
    guestName: APP_CONSTANTS.SIGN_IN_CREATE_ACCOUNT,
    forGuest: true,
  },
  {
    id: '2',
    name: APP_CONSTANTS.LOCATION_N_BANDWIDTH,
    guestName: APP_CONSTANTS.LOCATION_N_BANDWIDTH,
    forGuest: true,
  },
  {
    id: '3',
    name: APP_CONSTANTS.COMMUNICATION_SETTINGS,
    forGuest: false,
  },
  {
    id: '4',
    name: APP_CONSTANTS.VIRTUAL_WALLET,
    forGuest: false,
  },
  {
    id: '5',
    name: APP_CONSTANTS.REFUND,
    forGuest: false,
  },
  {
    id: '6',
    name: APP_CONSTANTS.CONTACT_US,
    guestName: APP_CONSTANTS.CONTACT_US,
    forGuest: true,
  },
  {
    id: '7',
    name: APP_CONSTANTS.ABOUT,
    guestName: APP_CONSTANTS.ABOUT,
    forGuest: true,
  },
  {
    id: '8',
    name: APP_CONSTANTS.LOGOUT,
    forGuest: false,
  },
];

export const BILLING_KEYS = {
  FOOD_STAMP_SUBTOTAL: 'FOOD_STAMP_SUBTOTAL',
  SUBTOTAL: 'SUB_TOTAL',
  SAVINGS: 'SAVINGS',
  HANDLING_FEE: 'HANDLING_FEE',
  FREIGHT_CHARGE: 'FREIGHT_CHARGE',
  TAX: 'TAX',
  TAX_FORGIVEN: 'TAX_FORGIVEN',
  TOTAL_AMOUNT: 'TOTAL_AMOUNT',
  SNAP_TAX: 'SNAP_TAX',
};

export const BILLING_CHARGES = [
  {
    name: APP_CONSTANTS.SUBTOTAL,
    refundName: APP_CONSTANTS.REFUND_SUBTOTAL,
    key: BILLING_KEYS.SUBTOTAL,
    text: APP_CONSTANTS.ESTIMATED_SUBTOTAL,
  },
  {
    name: APP_CONSTANTS.SAVINGS,
    key: BILLING_KEYS.SAVINGS,
    isNegative: true,
    color: COLORS.MAIN_LIGHT,
    valueColor: COLORS.MAIN,
    text: APP_CONSTANTS.ESTIMATED_SAVINGS_TEXT,
    details: APP_CONSTANTS.ESTIMATED_SAVINGS_DETAILS,
    header: APP_CONSTANTS.ESTIMATED_SAVINGS_HEADING,
  },
  {
    name: APP_CONSTANTS.HANDLING_FEE,
    key: BILLING_KEYS.HANDLING_FEE,
  },
  {
    name: APP_CONSTANTS.FREIGHT_CHARGE,
    key: BILLING_KEYS.FREIGHT_CHARGE,
    text: APP_CONSTANTS.ESTIMATED_FREIGHT_TEXT,
    details: APP_CONSTANTS.ESTIMATED_FREIGHT_DETAILS,
    header: APP_CONSTANTS.ESTIMATED_FREIGHT_HEADING,
  },
  {
    name: APP_CONSTANTS.SNAP_ELIGIBLE_SUBTOTAL,
    key: BILLING_KEYS.FOOD_STAMP_SUBTOTAL,
  },
  {
    name: APP_CONSTANTS.TAX,
    key: BILLING_KEYS.TAX,
    text: APP_CONSTANTS.ESTIMATED_TAX_TEXT,
    details: APP_CONSTANTS.ESTIMATED_TAX_DETAILS,
    header: APP_CONSTANTS.ESTIMATED_TAX_HEADING,
  },
  {
    name: APP_CONSTANTS.TAX_FORGIVEN,
    key: BILLING_KEYS.TAX_FORGIVEN,
    isNegative: true,
    color: COLORS.MAIN_LIGHT,
    valueColor: COLORS.MAIN,
    text: APP_CONSTANTS.ESTIMATED_TAX_FORGIVEN,
  },
  {
    name: APP_CONSTANTS.TOTAL_AMOUNT,
    refundName: APP_CONSTANTS.REFUND_TOTAL,
    key: BILLING_KEYS.TOTAL_AMOUNT,
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    isDivider: true,
    text: APP_CONSTANTS.ESTIMATED_TOTAL_TEXT,
    details: APP_CONSTANTS.ESTIMATED_TOTAL_DETAILS,
    header: APP_CONSTANTS.ESTIMATED_TOTAL_HEADING,
    icon: IMAGES.ICON_INFORMATION,
  },
];

export const ERROR_TYPES = {
  ACCOUNT_DEACTIVATED: 'AccountDeactivated',
  MULTI_DEVICE_LOGIN: 'MultiDeviceLogin',
  PASSWORD_RESET: 'PasswordReset',
  PASSWORD_EXPIRED: 'PasswordExpired',
  TOKEN_EXPIRED: 'TokenExpired',
  TOKEN_REQUIRED: 'TokenRequired',
  INVALID_TOKEN: 'InvalidToken',
};

export const pickupTimes = [
  {
    key: 0,
    listName: 'Morning',
    time: '9:00 AM - 1:00 PM',
    showArrow: true,
  },
  {
    key: 1,
    listName: 'Afternoon',
    time: '1:00 PM - 5:00 PM',
    showArrow: true,
  },
];

export const pickupTimes24H = [
  {
    key: 0,
    listName: 'Morning',
    time: '09:00 - 13:00',
    showArrow: true,
  },
  {
    key: 1,
    listName: 'Afternoon',
    time: '13:00  - 17:00',
    showArrow: true,
  },
];

export const passwordRegex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;

export const phoneNumberRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

export const userNameRegex = /^[a-zA-Z ]*$/;

export const curbsideOrderTypes = [APP_CONSTANTS.CURBSIDE_PICKUP, APP_CONSTANTS.HOME_DELIVERY];

export const bushDeliveryOrderTypes = [APP_CONSTANTS.BUSH_DELIVERY];

export const NOTIFICATION_TYPE_KEY = {
  ORDER_TRACKING: 'Order Tracking',
  ON_SALE: 'On Sale',
  QUALTRICS: 'Qualtrics',
  VW_REWARD: 'VW_REWARD',
};

export const DEFAULT_USER_KEYS = {
  MUDASSER: 'MUDASSER',
  USMAN: 'USMAN',
  AHMAD: 'AHMAD',
  AHMAD_2: 'AHMAD_2',
  ABBAS: 'ABBAS',
  HAREEM: 'HAREEM',
  TEST: 'TEST',
  MUSA: 'MUSA',
  DEVELOPER: 'DEVELOPER',
  HASSAN: 'HASSAN',
  VW: 'VW',
  ERQEM: 'ERQEM',
  REHAN: 'REHAN',
  RAHEEL: 'RAHEEL',
  ALIZA:'ALIZA'
};

export const DEFAULT_USERS = {
  [DEFAULT_USER_KEYS.MUDASSER]: {
    userEmail: 'mudasser021@gmail.com',
    userPassword: 'Asdf1234@',
  },
  [DEFAULT_USER_KEYS.VW]: {
    userEmail: 'virtual.wallet@citrusbits.com',
    userPassword: 'Asdf@1234',
  },
  [DEFAULT_USER_KEYS.USMAN]: {
    userEmail: 'usmanarif83@gmail.com',
    userPassword: 'Usman456$',
  },
  [DEFAULT_USER_KEYS.AHMAD]: {
    userEmail: 'ahmad.qureshi@citrusbits.com',
    userPassword: 'Asdf@1234',
  },
  [DEFAULT_USER_KEYS.AHMAD_2]: {
    userEmail: 'ahmadquraishi399@gmail.com',
    userPassword: 'Asdf@1234',
  },
  [DEFAULT_USER_KEYS.ABBAS]: {
    userEmail: 'abbas.ali@citrusbits.com',
    userPassword: 'Asdf1234@',
  },
  [DEFAULT_USER_KEYS.HAREEM]: {
    userEmail: 'hareem.qazi@citrusbits.com',
    userPassword: 'Asdf1234@',
  },
  [DEFAULT_USER_KEYS.TEST]: {
    userEmail: 't@g.com',
    userPassword: 'Asdf@1234',
  },
  [DEFAULT_USER_KEYS.MUSA]: {
    userEmail: 'musa.qureshi@citrusbits.com',
    userPassword: 'Admin@123',
  },
  [DEFAULT_USER_KEYS.DEVELOPER]: {
    userEmail: 'developer@citrusbits.com',
    userPassword: 'Asdf1234@',
  },
  [DEFAULT_USER_KEYS.HASSAN]: {
    userEmail: 'hassan.hashmi@citrusbits.com',
    userPassword: 'Hashmi@12',
  },
  [DEFAULT_USER_KEYS.ERQEM]: {
    userEmail: 'erqem.husaini@citrusbits.com',
    userPassword: 'Asdf1234@',
  },
  [DEFAULT_USER_KEYS.REHAN]: {
    userEmail: 'rehan.waheed@citrusbits.com',
    userPassword: 'Rehan@cb1',
  },
  [DEFAULT_USER_KEYS.RAHEEL]: {
    userEmail: 'bb@yopmail.com',
    userPassword: 'Asdf@1234',
  },
  [DEFAULT_USER_KEYS.ALIZA]: {
    userEmail: 'aliza.qamar@citrusbits.com',
    userPassword: 'Aqmr@123',
  },
};

export const NOTIFICATION_STATUS = {
  NEW: 'New',
  READ: 'Read',
};

export const reasons = [
  {
    id: 121212,
    name: 'Quality Issue',
    reason: 'Description',
  },
  {
    id: 121123,
    name: 'Missing Items',
    reason: 'Description',
  },
  {
    id: 121124,
    name: 'Other',
    reason: 'Please contact Customer Service',
  },
];

export const PAYMENT_METHOD_STATUS = {
  EXPIRED: 'EXPIRED',
  PENDING_PIN_LVT: 'PENDING_PIN_LVT',
  PENDING_PAN_HVT: 'PENDING_PAN_HVT',
  PIN_EXPIRED: 'PIN_EXPIRED',
  ACTIVE: 'ACTIVE', // Card is marked active when payment method has both pin and pan tokenized
  INACTIVE: 'INACTIVE',
  REMOVED: 'REMOVED',
};

export const PAYMENT_METHODS = {
  SNAP: 'SNAP',
  SNAP_FOOD: 'SNAP_FOOD',
  SNAP_CASH: 'SNAP_CASH',
  CARD: 'CARD',
  EIGEN: 'FIS_CREDIT_DEBIT',
  FIS_CREDIT_DEBIT: 'FIS_CREDIT_DEBIT',
  STORE_CHARGE: 'STORE_CHARGE',
  GIFT_CARD: 'GIFT_CARD',
  VIRTUAL_WALLET: 'VIRTUAL_WALLET',
};

export const PIN_TYPE = {
  SNAP_CASH: 'CASH',
  SNAP_FOOD: 'FOOD',
  BALANCE_INQUIRY: 'BALANCE_INQUIRY',
  VIRTUAL_WALLET: 'VIRTUAL_WALLET',
};

export const CARD_USAGE_TYPE = {
  SINGLE: 'SINGLE',
  MULTIPLE: 'MULTIPLE',
};

export const ASYNC_STORAGE_KEYS = {
  TOKEN_BEFORE_LOGIN: 'tokenBeforeLogin',
  USER_TOKEN: 'userToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_EMAIL: 'userEmail',
  UNIQUE_ID: 'uniqueId',
  GLOBAL_STATE: 'state',
  FCM_TOKEN: 'fcmToken',
};

export const DATE_TIME_FORMATS = {
  twelveHour: {
    refund: 'MMMM Do, YYYY h:mm A',
    refundOrderCard: 'MMMM D, YYYY, h:mm A',
    orderTime: 'MM/DD/YY, hh:mm A',
  },
  twentyFourHour: {
    refund: 'MMMM Do, YYYY HH:mm',
    refundOrderCard: 'MMMM D, YYYY, H:mm',
    orderTime: 'MM/DD/YY, HH:mm A',
  },
  orderHistory: 'MMMM DD, YYYY',
  deliveryDate: 'MMMM D, YYYY',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYY: 'YYYY',
  MMMM: 'MMMM',
};

export const SUNDAY_EXCLUSIONS_REQUIREMENTS = [APP_CONSTANTS.CLOSED, '10am', '11am', '12pm', '1pm'];

export const EDIT_LIST_OPTIONS = [
  {
    id: '1',
    name: APP_CONSTANTS.RENAME_LIST,
    list: true,
  },
  {
    id: '2',
    name: APP_CONSTANTS.DELETE_LIST,
    list: false,
  },
  {
    id: '3',
    name: APP_CONSTANTS.DUPLICATE_LIST,
    list: true,
  },
];

export const IMAGES_RESIZE_MODES = {
  CONTAIN: 'contain',
  COVER: 'cover',
  CENTER: 'centre',
};

export const TOAST_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

export const KEYBOARD_FEATURES = {
  maskTypes: {
    usPhoneFormat: '(999) 999-9999',
    creditCardExpiryDate: 'MM/YYYY',
    giftCardNumber: '9999 9999 9999 9999 999',
    storeCharge: '99 999 999 9999',
  },
  keyboardTypes: {
    emailAddress: 'email-address',
    numberPad: 'number-pad',
    numeric: 'numeric',
    default: 'default',
  },
  returnKeyTypes: {
    done: 'done',
    next: 'next',
    go: 'go',
  },
  autoCapitalizeTypes: {
    none: 'none',
    off: 'off',
  },
};

export const STATUSBAR_STYLES = {
  darkContent: 'dark-content',
  lightContent: 'light-content',
};

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const SPLASH_TIME = 3000;
export const TOAST_FADE_IN_DURATION = 100;
export const TOAST_FADE_OUT_DURATION = 1000;
export const TOAST_POSITION = 180;
export const TOAST_POSITION_KEYBOARD_OFFSET = 40;
export const DEPARTMENT_LISTING_ITEM_HEIGHT = 75;
export const FLASH_MESSAGE_DURATION = 3000;
export const DIALOG_OUT_ANIMATION_TIME = 200;
export const DIALOG_IN_ANIMATION_TIME = 300;

export const FLASH_MESSAGE_TYPE = 'default';
export const PROMO_CROSS_ICON_WIDTH = 35;

export const SNAP_CODES = {
  SUCCESS: '870',
  HTML_LOAD_FAILED: '884',
};

export const SNAP_IFRAME_SYSTEM_ERRORS = ['884', '889'];

export const PROMISE_STATUSES = {
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
};

export const VW_PREFIX = '40010000010';

export const TOLL_FREE = {
  CALL: '(844)-672-4274',
  DISPLAY: '1-844-672-4274',
};

export const GEO_CODING_APIKEY = 'AIzaSyB3h-whNhLcdpelrpphF69ThPQTDCGlN5Y';
export const GLEAP_TOKEN = 'WtojnOGhVodzoMy2ruHiLJA2sGaYC0El';

export const ENVIRONMENTS = {
  DEV: 'DEV',
  STAGING: 'STAGING',
  PRODUCTION: 'PRODUCTION',
};

export const RANDOM_WEIGHT_KEYS = {WT: 'lb', EA: 'ea', PKG: 'pkg', BOX: 'box', BAG: 'bag'};

export const RANDOM_WEIGHT_VALUES = {
  lb: 'WT',
  ea: 'EA',
  pkg: 'PKG',
  box: 'BOX',
  bag: 'BAG',
};

export const RANDOM_WEIGHT_UNITS = [...Object.values(RANDOM_WEIGHT_VALUES)];

export const CAKE_TYPES = {
  CUPCAKE: 'CC',
  FILLED_SHEET_CAKE: 'FC',
  SHEET_CAKE: 'SC',
  DECORATED_CAKE: 'DC',
};

export const CUSTOM_CAKES_TYPES = [
  CAKE_TYPES.CUPCAKE,
  CAKE_TYPES.FILLED_SHEET_CAKE,
  CAKE_TYPES.SHEET_CAKE,
  CAKE_TYPES.DECORATED_CAKE,
];

export const DEEPLINKS = {
  EMAIL: `${Config.DEEPLINK_DOMAIN}/email`,
  ORDER_DETAILS: `${Config.DEEPLINK_DOMAIN}/orderDetails`,
  ONSALE: `${Config.DEEPLINK_DOMAIN}/onsale`,
};
