import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import isEmail from 'validator/lib/isEmail';

//static imports
import {COLORS} from '../../theme';
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {
  saveLoginInfo,
  toggleNetworkErrorDialog,
} from '../../redux/actions/general';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  guestSignup,
  login,
  sendFcmTokenToServer,
} from '../../services/ApiCaller';
import {
  ASYNC_STORAGE_KEYS,
  DEFAULT_USER_KEYS,
  DEFAULT_USERS,
  ENVIRONMENTS,
  ERROR_TYPES,
  GLEAP_TOKEN,
  KEYBOARD_FEATURES,
} from '../../constants/Common';
import DialogBox from '../../components/DialogBox';
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {TestPaymentsModal} from '../../components/TestPaymentsModal';
import ImageComponent from '../../components/ImageComponent';
import {
  goBack,
  navigateTo,
  resetAndNavigate,
} from '../../utils/navigationUtils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {logToConsole} from '../../configs/ReactotronConfig';
import Analytics from '../../utils/analyticsUtils';
import {ANALYTICS_EVENTS} from '../ShoppingCartPickup/Constants';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import {
  handleBiometricLogin,
  handleBiometrics,
  promptForBiometrics,
} from '../../utils/biometricsUtils';
import {STATUSES} from '../../constants/Api';
import {getFCMUniqueId} from '../../utils/helperUtils';
import ACCLogo from '../../assets/svgs/ACCLogo';
import Config from 'react-native-config';
import useDeviceInfo from '../../hooks/useDeviceInfo';

