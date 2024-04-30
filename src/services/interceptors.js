import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS, ERROR_TYPES} from '../constants/Common';
import {api as API, REFRESH_TOKEN} from './Apis';
import {dispatchRef} from '../containers/RootContainer';
import {saveLoginTokens, toggleNetworkErrorDialog, toggleUnderMaintenance} from '../redux/actions/general';
import {LOGOUT_ENDPOINTS, WITHOUT_TOKEN_APIS} from '../constants/Api';
import {logout} from '../utils/userUtils';
import {reduxStore} from '../App';
import {showNetworkError} from './toast';
import {logToConsole} from '../configs/ReactotronConfig';
import {setAPIHeaders} from './ApiCaller';

let isRefreshCallInProgress = false;

const waitForRefreshTokenCall = async () => {
  return new Promise(resolve => {
    const intervalId = setInterval(async () => {
      if (!isRefreshCallInProgress) {
        const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USER_TOKEN);
        clearInterval(intervalId);
        resolve({token});
      }
    }, 100);
  });
};

export const fetchNewToken = async refreshToken => {
  isRefreshCallInProgress = true;
  const response = await REFRESH_TOKEN({refreshToken});
  const {token, refreshToken: newRefreshToken} = await setAPIHeaders(response);
  if (token) {
    dispatchRef.current(saveLoginTokens({userToken: token, refreshToken: newRefreshToken}));
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_TOKEN, token);
  }
  isRefreshCallInProgress = false;
  return {token};
};

API.addRequestTransform(request => {
  const {url, headers} = request || {};
  if (WITHOUT_TOKEN_APIS.includes(url?.split?.('?')?.[0])) {
    const {Authorization, ...rest} = headers || {};
    request.headers = {...(rest || {})};
  }
});

API.addAsyncResponseTransform(async response => {
  if (!LOGOUT_ENDPOINTS.includes(response?.config?.url)) {
    let newToken;
    const {type: errorType} = response?.data || {};
    if (errorType === ERROR_TYPES.MULTI_DEVICE_LOGIN) {
      const {token: currentToken} = await waitForRefreshTokenCall();
      const failedToken = response.config.headers.Authorization.replace('Bearer ', '');
      if (currentToken !== failedToken) {
        newToken = currentToken;
      }
    }
    if (errorType === ERROR_TYPES.TOKEN_EXPIRED) {
      const refreshToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
      if (isRefreshCallInProgress) {
        const {token} = await waitForRefreshTokenCall();
        newToken = token;
      } else if (refreshToken) {
        const {token} = await fetchNewToken(refreshToken);
        newToken = token;
      }
    }
    if (newToken) {
      response.config.headers.Authorization = `Bearer ${newToken}`;
      const newResponse = await API.any(response.config);
      const {data, duration, problem, ok, status, headers, config} = newResponse || {};
      response.data = data;
      response.duration = duration;
      response.problem = problem;
      response.ok = ok;
      response.status = status;
      response.headers = headers;
      response.config = config;
    }
  }
});

export const apiCaller = async (api, params = {}, isLogout = false, options) => {
  try {
    if (isRefreshCallInProgress) {
      await waitForRefreshTokenCall();
    }
    const response = (await api?.(params, options)) || {};
    const {data} = response || {};
    if (
      !isLogout &&
      [
        ERROR_TYPES.ACCOUNT_DEACTIVATED,
        ERROR_TYPES.MULTI_DEVICE_LOGIN,
        ERROR_TYPES.PASSWORD_RESET,
        ERROR_TYPES.TOKEN_EXPIRED,
      ].includes(data?.type)
    ) {
      dispatchRef.current?.(toggleNetworkErrorDialog({visible: true, error: data}));
      setTimeout(() => {
        logout(dispatchRef.current, reduxStore?.getState?.());
      }, 50);
      throw {isNetworkError: true};
    }
    if (response?.problem === 'NETWORK_ERROR' || response?.problem === 'TIMEOUT_ERROR') {
      showNetworkError(response?.problem);
      throw {...response, isNetworkError: true};
    } else if (response?.problem === 'SERVER_ERROR' && !!response?.data?.isUnderMaintenance) {
      setTimeout(() => {
        dispatchRef.current?.(toggleUnderMaintenance(true));
      }, 50);
      // showNetworkError(response?.problem, response?.data?.title, response?.data?.message);
      throw {isUnderMaintenance: true};
    }
    return {response};
  } catch (e) {
    logToConsole({e, message: e?.message});
    return {response: {...(e || {}), data: e?.data || {}}};
  }
};
