import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../theme';
import {Button, TextField} from '../../components';
import {styles} from './styles';
import {
  ASYNC_STORAGE_KEYS,
  KEYBOARD_FEATURES,
  passwordRegex,
  userNameRegex,
} from '../../constants/Common';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TextInputMask} from 'react-native-masked-text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Input from '../../components/Input';
import {sendFcmTokenToServer, signup} from '../../services/ApiCaller';
import DialogBox from '../../components/DialogBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createListForUser, getListName} from '../../utils/listUtils';
import {
  changeSelectedSegment,
  saveLoginInfo,
  setDeliveryType,
} from '../../redux/actions/general';
import {formatPhoneNumber, formatNumberForBackend} from '../../utils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import Analytics from '../../utils/analyticsUtils';
import {ANALYTICS_EVENTS} from '../ShoppingCartPickup/Constants';
import {logToConsole} from '../../configs/ReactotronConfig';
import {isValidEmail} from '../../utils/validationUtils';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import {BLOB_URLS, STATUSES} from '../../constants/Api';
import useDeviceInfo from '../../hooks/useDeviceInfo';

const getInitialState = userInfo => {
  const {
    FirstName = '',
    LastName = '',
    Email = '',
    PhoneNumber = '',
  } = userInfo ?? {};
  return {
    firstName: FirstName ?? '',
    lastName: LastName ?? '',
    email: Email ?? '',
    contactNumber: formatPhoneNumber(PhoneNumber) ?? '',
    userConfirmNewPassword: '',
    userNewPassword: '',
  };
};
const ShoppingCartGuestCheckout = ({navigation}) => {
  const loginInfo = useSelector(state => state.general?.loginInfo ?? {});
  const listItems = useSelector(state => state.general?.listItems ?? []);
  const cartItems = useSelector(state => state.general?.cartItems ?? []);
  const guestSelectedSegmentIndex = useSelector(
    state => state.general?.guestSelectedSegmentIndex ?? 0,
  );

  const {userInfo: guestInfo = {}} = loginInfo ?? {};

  const [couponsCheck, setCouponsCheck] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [emailErrorAlertText, setEmailErrorAlertText] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const [borderColor, setBorderColor] = useState(COLORS.GRAY0_15);
  const [instructionTextColor, setInstructionTextColor] = useState(
    COLORS.GRAY_5,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(true);
  const [isRadioButtonSelected, setIsRadioButtonSelected] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [apiErrorTitle, setApiErrorTitle] = useState('');

  const [state, setState] = useState(() => getInitialState(guestInfo));
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const contactInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);

  const dispatch = useDispatch();

  const {
    firstName = '',
    lastName = '',
    email = '',
    contactNumber = '',
    userConfirmNewPassword = '',
    userNewPassword = '',
  } = state ?? {};

  const toggleApiErrorDialog = () =>
    setIsApiErrorDialogVisible(prevState => !prevState);

  const toggleRadioButton = () =>
    setIsRadioButtonSelected(prevState => !prevState);

  const validateEmail = () => {
    if (!checkIfEmailIsValid()) {
      setEmailErrorAlertText('Please enter a valid email');
    } else {
      setEmailErrorAlertText('');
    }
  };

  const setCoupons = () => {
    setCouponsCheck(prevState => !prevState);
  };

  const onOpenLink = useCallback(
    async URL => {
      navigation.navigate('WebView', {url: URL});
    },
    [URL],
  );

  useEffect(() => {
    if (
      (!isRadioButtonSelected && checkIfInputsEmpty()) ||
      !checkIfEmailIsValid()
    ) {
      return setBtnDisable(true);
    }
    if (isRadioButtonSelected) {
      if (checkIfSignupFieldsAreEmpty()) {
        return setBtnDisable(true);
      }
    }
    return setBtnDisable(false);
  }, [
    firstName,
    lastName,
    contactNumber,
    email,
    userConfirmNewPassword,
    userNewPassword,
    isRadioButtonSelected,
    agreeToTerms,
  ]);

  const checkIfInputsEmpty = () =>
    !firstName ||
    !lastName ||
    !contactNumber ||
    contactNumber.length < 14 ||
    !email;

  const checkIfSignupFieldsAreEmpty = () =>
    checkIfInputsEmpty() ||
    !userConfirmNewPassword ||
    !userConfirmNewPassword ||
    !agreeToTerms;

  const checkIfPasswordMatchToRequirements = () =>
    passwordRegex.test(userNewPassword);

  const checkIfPasswordMatches = () =>
    userNewPassword === userConfirmNewPassword;

  const checkIfEmailIsValid = () => isValidEmail(email?.trim?.());

  function actionsOnChangeText(key, value) {
    if (key === 'firstName') {
      if (value.match(userNameRegex)) {
        setState({...state, [key]: value.trim()});
      }
    } else if (key === 'lastName') {
      if (value.match(userNameRegex)) {
        setState({...state, [key]: value.trim()});
      }
    } else {
      setState({...state, [key]: value});
      setEmailErrorAlertText('');
      setErrorAlertText('');
      setInstructionTextColor(COLORS.GRAY_5);
      setBorderColor(COLORS.GRAY0_15);
      if (key === 'email') {
        setEmailErrorAlertText('');
      }
    }
  }

  const submit = async () => {
    try {
      if (!isRadioButtonSelected) {
        if (!checkIfEmailIsValid()) {
          emailInput?.current?.focus();
          return setEmailErrorAlertText('Please enter a valid email');
        }
        let customerInfo = {
          FirstName: firstName,
          LastName: lastName,
          FullName: `${firstName} ${lastName}`,
          PhoneNumber: formatNumberForBackend(contactNumber),
          Email: email,
        };
        let updatedInfo = {...guestInfo, ...customerInfo};
        let newLoginInfo = {...loginInfo, userInfo: updatedInfo};
        dispatch(saveLoginInfo(newLoginInfo));
      } else {
        await createAccountForUser();
      }
    } catch (e) {
      logToConsole({e, message: e?.message});
    }
  };
  const deviceInformation = useDeviceInfo();

  const createAccountForUser = async () => {
    const uniqueId = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.UNIQUE_ID);
    if (!checkIfEmailIsValid()) {
      emailInput?.current?.focus();
      return setEmailErrorAlertText('Please enter a valid email');
    }
    if (!checkIfPasswordMatchToRequirements()) {
      setInstructionTextColor(COLORS.MAIN);
      return setBorderColor(COLORS.MAIN);
    }
    if (!checkIfPasswordMatches()) {
      setErrorAlertText('Password does not match');
      return setBorderColor(COLORS.MAIN);
    }
    setIsLoading(true);
    let signupData = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: formatNumberForBackend(contactNumber),
      Password: userNewPassword,
      FCM: uniqueId,
      InAppNotification: couponsCheck,
      OrderNotification: false,
      EmailNotification: couponsCheck,
      TextNotification: couponsCheck,
      deviceInfo: deviceInformation,
      isEmailOptIn: undefined,
      isSMSOptIn: undefined,
    };
    const {response = {}} = await signup(signupData);
    const {ok = false, status = 0} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {
        data: {
          User: {
            PhoneNumber = '',
            Email = '',
            FirstName = '',
            LastName = '',
          } = {},
        } = {},
      } = response || {};
      await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.UNIQUE_ID); // remove existing guest from app
      await sendFcmTokenToServer(); // save fcm when guest is converted to user
      global.isConvertingGuestUser = true;
      logToConsole({response});
      await saveUserData(response);
      MixPanelInstance.trackSignUp(response?.data?.User);
      Analytics.logSignUp(ANALYTICS_EVENTS.GUEST_SIGNUP, {
        Email,
        PhoneNumber,
        FullName: `${FirstName} ${LastName}`,
      });
      navigation.pop(1);
      navigation.navigate('EmailVerificationForGuest');
    } else {
      const {
        data: {msg = ''} = {},
        status,
        isNetworkError,
        isUnderMaintenance = false,
      } = response ?? {};
      if (status === STATUSES.BAD_REQUEST) {
        setApiErrorTitle(APP_CONSTANTS.ACCOUNT_ALREADY_EXISTS);
        setApiErrorMessage(
          msg || 'User with this Email or Phone Number already exists.',
        );
        toggleApiErrorDialog();
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
    }
    setIsLoading(false);
  };

  const saveUserData = async response => {
    const {
      data: {User = {}, token: Token = '', refreshToken},
    } = response || {};
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_EMAIL, email);
    await AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.TOKEN_BEFORE_LOGIN,
      Token,
    ).then(async () => {
      //Create list for user account
      const listName = getListName();
      await createListForUser(listName, dispatch, listItems)
        .then(async () => {
          const {_id = ''} = User ?? {};
          const updatedLoginInfo = {
            userToken: Token,
            refreshToken,
            userId: _id,
            userInfo: User,
          };
          logToConsole({updatedLoginInfo})
          dispatch(saveLoginInfo(updatedLoginInfo));
        })
        .catch(e => {
          const {isNetworkError, status} = e ?? {};
          //create list api call failure handling
          setIsLoading(false);
          if (!isNetworkError) {
            handleApiErrorDialog({message: status});
          }
        });
    });
  };

  const handleApiErrorDialog = e => {
    if (e.message === STATUSES.AUTH_ERROR) {
    } else {
      setApiErrorTitle(APP_CONSTANTS.ALASKA_COMMERCIAL);
      setApiErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
      toggleApiErrorDialog();
    }
  };
  const getSegmentBackgroundColor = index => {
    if (index === guestSelectedSegmentIndex) {
      return COLORS.MAIN;
    }

    return 'transparent';
  };

  const getSegmentTextColor = index => {
    if (index === guestSelectedSegmentIndex) {
      return COLORS.WHITE;
    }

    return COLORS.MAIN;
  };

  const renderGuestCheckoutInputs = () => (
    <View style={styles.inputFieldsWrapper}>
      <View style={styles.twoFieldsContainer}>
        <View style={styles.halfRowField}>
          <TextField
            autoComplete={'name-given'}
            textContentType={'givenName'}
            placeholder={APP_CONSTANTS.F_NAME}
            value={firstName}
            maxLength={30}
            onChangeText={text => actionsOnChangeText('firstName', text)}
            returnKeyType={'next'}
            blurOnSubmit={false}
            onSubmitEditing={() => lastNameInput.current.focus()}
          />
        </View>
        <View style={styles.verticalSeparator} />
        <View style={styles.halfRowField}>
          <TextField
            autoComplete={'name-family'}
            textContentType={'familyName'}
            placeholder={APP_CONSTANTS.L_NAME}
            inputRef={lastNameInput}
            value={lastName}
            maxLength={30}
            blurOnSubmit={false}
            onChangeText={text => actionsOnChangeText('lastName', text)}
            returnKeyType={'next'}
            onSubmitEditing={() => contactInput.current._inputElement.focus()}
          />
        </View>
      </View>
      <View style={styles.modal_divider} />
      <View style={styles.fullRowField}>
        <TextInputMask
           allowFontScaling={false}
          ref={contactInput}
          keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
          maxLength={14}
          type={'custom'}
          options={{
            mask: '(999) 999-9999',
          }}
          blurOnSubmit={false}
          value={contactNumber}
          onChangeText={text => actionsOnChangeText('contactNumber', text)}
          placeholder={APP_CONSTANTS.PHONE_NUM}
          placeholderTextColor={COLORS.GRAY_5}
          returnKeyType={'done'}
          onSubmitEditing={() => emailInput.current.focus()}
          style={styles.phoneInput}
        />
      </View>

      <View style={styles.modal_divider} />
      <View style={styles.fullRowField}>
        <TextField
          autoComplete={'email'}
          textContentType={'emailAddress'}
          placeholder={APP_CONSTANTS.EMAIL_ADDRESS}
          autoCapitalize="none"
          inputRef={emailInput}
          keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
          value={email}
          onBlur={validateEmail}
          maxLength={150}
          blurOnSubmit={true}
          onChangeText={text => actionsOnChangeText('email', text)}
          returnKeyType={'done'}
        />
      </View>
    </View>
  );

  const renderCreateAccountRadioView = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleRadioButton}
      style={styles.createAccountToGetSavingsView}>
      <View style={styles.radioUnchecked}>
        {isRadioButtonSelected ? <View style={styles.radioChecked} /> : null}
      </View>
      <Text allowFontScaling={false} style={styles.createAccountToGetSavingsText}>
        {APP_CONSTANTS.CREATE_ACCOUNT_TO_GET_ADDITIONAL_SAVINGS}
      </Text>
    </TouchableOpacity>
  );

  const renderButton = () => (
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
        color="white"
        width="90%"
        disabled={btnDisable}
        onPress={submit}
      />
    </View>
  );
  const renderAlreadyAMemberText = () => (
    <View style={styles.alreadyMemberWrapper}>
      <Text allowFontScaling={false} style={styles.loginTextStyle}>
        {APP_CONSTANTS.ALREADY_A_MEMBER}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        // onPress={() => logout(dispatch, globalState)}>
        onPress={logOutGuestUser}>
        <Text allowFontScaling={false} style={styles.underlinedText}>{'Sign in'}</Text>
      </TouchableOpacity>
      <Text allowFontScaling={false} style={styles.loginTextStyle}>
        {' '}
        {APP_CONSTANTS.TO_YOUR_ACCOUNT}{' '}
      </Text>
    </View>
  );
  const logOutGuestUser = () => {
    navigation.navigate('AuthStackForGuest', {
      screen: 'Login',
      initial: true,
      params: {showHeader: true, fromCart: true},
    });
  };
  const renderPasswordsView = () => (
    <TouchableOpacity activeOpacity={1} style={styles.passwordsContainer}>
      <Text allowFontScaling={false} style={[
          styles.passwordRequirementTextStyle,
          {color: instructionTextColor},
        ]}>
        {APP_CONSTANTS.GUEST_CHECKOUT_PASSWORD_REQUIREMENT}
      </Text>
      <View>
        {errorAlertText.length > 0 ? (
          <View style={[styles.errorStyle, {marginStart: 0, marginTop: 10}]}>
            <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
          </View>
        ) : null}
        <Input
          autoComplete={'password-new'}
          textContentType={'newPassword'}
          placeholder={APP_CONSTANTS.PASSWORD}
          inputRef={passwordInput}
          onChangeText={text => actionsOnChangeText('userNewPassword', text)}
          value={userNewPassword}
          borderColor={borderColor}
          returnKeyType={'next'}
          maxLength={30}
          borderWidth={1}
          inPutWidth={wp('88%')}
          blurOnSubmit={false}
          secureTextEntry={visiblePassword}
          showEye={true}
          autoCapitalize={'none'}
          onEyeButtonPress={() => setVisiblePassword(!visiblePassword)}
          onSubmitEditing={() => confirmPasswordInput?.current?.focus()}
        />
        <Input
          autoComplete={'password-new'}
          textContentType={'newPassword'}
          inputRef={confirmPasswordInput}
          placeholder={APP_CONSTANTS.CONFIRM_PASS}
          borderColor={borderColor}
          onChangeText={text =>
            actionsOnChangeText('userConfirmNewPassword', text)
          }
          returnKeyType={'done'}
          blurOnSubmit={true}
          onSubmitEditing={btnDisable ? null : submit}
          value={userConfirmNewPassword}
          maxLength={30}
          borderWidth={1}
          showEye={true}
          secureTextEntry={visibleConfirmPassword}
          autoCapitalize={'none'}
          onEyeButtonPress={() =>
            setVisibleConfirmPassword(!visibleConfirmPassword)
          }
          inPutWidth={wp('88%')}
        />
        <View style={styles.marginTop}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.checkboxWrapper}
            onPress={setCoupons}>
            <View style={styles.radioUnchecked}>
              {couponsCheck ? <View style={styles.radioChecked} /> : null}
            </View>
            <Text allowFontScaling={false} style={styles.bottomTextStyle}>
              {APP_CONSTANTS.COUPONS_AND_DEALS}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            style={styles.termsWrapper}>
            <View style={styles.radioUnchecked}>
              {agreeToTerms ? <View style={styles.radioChecked} /> : null}
            </View>
            <Text allowFontScaling={false} style={[styles.bottomTextStyle, {marginTop: hp('.3%')}]}>
              {APP_CONSTANTS.AGREEMENT}
              <Text allowFontScaling={false} style={styles.underLinedText}
                onPress={() => onOpenLink(BLOB_URLS.TERM_OF_USE)}>
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
      </View>
    </TouchableOpacity>
  );

  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={toggleApiErrorDialog}
        title={apiErrorTitle}
        message={apiErrorMessage}
        messageContainerStyles={{marginTop: 5}}
        isSingleButton={true}
        onCancelPress={toggleApiErrorDialog}
        cancelButtonLabel={APP_CONSTANTS.OK}
      />
    );
  };

  return (
    <ScreenWrapperComponent
      headerTitle={`CHECKOUT (${cartItems.length})`}
      withBackButton
      isLoading={isLoading}
      isScrollView={false}>
      <KeyboardAwareScrollView
        style={{paddingBottom: 300}}
        keyboardShouldPersistTaps="handled"
        enableResetScrollToCoords
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        keyboardOpeningTime={Number.MAX_SAFE_INTEGER}>
        <View style={styles.content}>
          <View style={styles.continueAsGuestTextWrapper}>
            <Text allowFontScaling={false} style={styles.continueAsGuestText}>
              {APP_CONSTANTS.CONTINUE_AS_GUEST}
            </Text>
          </View>
          {emailErrorAlertText.length > 0 ? (
            <View style={[styles.errorStyle, {marginBottom: 5}]}>
              <Text allowFontScaling={false} style={styles.errorText}>{emailErrorAlertText}</Text>
            </View>
          ) : null}
          {renderGuestCheckoutInputs()}
          {renderCreateAccountRadioView()}
          {isRadioButtonSelected && renderPasswordsView()}
          {renderButton()}
          {renderAlreadyAMemberText()}
          {renderApiErrorDialog()}
        </View>
      </KeyboardAwareScrollView>
    </ScreenWrapperComponent>
  );
};

export default ShoppingCartGuestCheckout;
