import messaging from '@react-native-firebase/messaging';
import {logToConsole} from '../configs/ReactotronConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setNotificationBadge} from '../redux/actions/general';
import {dispatchRef} from '../containers/RootContainer';
import PushNotification from 'react-native-push-notification';
import {requestNotifications, checkNotifications, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const checkStatus = authStatus => {
  if (Platform.OS === 'ios') {
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  return authStatus === RESULTS.GRANTED || authStatus === RESULTS.LIMITED;
};

export const requestNotificationPermission = async () => {
  try {
    let status;
    if (Platform.OS === 'ios') {
      status = await messaging().requestPermission();
    } else {
      const result = await requestNotifications();
      status = result.status;
    }
    return checkStatus(status);
  } catch (e) {
    logToConsole({ErrorRequestPermission: e, message: e.message}, 'error');
    return false;
  }
};

export const checkIfNotificationAllowed = async () => {
  let status;
  if (Platform.OS === 'ios') {
    status = await messaging()?.hasPermission();
  } else {
    const result = await checkNotifications();
    status = result.status;
  }
  return checkStatus(status);
};

export const getFcmToken = async () => {
  try {
    const isPermissionGranted = await checkIfNotificationAllowed();
    if (isPermissionGranted) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('FCMToken', fcmToken);
        return fcmToken;
      }
    }
    return '';
  } catch (e) {
    logToConsole({ErrorGetToken: e, message: e.message}, 'error');
    return '';
  }
};

export const updateNotificationBadge = count => {
  if (!count) {
    PushNotification.removeAllDeliveredNotifications();
    PushNotification.setApplicationIconBadgeNumber(0);
  }
  dispatchRef.current(setNotificationBadge(!!count));
};
