import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import {FONTS, getFontSize} from '../../theme';
import BottomSheetModal from '../BottomSheetModal';
import useIsGuest from '../../hooks/useIsGuest';

const OrderNotificationPreferenceModal = ({
  visible,
  onRequestClose,
  defaultPreferences,
  onShowPermissionModal,
  onOrderNotificationPreferenceChange,
}) => {
  const {
    email = false,
    text = false,
    alert: defaultAlert = false,
  } = defaultPreferences ?? {};
  const [alert, setAlert] = useState(defaultAlert);
  const [textAlert, setTextAlert] = useState(text);
  const [emailAlert, setEmailAlert] = useState(email);
  const [isBtnDisable, setIsBtnDisable] = useState(true);
  const [isAlertBtnDisabled, setIsAlertBtnDisabled] = useState(true);

  const isGuest = useIsGuest();

  const isNotificationAllowedSelector = useMemo(
    () => state => state.general?.isNotificationAllowed,
    [],
  );

  const isNotificationAllowed = useSelector(isNotificationAllowedSelector);

  const initializeStates = () => {
    setAlert(defaultAlert);
    setEmailAlert(email);
    setTextAlert(text);
  };

  useEffect(() => {
    if (textAlert === text && emailAlert === email) {
      return setIsBtnDisable(true);
    }
    return setIsBtnDisable(false);
  }, [textAlert, emailAlert]);

  const toggleAlert = () => {
    setAlert(prevState => {
      if (prevState && isNotificationAllowed) {
        setIsAlertBtnDisabled(false);
        return false;
      }
      if (isNotificationAllowed) {
        setIsAlertBtnDisabled(false);
      } else {
        onShowPermissionModal();
      }
      return true;
    });
  };

  const toggleTextAlert = () => setTextAlert(prevState => !prevState);

  const save = () => {
    let preferences = {
      email: emailAlert,
      text: textAlert,
      alert: alert,
    };
    setIsAlertBtnDisabled(true);
    onOrderNotificationPreferenceChange(preferences);
    onRequestClose();
  };
  return (
    <BottomSheetModal
      visible={visible}
      title={APP_CONSTANTS.ORDER_NOTIFICATION_PREFERENCE}
      onModalWillShow={initializeStates}
      onCrossPress={onRequestClose}
      statusBarTranslucent
      buttonTitle={APP_CONSTANTS.CONTINUE}
      isButtonDisabled={isBtnDisable && isAlertBtnDisabled}
      onBottomPress={save}>
      <View>
        {!isGuest ? (
          <View
            style={[
              styles.listRow,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <Text allowFontScaling={false} style={styles.createListText}>{APP_CONSTANTS.ALERT}</Text>
            <Switch
              trackColor={{
                false: COLORS.SWITCH_COLOR,
                true: COLORS.SWITCH_ON_COLOR,
              }}
              thumbColor={COLORS.WHITE}
              ios_backgroundColor={COLORS.SWITCH_COLOR}
              onValueChange={toggleAlert}
              value={alert && isNotificationAllowed}
            />
          </View>
        ) : null}
        <View style={styles.divider} />
        <View
          style={[
            styles.listRow,
            {
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          <Text allowFontScaling={false} style={styles.createListText}>{APP_CONSTANTS.TEXT}</Text>
          <Switch
            trackColor={{
              false: COLORS.SWITCH_COLOR,
              true: COLORS.SWITCH_ON_COLOR,
            }}
            thumbColor={COLORS.WHITE}
            ios_backgroundColor={COLORS.SWITCH_COLOR}
            onValueChange={toggleTextAlert}
            value={textAlert}
          />
        </View>
        <View style={styles.divider} />
      </View>
    </BottomSheetModal>
  );
};
const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  listRow: {
    width: '90%',
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('2%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  createListText: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.REGULAR,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  rightArrowStyle: {
    width: 8,
    height: 25,
    alignSelf: 'flex-end',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY0_5,
    marginStart: wp('6%'),
    width: '100%',
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.MAIN,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginVertical: hp('5%'),
  },
});
export default OrderNotificationPreferenceModal;
