import * as Keychain from 'react-native-keychain';
import {logToConsole} from '../configs/ReactotronConfig';

export const setCredentials = async (username, password) => {
  return new Promise((resolve, reject) => {
    // Store the credentials
    Keychain.setGenericPassword(username, password)
      .then(resp => {
        // logToConsole({resp});
        resolve(true);
      })
      .catch(err => {
        logToConsole('err: ', err);
        reject(err);
      });
  });
};

export const getSupportedBiometryType = async () => {
  return await Keychain.getSupportedBiometryType();
};

export const getCredentials = async () => {
  return new Promise((resolve, reject) => {
    // Get the credentials
    Keychain.getGenericPassword()
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        logToConsole('err: ', err);
        reject(err);
      });
  });
};
