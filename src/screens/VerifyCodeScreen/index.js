/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Alert, Platform, Text, TouchableOpacity, View} from 'react-native';

import {forgotPassword, isCodeValid} from '../../services/ApiCaller';
import {COLORS} from '../../theme';
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {KEYBOARD_FEATURES} from '../../constants/Common';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {navigateTo} from '../../utils/navigationUtils';
import BackgroundTimer from 'react-native-background-timer';
import {logToConsole} from '../../configs/ReactotronConfig';

const VerifyCode = ({route}) => {
  const [userCode, setUserCode] = useState('');
  const [timerCount, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [borderColor, setBorderColor] = useState(COLORS.GRAY_4);

  useEffect(() => {
    startTimer();
  }, []);

  const startTimer = () => {
    let interval = BackgroundTimer.setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && BackgroundTimer.clearInterval(interval);
        return +lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => BackgroundTimer.clearInterval(interval);
  };

  const isButtonDisabled = userCode.length !== 6;

  const submit = async () => {
    setLoading(true);
    const {userCredential = '', isEmail = false} = route.params || {};
    const {response = {}} = await isCodeValid({VerificationCode: userCode});
    setLoading(false);
    const {ok = false} = response || {};
    if (ok) {
      navigateTo('ResetPassword', {
        comingFrom: 'ForgotPassword',
        userCredential,
        isEmail,
      });
    } else {
      const {data: {msg = ''} = {}, isNetworkError, isUnderMaintenance} = response || {};
      if (isUnderMaintenance) {
      } else if (!isNetworkError) {
        setErrorAlertText(msg);
        setBorderColor(COLORS.MAIN);
        setUserCode('');
      }
    }
  };

  const resendCode = async () => {
    setLoading(true);
    const {userCredential = '', isEmail = false} = route.params || {};
    let verificationCodeCredentials;
    if (isEmail) {
      verificationCodeCredentials = {
        Email: userCredential,
      };
    } else {
      let phoneNumber = userCredential.replace(/[^\d]/g, '');
      phoneNumber = `+1${phoneNumber}`;
      verificationCodeCredentials = {
        PhoneNumber: phoneNumber,
      };
    }
    const {response = {}} = await forgotPassword(verificationCodeCredentials);
    setLoading(false);
    const {ok = false} = response || {};
    if (ok) {
      this.toast?.show(APP_CONSTANTS.CODE_SENT, 2000);
      setUserCode('');
      setTimer(45);
      startTimer();
    } else {
      const {data: {msg = ''} = {}, isNetworkError, isUnderMaintenance} = response || {};
      if (isUnderMaintenance) {
      } else if (msg) {
        setErrorAlertText(msg);
        setBorderColor(COLORS.MAIN);
        setUserCode('');
      }
      if (!isNetworkError) {
        Alert.alert(APP_CONSTANTS.ALASKA_COMMERCIAL, APP_CONSTANTS.SOME_THING_WENT_WRONG, [{text: 'Ok'}]);
      }
    }
  };

  const renderVerificationCodeTitle = () => (
    <Text allowFontScaling={false} style={styles.subtitle}>{APP_CONSTANTS.ENTER_VERIFICATION_CODE}</Text>
  );

  const renderVerificationCodeInstructions = () => (
    <View style={styles.marginTop}>
      <Text allowFontScaling={false} style={styles.instructionText}>{APP_CONSTANTS.VERIFICATION_CODE_INSTRUCTIONS}</Text>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.errorStyle}>
      <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
    </View>
  );

  const renderInputView = () => (
    <View style={styles.inputContainer}>
      <Input
        autoCapitalize={KEYBOARD_FEATURES.autoCapitalizeTypes.none}
        keyboardType={
          Platform.OS === 'ios' ? KEYBOARD_FEATURES.keyboardTypes.numberPad : KEYBOARD_FEATURES.keyboardTypes.numeric
        }
        placeholder={'xxxxxx'}
        borderColor={borderColor}
        onChangeText={code => {
          setUserCode(code.trim());
          setBorderColor(COLORS.GRAY_4);
          setErrorAlertText('');
        }}
        value={userCode}
        maxLength={6}
        onSubmitEditing={submit}
      />
    </View>
  );

  const renderButton = () => (
    <View
      style={[
        styles.btnWrapper,
        {
          backgroundColor: isButtonDisabled ? COLORS.DISABLE_BUTTON_COLOR : COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button
        label={APP_CONSTANTS.VERIFY}
        color={COLORS.WHITE}
        width="90%"
        disabled={isButtonDisabled}
        onPress={submit}
      />
    </View>
  );

  const renderResendCodeText = () => {
    return (
      <TouchableOpacity disabled={timerCount > 0} onPress={resendCode}>
        {timerCount > 0 ? (
          <Text allowFontScaling={false} style={[styles.resendCodeText, {color: COLORS.GRAY_4}]}>
            {APP_CONSTANTS.RESEND_IN}
            {timerCount < 10 ? '0' + timerCount : timerCount}
          </Text>
        ) : (
          <Text allowFontScaling={false} style={[styles.resendCodeText, {color: COLORS.BLACK}]}>{APP_CONSTANTS.RESEND_CODE}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapperComponent
      isAuthHeader
      withHeader
      withBackButton
      headerTitle={APP_CONSTANTS.FORGOT_PASS_HEADER}
      isKeyboardAwareScrollView
      isLoading={loading}>
      <View style={styles.wrapper}>
        {renderVerificationCodeTitle()}
        {renderVerificationCodeInstructions()}
        {renderErrorView()}
        {renderInputView()}
        {renderButton()}
        {renderResendCodeText()}
      </View>
      <ToastComponent toastRef={toast => (this.toast = toast)} />
    </ScreenWrapperComponent>
  );
};
export default VerifyCode;
