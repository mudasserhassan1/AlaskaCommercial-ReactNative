import {showMessage} from 'react-native-flash-message';
import {APP_CONSTANTS} from '../constants/Strings';
import {FLASH_MESSAGE_DURATION, FLASH_MESSAGE_TYPE} from '../constants/Common';
import {COLORS} from '../theme';
import {Platform, StatusBar} from 'react-native';
import {FONTS} from '../theme';
import {logToConsole} from '../configs/ReactotronConfig';

export const showNetworkError = (problem = 'NETWORK_ERROR', title = '', message = '') => {
  logToConsole({problem, title, message});
  const errorMessage = message
    ? message
    : problem === 'NETWORK_ERROR'
    ? APP_CONSTANTS.NO_INTERNET_CONNECTION
    : APP_CONSTANTS.SOME_THING_WENT_WRONG;
  showMessage({
    message: errorMessage,
    type: FLASH_MESSAGE_TYPE,
    backgroundColor: COLORS.GRAY_TEXT_0_9,
    color: COLORS.WHITE,
    statusBarHeight: Platform.OS === 'android' ? StatusBar.currentHeight : undefined,
    floating: Platform.OS === 'android',
    titleStyle: {
      fontSize: 16,
      fontFamily: FONTS.MEDIUM,
    },
    duration: FLASH_MESSAGE_DURATION,
  });
};
