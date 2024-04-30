/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {COLORS, FONTS} from '../../theme';
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {saveZipCodes} from '../../redux/actions/general';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  getZipCodes,
  logoutApiCall,
  sendFcmTokenToServer,
  updateUser,
} from '../../services/ApiCaller';
import StoreModal from '../../components/StoreModal';
import {logToConsole} from '../../configs/ReactotronConfig';
import {
  getCurrentLocation,
  getLocationPermissions,
} from '../../utils/locationUtils';
import {logout, saveUserInfo} from '../../utils/userUtils';
import {KEYBOARD_FEATURES} from '../../constants/Common';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {resetAndNavigate} from '../../utils/navigationUtils';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import useIsGuest from '../../hooks/useIsGuest';
import {STATUSES} from '../../constants/Api';
import LabelCheckBox from '../../components/LabelCheckBox';
import {SwitchView} from './SwitchView';
import DialogBox from '../../components/DialogBox';

const CreateAccountZipCode = () => {
  // let {loginInfo = {}, inOnboarded} = useSelector(({general} = {}) => general);
  // let {userInfo = {}} = loginInfo ?? {};

  const inOnboardedSelector = useMemo(
    () => state => state.general?.inOnboarded ?? false,
    [],
  );

  const userInfoSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo ?? {},
    [],
  );

  const inOnboarded = useSelector(inOnboardedSelector);
  const userInfo = useSelector(userInfoSelector);

  // logToConsole({inOnboarded, userInfo});

  const {
    _id = '',
    GlobalSubstitution,
    isSMSOptIn,
    isEmailOptIn,
  } = userInfo ?? {};

  const [state, setState] = useState({zipCode: ''});
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSMSCheckBox, setIsSMSCheckBox] = useState(undefined);
  const [isEmailCheckBox, setIsEmailCheckBox] = useState(undefined);
  const [isSubstitutionAllowed, setIsSubstitutionAllowed] = useState(
    /*GlobalSubstitution*/ true,
  );
  const [btnDisable, setBtnDisable] = useState(true);
  const [visibleStoreModal, setVisibleStoreModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStoreNumber, setSelectedStoreNumber] = useState(null);
  const [selectedStoreKey, setSelectedStoreKey] = useState(null);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [selectedStoreLocation, setSelectedStoreLocation] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [errorAlertText, setErrorAlertText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [borderColor, setBorderColor] = useState(COLORS.GRAY_4);

  const {zipCode = ''} = state ?? {};

  const zipCodeInput = useRef(null);

  const dispatch = useDispatch();
  const isGuest = useIsGuest();
  const openModal = useCallback(() => setVisibleStoreModal(true), []);
  const closeModal = useCallback(() => setVisibleStoreModal(false), []);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSubstitution = () =>
    setIsSubstitutionAllowed(previousState => !previousState);

  // Getting permission from user to provide location access
  useEffect(() => {
    if(!isGuest) {
      setIsEmailCheckBox(true);
      setIsSMSCheckBox(true);
    }
    const permissionsHandler = async () => {
      await getLocationPermissions().then(response => {
        if (response === APP_CONSTANTS.GRANTED) {
          getCurrentLocation();
        } else {
          logToConsole('PERMISSIONS_DENIED');
        }
      });
    };
    permissionsHandler().then(() => {});
  }, []);

  const getStoresFromZipCodes = async value => {
    setIsLoading(true);
    const {response = {}} = await getZipCodes({zipCode: value}, dispatch);
    const {ok = false, isNetworkError, isUnderMaintenance} = response ?? {};
    const {data: {Zipcode: zipCodesArray = []} = {}} = response ?? {};
    if (ok && zipCodesArray.length > 0) {
      setStores(zipCodesArray);
      dispatch(saveZipCodes(zipCodesArray));
      populateStores(zipCodesArray);
    } else if (isUnderMaintenance) {
      setErrorAlertText('');
    } else if (!isNetworkError) {
      setErrorAlertText(APP_CONSTANTS.NO_STORE_FOUND);
      setBorderColor(COLORS.MAIN);
    }
    setIsLoading(false);
  };

  const populateStores = params => {
    if (params.length === 1) {
      const {
        HOME_STORE_NUMBER: storeNumber = '',
        HOME_STORE_NAME: storeName = '',
        CITY: storeLocation = '',
        ORDER_TYPE: orderType = '',
      } = params[0] ?? {};
      selectStore(storeNumber, storeName, storeLocation, orderType);
    } else {
      setTimeout(() => openModal(), 500);
    }
  };

  //handling input states
  function actionsOnChangeText(key, value) {
    if (key === 'zipCode' && (value.includes('.') || value.includes('-'))) {
      value = value.replace('.', '').replace('-', '');
    }
    setState({...state, [key]: value});
    setStores([]);
    setErrorAlertText('');
    setBorderColor(COLORS.GRAY_4);
    // if (value.length === 5) {
    //   Keyboard.dismiss();
    //   getStoresFromZipCodes(value).then(() => {});
    // } else {
    //   setSelectedStoreName('');
    //   setSelectedStoreKey(null);
    // }
  }

  useEffect(() => {
    if (state.zipCode.length === 5) {
      Keyboard.dismiss();
      getStoresFromZipCodes(state.zipCode).then(() => {});
    } else {
      setSelectedStoreName('');
      setSelectedStoreKey(null);
    }
  }, [state]);

  //restricting user to navigate unless every information is provided
  useEffect(() => {
    if (state.zipCode.length === 5 && selectedStoreName !== '') {
      setBtnDisable(false);
    } else if (state.zipCode.length < 5) {
      setBtnDisable(true);
      setSelectedStoreNumber(null);
      setSelectedStoreKey(null);
    }
  }, [state.zipCode, selectedStoreNumber]);

  //  continuous validating zip code on input
  useEffect(() => {
    validateZipCode();
  }, [state, selectedStoreName]);

  //validate zipCodes and restricting user to navigate on false input
  const validateZipCode = () => {
    if (state.zipCode.trim().length === 5 && selectedStoreName !== '') {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  const handleLogout = () => {
    setTimeout(async () => {
      setIsLoading(true);
      await logoutApiCall();
      logout(dispatch).then(() => {
        resetAndNavigate('Login', 0);
      });
      setIsLoading(false);
    }, 300);
  };

  const openModalOnBtnTap = () => {
    if (zipCode.length < 5) {
      return null;
    } else {
      stores?.length > 1 && openModal();
    }
  };

  //updating user's zip code and store
  const updateUserZipCode = async info => {
    try {
      setIsLoading(true);
      const {response = {}} = await updateUser(info);
      const {
        data: {user: User = {}, msg = ''} = {},
        ok = false,
        status = 0,
        isNetworkError,
        isUnderMaintenance,
      } = response ?? {};
      if (ok && status === STATUSES.OK) {
        await saveUserInfo(dispatch, _id, User);
        MixPanelInstance.trackSignUp(User);
        if (!isGuest) {
          resetAndNavigate('EmailVerification');
        } else if (!inOnboarded) {
          resetAndNavigate('OnBoarding');
        }
        sendFcmTokenToServer();
      } else if (isUnderMaintenance) {
        setIsLoading(false);
      } else if (status === STATUSES.AUTH_ERROR) {
        displayAlert(
          APP_CONSTANTS.ALASKA_COMMERCIAL,
          msg ?? '',
          APP_CONSTANTS.RETRY,
          () => {},
        );
      } else if (!isNetworkError) {
        displayAlert(
          APP_CONSTANTS.ALASKA_COMMERCIAL,
          APP_CONSTANTS.SOME_THING_WENT_WRONG,
          APP_CONSTANTS.OK,
          () => {},
        );
      }
    } catch (e) {
      logToConsole({e, message: e?.message});
    } finally {
      setIsLoading(false);
    }
  };

  const displayAlert = (
    title = '',
    msg = '',
    okButtonText = '',
    okPress = () => {},
  ) => {
    Alert.alert(title, msg, [
      {
        text: okButtonText ?? 'Ok',
        onPress: okPress?.(),
      },
    ]);
  };

  // saving user's info and navigating next
  const save = async () => {
    await updateUserZipCode({
      ZipCode: zipCode,
      Store: selectedStoreName,
      isLowBandwidth: isEnabled,
      StoreNumber: selectedStoreNumber,
      StoreLocation: selectedStoreLocation,
      OrderType: selectedOrderType,
      sendVerificationEmail: !isGuest,
      GlobalSubstitution: isSubstitutionAllowed,
      isSMSOptIn: isSMSCheckBox,
      isEmailOptIn: isEmailCheckBox,
    });
  };
  // saving user's info and navigating next

  const selectStore = (storeNumber, name, location, orderType) => {
    setSelectedStoreNumber(storeNumber);
    setSelectedStoreName(name);
    setSelectedStoreLocation(location);
    setSelectedStoreKey(storeNumber + location);
    setSelectedOrderType(orderType);
  };

  const renderZipCodesInputs = () => {
    return (
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.mainParent}>
            <View style={styles.userPreferenceWrapper}>
              {renderTextHeader()}
              {renderInputView()}
              <SwitchView
                enabled={isSubstitutionAllowed}
                onPress={toggleSubstitution}
                text={APP_CONSTANTS.SUBSTITUTION_ALLOWED}
              />
              <SwitchView
                enabled={isEnabled}
                onPress={toggleSwitch}
                text={APP_CONSTANTS.LOW_BANDWIDTH}
              />
            </View>
            {renderMarketingOptions()}
            {renderSaveButton()}
            {renderLogoutButton()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  };

  const renderMarketingOptions = () => {
    if (!isGuest) {
      return (
        <>
          <LabelCheckBox
            label={APP_CONSTANTS.SIGN_UP_FOR_SMS_MARKETING}
            containerStyle={styles.checkBox}
            isSelected={isSMSCheckBox}
            onPress={() => setIsSMSCheckBox(prevState => !prevState)}
          />
          <LabelCheckBox
            label={APP_CONSTANTS.SIGN_UP_FOR_EMAIL_MARKETING}
            containerStyle={styles.checkBox}
            isSelected={isEmailCheckBox}
            onPress={() => setIsEmailCheckBox(prevState => !prevState)}
          />
        </>
      );
    }
  };

  const renderTextHeader = () => {
    return (
      <View style={styles.textWrapper}>
        <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.ZIP_CODE}</Text>
        <Text allowFontScaling={false} style={styles.nearByText}>
          {APP_CONSTANTS.ZIP_CODE_INSTRUCTIONS}
        </Text>
      </View>
    );
  };

  const renderInputView = () => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.errorStyle}>
          <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
        </View>
        <Input
          autoComplete={'postal-code'}
          textContentType={'postalCode'}
          placeholder={APP_CONSTANTS.ZIP_CODE}
          inputRef={zipCodeInput}
          onChangeText={text => actionsOnChangeText('zipCode', text)}
          value={state.zipCode}
          keyboardType={KEYBOARD_FEATURES.keyboardTypes.numeric}
          borderColor={borderColor}
          maxLength={5}
          borderWidth={1}
          inPutWidth={wp('90%')}
        />
        <TouchableOpacity
          disabled={zipCode.length < 5}
          activeOpacity={0.6}
          style={styles.storeNameView}
          onPress={openModalOnBtnTap}>
          <Text
              allowFontScaling={false}
            style={[
              styles.storeNameText,
              {color: selectedStoreName ? COLORS.BLACK : COLORS.GRAY_4},
            ]}>
            {selectedStoreName !== '' ? selectedStoreName : 'Store'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSaveButton = () => {
    return (
      <View style={styles.buttonWrapperContainer}>
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
            onPress={save}
          />
        </View>
      </View>
    );
  };
  const renderLogoutButton = () => {
    return (
      <View style={[styles.buttonWrapperContainer, {marginTop: 0}]}>
        <Pressable
          onPress={handleLogout}
          style={[
            styles.btnWrapper,
            {backgroundColor: COLORS.TRANSPARENT, alignItems: 'center'},
          ]}>
          <Text allowFontScaling={false} style={styles.backtoLoginText}>
            {APP_CONSTANTS.BACK_TO_LOGIN}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenWrapperComponent
      isAuthHeader
      withHeader
      headerTitle={APP_CONSTANTS.STORE_LOCATION}
      isKeyBoardAwareScrollView
      isScrollView={false}
      isLoading={isLoading}>
      {renderZipCodesInputs()}
      <StoreModal
        visibleModal={visibleStoreModal}
        data={stores}
        closeModal={closeModal}
        isZipCodeChanged={zipCode.length < 5}
        selectedStore={selectedStoreKey}
        onItemPress={selectStore}
      />
    </ScreenWrapperComponent>
  );
};
export default CreateAccountZipCode;
