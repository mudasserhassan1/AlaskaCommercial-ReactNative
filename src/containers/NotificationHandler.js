import {useEffect, useMemo, useRef} from 'react';
import messaging from '@react-native-firebase/messaging';
import {logToConsole} from '../configs/ReactotronConfig';
import {sendFcmTokenToServer} from '../services/ApiCaller';
import {useRoute} from '@react-navigation/native';
import {checkIfNotificationAllowed} from '../utils/notificationsUtils';
import {addForegroundHandler} from './AppStateHandler';
import {setNotificationAllowed} from '../redux/actions/general';
import {useDispatch, useSelector} from 'react-redux';

const NotificationHandler = ({onNotificationTap, onNewNotification} = {}) => {
  const onTokenRef = useRef(null);
  const onMessageRef = useRef(null);
  const onNotificationOpenedAppRef = useRef(null);

  const route = useRoute();
  const dispatch = useDispatch();

  const notificationAllowedSelector = useMemo(
    () => state => state.general.isNotificationAllowed ?? false,
    [],
  );
  const isNotificationAllowed = useSelector(notificationAllowedSelector);

  const foregroundListener = async () => {
    try {
      const enabled = await checkIfNotificationAllowed();
      if (isNotificationAllowed !== enabled) {
        dispatch(setNotificationAllowed(enabled));
      }
      if (!route?.params?.reset && enabled) {
        await sendFcmTokenToServer();
      }
    } catch (e) {
      logToConsole({ErrorForegroundListener: e, message: e?.message}, 'error');
    }
  };

  useEffect(() => {
    addForegroundHandler('NOTIFICATION', foregroundListener);
  }, [isNotificationAllowed]);

  const handlerListener = async () => {
    const isPermissionGranted = await checkIfNotificationAllowed();
    if (isPermissionGranted) {
      //Foreground
      onMessageRef.current = messaging().onMessage(async remoteMessage => {
        if (remoteMessage) {
          onNewNotification(1);
        }
      });
    }
    //Background
    onNotificationOpenedAppRef.current = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        if (remoteMessage) {
          onNotificationTap(remoteMessage, false);
        }
      },
    );
    //Quit state
    if (!route?.params?.reset) {
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            onNotificationTap(remoteMessage, true);
            logToConsole({
              'getInitialNotification:': remoteMessage,
            });
          }
        });
    }

    //Token Refresh
    onTokenRef.current = messaging().onTokenRefresh(async token => {
      await sendFcmTokenToServer(token);
    });
  };

  useEffect(() => {
    handlerListener();
    return () => {
      onTokenRef.current?.();
      onMessageRef.current?.();
      onNotificationOpenedAppRef.current?.();
    };
  }, []);

  return null;
};

export default NotificationHandler;
