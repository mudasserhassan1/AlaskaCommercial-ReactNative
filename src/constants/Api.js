import Config from 'react-native-config';

export const API_ENDPOINTS = {
  REFRESH_TOKEN: 'user/refreshToken',
  LOGIN_API: 'auth/login',
  SIGNUP_API: 'auth/signup',
  GUEST_SIGN_UP: 'auth/guestSignup',
  FORGOT_PASSWORD_API: 'auth/verification',
  IS_CODE_VALID_API: 'auth/isCodeValid',
  RESET_PASSWORD_API: 'auth/resetPassword',
  CHANGE_PASSWORD: 'user/passwordReset',
  DEACTIVATE_ACCOUNT: 'user/deleteAccount',
  UPDATE_USER: 'user',
  GET_APP_LATEST_VERSION: 'version/getAppLatestVersion',
};

export const WITHOUT_TOKEN_APIS = [
  API_ENDPOINTS.LOGIN_API,
  API_ENDPOINTS.SIGNUP_API,
  API_ENDPOINTS.GUEST_SIGN_UP,
  API_ENDPOINTS.FORGOT_PASSWORD_API,
  API_ENDPOINTS.GET_APP_LATEST_VERSION,
  API_ENDPOINTS.REFRESH_TOKEN,
  API_ENDPOINTS.IS_CODE_VALID_API,
  API_ENDPOINTS.RESET_PASSWORD_API,
];

export const LOGOUT_ENDPOINTS = ['auth/logout'];

export const BLOB_URLS = {
  LOCAL_URL: 'http://192.168.30.209:3000/',
  MAIN_IMAGE_URL: Config.MAIN_IMAGE_URL,
  THUMBNAIL_IMAGE_URL: Config.THUMBNAIL_IMAGE_URL,
  DEPT_ICON_URL: Config.DEPT_ICON_URL,
  HOME_BANNER_URL: Config.HOME_BANNER_URL,
  LR_MAIN_IMAGE_END_URL: '_LR_MN_SYN.png',
  HR_MAIN_IMAGE_END_URL: '_HR_MN_SYN.png',
  LR_THUMBNAIL_IMAGE_END_URL: '_LR_TN_SYN.png',
  HR_THUMBNAIL_IMAGE_END_URL: '_HR_TN_SYN.png',
  ABOUT_US: 'https://accstorageapp.blob.core.windows.net/assets/about-us.component.html/',
  TERM_OF_USE: 'https://accstorageapp.blob.core.windows.net/assets/terms-of-use.component.html',
  FAQ: 'https://accstorageapp.blob.core.windows.net/assets/faq.component.html',
  PRIVACY_POLICY: 'https://accstorageapp.blob.core.windows.net/assets/privacy-policy.component.html',
  SHIPPING_AND_RETURN: 'https://accstorageapp.blob.core.windows.net/assets/shipping-and-return.component.html',
};

export const STATUSES = {
  OK: 200,
  AUTH_ERROR: 401,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
};
