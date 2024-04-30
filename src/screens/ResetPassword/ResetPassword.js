/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Text, TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';

import {COLORS} from '../../theme';
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {changePassword, resetPassword} from '../../services/ApiCaller';
import {APP_CONSTANTS} from '../../constants/Strings';
import AuthenticationErrorDialog from '../../components/AuthenticationErrorDialog';
import DialogBox from '../../components/DialogBox';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {KEYBOARD_FEATURES, passwordRegex} from '../../constants/Common';
import {STATUSES} from '../../constants/Api';

const ResetPassword = ({navigation, route}) => {
  const {comingFrom = ''} = route.params ?? {};
  const [state, setState] = useState({
    userNewPassword: '',
    userConfirmNewPassword: '',
  });
  const instructionColor =
    comingFrom === 'Profile' ? COLORS.GRAY_6 : COLORS.GRAY_5;
  const [loading, setLoading] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const [borderColor, setBorderColor] = useState(COLORS.GRAY0_15);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(true);
  const [isVisibleSuccessDialog, setIsVisibleSuccessDialog] = useState(false);
  const [isVisibleErrorDialog, setIsVisibleErrorDialog] = useState(false);
  const [instructionTextColor, setInstructionTextColor] =
    useState(instructionColor);

  const passwordInput = useRef(null);

  const toggleErrorDialog = () =>
    setIsVisibleErrorDialog(prevState => !prevState);

  const toggleSuccessDialog = () =>
    setIsVisibleSuccessDialog(prevState => !prevState);

  // const {
  //   loginInfo: {userId = ''},
  // } = useSelector(({general: {loginInfo = {}} = {}}) => ({loginInfo}));

  const userIdSelector = useMemo(
    () => state => state.general?.loginInfo?.userId ?? '',
    [],
  );

  const userId = useSelector(userIdSelector);

  useEffect(() => {
    validatePasswords();
  }, [state]);

  function actionsOnChangeText(key, value) {
    setState({...state, [key]: value.trim()});
    setErrorAlertText('');
    setInstructionTextColor(instructionColor);
    setBorderColor(COLORS.GRAY_4);
  }

  const validatePasswords = () => {
    if (
      state.userNewPassword.length >= 7 &&
      state.userConfirmNewPassword.length >= 7 &&
      errorAlertText.length === 0
    ) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  const changeUserPassword = async () => {
    setTimeout(() => setLoading(true), 120);
    const {userNewPassword = ''} = state ?? {};
    let apiParams = {
      _id: userId,
      Password: userNewPassword,
    };
    const {response = {}} = await changePassword(apiParams);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      setLoading(false);
      toggleSuccessDialog();
    } else if (isUnderMaintenance) {
      setIsVisibleErrorDialog(false);
    } else if (!isNetworkError) {
      toggleErrorDialog();
    }
    setLoading(false);
  };

  const resetUserPassword = async () => {
    const {userCredential = '', isEmail = false} = route.params || {};
    let data;
    if (isEmail) {
      data = {
        Email: userCredential,
        Password: state.userNewPassword,
      };
    } else {
      let phoneNumber = userCredential.replace(/[^\d]/g, '');
      phoneNumber = '+1' + phoneNumber;
      data = {
        PhoneNumber: phoneNumber,
        Password: state.userNewPassword,
      };
    }
    const {response = {}} = await resetPassword(data);
    setLoading(false);
    const {ok = false} = response || {};
    if (ok) {
      toggleSuccessDialog();
    } else {
      const {
        data: {msg = ''} = {},
        isNetworkError,
        isUnderMaintenance,
      } = response ?? {};
      if (!isNetworkError && !isUnderMaintenance) {
        Alert.alert('Error', msg);
      }
    }
  };

  const submit = async () => {
    if (btnDisable) {
      return;
    }
    const {userNewPassword, userConfirmNewPassword} = state;
    if (userNewPassword === userConfirmNewPassword) {
      if (
        userNewPassword.match(passwordRegex) &&
        userConfirmNewPassword.match(passwordRegex)
      ) {
        setLoading(true);
        if (comingFrom === 'Profile') {
          await changeUserPassword();
        } else {
          await resetUserPassword();
        }
      } else {
        setErrorAlertText('Enter a password that meets the requirements');
        setInstructionTextColor(COLORS.MAIN);
        setBorderColor(COLORS.MAIN);
        setBtnDisable(true);
        setState({userConfirmNewPassword: '', userNewPassword: ''});
      }
    } else if (state.userNewPassword !== state.userConfirmNewPassword) {
      setErrorAlertText('Password does not match.');
      setBorderColor(COLORS.MAIN);
      setBtnDisable(true);
    }
  };

  const handelGoBack = () => {
    toggleSuccessDialog();
    navigation.popToTop();
  };

  const renderSubHeaders = () => {
    if (comingFrom === 'Profile') {
      return changePasswordSubHeaders();
    }
    return resetPasswordSubHeaders();
  };

  const changePasswordSubHeaders = () => (
    <>
      <Text allowFontScaling={false} style={styles.changePasswordHeader}>Change Password</Text>
      <View style={styles.marginTop}>
        <Text allowFontScaling={false} style={[styles.instructionText, {color: instructionTextColor}]}>
          {APP_CONSTANTS.CHANGE_PASSWORD_INSTRUCTIONS}
        </Text>
      </View>
      <View style={styles.marginTop}>
        <Text allowFontScaling={false} style={[styles.instructionText, {color: instructionTextColor}]}>
          {APP_CONSTANTS.SIGNUP_PASSWORD_REQUIREMENT}
        </Text>
      </View>
    </>
  );

  const resetPasswordSubHeaders = () => (
    <>
      <Text allowFontScaling={false} style={styles.subtitle}>Reset Password</Text>
      <View style={styles.marginTop}>
        <Text allowFontScaling={false} style={[styles.instructionText, {color: instructionTextColor}]}>
          {APP_CONSTANTS.RESET_PASSWORD_INSTRUCTIONS}
        </Text>
      </View>
      <View style={styles.marginTop}>
        <Text allowFontScaling={false} style={[styles.instructionText, {color: instructionTextColor}]}>
          {APP_CONSTANTS.SIGNUP_PASSWORD_REQUIREMENT}
        </Text>
      </View>
    </>
  );

  const renderErrorView = () => (
    <View style={styles.errorStyle}>
      <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
    </View>
  );

  //Following Extra TextInput is workaround to avoid password suggestions

  const renderInputs = () => (
    <View style={{paddingBottom: heightPercentageToDP('1.7%')}}>
      <TextInput allowFontScaling={false} />
      <Input
        autoComplete={'password-new'}
        textContentType={'newPassword'}
        placeholder={'New Password'}
        onChangeText={text => actionsOnChangeText('userNewPassword', text)}
        value={state.userNewPassword}
        borderColor={borderColor}
        secureTextEntry={visiblePassword}
        showEye
        autoCorrect={false}
        blurOnSubmit={false}
        onEyeButtonPress={() => setVisiblePassword(!visiblePassword)}
        onSubmitEditing={() => passwordInput.current.focus()}
      />
      <Input
        autoComplete={'password-new'}
        textContentType={'newPassword'}
        inputRef={passwordInput}
        placeholder={'Confirm New Password'}
        borderColor={borderColor}
        returnKeyType={KEYBOARD_FEATURES.returnKeyTypes.go}
        secureTextEntry={visibleConfirmPassword}
        showEye
        autoCorrect={false}
        blurOnSubmit={false}
        onEyeButtonPress={() =>
          setVisibleConfirmPassword(!visibleConfirmPassword)
        }
        onSubmitEditing={submit}
        onChangeText={text =>
          actionsOnChangeText('userConfirmNewPassword', text)
        }
        value={state.userConfirmNewPassword}
      />
    </View>
  );

  const renderSaveButton = () => (
    <View
      style={[
        styles.btnWrapper,
        {
          backgroundColor: btnDisable
            ? COLORS.DISABLE_BUTTON_COLOR
            : COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button
        label={
          route.params.comingFrom === 'Profile'
            ? APP_CONSTANTS.SAVE
            : 'Reset Password'
        }
        color={COLORS.WHITE}
        width="90%"
        disabled={btnDisable}
        onPress={submit}
      />
    </View>
  );

  const renderApiSuccessDialog = () => (
    <DialogBox
      visible={isVisibleSuccessDialog}
      closeModal={toggleSuccessDialog}
      title={APP_CONSTANTS.ALASKA_COMMERCIAL}
      messageContainerStyles={{marginTop: heightPercentageToDP('0.5%')}}
      message={APP_CONSTANTS.PAS_CHANGE_SUCCESS_MESSAGE}
      isSingleButton={true}
      cancelButtonLabel={APP_CONSTANTS.OK}
      onCancelPress={handelGoBack}
    />
  );

  const renderApiErrorDialog = () => (
    <AuthenticationErrorDialog
      visible={isVisibleErrorDialog}
      closeDialog={toggleErrorDialog}
      retry={changeUserPassword}
    />
  );

  return (
    <ScreenWrapperComponent
      isAuthHeader={comingFrom !== 'Profile'}
      withHeader
      withBackButton
      headerTitle={
        comingFrom === 'Profile' ? 'PASSWORD' : APP_CONSTANTS.FORGOT_PASS_HEADER
      }
      isKeyboardAwareScrollView
      isLoading={loading}>
      <View
        style={[
          styles.wrapper,
          comingFrom === 'Profile' && {backgroundColor: COLORS.WHITE},
        ]}>
        {renderSubHeaders()}
        {renderErrorView()}
        {renderInputs()}
        <View style={{backgroundColor: '#f4f4f4', width: '100%'}}>
          {renderSaveButton()}
        </View>
      </View>
      {renderApiSuccessDialog()}
      {renderApiErrorDialog()}
    </ScreenWrapperComponent>
  );
};
export default ResetPassword;
