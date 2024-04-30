import analytics from '@react-native-firebase/analytics';
import {logToConsole} from '../configs/ReactotronConfig';

const logEvent = async (name = '', params = {}) => {
  try {
    await analytics().logEvent(name, params);
  } catch (e) {
    logToConsole({logEventError: e, name, params});
  }
};

const logLogin = async (name = '', params = {}) => {
  try {
    await analytics().logEvent(name, params);
  } catch (e) {
    logToConsole({logEventError: e, name, params});
  }
};

const logSignUp = async (name = '', params = {}) => {
  try {
    await analytics().logEvent(name, params);
  } catch (e) {
    logToConsole({logEventError: e, name, params});
  }
};

export default {
  logEvent,
  logSignUp,
  logLogin,
};
