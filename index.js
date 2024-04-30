import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
import messaging from '@react-native-firebase/messaging';
import {logToConsole} from './src/configs/ReactotronConfig';
import {dispatchRef} from './src/containers/RootContainer';
import {setNotificationBadge} from './src/redux/actions/general';

if (__DEV__) {
  import('./src/configs/ReactotronConfig').then(() =>
    logToConsole('Reactotron Configured'),
  );
}
enableScreens();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  logToConsole({setBackgroundMessageHandler: remoteMessage});
  if (remoteMessage) {
    dispatchRef.current?.(setNotificationBadge(true));
  }
});

AppRegistry.registerComponent(appName, () => App);
