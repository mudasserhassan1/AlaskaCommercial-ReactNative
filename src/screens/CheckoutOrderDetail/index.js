import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, IMAGES} from '../../theme';
import {Button, List, TextField} from '../../components';
import {styles} from './style';
import {formatNumberForBackend} from '../../utils';
import {APP_CONSTANTS} from '../../constants/Strings';
import ContactInformationModal from '../../components/ContactInformationModal';
import InstructionsModal from '../../components/SpecialInstructionsModal';
import PickupTimeModal from '../../components/PickUpTimeModal';
import moment from 'moment';
import OrderNotificationPreferenceModal from '../../components/OrderNotificationPreferenceModal';
import DialogBox from '../../components/DialogBox';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {
  ASYNC_STORAGE_KEYS,
  KEYBOARD_FEATURES,
  passwordRegex,
  userNameRegex,
} from '../../constants/Common';
import {TextInputMask} from 'react-native-masked-text';
import Input from '../../components/Input';
import {
  getPaymentMethods,
  sendFcmTokenToServer,
  signup,
} from '../../services/ApiCaller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createListForUser, getListName} from '../../utils/listUtils';
import {saveLoginInfo} from '../../redux/actions/general';
import Analytics from '../../utils/analyticsUtils';
import {ANALYTICS_EVENTS} from '../ShoppingCartPickup/Constants';
import {logToConsole} from '../../configs/ReactotronConfig';
import {isValidEmail} from '../../utils/validationUtils';
import {BLOB_URLS, STATUSES} from '../../constants/Api';
import useNotificationPermissionModal from '../../components/useNotificationPermissionModal';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import useIsGuest from '../../hooks/useIsGuest';
import CheckoutOrderSteps from '../../components/CheckoutOrderSteps';
import DeliveryAddressModal from '../../components/DeliveryAddressModal';
import {
  getCompleteAddress,
  getCompleteDestinationVillage,
} from '../../utils/addressUtils';
import DestinationVillageModal from '../../components/DestinationVillageModal';
import {setCheckoutInfo} from '../../redux/actions/checkoutinfo';
import {
  getInitialState,
  getDeliveryDateFromRedux,
  getAddressFromRedux,
  getDeliveryAddressDetails,
} from './constants';
import {savePaymentMethods} from '../../redux/actions/payment';
import {getFCMUniqueId} from '../../utils/helperUtils';
import {formatTime} from '../../utils/timeUtils';
import useDeviceInfo from '../../hooks/useDeviceInfo';

