/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {forgotPassword} from '../../services/ApiCaller';
import {KEYBOARD_FEATURES, phoneNumberRegex} from '../../constants/Common';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {navigateTo} from '../../utils/navigationUtils';
import {formatNumberForBackend} from '../../utils/phoneUtils';
import {isValidEmail} from '../../utils/validationUtils';

const ForgotPassword = () => {
  const [maxInputLength, setMaxInputLength] = useState(30);

  const [borderColor, setBorderColor] = useState(COLORS.GRAY_4);
  const [userCredential, setUserCredential] = useState('');
  const [errorAlertText, setErrorAlertText] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const [isEmail, setIsEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let cleaned = ('' + userCredential).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (userCredential.trim().length > 0 && userCredential.charAt(0).match(/^[\d (]+$/)) {
      setIsEmail(false);
      setMaxInputLength(14);
      if (phoneNumberRegex.test(userCredential) === false) {
        setBtnDisable(true);
        if (match) {
          setUserCredential('(' + match[1] + ') ' + match[2] + '-' + match[3]);
        }
      } else if (phoneNumberRegex.test(userCredential) === true) {
        setBtnDisable(false);
        if (match) {
          setUserCredential('(' + match[1] + ') ' + match[2] + '-' + match[3]);
        }
      }
    } else {
      setIsEmail(true);
      setMaxInputLength(30);
      if (!isValidEmail(userCredential)) {
        setUserCredential(userCredential);
        setBtnDisable(true);
      } else if (isValidEmail(userCredential)) {
        setBtnDisable(false);
        setUserCredential(userCredential);
      }
    }
  };

  useEffect(() => {
    validate();
  }, [userCredential]);

  const submit = async () => {
    setIsLoading(true);
    let verificationCodeCredentials;
    if (isEmail) {
      verificationCodeCredentials = {
        Email: userCredential,
      };
    } else {
      verificationCodeCredentials = {
        PhoneNumber: formatNumberForBackend(userCredential),
      };
    }
    const {response = {}} = await forgotPassword(verificationCodeCredentials);
    setIsLoading(false);
    const {ok = false, isNetworkError, isUnderMaintenance = false} = response || {};
    if (ok) {
      navigateTo('VerifyCode', {
        comingFrom: 'ForgotPassword',
        userCredential,
        isEmail,
      });
    } else {
      const {data: {msg = ''} = {}} = response || {};
      if (isUnderMaintenance) {
        setIsLoading(false);
      } else if (msg) {
        setErrorAlertText(msg);
        setBorderColor(COLORS.MAIN);
        setUserCredential('');
      } else if (!isNetworkError) {
        Alert.alert(APP_CONSTANTS.ALASKA_COMMERCIAL, APP_CONSTANTS.SOME_THING_WENT_WRONG, [{text: 'Ok'}]);
      }
    }
  };

  const renderHeaderAndSubHeader = () => (
    <>
      <Text allowFontScaling={false} style={styles.subtitle}>{APP_CONSTANTS.PASSWORD_RECOVERY}</Text>
      <View style={styles.marginTop}>
        <Text allowFontScaling={false} style={styles.instructionText}>{APP_CONSTANTS.FORGOT_PASS_INSTRUCTIONS}</Text>
      </View>
    </>
  );

  const renderErrorView = () => (
    <View style={styles.errorStyle}>
      <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
    </View>
  );

  const renderInput = () => (
    <View style={styles.inputFieldWrapper}>
      <Input
        autoComplete={'email'}
        textContentType={'emailAddress'}
        autoCapitalize="none"
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
        maxLength={maxInputLength}
        inPutWidth={wp('90%')}
        borderWidth={1}
        borderColor={borderColor}
        placeholder={'Enter Email Address or Phone Number'}
        onChangeText={text => {
          setUserCredential(text.trim());
          setBorderColor(COLORS.GRAY_4);
          setErrorAlertText('');
        }}
        value={userCredential}
      />
    </View>
  );

  const renderButton = () => (
    <View
      style={[
        styles.btnWrapper,
        {
          backgroundColor: btnDisable ? COLORS.DISABLE_BUTTON_COLOR : COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button label={APP_CONSTANTS.SEND} color="white" width="90%" disabled={btnDisable} onPress={submit} />
    </View>
  );
  return (
    <ScreenWrapperComponent
      isAuthHeader
      withHeader
      withBackButton
      headerTitle={APP_CONSTANTS.FORGOT_PASS_HEADER}
      isKeyboardAwareScrollView
      isLoading={isLoading}>
      <View style={styles.wrapper}>
        {renderHeaderAndSubHeader()}
        {renderErrorView()}
        {renderInput()}
        {renderButton()}
      </View>
    </ScreenWrapperComponent>
  );
};
export default ForgotPassword;
