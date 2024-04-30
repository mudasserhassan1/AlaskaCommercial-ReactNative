import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  getNotificationSettings,
  setNotificationSettings,
  updateUser,
} from '../../services/ApiCaller';
import {NOTIFICATION_KEYS} from '../../constants/Common';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {
  changeNotificationSetting,
  saveLoginInfo,
} from '../../redux/actions/general';
import useNotificationPermissionModal from '../../components/useNotificationPermissionModal';
import {logToConsole} from '../../configs/ReactotronConfig';
import NotificationItem from './NotificationItem';

const NotificationSettings = () => {
  const {onShowAlert} = useNotificationPermissionModal();

  const dispatch = useDispatch();

  // const {
  //   notificationSettings = [],
  //   loginInfo,
  //   isNotificationAllowed,
  // } = useSelector(({general: {notificationSettings, isNotificationAllowed, loginInfo = {}} = {}}) => ({
  //   notificationSettings,
  //   loginInfo,
  //   isNotificationAllowed,
  // }));

  const notificationSettingsSelector = useMemo(
    () => state => state.general?.notificationSettings,
    [],
  );

  const loginInfoSelector = useMemo(
    () => state => state.general?.loginInfo,
    [],
  );

  const isNotificationAllowedSelector = useMemo(
    () => state => state.general?.isNotificationAllowed,
    [],
  );

  const notificationSettings = useSelector(notificationSettingsSelector);
  const loginInfo = useSelector(loginInfoSelector);
  const isNotificationAllowed = useSelector(isNotificationAllowedSelector);

  // logToConsole({notificationSettings, loginInfo, isNotificationAllowed});

  const userInfo = loginInfo?.userInfo || {};
  const {isSMSOptIn, isEmailOptIn} = userInfo || {};

  const [loading, setLoading] = useState(true);
  const [isSMSCheckBox, setIsSMSCheckBox] = useState(!!isSMSOptIn);
  const [isEmailCheckBox, setIsEmailCheckBox] = useState(!!isEmailOptIn);

  useEffect(() => {
    getNotificationSettings(userInfo?._id, dispatch)
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onUpdateOptIn = async ({
    sms = isSMSCheckBox,
    email = isEmailCheckBox,
  }) => {
    try {
      const {response} = await updateUser({
        isSMSOptIn: sms,
        isEmailOptIn: email,
      });
      if (response.ok) {
        const {data: {user: User = {}} = {}} = response ?? {};
        dispatch(saveLoginInfo({...loginInfo, userInfo: User}));
      }
    } catch (e) {
      logToConsole({onUpdateOptInError: e});
    }
  };

  const onUpdateSMSOptIn = async () => {
    let isEnabled = isSMSCheckBox;
    try {
      setIsSMSCheckBox(!isEnabled);
      await onUpdateOptIn({sms: !isEnabled});
    } catch (e) {
      setIsSMSCheckBox(isEnabled);
    }
  };

  const onUpdateEmailOptIn = async () => {
    let isEnabled = isEmailCheckBox;
    try {
      setIsEmailCheckBox(!isEnabled);
      await onUpdateOptIn({email: !isEnabled});
    } catch (e) {
      setIsEmailCheckBox(isEnabled);
    }
  };

  const toggleNotificationItem = (
    index,
    isEnabled,
    {key, isEnabled: isEnabledItem} = {},
  ) => {
    if (key === NOTIFICATION_KEYS.IN_APP_NOTIFICATION && !isEnabled) {
      if (!isNotificationAllowed) {
        onShowAlert();
        if (isEnabledItem) {
          return;
        }
      }
    }
    notificationSettings[index].isEnabled = !isEnabledItem;
    dispatch(changeNotificationSetting([...notificationSettings]));
    let settings = {};
    notificationSettings.forEach(item => {
      settings[item.key] = item?.isEnabled ?? false;
    });
    setNotificationSettings(settings);
  };

  const renderNotificationItem = ({item, index}) => {
    return (
      <NotificationItem
        onPressItem={toggleNotificationItem}
        isNotificationAllowed={isNotificationAllowed}
        item={item}
        index={index}
      />
    );
  };

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.NOTIFICATION_HEADER}
      withBackButton
      isLoading={loading}
      isScrollView={true}>
      <View style={styles.userPreferenceWrapper}>
        <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.ORDER_UPDATES}</Text>
        <FlatList
          data={notificationSettings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNotificationItem}
        />
      </View>
      <View
        style={[styles.userPreferenceWrapper, styles.userPreferenceWrapperII]}>
        <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.MARKETING_UPDATES}</Text>
        <NotificationItem
          onPressItem={onUpdateEmailOptIn}
          item={{
            name: APP_CONSTANTS.EMAIL_MARKETING,
            isEnabled: isEmailCheckBox,
          }}
        />
        <NotificationItem
          onPressItem={onUpdateSMSOptIn}
          item={{
            name: APP_CONSTANTS.TEXT_MARKETING,
            isEnabled: isSMSCheckBox,
          }}
        />
      </View>
    </ScreenWrapperComponent>
  );
};

export default NotificationSettings;