const CheckoutOrderDetail = ({navigation, route}) => {
  const cartPaymentsSelector = useMemo(
    () => state => state.payment.cartPayments,
    [],
  );
  const cartInvoiceSelector = useMemo(
    () => state => state.payment.cartInvoice,
    [],
  );
  const paymentsSelector = useMemo(() => state => state.payment.payments, []);

  const isNotificationAllowedSelector = useMemo(
    () => state => state.general.isNotificationAllowed,
    [],
  );
  const cartItemsSelector = useMemo(() => state => state.general.cartItems, []);
  const loginInfoSelector = useMemo(() => state => state.general.loginInfo, []);
  const selectedDeliveryTypeSelector = useMemo(
    () => state => state.general.selectedDeliveryType,
    [],
  );
  const notificationSettingsSelector = useMemo(
    () => state => state.general.notificationSettings,
    [],
  );
  const storeDetailSelector = useMemo(
    () => state => state.general.storeDetail,
    [],
  );
  const zipCodeDetailSelector = useMemo(
    () => state => state.general.zipCodeDetail,
    [],
  );

  const cartPayments = useSelector(cartPaymentsSelector);
  const cartInvoice = useSelector(cartInvoiceSelector);
  const payments = useSelector(paymentsSelector);
  const isNotificationAllowed = useSelector(isNotificationAllowedSelector);
  const cartItems = useSelector(cartItemsSelector);
  const loginInfo = useSelector(loginInfoSelector);
  const selectedDeliveryType = useSelector(selectedDeliveryTypeSelector);
  const notificationSettings = useSelector(notificationSettingsSelector);
  const storeDetail = useSelector(storeDetailSelector);
  const zipCodeDetail = useSelector(zipCodeDetailSelector);

  const checkoutInformationSelector = useMemo(
    () => state => state?.checkoutinfo?.checkoutInformation,
    [],
  );
  const deliveryDetailSelector = useMemo(
    () => state => state?.checkoutinfo?.deliveryDetail,
    [],
  );
  const addressSelector = useMemo(
    () => state => state?.checkoutinfo?.address,
    [],
  );

  const checkoutInformation = useSelector(checkoutInformationSelector);
  const deliveryDetail = useSelector(deliveryDetailSelector);
  const address = useSelector(addressSelector);
  const {userInfo = {}} = loginInfo ?? {};
  const {userInfo: {ZipCode, FirstName, LastName, StoreLocation} = {}} =
    loginInfo || {};

  const initialState = getInitialState(userInfo, checkoutInformation);
  const [btnDisable, setBtnDisable] = useState(true);
  const [state, setState] = useState(() => initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [cartItemsLength, setCartItemsLength] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [visibleContactInfoModal, setVisibleContactInfoModal] = useState(false);
  const [visiblePickupTimeModal, setVisiblePickupTimeModal] = useState(false);
  const [visibleInstructionsModal, setVisibleInstructionsModal] =
    useState(false);
  const [isVisibleOrderNotificationModal, setIsVisibleOrderNotificationModal] =
    useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [alertNotification, setAlertNotification] = useState(false);
  const [textNotification, setTextNotifications] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [emailErrorAlertText, setEmailErrorAlertText] = useState('');
  const isAlertAllowed = alertNotification && isNotificationAllowed;
  const [visibleDeliveryAddressModal, setVisibleDeliveryAddressModal] =
    useState(false);
  const [couponsCheck, setCouponsCheck] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [continueBtnDisable, setContinueBtnDisable] = useState(false);
  const [borderColor, setBorderColor] = useState(COLORS.GRAY0_15);
  const [instructionTextColor, setInstructionTextColor] = useState(
    COLORS.GRAY_5,
  );
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(true);
  const [isRadioButtonSelected, setIsRadioButtonSelected] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [apiErrorTitle, setApiErrorTitle] = useState('');
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const contactInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const [addressData, setAddressData] = useState('');
  const [deliveryAddressObject, setDeliveryAddressObject] = useState({});
  const [visibleDestinationVillageModal, setVisibleDestinationVillageModal] =
    useState(false);
  const [destinationVillageData, setDestinationVillageData] = useState({});
  const listItems = useSelector(({general}) => general?.listItems) ?? {};
  // const {
  //   listItems,
  //   guestSelectedSegmentIndex,
  //   segments = [],
  // } = globalState ?? {};
  const isGuest = useIsGuest();
  const {userInfo: guestInfo = {}} = loginInfo ?? {};
  const dispatch = useDispatch();
  const {onShowAlert} = useNotificationPermissionModal();

  const isBushOrder = selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY;
  const deliveryDate = getDeliveryDateFromRedux(deliveryDetail);
  const addressDataFromRedux = getAddressFromRedux(address);
  const deliveryAddressFromRedux = getDeliveryAddressDetails(
    ZipCode,
    FirstName,
    LastName,
    StoreLocation,
  );

  const {
    firstName = '',
    lastName = '',
    email = '',
    contactNumber = '',
    userConfirmNewPassword = '',
    userNewPassword = '',
  } = state ?? {};

  useEffect(() => {
    setState(getInitialState(userInfo, checkoutInformation));
  }, [checkoutInformation]);

  useEffect(() => {
    const dateAndTime = deliveryDate;
    setSelectedDate(dateAndTime.selectedDate);
    setSelectedTime(dateAndTime.selectedTime);
    setSelectedDateIndex(dateAndTime.selectedDateIndex);
    setSelectedTimeIndex(dateAndTime.selectedTimeIndex);
  }, [deliveryDetail]);

  useEffect(() => {
    const mnaddress = addressDataFromRedux;
    setAddressData(mnaddress.addressData);
    const completeAddress = getCompleteAddress(mnaddress.addressData);
    setDeliveryAddress(completeAddress);
  }, [address]);

  useEffect(() => {
    if (isBushOrder) {
      getDestinationVillage(deliveryAddressFromRedux);
      setDeliveryAddressObject(deliveryAddressFromRedux);
      setAddressData(deliveryAddressFromRedux);
    }
  }, [state]);
  const onFetchPaymentMethods = async () => {
    setIsLoading(true);
    const {response} = await getPaymentMethods();
    const {ok = false, isUnderMaintenance} = response ?? {};
    if (ok) {
      const {data: {response: methods = []} = {}} = response ?? {};
      dispatch(savePaymentMethods({methods}));
    } else {
      if (!isUnderMaintenance) {
        setApiErrorTitle(APP_CONSTANTS.ALASKA_COMMERCIAL);
        setApiErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
        toggleApiErrorDialog();
      }
    }
    setIsLoading(false);
  };

  const setCoupons = () => {
    setCouponsCheck(prevState => !prevState);
  };

  const toggleApiErrorDialog = () =>
    setIsApiErrorDialogVisible(prevState => !prevState);

  const toggleRadioButton = () =>
    setIsRadioButtonSelected(prevState => !prevState);

  const onOpenLink = useCallback(
    async URL => {
      navigation.navigate('WebView', {url: URL});
    },
    [URL],
  );

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

  const toggleContactInfoModal = () =>
    setVisibleContactInfoModal(prevState => !prevState);

  const togglePickupTimeModal = () =>
    setVisiblePickupTimeModal(prevState => !prevState);

  const toggleInstructionsModal = () =>
    setVisibleInstructionsModal(prevState => !prevState);

  const toggleNotificationPreferences = () =>
    setIsVisibleOrderNotificationModal(prevState => !prevState);

  const toggleDeliveryAddressModal = () =>
    setVisibleDeliveryAddressModal(prevState => !prevState);

  const toggleDestinationVillageModal = () =>
    setVisibleDestinationVillageModal(prevState => !prevState);

  const handleApiErrorDialog = e => {
    if (e.message === STATUSES.AUTH_ERROR) {
    } else {
      setApiErrorTitle(APP_CONSTANTS.ALASKA_COMMERCIAL);
      setApiErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
      toggleApiErrorDialog();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    onFetchPaymentMethods();

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  //Getting Total and Subtotal of Cart
  useEffect(() => {
    let cart = cartItems.filter(item => item.quantity > 0);
    setCartItemsLength(cart.length);
  }, [cartItems]);

  useEffect(() => {
    if (!isGuest) {
      setAlertNotification(
        notificationSettings[0].isEnabled && isNotificationAllowed,
      );
      setTextNotifications(notificationSettings[2].isEnabled);
    } else {
      setTextNotifications(true);
      setAlertNotification(false);
    }
  }, [notificationSettings, isGuest]);

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

    if (
      isRadioButtonSelected &&
      (!checkIfPasswordMatchToRequirements() || !checkIfPasswordMatches())
    ) {
      return setBtnDisable(true);
    }

    setBtnDisable(false);
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

  //get month and day value from redux
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [year, month, day] = formatTime(selectedDate)?.split('-') ?? [];

  const monthValue = parseInt(month);
  const monthName = monthNames[monthValue - 1];
  const dayValue = parseInt(day);
  const yearValue = parseInt(year);

  const getSelectedDateTime = () => {
    const {listName = '', time = ''} = selectedTime ?? {};

    if (selectedTime && selectedDate) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={togglePickupTimeModal}
          style={styles.selectedDateAndTimeMainWrapper}>
          <View style={{width: '100%'}}>
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>{listName}</Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>{time}</Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={{paddingTop: 10}}>
              <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.DATE}</Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {monthName} {dayValue}, {yearValue}
              </Text>
            </View>
            {/*{selectedDate && selectedTime ?<View style={styles.contactInformationDivider}/>:null}*/}
          </View>
        </TouchableOpacity>
      );
    }
    return APP_CONSTANTS.SELECT_TIME;
  };

  const getSelectedDeliveryDate = () => {
    const {listName = '', time = ''} = selectedTime ?? {};
    let completeDateTime = '';
    if (selectedDate || selectedTime) {
      if (selectedDate) {
        if (completeDateTime) {
          completeDateTime = `${completeDateTime} ${selectedDate}`;
        } else {
          completeDateTime = `${monthName} ${dayValue}, ${yearValue} `;
        }
      }
      if (selectedTime) {
        completeDateTime = `${completeDateTime} ${listName} ${time}`;
      }
      return completeDateTime;
    }

    return selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY
      ? APP_CONSTANTS.SELECT_DELIVERY_OPTION
      : APP_CONSTANTS.SELECT_DELIVERY_DATE;
  };

  const getTimeTextColor = () => {
    if (selectedTime || selectedDate) {
      return COLORS.BLACK;
    }
    return COLORS.MAIN_LIGHT;
  };

  const getNotificationPreferenceTextColor = () => {
    if (textNotification || isAlertAllowed) {
      return COLORS.BLACK;
    }
    return COLORS.MAIN_LIGHT;
  };

  const continueToNextPage = () => {
    dispatch(
      setCheckoutInfo({
        checkoutInformation: state,
        deliveryDetail: {
          selectedDate,
          selectedTime,
          selectedDateIndex,
          selectedTimeIndex,
        },
        address: isBushOrder
          ? {addressData: deliveryAddressObject}
          : {addressData},
      }),
    );
    navigation.navigate('CheckoutPaymentOption', {
      instructions: specialInstructions,
    });
  };

  const getAlertInfo = () => {
    const info = `${isAlertAllowed ? 'Alert, ' : ''}${
      textNotification ? 'Text, ' : ''
    }${emailNotification ? 'Email' : ''}`;
    return info?.replace(/,\s*$/, '') || 'Select Notification Preferences';
  };
  //Button Validation

  useEffect(() => {
    const isDeliveryDateValid = !!selectedDate;
    const isPickupDateValid = !!selectedDate || !!selectedTime;

    let isDestinationAddressAdded = true;

    if (selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY || isBushOrder) {
      if (deliveryAddress && selectedDate) {
        isDestinationAddressAdded = true;
      } else {
        isDestinationAddressAdded = false;
      }
    }
    if (isGuest) {
      if (isRadioButtonSelected) {
        setContinueBtnDisable(true);
      } else {
        if (
          !checkIfInputsEmpty() &&
          checkIfEmailIsValid() &&
          isDeliveryDateValid &&
          isPickupDateValid &&
          isDestinationAddressAdded
        ) {
          setContinueBtnDisable(false);
        } else {
          setContinueBtnDisable(true);
        }
      }
    } else {
      if (
        isDeliveryDateValid &&
        isPickupDateValid &&
        isDestinationAddressAdded
      ) {
        setContinueBtnDisable(false);
      } else {
        setContinueBtnDisable(true);
      }
    }
  }, [
    selectedTime,
    selectedDate,
    deliveryAddress,
    isRadioButtonSelected,
    firstName,
    lastName,
    contactNumber,
    email,
    userConfirmNewPassword,
    userNewPassword,
    agreeToTerms,
    selectedDeliveryType,
  ]);

  const renderListHeaderComponent = () => {
    return (
      <>
        <TouchableOpacity activeOpacity={1}>
          {renderContactInformation()}
          {renderShoppingCartGuest()}
          {renderScheduleInfo()}
          <View style={styles.scheduleinformationandbuttondivider} />
        </TouchableOpacity>
      </>
    );
  };
  const validateEmail = () => {
    if (!checkIfEmailIsValid()) {
      setEmailErrorAlertText('Please enter a valid email');
    } else {
      setEmailErrorAlertText('');
    }
  };

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
    const uniqueId = await getFCMUniqueId();
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

  const renderCreateAccountRadioView = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={toggleRadioButton}
      style={styles.createAccountToGetSavingsView}>
      <View style={{marginTop: 4}}>
        <ImageComponent
          source={
            isRadioButtonSelected
              ? IMAGES.SELECTED_CHECK_BOX
              : IMAGES.UNSELECTED_CHECK_BOX
          }
          resizeMode={'contain'}
          style={{width: 15, height: 15}}
        />
      </View>

      <Text allowFontScaling={false} style={styles.createAccountToGetSavingsText}>
        {APP_CONSTANTS.CREATE_ACCOUNT_TO_GET_ADDITIONAL_SAVINGS}
      </Text>
    </TouchableOpacity>
  );
  const getDeliveryAddressText = () => {
    if (deliveryAddress) {
      return COLORS.BLACK;
    }
    return COLORS.MAIN_LIGHT;
  };

  const renderDestinationVillageInfo = () => {
    return (
      <View style={styles.storeInnerWrapper} activeOpacity={0.7}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>
            {APP_CONSTANTS.DESTINATION_VILLAGE}
          </Text>
          <Text
              allowFontScaling={false}
            style={[
              styles.openModalLabelInfo,
              {color: getDeliveryAddressText(), width: '90%'},
            ]}>
            {deliveryAddress
              ? deliveryAddress
              : APP_CONSTANTS.ADD_DESTINATION_VILLAGE}
          </Text>
        </View>
      </View>
    );
  };
  const renderDeliveryAddressInfoView = () => {
    return (
      <TouchableOpacity
        style={styles.storeInnerWrapper}
        activeOpacity={0.7}
        onPress={toggleDeliveryAddressModal}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>
            {APP_CONSTANTS.DELIVERY_ADDRESS}
          </Text>
          <Text
              allowFontScaling={false}
            style={[
              styles.openModalLabelInfo,
              {color: getDeliveryAddressText()},
            ]}>
            {deliveryAddress ? deliveryAddress : APP_CONSTANTS.ADD_ADDRESS}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <Image source={IMAGES.RIGHT} style={styles.rightArrowStyle} />
        </View>
      </TouchableOpacity>
    );
  };

  const checkHomeDeliveryOrBushDelivery = () => {
    if (isBushOrder) {
      return renderDestinationVillageInfo();
    }
    if (selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY) {
      return renderDeliveryAddressInfoView();
    }
    return null;
  };
  const getAddress = address => {
    setAddressData(address);
    const completeAddress = getCompleteAddress(address);
    setDeliveryAddress(completeAddress);
    setDeliveryAddressObject(address);
  };

  const renderDeliveryAddressModal = () => (
    <DeliveryAddressModal
      isVisible={visibleDeliveryAddressModal}
      closeModal={toggleDeliveryAddressModal}
      defaultData={addressData}
      onAddressChange={getAddress}
      previousData={deliveryAddress}
    />
  );

  const getDestinationVillage = destinationVillage => {
    setDestinationVillageData(destinationVillage);
    const completeDestinationAddress = getCompleteDestinationVillage(
      destinationVillage,
      zipCodeDetail,
    );
    setDeliveryAddress(completeDestinationAddress);
    setDeliveryAddressObject(destinationVillage);
  };

  const renderDestinationVillageAddressModal = () => (
    <DestinationVillageModal
      isVisible={visibleDestinationVillageModal}
      closeModal={toggleDestinationVillageModal}
      defaultData={destinationVillageData}
      onDestinationVillageChange={getDestinationVillage}
    />
  );

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
  const renderButton = () => (
    <View
      style={[
        styles.buttonWrapper,
        {
          backgroundColor: btnDisable
            ? COLORS.DISABLE_BUTTON_COLOR
            : COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button
        label={APP_CONSTANTS.SUBMIT}
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
      <Text
          allowFontScaling={false}
        style={[
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
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            activeOpacity={0.7}
            style={styles.checkboxWrapper}
            onPress={setCoupons}>
            <View>
              <ImageComponent
                source={
                  couponsCheck
                    ? IMAGES.SELECTED_CHECK_BOX
                    : IMAGES.UNSELECTED_CHECK_BOX
                }
                style={{width: 15, height: 15}}
                resizeMode={'contain'}
              />
            </View>

            <Text allowFontScaling={false} style={styles.bottomTextStyle}>
              {APP_CONSTANTS.COUPONS_AND_DEALS}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            activeOpacity={0.7}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            style={styles.termsWrapper}>
            <View>
              <ImageComponent
                source={
                  agreeToTerms
                    ? IMAGES.SELECTED_CHECK_BOX
                    : IMAGES.UNSELECTED_CHECK_BOX
                }
                style={{width: 15, height: 15}}
                resizeMode={'contain'}
              />
            </View>
            <Text allowFontScaling={false} style={[styles.bottomTextStyle, {marginTop: -3}]}>
              {APP_CONSTANTS.AGREEMENT}
              <Text
                  allowFontScaling={false}
                style={styles.underLinedText}
                onPress={() => onOpenLink(BLOB_URLS.TERM_OF_USE)}>
                {APP_CONSTANTS.TERMS}
              </Text>
              {APP_CONSTANTS.AND}
              <Text
                  allowFontScaling={false}
                style={styles.underLinedText}
                onPress={() => onOpenLink(BLOB_URLS.PRIVACY_POLICY)}>
                {APP_CONSTANTS.PRIVACY_POLICY}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderButton()}
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

  const renderShoppingCartGuest = () => {
    if (isGuest) {
      return (
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
          <View style={styles.passwordViewContainer}>
            {isRadioButtonSelected && renderPasswordsView()}
          </View>
          {renderApiErrorDialog()}
        </View>
      );
    } else {
      return null;
    }
  };
  const renderContactInformation = () => {
    if (!isGuest) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.mainWrapper}>
          <View style={styles.textWrapper}>
            <View
              style={[styles.editProfileWrapper, {marginBottom: hp('2.2%')}]}>
              <Text allowFontScaling={false} style={styles.textHeader}>
                {APP_CONSTANTS.CONTACT_INFORMATION}
              </Text>
              <TouchableOpacity
                onPress={toggleContactInfoModal}
                activeOpacity={0.7}
                style={styles.editTextWrapper}>
                <Text allowFontScaling={false} style={styles.editText}>{APP_CONSTANTS.EDIT}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.NAME}</Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {firstName} {lastName}
              </Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.PHONE_NUM}</Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>{contactNumber}</Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.EMAIL}</Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>{email}</Text>
            </View>
            {/*<View style={styles.contactInformationDivider}/>*/}
          </View>
          <View style={styles.sectionDivider} />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const checkDeliveryDateOrPickupTime = () => {
    if (selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      return renderPickupTimeSection();
    }
    return renderDeliveryDateView();
  };

  const renderDeliveryDateView = () => {
    return (
      <TouchableOpacity
        onPress={togglePickupTimeModal}
        style={styles.storeInnerWrapper}
        activeOpacity={0.7}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>
            {APP_CONSTANTS.DELIVERY_DATE_}
          </Text>
          <Text
              allowFontScaling={false}
            style={[styles.openModalLabelInfo, {color: getTimeTextColor()}]}>
            {getSelectedDeliveryDate()}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <ImageComponent
            source={IMAGES.RIGHT}
            style={styles.rightArrowStyle}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderScheduleInfo = () => (
    <View style={styles.mainWrapper}>
      <View style={styles.textWrapper}>
        <View style={styles.editProfileWrapper}>
          <Text allowFontScaling={false} style={styles.textHeader}>
            {selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP
              ? APP_CONSTANTS.SCHEDULE_DELIVERY
              : selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY
              ? APP_CONSTANTS.DELIVERY_INFORMATION
              : APP_CONSTANTS.BUSH_DELIVERY_INFORMATION}
          </Text>
        </View>
        <View style={styles.storeWrapper}>
          {checkHomeDeliveryOrBushDelivery()}
          {isBushOrder ||
          selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY ? (
            <View style={styles.contactInformationDivider} />
          ) : null}
          {checkDeliveryDateOrPickupTime()}
          <View style={styles.contactInformationDivider} />

          {renderNotificationPreferences()}
          <View style={styles.contactInformationDivider} />
          {renderSpecialInstructionSection()}
        </View>
      </View>
    </View>
  );

  const renderNotificationPreferences = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleNotificationPreferences}
        style={styles.storeInnerWrapper}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>
            {APP_CONSTANTS.ORDER_NOTIFICATION_PREFERENCE}
          </Text>
          <Text
              allowFontScaling={false}
            style={[
              styles.openModalLabelInfo,
              {color: getNotificationPreferenceTextColor()},
            ]}>
            {getAlertInfo()}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <Image source={IMAGES.RIGHT} style={styles.rightArrowStyle} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPickupTimeSection = () => (
    <TouchableOpacity
      onPress={togglePickupTimeModal}
      style={styles.storeInnerWrapper}>
      <View style={styles.rowInformationWrapper}>
        <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.PICKUP_TIME}</Text>
        <Text allowFontScaling={false} style={[styles.openModalLabelInfo, {color: getTimeTextColor()}]}>
          {getSelectedDateTime()}
        </Text>
      </View>
      <View
        style={[
          styles.rightIconWrapper,
          {marginTop: selectedTime && selectedDate ? hp('-8.5%') : hp('0%')},
        ]}>
        <Image source={IMAGES.RIGHT} style={styles.rightArrowStyle} />
      </View>
    </TouchableOpacity>
  );

  const renderSpecialInstructionSection = () => (
    <TouchableOpacity
      onPress={toggleInstructionsModal}
      style={styles.storeInnerWrapper}
      activeOpacity={0.7}>
      <View style={styles.rowInformationWrapper}>
        <Text allowFontScaling={false} style={styles.bottomLabelText}>
          {APP_CONSTANTS.SPECIAL_INSTRUCTION}{' '}
        </Text>
        <Text
            allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[
            styles.openModalLabelInfo,
            {color: specialInstructions ? COLORS.BLACK : COLORS.MAIN_LIGHT},
          ]}>
          {specialInstructions
            ? specialInstructions
            : APP_CONSTANTS.ADD_INSTRUCTION_HERE}
        </Text>
      </View>
      <View style={styles.rightIconWrapper}>
        <Image source={IMAGES.RIGHT} style={styles.rightArrowStyle} />
      </View>
    </TouchableOpacity>
  );

  const renderListFooterComponent = () => {
    return (
      <View style={styles.buttonContainer}>
        <View
          style={[
            styles.btnWrapper,
            {
              backgroundColor: continueBtnDisable
                ? COLORS.DISABLE_BUTTON_COLOR
                : COLORS.ACTIVE_BUTTON_COLOR,
            },
          ]}>
          <Button
            label={APP_CONSTANTS.CONTINUE}
            color={COLORS.WHITE}
            disabled={!!continueBtnDisable}
            width="90%"
            onPress={continueToNextPage}
          />
        </View>
      </View>
    );
  };

  const renderContactInformationModal = () => (
    <ContactInformationModal
      defaultData={state}
      visible={visibleContactInfoModal}
      onRequestClose={toggleContactInfoModal}
      setData={setState}
    />
  );
  const renderPickupTimeModal = () => (
    <PickupTimeModal
      visible={visiblePickupTimeModal}
      onRequestClose={togglePickupTimeModal}
      onTimeSelect={(time, index) => {
        setSelectedTime(time);
        setSelectedTimeIndex(index);
      }}
      onDateSelect={(date, index) => {
        setSelectedDate(date);
        setSelectedDateIndex(index);
      }}
      deliveryMethod={selectedDeliveryType}
      defaultDateIndex={selectedDateIndex}
      defaultTimeIndex={selectedTimeIndex}
    />
  );
  const saveOrderNotificationPreferences = ({email, text, alert}) => {
    setEmailNotification(email);
    setAlertNotification(alert);
    setTextNotifications(text);
  };
  const renderOrderNotificationPreferenceModal = () => {
    return (
      <OrderNotificationPreferenceModal
        visible={isVisibleOrderNotificationModal}
        onRequestClose={toggleNotificationPreferences}
        defaultPreferences={{
          email: emailNotification,
          text: textNotification,
          alert: alertNotification,
        }}
        onShowPermissionModal={onShowAlert}
        onOrderNotificationPreferenceChange={saveOrderNotificationPreferences}
      />
    );
  };
  const renderInstructionModal = () => (
    <InstructionsModal
      visible={visibleInstructionsModal}
      onRequestClose={toggleInstructionsModal}
      onSave={setSpecialInstructions}
      previousData={specialInstructions}
    />
  );

  return (
    <ScreenWrapperComponent
      headerTitle={`CHECKOUT (${cartItemsLength})`}
      withBackButton
      isLoading={isLoading}
      isScrollView={false}
      containerStyle={styles.screenContainer}>
      <CheckoutOrderSteps currentPage={1} />
      <TouchableOpacity activeOpacity={1} style={styles.listWrapper}>
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {renderListHeaderComponent()}
          {renderListFooterComponent()}
        </ScrollView>

        {renderContactInformationModal?.()}
        {renderPickupTimeModal?.()}
        {renderInstructionModal?.()}
        {renderDeliveryAddressModal?.()}
        {renderDestinationVillageAddressModal?.()}
        {renderOrderNotificationPreferenceModal?.()}
      </TouchableOpacity>
    </ScreenWrapperComponent>
  );
};

export default CheckoutOrderDetail;
