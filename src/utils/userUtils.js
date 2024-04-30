import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutUser, saveLoginInfo} from '../redux/actions/general';
import {ASYNC_STORAGE_KEYS} from '../constants/Common';
import {resetUserConfig} from '../redux/actions/config';
import {ANALYTICS_EVENTS} from '../screens/ShoppingCartPickup/Constants';
import Analytics from './analyticsUtils';
import {MixPanelInstance} from './mixpanelUtils';
import {api as API} from '../services/Apis';
import { reduxStore } from "../App";

export const logout = async (dispatch) => {
  const globalState = reduxStore.getState();
  const updatedLoginInfo = {
    userToken: null,
    userId: null,
    userInfo: {},
  };
  global.isConvertingGuestUser = false;
  const {FullName, PhoneNumber, Email} = globalState?.general?.loginInfo?.userInfo || {};
  Analytics.logEvent(ANALYTICS_EVENTS.LOGOUT, {
    FullName,
    PhoneNumber,
    Email,
  });
  globalState.general.loginInfo = updatedLoginInfo;
  delete API.headers.Authorization;
  await AsyncStorage.multiRemove([
    ASYNC_STORAGE_KEYS.USER_EMAIL,
    ASYNC_STORAGE_KEYS.TOKEN_BEFORE_LOGIN,
    ASYNC_STORAGE_KEYS.USER_TOKEN,
    ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
  ]);
  await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.GLOBAL_STATE, JSON.stringify(globalState)).then(() => {
    global.isQualtricsInitialized = false;
    dispatch(logoutUser());
    dispatch(resetUserConfig());
  });
  MixPanelInstance.logout();
};

export const saveUserInfo = async (dispatch, id, userInfo) => {
  let token;
  if (String(id) === 'guestUser') {
    token = 'guest-auth-token';
  } else {
    await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TOKEN_BEFORE_LOGIN).then(async tokenBeforeLogin => {
      if (!tokenBeforeLogin) {
        await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USER_TOKEN).then(userToken => {
          token = userToken;
        });
      } else {
        token = tokenBeforeLogin;
      }
    });
  }
  let updatedInfo = {
    userToken: token,
    userId: id,
    userInfo: userInfo,
  };
  dispatch?.(saveLoginInfo(updatedInfo));
};

export async function getApiToken() {
  let token;
  await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TOKEN_BEFORE_LOGIN).then(async tokenBeforeLogin => {
    if (tokenBeforeLogin == null) {
      await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USER_TOKEN).then(userToken => {
        token = userToken;
      });
    } else {
      token = tokenBeforeLogin;
    }
  });
  return token;
}
