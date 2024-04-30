import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeModules} from 'react-native';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

const scriptURL = NativeModules.SourceCode.scriptURL;
const host = scriptURL.split('://')[1].split(':')[0];
const reactotron = Reactotron.configure({name: 'AlaskaCo', host})
  .use(reactotronRedux())
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative()
  .connect();

reactotron?.clear?.();

export const logToConsole = (params, type = 'warn') => {
  if (__DEV__) {
    reactotron[type]?.(params);
    console.log(params);
  }
};

export const displayToConsole = (value, name = 'QUALTRICS', config = {}) => {
  if (__DEV__) {
    reactotron.display({
      name: 'DEBUGGER',
      value,
      preview: name,
      ...config,
    });
    console.log(value);
  }
};

export default reactotron;
