/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInputMask} from 'react-native-masked-text';

//Static Imports
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS, IMAGES} from '../../theme';
import {sendFcmTokenToServer, signup} from '../../services/ApiCaller';
import {saveLoginInfo} from '../../redux/actions/general';
import {formatNumberForBackend} from '../../utils';
import {BLOB_URLS, STATUSES} from '../../constants/Api';
import {createListForUser, getListName} from '../../utils/listUtils';
import {
  ASYNC_STORAGE_KEYS,
  KEYBOARD_FEATURES,
  passwordRegex,
  userNameRegex,
} from '../../constants/Common';
import DialogBox from '../../components/DialogBox';
import {navigateTo, resetAndNavigate} from '../../utils/navigationUtils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import Analytics from '../../utils/analyticsUtils';
import {ANALYTICS_EVENTS} from '../ShoppingCartPickup/Constants';
import isEmail from 'validator/lib/isEmail';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import {logToConsole} from '../../configs/ReactotronConfig';
import ImageComponent from '../../components/ImageComponent';
import useDeviceInfo from '../../hooks/useDeviceInfo';

const CreateAccount = ({route}) => {
  const [state, setState] = useState({
    userNewPassword: '',
    userConfirmNewPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  });
  const [isNotificationsAllowed, setIsNotificationsAllowed] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [emailErrorAlertText, setEmailErrorAlertText] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const [borderColor, setBorderColor] = useState(COLORS.GRAY_4);
  const [emailBorderColor, setEmailBorderColor] = useState(COLORS.GRAY_4);
  const [instructionTextColor, setInstructionTextColor] = useState(
    COLORS.GRAY_5,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(true);

  //Refs
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const contactInput = useRef(null);

  //Input states destructuring
  const {
    firstName = '',
    lastName = '',
    email = '',
    contactNumber = '',
    userConfirmNewPassword = '',
    userNewPassword = '',
  } = state ?? {};

  //Redux state destructuring
  // const {
  //   loginInfo: {userInfo = {}},
  //   listItems,
  // } = useSelector(({general}) => general);

  const userInfoSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo ?? {},
    [],
  );

  const listItemsSelector = useMemo(
    () => state => state.general?.listItems ?? [],
    [],
  );

  const userInfo = useSelector(userInfoSelector);
  const listItems = useSelector(listItemsSelector);

  //Redux dispatch
  const dispatch = useDispatch();

  //Route params
  const {showHeader = false} = route.params ?? {};

  //Validating inputs
  useEffect(() => {
    if (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      contactNumber.trim().length === 14 &&
      userNewPassword.length >= 8 &&
      userConfirmNewPassword.length >= 8 &&
      agreeToTerms === true &&
      errorAlertText?.length === 0 &&
      isEmail(state.email)
    ) {
      return setBtnDisable(false);
    }
    return setBtnDisable(true);
  }, [
    firstName,
    lastName,
    email,
    contactNumber,
    userNewPassword,
    userConfirmNewPassword,
    agreeToTerms,
    errorAlertText,
  ]);

  const toggleVisiblePasswordEyeButton = useCallback(() => {
    setVisiblePassword(prevState => !prevState);
  }, [visiblePassword]);

  const toggleVisibleConfirmPasswordEyeButton = useCallback(() => {
    setVisibleConfirmPassword(prevState => !prevState);
  }, [visibleConfirmPassword]);

  const focusLastNameInput = useCallback(
    () => lastNameInput.current?.focus(),
    [],
  );
  const focusContactInput = useCallback(
    () => contactInput.current?._inputElement?.focus(),
    [],
  );
  const focusEmailInput = useCallback(() => emailInput.current?.focus(), []);
  const focusNewPasswordInput = useCallback(
    () => passwordInput.current?.focus(),
    [],
  );
  const focusConfirmPasswordInput = useCallback(
    () => confirmPasswordInput.current?.focus(),
    [],
  );

  //Validating email
  const validateEmail = useCallback(() => {
    if (email.trim().length) {
      if (!isEmail(state.email)) {
        setEmailBorderColor(COLORS.MAIN);
        setEmailErrorAlertText(APP_CONSTANTS.SIGNUP_EMAIL_ERROR);
        setBtnDisable(true);
      }
    }
  }, [email]);

  //saving input state values
  const actionsOnChangeText = (key, value) => {
    if (key === 'firstName') {
      if (value.match(userNameRegex)) {
        setState({...state, [key]: value.trim()});
      }
    } else if (key === 'lastName') {
      if (value.match(userNameRegex)) {
        setState({...state, [key]: value.trim()});
      }
    } else {
      setState({...state, [key]: value.trim()});
      setErrorAlertText('');
      setInstructionTextColor(COLORS.GRAY_5);
      setBorderColor(COLORS.GRAY_4);
      if (key === 'email') {
        setEmailBorderColor(COLORS.GRAY_4);
        setEmailErrorAlertText('');
      }
    }
  };

  const deviceInformation = useDeviceInfo();

  const processSignupFlow = async () => {
    Keyboard.dismiss();
    if (btnDisable) {
      return;
    }
    if (isApiErrorDialogVisible) {
      setIsApiErrorVisible(false);
    }
    const uniqueId = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.UNIQUE_ID);
    if (userNewPassword !== userConfirmNewPassword) {
      setErrorAlertText(APP_CONSTANTS.PASS_NO_MATCH);
      setBorderColor(COLORS.MAIN);
      return setBtnDisable(true);
    }
    if (
      !userNewPassword.match(passwordRegex) ||
      !userConfirmNewPassword.match(passwordRegex)
    ) {
      setErrorAlertText(APP_CONSTANTS.PASS_REQ_ERR);
      setInstructionTextColor(COLORS.MAIN);
      setBorderColor(COLORS.MAIN);
      return setBtnDisable(true);
    }
    setIsLoading(true);
    const signupData = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: formatNumberForBackend(contactNumber),
      Password: userNewPassword,
      FCM: showHeader ? uniqueId : '',
      InAppNotification: isNotificationsAllowed,
      OrderNotification: false,
      EmailNotification: isNotificationsAllowed,
      TextNotification: isNotificationsAllowed,
      deviceInfo: deviceInformation,
    };

    const {response = {}} = await signup(signupData);
    const {
      ok = false,
      status,
      isNetworkError,
      isUnderMaintenance = false,
    } = response;
    if (ok && status === STATUSES.OK) {
      const {data: {token: Token = ''} = {}} = response || {};
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_EMAIL, email);
      await AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.TOKEN_BEFORE_LOGIN,
        Token,
      ).then(async () => {
        let listName = getListName();
        await createListForUser(listName, dispatch, listItems);
      });
      Analytics.logSignUp(ANALYTICS_EVENTS.SIGNUP, {
        Email: email,
      });
      if (showHeader) {
        return await processAccountInformationForGuest(response);
      }
      return await processAccountInformationForNormalUser(response);
    }

    if (isUnderMaintenance) {
      setIsLoading(false);
    } else if (!isNetworkError) {
      setIsLoading(false);
      handleApiErrors(status, response);
    }
  };

  //If user is creating account after continuing as guest
  const processAccountInformationForGuest = async response => {
    const {
      data: {token: Token = '', refreshToken, User = {}},
    } = response || {};
    const {_id} = User;

    const loginInfo = {
      userToken: Token,
      refreshToken,
      userId: _id,
      userInfo: User,
    };
    dispatch(saveLoginInfo(loginInfo));
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.UNIQUE_ID);
    await sendFcmTokenToServer();
    setIsLoading(false);
    MixPanelInstance.trackSignUp(User);
    resetAndNavigate('EmailVerification');
  };

  //If user follows the normal flow of signup
  const processAccountInformationForNormalUser = async response => {
    const {
      data: {User = {}, refreshToken},
    } = response || {};
    const {_id = ''} = User ?? {};
    const loginInfo = {
      userToken: null,
      refreshToken,
      userId: _id,
      userInfo: User,
    };
    dispatch(saveLoginInfo(loginInfo));
    resetAndNavigate('CreateAccountZipcode');
    setIsLoading(false);
  };

  //displaying error dialogs
  const handleApiErrors = (status, response) => {
    setIsLoading(false);
    if (status === STATUSES.BAD_REQUEST) {
      const {
        data: {msg = ''},
      } = response ?? {};
      setErrorTitle(APP_CONSTANTS.ACCOUNT_ALREADY_EXISTS);
      setErrorMessage(msg);
    } else {
      setErrorTitle(APP_CONSTANTS.ALASKA_COMMERCIAL);
      setErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
    }
    setIsApiErrorVisible(true);
  };

  const toggleAllowNotificationsBool = () => {
    setIsNotificationsAllowed(!isNotificationsAllowed);
  };

  const onOpenLink = useCallback(URL => navigateTo('WebView', {url: URL}), []);

  const renderCreateAccountHeaderText = () => (
    <Text allowFontScaling={false} style={styles.subtitle}>{APP_CONSTANTS.CREATE_ACCOUNT}</Text>
  );

  const renderPasswordRequirementView = () => (
    <View style={styles.marginTop}>
      <Text allowFontScaling={false} style={[
          styles.passwordSettingInstructionText,
          instructionTextColor && {color: instructionTextColor},
        ]}>
        {APP_CONSTANTS.SIGNUP_PASSWORD_REQUIREMENT}
      </Text>
    </View>
  );

  const renderInputsContainer = () => (
    <View style={styles.marginTop1}>
      <Input
        autoComplete={'name-given'}
        textContentType={'givenName'}
        placeholder={APP_CONSTANTS.F_NAME}
        onChangeText={text => actionsOnChangeText('firstName', text)}
        value={firstName}
        onSubmitEditing={focusLastNameInput}
      />
      <Input
        autoComplete={'name-family'}
        textContentType={'familyName'}
        placeholder={APP_CONSTANTS.L_NAME}
        inputRef={lastNameInput}
        onChangeText={text => actionsOnChangeText('lastName', text)}
        value={lastName}
        onSubmitEditing={focusEmailInput}
      />
      <Input
        autoComplete={'email'}
        textContentType={'emailAddress'}
        placeholder={APP_CONSTANTS.EMAIL_ADDRESS}
        inputRef={emailInput}
        onChangeText={text => actionsOnChangeText('email', text)}
        value={email}
        maxLength={150}
        onSubmitEditing={focusContactInput}
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
        onBlur={validateEmail}
        borderColor={emailBorderColor}
        autoCapitalize={KEYBOARD_FEATURES.autoCapitalizeTypes.none}
      />
      {renderMaskedInput()}
      {renderErrorTextView()}
      <Input
        autoComplete={'password-new'}
        textContentType={'newPassword'}
        placeholder={APP_CONSTANTS.PASSWORD}
        inputRef={passwordInput}
        onChangeText={text => actionsOnChangeText('userNewPassword', text)}
        value={userNewPassword}
        onSubmitEditing={focusConfirmPasswordInput}
        borderColor={borderColor}
        autoCapitalize={KEYBOARD_FEATURES.autoCapitalizeTypes.none}
        secureTextEntry={visiblePassword}
        showEye
        autoCorrect={false}
        blurOnSubmit={false}
        onEyeButtonPress={toggleVisiblePasswordEyeButton}
      />
      <Input
        autoComplete={'password-new'}
        textContentType={'newPassword'}
        placeholder={APP_CONSTANTS.CONFIRM_PASS}
        inputRef={confirmPasswordInput}
        onChangeText={text =>
          actionsOnChangeText('userConfirmNewPassword', text)
        }
        value={userConfirmNewPassword}
        onSubmitEditing={processSignupFlow}
        borderColor={borderColor}
        autoCapitalize={KEYBOARD_FEATURES.autoCapitalizeTypes.none}
        secureTextEntry={visibleConfirmPassword}
        showEye
        autoCorrect={false}
        blurOnSubmit={false}
        onEyeButtonPress={toggleVisibleConfirmPasswordEyeButton}
        returnKeyType={KEYBOARD_FEATURES.returnKeyTypes.done}
      />
      <View style={styles.marginTop}>
        {renderAllowNotificationsCheck()}
        {renderAlreadyHaveAccountView()}
      </View>
    </View>
  );

  const renderMaskedInput = () => (
    <View style={[styles.phoneInputView, {borderColor: COLORS.GRAY_4}]}>
      <TextInputMask
          allowFontScaling={false}
        ref={contactInput}
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
        autoComplete={'tel-national'}
        textContentType={'none'}
        maxLength={14}
        type={'custom'}
        options={{
          mask: KEYBOARD_FEATURES.maskTypes.usPhoneFormat,
        }}
        value={contactNumber}
        onChangeText={text => actionsOnChangeText('contactNumber', text)}
        placeholder={APP_CONSTANTS.PHONE_NUM}
        placeholderTextColor={COLORS.GRAY_4}
        returnKeyType={'done'}
        onSubmitEditing={focusNewPasswordInput}
        style={styles.phoneInput}
      />
    </View>
  );

  const renderErrorTextView = () => {
    if (errorAlertText) {
      return (
        <View style={styles.errorStyle}>
          <Text allowFontScaling={false} style={styles.errorText}>
            {errorAlertText || emailErrorAlertText}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderAllowNotificationsCheck = () => (
    <TouchableOpacity
      hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
      onPress={toggleAllowNotificationsBool}>
      <View style={styles.checkboxWrapper}>
        <View>
          <ImageComponent
            source={
              isNotificationsAllowed
                ? IMAGES.SELECTED_CHECK_BOX
                : IMAGES.UNSELECTED_CHECK_BOX
            }
            style={{width: 15, height: 15}}
          />
        </View>

        <Text allowFontScaling={false} style={styles.bottomTextStyle}>
          {APP_CONSTANTS.COUPONS_AND_DEALS}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAlreadyHaveAccountView = () => (
    <View style={styles.termsWrapper}>
      <TouchableOpacity
        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
        onPress={() => setAgreeToTerms(!agreeToTerms)}>
        <View>
          <ImageComponent
            source={
              agreeToTerms
                ? IMAGES.SELECTED_CHECK_BOX
                : IMAGES.UNSELECTED_CHECK_BOX
            }
            style={{width: 15, height: 15}}
          />
        </View>


      <Text allowFontScaling={false} style={[styles.bottomTextStyle, {marginTop: -20,marginStart:25}]}>
        {APP_CONSTANTS.AGREEMENT}
        <Text allowFontScaling={false} style={styles.underLinedText} onPress={() => onOpenLink(BLOB_URLS.TERM_OF_USE)}>
          {APP_CONSTANTS.TERMS}
        </Text>
        {APP_CONSTANTS.AND}
        <Text allowFontScaling={false} style={styles.underLinedText}
            onPress={() => onOpenLink(BLOB_URLS.PRIVACY_POLICY)}>
            {APP_CONSTANTS.PRIVACY_POLICY}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContinueButton = () => (
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
        label={APP_CONSTANTS.CONTINUE}
        color={COLORS.WHITE}
        width="90%"
        disabled={btnDisable}
        onPress={processSignupFlow}
      />
    </View>
  );

  const renderErrorDialog = () => (
    <DialogBox
      visible={isApiErrorDialogVisible}
      title={errorTitle}
      message={errorMessage}
      messageContainerStyles={{marginTop: 5}}
      isSingleButton
      closeModal={() => setIsApiErrorVisible(false)}
    />
  );

  return (
    <ScreenWrapperComponent
      isLoading={isLoading}
      isAuthHeader
      withBackButton
      headerTitle={APP_CONSTANTS.CREATE_ACCOUNT}
      isScrollView={false}
      isKeyBoardAwareScrollView>
      <View style={styles.wrapper}>
        {renderCreateAccountHeaderText()}
        {renderPasswordRequirementView()}
        {renderInputsContainer()}
        {renderContinueButton()}
      </View>
      {renderErrorDialog()}
    </ScreenWrapperComponent>
  );
};
export default CreateAccount;