const LoginScreen = ({navigation, route}) => {
  const [state, setState] = useState({userEmail: '', userPassword: ''});
  const [randomId, setRandomId] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [borderColor, setBorderColor] = useState(COLORS.GRAY_4);
  const [emailBorderColor, setEmailBorderColor] = useState(COLORS.GRAY_4);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [isTestPaymentsModal, setIsTestPaymentsModal] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [apiErrorTitle, setApiErrorTitle] = useState('');
  const [biometrics, setBiometrics] = useState('');

  const {showHeader = false} = route.params ?? {};

  // const {isNetworkErrorDialogVisible, networkErrorData, isOnboarded} =
  //   useSelector(
  //     ({
  //       config: {isOnboarded} = {},
  //       general: {isNetworkErrorDialogVisible, networkErrorData} = {},
  //     }) => ({
  //       isNetworkErrorDialogVisible,
  //       networkErrorData,
  //       isOnboarded,
  //     }),
  //   );

  const isNetworkErrorDialogVisibleSelector = useMemo(
    () => state => state.general?.isNetworkErrorDialogVisible,
    [],
  );

  const networkErrorDataSelector = useMemo(
    () => state => state.general?.networkErrorData,
    [],
  );

  const isOnboardedSelector = useMemo(
    () => state => state.config?.isOnboarded ?? false,
    [],
  );

  const isNetworkErrorDialogVisible = useSelector(
    isNetworkErrorDialogVisibleSelector,
  );
  const networkErrorData = useSelector(networkErrorDataSelector);
  const isOnboarded = useSelector(isOnboardedSelector);

  // logToConsole({networkErrorData, isOnboarded});

  //Get Random Id for guest user
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const id = await getFCMUniqueId();
      setRandomId(id);
    }
    fetchData();

    // AsyncStorage.getItem(ASYNC_STORAGE_KEYS.UNIQUE_ID).then(id => {
    //   if (id) {
    //     setRandomId(id);
    //   } else {
    //     const uniqueId = uuid.v4();
    //     setRandomId(uniqueId);
    //     AsyncStorage.setItem(ASYNC_STORAGE_KEYS.UNIQUE_ID, uniqueId);
    //   }
    // });
  }, []);

  useEffect(() => {
    if (Config.ENV === ENVIRONMENTS.DEV) {
      setDefaultCredentials();
    }
    handleBiometrics().then(setBiometrics);
  }, []);

  useEffect(() => {
    const {userEmail, userPassword} = state;
    if (validate(userEmail) && userPassword.trim().length > 0) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [state]);

  const onQuadrupleTapEvent = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setIsTestPaymentsModal(true);
    }
  };

  const toggleApiErrorDialog = useCallback(
    () => setIsApiErrorDialogVisible(prevState => !prevState),
    [],
  );

  const toggleEyeButton = useCallback(
    () => setVisiblePassword(prevState => !prevState),
    [],
  );

  const closeApiErrorDialog = () => {
    dispatch(toggleNetworkErrorDialog({visible: false, error: {}}));
  };

  const closeTestPaymentsDialog = () => setIsTestPaymentsModal(false);

  const focusPasswordInput = useCallback(
    () => passwordInput.current?.focus(),
    [],
  );

  const passwordInput = useRef(null);
  const dispatch = useDispatch();

  // Just for dev ease
  const setDefaultCredentials = () => {
    setState(DEFAULT_USERS[DEFAULT_USER_KEYS.ALIZA]);
  };

  const actionsOnChangeText = (key, value) => {
    setState({...state, [key]: value.trim()});
    if (key === 'userEmail' && errorAlertText) {
      setEmailBorderColor(COLORS.GRAY_4);
      setErrorAlertText('');
    }
    setErrorAlertText('');
    setBorderColor(COLORS.GRAY_4);
    setEmailBorderColor(COLORS.GRAY_4);
  };

  // validate user entered email
  const validate = text => {
    if (!isEmail(text)) {
      setBtnDisable(true);
      return false;
    }
    return true;
  };

  const validateEmail = useCallback(() => {
    const email = state?.userEmail?.trim?.() || '';
    if (email.length >= 1) {
      if (!isEmail(email)) {
        setEmailBorderColor(COLORS.MAIN);
        setErrorAlertText(APP_CONSTANTS.LOGIN_EMAIL_ERROR);
        setBtnDisable(true);
      }
    }
  }, [state.userEmail]);

  const handleGuestScenario = () => {
    return goBack();
    // return resetAndNavigate('BottomTabs', 1);
  };

  const deviceInformation = useDeviceInfo();

  const loginUser = async (
    email = state?.userEmail,
    password = state?.userPassword,
    isBiometry,
  ) => {
    try {
      setIsLoading(true);
      const {response = {}} = await login({
        Email: email,
        Password: password,
        deviceInfo: deviceInformation,
      });
      let {
        ok = false,
        isNetworkError = false,
        isUnderMaintenance = false,
      } = response ?? {};
      if (!ok) {
        const {data: {msg = ''} = {}} = response || {};
        setIsLoading(false);
        if (msg) {
          setApiErrorTitle(APP_CONSTANTS.AUTHENTICATION_ERROR);
          setErrorAlertText(msg);
          setEmailBorderColor(COLORS.MAIN);
          setBorderColor(COLORS.MAIN);
        } else {
          if (isUnderMaintenance) {
            setIsApiErrorDialogVisible(false);
          } else if (!isNetworkError) {
            setApiErrorTitle(APP_CONSTANTS.ALASKA_COMMERCIAL);
            setApiErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
            toggleApiErrorDialog();
          }
        }
      } else {
        //login success
        const {data: {token: Token = '', refreshToken, User = {}} = {}} =
          response || {};

        const {
          ZipCode = '',
          Store = '',
          _id = '',
          OrderType = '',
          isEmailVerified,
          Email,
          PhoneNumber,
          FullName,
        } = User || {};
        const {username: bioEmail = '', password: bioPassword} =
          biometrics || {};
        if (!isBiometry && (email !== bioEmail || password !== bioPassword)) {
          promptForBiometrics({username: email, password, dispatch});
        }
        // Only if logged-in user does not have store and zipcode selected
        if (!ZipCode.length && !Store.length) {
          const loginInfo = {
            userToken: null,
            refreshToken,
            userId: null,
            userInfo: User,
          };
          await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_TOKEN, Token);
          dispatch(saveLoginInfo(loginInfo));
          return navigateTo('CreateAccountZipcode');
        }
        //Normal Flow i.e. zip code and store is already selected
        const loginInfo = {
          userToken: Token,
          refreshToken,
          userId: _id,
          userInfo: User,
        };
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_TOKEN, Token);
        await sendFcmTokenToServer();
        dispatch(saveLoginInfo(loginInfo));
        MixPanelInstance.trackSignIn(User);
        if (!isEmailVerified) {
          resetAndNavigate('EmailVerification');
          return;
        }
        if (!isOnboarded) {
          resetAndNavigate('OnBoarding');
          return;
        }

        //If user is coming to log in screen after continuing as a guest
        !!showHeader && handleGuestScenario();
        Analytics.logLogin(ANALYTICS_EVENTS.LOGIN, {
          FullName,
          PhoneNumber,
          Email,
        });
      }
    } catch (e) {
      logToConsole({e, message: e.message});
    } finally {
      setIsLoading(false);
    }
  };

  const retryLogin = () => {
    toggleApiErrorDialog();
    setTimeout(loginUser, 220);
  };

  const createAnAccount = () => {
    navigateTo('CreateAccount', {
      showHeader,
    });
  };

  /*  If user is already a guest then
   *   user will be navigated back  otherwise
   *   a new guest will be signed up with a unique randomId */
  const signupAsGuest = async () => {
    if (showHeader) {
      return navigation.pop();
    }
    setIsLoading(true);
    const {response = {}} = await guestSignup({
      isGuest: true,
      FCM: randomId,
      deviceInfo: deviceInformation,
    });
    const {
      ok = false,
      status = 0,
      isNetworkError = false,
      isUnderMaintenance = false,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {token = '', user: User = {}} = {}} = response ?? {};
      const {_id = '', ZipCode = ''} = User ?? {};
      MixPanelInstance.trackSignIn(User);
      Analytics.logEvent(ANALYTICS_EVENTS.GUEST_LOGIN);
      if (ZipCode) {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_TOKEN, token);
        const loginInfo = {
          userToken: token,
          userId: _id,
          userInfo: User,
        };
        setIsLoading(false);
        logToConsole({loginInfo});
        dispatch(saveLoginInfo(loginInfo));
        if (!isOnboarded) {
          resetAndNavigate('OnBoarding');
        }
        return;
      }

      /*  If Zipcode is not found in user's info
       *   App will navigate user to CreateAccountZipCode Screen
       *   for zip code selection process */

      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TOKEN_BEFORE_LOGIN, token);
      const loginInfo = {
        userToken: null,
        userId: null,
        userInfo: User,
      };
      dispatch(saveLoginInfo(loginInfo));
      navigateTo('CreateAccountZipcode', {
        token,
        User,
      });
    } else {
      if (isUnderMaintenance) {
        setIsLoading(false);
        setIsApiErrorDialogVisible(false);
      } else if (!isNetworkError) {
        setApiErrorTitle(APP_CONSTANTS.ALASKA_COMMERCIAL);
        setApiErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
        toggleApiErrorDialog();
      }
    }
    setIsLoading(false);
  };

  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={toggleApiErrorDialog}
        title={apiErrorTitle}
        message={apiErrorMessage}
        messageContainerStyles={{marginTop: 5}}
        isSingleButton
        onCancelPress={toggleApiErrorDialog}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={retryLogin}
        cancelButtonLabel={APP_CONSTANTS.OK}
      />
    );
  };

  const apiErrorTypeMessage = !isNetworkErrorDialogVisible
    ? ''
    : networkErrorData?.type === ERROR_TYPES.ACCOUNT_DEACTIVATED
    ? APP_CONSTANTS.ACCOUNT_DEACTIVATED_TEXT
    : networkErrorData?.msg || APP_CONSTANTS.SOME_THING_WENT_WRONG;

  const renderLogoView = () => (
    <TapGestureHandler
      maxDelayMs={1000}
      onHandlerStateChange={onQuadrupleTapEvent}
      numberOfTaps={4}>
      <View style={styles.LogoView}>
        {/*<ImageComponent source={IMAGES.LOGO} style={styles.Logo} resizeMode={"contain"}/>*/}
        <ACCLogo />
      </View>
    </TapGestureHandler>
  );

  const renderInputsView = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>
        <View style={styles.inputWrapper}>
          <Text allowFontScaling={false} style={styles.signinText}>{APP_CONSTANTS.LOGIN}</Text>
          <View style={styles.errorStyle}>
            <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
          </View>
          <Input
            autoComplete="email"
            textContentType="username"
            keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
            value={state.userEmail}
            maxLength={150}
            autoCapitalize={KEYBOARD_FEATURES.autoCapitalizeTypes.none}
            placeholder={APP_CONSTANTS.EMAIL}
            onChangeText={text => actionsOnChangeText('userEmail', text)}
            autoCorrect
            onBlur={validateEmail}
            borderColor={emailBorderColor}
            onSubmitEditing={focusPasswordInput}
          />
          <Input
            autoComplete="password"
            textContentType="password"
            inputRef={passwordInput}
            placeholder={APP_CONSTANTS.PASSWORD}
            value={state.userPassword}
            borderColor={borderColor}
            autoCapitalize={KEYBOARD_FEATURES.autoCapitalizeTypes.none}
            onChangeText={text => actionsOnChangeText('userPassword', text)}
            secureTextEntry={visiblePassword}
            showEye
            onEyeButtonPress={toggleEyeButton}
            returnKeyType={KEYBOARD_FEATURES.returnKeyTypes.go}
            blurOnSubmit
            onSubmitEditing={() => {
              if (!btnDisable) {
                loginUser();
              }
            }}
          />
        </View>
        {renderForgotPasswordTextView()}
        {renderSigninButton()}
        {renderFaceIDButton()}
        <View style={styles.dividerContainer}>{renderDivider()}</View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderForgotPasswordTextView = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigateTo('ForgotPassword')}
      style={styles.forgotPassword}>
      <Text allowFontScaling={false} style={styles.forgotPasswordText}>{APP_CONSTANTS.FORGOT_PASS}</Text>
    </TouchableOpacity>
  );

  const renderSigninButton = () => (
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
        label={APP_CONSTANTS.SIGN_IN}
        color="white"
        width="90%"
        disabled={btnDisable}
        onPress={() => loginUser()}
      />
    </View>
  );
  const renderFaceIDButton = () => {
    const {biometryType, username, password, biometryName, biometryIcon} =
      biometrics || {};
    if (biometryType && username && password) {
      return (
        <TouchableOpacity
          onPress={() => handleBiometricLogin(loginUser)}
          activeOpacity={0.8}
          style={styles.biometricsContainer}>
          <ImageComponent
            resizeMode={'contain'}
            source={biometryIcon}
            style={styles.biometricsIcon}
          />
          <Text allowFontScaling={false} style={styles.biometricsName}>{biometryName}</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderDivider = () => <View style={styles.divider} />;

  const renderContinueAsGuestButton = () => (
    <View style={[styles.btnWrapper, styles.guestButton]}>
      <Button
        label={APP_CONSTANTS.GUEST}
        color="white"
        width="90%"
        onPress={signupAsGuest}
      />
    </View>
  );

  const renderCreateAccountTextView = () => (
    <View style={styles.notMemberWrapper}>
      <Text allowFontScaling={false} onPress={createAnAccount} style={styles.notMember}>
        {APP_CONSTANTS.NOT_MEMBER_TEXT}
        <Text allowFontScaling={false} style={styles.forgotPasswordText}>
          {APP_CONSTANTS.CREATE_NEW_ACC}
        </Text>
      </Text>
    </View>
  );

  const renderPaymentsModal = () => {
    return (
      <TestPaymentsModal
        isVisible={isTestPaymentsModal}
        closeDialog={closeTestPaymentsDialog}
      />
    );
  };

  const renderNetworkErrorDialog = () => {
    return (
      <DialogBox
        visible={
          isNetworkErrorDialogVisible &&
          !global.isForceUpdateModal &&
          !global.isUnderMaintenance
        }
        closeModal={closeApiErrorDialog}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
        message={apiErrorTypeMessage}
        messageContainerStyles={{marginTop: 5}}
        isSingleButton
        onCancelPress={closeApiErrorDialog}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={closeApiErrorDialog}
        cancelButtonLabel={APP_CONSTANTS.OK}
      />
    );
  };

  return (
    <ScreenWrapperComponent
      withBackButton={showHeader}
      isAuthHeader
      isLoading={isLoading}
      isScrollView
      isKeyboardAwareScrollView>
      {renderLogoView()}
      {renderInputsView()}
      {renderDivider()}
      {renderContinueAsGuestButton()}
      {renderCreateAccountTextView()}
      {renderApiErrorDialog()}
      {renderPaymentsModal()}
      {renderNetworkErrorDialog()}
    </ScreenWrapperComponent>
  );
};
export default LoginScreen;
