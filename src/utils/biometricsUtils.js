import {Alert, Platform} from 'react-native';
import {getCredentials, getSupportedBiometryType, setCredentials} from './keychainUtils';
import {logToConsole} from '../configs/ReactotronConfig';
import isEmail from 'validator/lib/isEmail';
import ReactNativeBiometrics from 'react-native-biometrics';
import {IMAGES} from '../theme';
import {BIOMETRY_TYPE} from 'react-native-keychain';
import {APP_CONSTANTS} from '../constants/Strings';
import {setIsBiometrics} from '../redux/actions/general';

const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});
export let biometrics = {};

export const handleBiometrics = async () => {
  const biometryType = await getSupportedBiometryType();
  if (biometryType) {
    const user = await getCredentials();
    const {username = '', password = ''} = user || {};
    biometrics = {available: true, username: isEmail(username) ? username : '', password};
    if ([BIOMETRY_TYPE.FACE, BIOMETRY_TYPE.FACE_ID].includes(biometryType)) {
      biometrics.biometryIcon = IMAGES.FACE_ID;
      biometrics.biometryType = APP_CONSTANTS.FACE_ID;
      biometrics.biometryName = APP_CONSTANTS.FACE_ID_R;
    } else {
      biometrics.biometryIcon = IMAGES.TOUCH_ID;
      biometrics.biometryType = APP_CONSTANTS.TOUCH_ID;
      biometrics.biometryName = APP_CONSTANTS.TOUCH_ID_R;
    }
    if (Platform.OS === 'android') {
      biometrics.biometryType = APP_CONSTANTS.BIOMETRIC;
    }
  }
  return biometrics;
};

export const promptForBiometrics = async ({username, password, dispatch}) => {
  const {biometryType, username: bioEmail} = biometrics || {};
  if (biometryType) {
    dispatch(setIsBiometrics(true));
    Alert.alert(
      biometryType,
      `Would you like to ${isEmail(bioEmail) ? 'update' : 'enable'} ${biometryType} authentication for the next time?`,
      [
        {
          text: 'Yes please',
          onPress: () => {
            dispatch(setIsBiometrics(false));
            setCredentials(username, password);
          },
        },
        {text: 'Cancel', style: 'cancel', onPress: () => dispatch(setIsBiometrics(false))},
      ],
    );
  }
};

export const handleBiometricLogin = async cb => {
  try {
    const {biometryType, password, username: email} = biometrics || {};
    const {success} = await rnBiometrics.simplePrompt({
      promptMessage: `Login with ${biometryType}`,
    });
    if (success) {
      cb(email, password, true);
    }
  } catch (e) {
    logToConsole({e, message: e?.message});
  }
};
