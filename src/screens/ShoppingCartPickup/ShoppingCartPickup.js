import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Image, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, IMAGES} from '../../theme';
import {Button, List} from '../../components';
import {styles} from './styles';
import AddPaymentModal from './AddPaymentModal';
import {formatPhoneNumber, formatNumberForBackend} from '../../utils';
import {APP_CONSTANTS} from '../../constants/Strings';
import ContactInformationModal from '../../components/ContactInformationModal';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import BillingInformationView from '../../components/BillingInformationView';
import InstructionsModal from '../../components/SpecialInstructionsModal';
import PickupTimeModal from '../../components/PickUpTimeModal';
import DeliveryAddressModal from '../../components/DeliveryAddressModal';
import {getCompleteAddress, getCompleteDestinationVillage} from '../../utils/addressUtils';
import moment from 'moment';
import {completeOrder} from '../../services/ApiCaller';
import {getItemsFromCart} from '../../utils/cartUtils';
import DestinationVillageModal from '../../components/DestinationVillageModal';
import {camelToSnakeCase, snakeToCamelCase} from '../../utils/transformUtils';
import {BILLING_KEYS, IMAGES_RESIZE_MODES, PAYMENT_METHODS} from '../../constants/Common';
import OrderNotificationPreferenceModal from '../../components/OrderNotificationPreferenceModal';
import DialogBox from '../../components/DialogBox';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import ToastComponent from '../../components/ToastComponent';
import {
  BigNumber,
  checkIfBushTaxExempt,
  checkIfPaymentRemaining,
  getSnapSelectedAmount,
  getSnapTaxForgiven,
} from '../../utils/calculationUtils';
import {showDialogWithTimeout} from '../../utils/helperUtils';
import FlashMessage from 'react-native-flash-message';
import {Divider, getPaymentErrorTitle} from './PaymentsButtons';
import {removeCartAllPayments, removeCartPayment} from '../../redux/actions/payment';
import CheckBox from '../../components/CheckBox';
import ShareCartModal from '../../components/ShareCartModal';
import useNotificationPermissionModal from '../../components/useNotificationPermissionModal';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import useIsGuest from '../../hooks/useIsGuest';
import {STATUSES} from '../../constants/Api';
import CheckoutOrderSteps from "../../components/CheckoutOrderSteps";
import useDeviceInfo from "../../hooks/useDeviceInfo";

const getInitialState = userInfo => {
  const {FirstName = '', LastName = '', PhoneNumber = '', Email = ''} = userInfo ?? {};
  return {
    firstName: FirstName,
    lastName: LastName,
    email: Email,
    contactNumber: formatPhoneNumber(PhoneNumber),
  };
};
const PickUp = ({navigation}) => {
  const {
    cartItems,
    loginInfo,
    selectedDeliveryType,
    notificationSettings,
    storeDetail,
    cartPayments,
    cartInvoice,
    zipCodeDetail,
    isNotificationAllowed,
  } = useSelector(
    ({
      payment: {cartPayments, cartInvoice, payments} = {},
      general: {
        isNotificationAllowed,
        cartItems = [],
        loginInfo = {},
        selectedDeliveryType = '',
        notificationSettings,
        storeDetail = {},
        zipCodeDetail,
      } = {},
    }) => ({
      isNotificationAllowed,
      cartItems,
      loginInfo,
      selectedDeliveryType,
      notificationSettings,
      storeDetail,
      cartPayments,
      cartInvoice,
      payments,
      zipCodeDetail,
    }),
  );

  const {userInfo = {}} = loginInfo ?? {};
  const {StoreLocation = '', ZipCode = '', Store = ''} = userInfo ?? {};
  const [btnDisable, setBtnDisable] = useState(true);
  const [state, setState] = useState(() => getInitialState(userInfo));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [cartItemsLength, setCartItemsLength] = useState(null);
  const [addressData, setAddressData] = useState('');
  const [destinationVillageData, setDestinationVillageData] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryAddressObject, setDeliveryAddressObject] = useState({});
  const [visibleContactInfoModal, setVisibleContactInfoModal] = useState(false);
  const [visiblePickupTimeModal, setVisiblePickupTimeModal] = useState(false);
  const [transactionErrors, setTransactionErrors] = useState([]);
  const [isFreightToAirlineSelected, setIsFreightToAirlineSelected] = useState(false);
  const [isFreightToAirlineModal, setIsFreightToAirlineModal] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);

  const [visibleInstructionsModal, setVisibleInstructionsModal] = useState(false);
  const [visibleDeliveryAddressModal, setVisibleDeliveryAddressModal] = useState(false);
  const [visibleDestinationVillageModal, setVisibleDestinationVillageModal] = useState(false);
  const [isVisibleOrderNotificationModal, setIsVisibleOrderNotificationModal] = useState(false);

  const [visibleAddPaymentModal, setVisibleAddPaymentModal] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);
  const [alertNotification, setAlertNotification] = useState(false);
  const [textNotification, setTextNotifications] = useState(false);

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [isShareCartModal, setIsShareCartModal] = useState(false);

  const isBushOrder = selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY;
  const isAlertAllowed = alertNotification && isNotificationAllowed;

  const {onShowAlert} = useNotificationPermissionModal();

  const billingValuesRef = useRef();
  const toastRef = useRef();
  const flashRef = useRef(null);

  const dispatch = useDispatch();
  const isGuest = useIsGuest();

  const {firstName = '', lastName = '', email = '', contactNumber = ''} = state ?? {};
  const {
    [PAYMENT_METHODS.SNAP_FOOD]: {amount: snapFoodSelectedAmount = 0.0, subTitle: snapFoodSubTitle} = {},
    [PAYMENT_METHODS.SNAP_CASH]: {amount: snapCashSelectedAmount = 0.0, subTitle: snapCashSubTitle} = {},
    [PAYMENT_METHODS.VIRTUAL_WALLET]: {amount: vwSelectedAmount = 0.0, subTitle: vwSelectedSubTitle} = {},
    [PAYMENT_METHODS.GIFT_CARD]: {amount: gcSelectedAmount = 0.0, subTitle: gcSelectedSubTitle} = {},
    [PAYMENT_METHODS.STORE_CHARGE]: {amount: staSelectedAmount = 0.0, subTitle: staSelectedSubTitle} = {},
    [PAYMENT_METHODS.EIGEN]: {paymentMethodId: eigenSelectedPaymentId, subTitle: eigenSelectedSubTitle} = {},
  } = cartPayments ?? {};

  const {
    [BILLING_KEYS.FOOD_STAMP_SUBTOTAL]: foodStampSubtotal = 0,
    [BILLING_KEYS.SNAP_TAX]: snapTax = 0,
    [BILLING_KEYS.TOTAL_AMOUNT]: totalAmount = 0,
  } = cartInvoice ?? {};

  const {bushOrderTaxExempt} = zipCodeDetail || {};
  const isBushTaxExempt = checkIfBushTaxExempt(bushOrderTaxExempt);

  const snapSelectedAmount = useMemo(
    () => getSnapSelectedAmount({food: snapFoodSelectedAmount, cash: snapCashSelectedAmount}),
    [snapCashSelectedAmount, snapFoodSelectedAmount],
  );

  //tax forgiven in case of snap food selected amount
  const snapTaxForgiven = useMemo(
    () =>
      getSnapTaxForgiven({
        amount: snapFoodSelectedAmount,
        snapTax,
        subTotal: foodStampSubtotal,
        isBushTaxExempt,
      }),
    [foodStampSubtotal, isBushTaxExempt, snapFoodSelectedAmount, snapTax],
  );

  //remaining total after tax forgiven
  const isPaymentRemaining = useMemo(
    () =>
      checkIfPaymentRemaining({
        snapTaxForgiven,
        totalAmount,
        snapAmount: snapSelectedAmount,
        vwAmount: vwSelectedAmount,
        gcAmount: gcSelectedAmount,
        staAmount: staSelectedAmount,
        isDebitSelected: eigenSelectedPaymentId,
      }),
    [
      snapTaxForgiven,
      totalAmount,
      snapSelectedAmount,
      vwSelectedAmount,
      gcSelectedAmount,
      staSelectedAmount,
      eigenSelectedPaymentId,
    ],
  );

  const isPlaceOrderDisabled = btnDisable || isPaymentRemaining;

  const selectedCardsString = useMemo(() => {
    return [
      snapFoodSubTitle || snapCashSubTitle,
      eigenSelectedSubTitle,
      gcSelectedSubTitle,
      staSelectedSubTitle,
      vwSelectedSubTitle,
    ]
      .filter(Boolean)
      .join(', ');
  }, [
    snapFoodSubTitle,
    snapCashSubTitle,
    eigenSelectedSubTitle,
    gcSelectedSubTitle,
    staSelectedSubTitle,
    vwSelectedSubTitle,
  ]);

  const toggleApiErrorDialog = () => setIsApiErrorDialogVisible(prevState => !prevState);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  //Button Validation
  useEffect(() => {
    if (selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      if (selectedDate && selectedTime !== null) {
        return setBtnDisable(false);
      }
      return setBtnDisable(true);
    } else {
      if (selectedDate !== null && deliveryAddress.length !== 0) {
        return setBtnDisable(false);
      }
      return setBtnDisable(true);
    }
  }, [selectedTime, selectedDate, deliveryAddress]);

  //Getting Default delivery address if set by user
  useEffect(() => {
    let address = getAddressBasedOnDeliveryType();
    setDeliveryAddress(address);
    MixPanelInstance.trackViewCheckout({cart: cartItems, invoice: cartInvoice, deliveryType: selectedDeliveryType});
  }, []);

  const getAddressBasedOnDeliveryType = () => {
    let address = '';
    if (selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      const {
        storeStreetAddress = '',
        storeLocationVillage,
        storeLocationState = 'AK',
        storeZipCode,
        storeName: ACStoreName,
      } = storeDetail || {};
      let curbsideAddressObject = {
        firstName,
        lastName,
        city: storeLocationVillage || StoreLocation,
        storeAddress: storeStreetAddress,
        storeName: ACStoreName || Store,
        zipCode: storeZipCode || ZipCode,
        state: storeLocationState === 'Alaska' ? 'AK' : storeLocationState,
      };
      setDeliveryAddressObject(curbsideAddressObject);
    }
    return address;
  };

  //Getting Total and Subtotal of Cart
  useEffect(() => {
    let cart = cartItems.filter(item => item.quantity > 0);
    setCartItemsLength(cart.length);
  }, [cartItems]);

  useEffect(() => {
    if (!isGuest) {
      setAlertNotification(notificationSettings[0].isEnabled && isNotificationAllowed);
      setTextNotifications(notificationSettings[2].isEnabled);
    } else {
      setTextNotifications(true);
      setAlertNotification(false);
    }
  }, [notificationSettings, isGuest]);

  const toggleContactInfoModal = () => setVisibleContactInfoModal(prevState => !prevState);

  const togglePickupTimeModal = () => setVisiblePickupTimeModal(prevState => !prevState);

  const toggleInstructionsModal = () => setVisibleInstructionsModal(prevState => !prevState);

  const openAddPaymentModal = () => setVisibleAddPaymentModal(true);

  const closeAddPaymentModal = () => setVisibleAddPaymentModal(false);

  const onCloseTransactionModal = useCallback(() => {
    setIsTransactionModal(false);
    setTimeout(openAddPaymentModal, 400);
  }, []);

  const onCloseShareModal = () => {
    setIsShareCartModal(false);
  };

  const onSetTransactionErrors = payments => {
    const failedPayments = [];
    const failedMethods = [];
    for (const [key, value] of Object.entries(camelToSnakeCase(payments))) {
      const payment = {...(cartPayments[key] || {}), ...(value?.error || value || {})};
      const {title} = getPaymentErrorTitle({...payment});
      failedPayments.push({...payment, modalTitle: `${title} Error`, title});
      failedMethods.push(key);
    }
    dispatch(removeCartPayment({methods: failedMethods}));
    setTransactionErrors(failedPayments);
    return failedPayments?.length;
  };

  const toggleNotificationPreferences = () => setIsVisibleOrderNotificationModal(prevState => !prevState);

  const toggleDestinationVillageModal = () => setVisibleDestinationVillageModal(prevState => !prevState);
  const toggleDeliveryAddressModal = () => setVisibleDeliveryAddressModal(prevState => !prevState);
  const getSelectedDateTime = () => {
    const {listName = '', time = ''} = selectedTime ?? {};
    if (selectedTime && selectedDate) {
      return `${moment(selectedDate).format('M/D')} ${listName}, ${time}`;
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
          completeDateTime = `${moment(selectedDate).format('M/D')}`;
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

  const getDeliveryAddressText = () => {
    if (deliveryAddress) {
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

  const saveOrderNotificationPreferences = ({email, text, alert}) => {
    setEmailNotification(email);
    setAlertNotification(alert);
    setTextNotifications(text);
  };

  const getAddress = address => {
    setAddressData(address);
    const completeAddress = getCompleteAddress(address);
    setDeliveryAddress(completeAddress);
    setDeliveryAddressObject(address);
  };

  const getDestinationVillage = destinationVillage => {
    setDestinationVillageData(destinationVillage);
    const completeDestinationAddress = getCompleteDestinationVillage(destinationVillage, zipCodeDetail);
    setDeliveryAddress(completeDestinationAddress);
    setDeliveryAddressObject(destinationVillage);
  };

  const deviceInformation = useDeviceInfo();

  const placeOrder = async () => {
    if (isPlaceOrderDisabled) {
      return toastRef.current?.show('Please enter full payment', 2000);
    }
    const invoice = billingValuesRef.current.getBillingValues();
    if (BigNumber(snapTaxForgiven).gt(0)) {
      invoice[BILLING_KEYS.TAX_FORGIVEN] = BigNumber(invoice[BILLING_KEYS.TAX_FORGIVEN]).plus(snapTaxForgiven);
      invoice[BILLING_KEYS.TOTAL_AMOUNT] = BigNumber(invoice[BILLING_KEYS.TOTAL_AMOUNT]).minus(snapTaxForgiven);
    }
    setIsLoading(true);
    let notifications = {
      alert: isAlertAllowed,
      text: textNotification,
      email: true,
    };
    let contactInfo = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      FullName: firstName + ' ' + lastName,
      phoneNumber: formatNumberForBackend(contactNumber),
    };
    const {listName: pickupSession = '', time: pickupTime = ''} = selectedTime ?? {};
    let mappedOrderItems = [];
    cartItems.forEach(item => {
      mappedOrderItems.push({item: item});
    });
    const orderData = {
      isFreightToAirline: isFreightToAirlineSelected,
      notifications,
      instructions: specialInstructions,
      contactInfo,
      orderType: selectedDeliveryType,
      pickUpTime: pickupTime,
      deliveryAddress: deliveryAddressObject,
      deliveryDate: moment(selectedDate).format(),
      deliverySession: pickupSession,
      orderItems: mappedOrderItems,
      invoice: snakeToCamelCase(invoice),
      cartPayments: snakeToCamelCase(cartPayments),
      deviceInfo:deviceInformation
    };

    const {response = {}} = await completeOrder(orderData);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
      data: {response: orderDetail = {}, transactions, failPayments} = {},
    } = response ?? {};
    const isPaymentsFailed = onSetTransactionErrors(failPayments);

    if (ok && status === STATUSES.OK && !isPaymentsFailed) {
      const {invoice: resInvoice, storeName, zipCode, city} = orderDetail || {};
      await getItemsFromCart(dispatch);
      navigation.replace('OrderConfirmation', {orderDetail, transactions});
      MixPanelInstance.trackPurchase({
        cart: cartItems,
        invoice: resInvoice || {},
        payments: cartPayments,
        address: {city, storeName, zipCode},
        deliveryType: selectedDeliveryType,
      });
    } else if (isUnderMaintenance) {
      setIsTransactionModal(false);
      setIsApiErrorDialogVisible(false);
    } else if (isPaymentsFailed) {
      setTimeout(() => setIsTransactionModal(true), 300);
    } else if (!isNetworkError) {
      handleApiError();
    }
    setIsLoading(false);
  };

  const handleApiError = () => {
    showDialogWithTimeout(toggleApiErrorDialog);
  };

  const onCloseFreightToAirlineModal = () => {
    setIsFreightToAirlineModal(false);
  };

  const onConfirmFreightToAirline = () => {
    onCloseFreightToAirlineModal();
    onRemoveAllPayments();
    setIsFreightToAirlineSelected(true);
  };

  const getAlertInfo = () => {
    const info = `${isAlertAllowed ? 'Alert, ' : ''}${textNotification ? 'Text, ' : ''}${
      emailNotification ? 'Email' : ''
    }`;
    return info?.replace(/,\s*$/, '') || 'Select Notification Preferences';
  };

  const onRemoveAllPayments = useCallback(() => {
    // dispatch(removeCartAllPayments());
  }, [dispatch]);

  const onPressFreightCheckBox = useCallback(() => {
    if (isFreightToAirlineSelected) {
      setIsFreightToAirlineSelected(false);
      onRemoveAllPayments();
    } else {
      setIsFreightToAirlineModal(true);
    }
  }, [isFreightToAirlineSelected, onRemoveAllPayments]);

  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={toggleApiErrorDialog}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
        message={APP_CONSTANTS.CHECKOUT_FAILED_MESSAGE}
        messageContainerStyles={styles.dialogBoxMessage}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        isSingleButton
        onCancelPress={toggleApiErrorDialog}
      />
    );
  };

  const renderFreightToAirlineModal = () => {
    return (
      <DialogBox
        visible={isFreightToAirlineModal}
        closeModal={onCloseFreightToAirlineModal}
        title={APP_CONSTANTS.FREIGHT_CHARGE_PAYMENT}
        message={APP_CONSTANTS.PAY_FREIGHT_TO_AIRLINE_CONFIRMATION}
        messageContainerStyles={styles.dialogBoxMessage}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        confirmButtonLabel={APP_CONSTANTS.CONFIRM}
        onCancelPress={onCloseFreightToAirlineModal}
        onConfirmPress={onConfirmFreightToAirline}
      />
    );
  };

  const renderListHeaderComponent = () => {
    return (
      <>
        {/*<View style={styles.sendStoreContainer}>*/}
        {/*  <Text style={styles.shareToStore}>{APP_CONSTANTS.SHARE_ITEMS_WITH_STORE}</Text>*/}
        {/*  <Text style={styles.shareToStoreInfo}>*/}
        {/*    <Text onPress={() => setIsShareCartModal(true)} style={styles.clickHere}>*/}
        {/*      {APP_CONSTANTS.CLICK_HERE}*/}
        {/*    </Text>*/}
        {/*    {` ${APP_CONSTANTS.SHARE_ITEMS_WITH_STORE_TEXT}`}*/}
        {/*  </Text>*/}
        {/*</View>*/}
        <TouchableOpacity activeOpacity={1}>
          {renderContactInformation()}
          <View style={styles.blankView} />
          {renderScheduleInfo()}
          <View style={styles.blankView} />
          {renderPaymentInformationView}
          {renderFreightToAirLine}
          <View style={styles.blankView} />
          <View style={{backgroundColor: COLORS.WHITE}}>
            <Text allowFontScaling={false} style={styles.ordernumber}>{APP_CONSTANTS.REVIEW_ORDER}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderContactInformation = () => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.mainWrapper}>
        <View style={styles.textWrapper}>
          <View style={styles.editProfileWrapper}>
            <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.CONTACT_INFORMATION}</Text>
            <TouchableOpacity onPress={toggleContactInfoModal} activeOpacity={0.7} style={styles.editTextWrapper}>
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

  const checkDeliveryDateOrPickupTime = () => {
    if (selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      return renderPickupTimeSection();
    }
    return renderDeliveryDateView();
  };

  const onShowPaymentToast = (message = APP_CONSTANTS.APPLIED_FULL_AMOUNT) => {
    setTimeout(() => {
      flashRef.current?.showMessage?.({message: message, backgroundColor: COLORS.BLACK});
    }, 600);
  };

  const renderDeliveryDateView = () => {
    return (
      <TouchableOpacity
        onPress={togglePickupTimeModal}
        style={[styles.storeInnerWrapper, {marginTop: hp('3%')}]}
        activeOpacity={0.7}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.DELIVERY_DATE_}</Text>
          <Text allowFontScaling={false} style={[styles.openModalLabelInfo, {color: getTimeTextColor()}]}>{getSelectedDeliveryDate()}</Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <ImageComponent source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
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
              ? APP_CONSTANTS.SCHEDULE_PICKUP
              : selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY
              ? APP_CONSTANTS.DELIVERY_INFORMATION
              : APP_CONSTANTS.BUSH_DELIVERY_INFORMATION}
          </Text>
        </View>
        <View style={styles.storeWrapper}>
          {checkHomeDeliveryOrBushDelivery()}
          {checkDeliveryDateOrPickupTime()}
          {renderNotificationPreferences()}
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
        style={[styles.storeInnerWrapper, {marginTop: hp('2.5%')}]}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.ORDER_NOTIFICATION_PREFERENCE}</Text>
          <Text allowFontScaling={false} style={[styles.openModalLabelInfo, {color: getNotificationPreferenceTextColor()}]}>
            {getAlertInfo()}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <Image source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderDeliveryAddressInfoView = () => {
    return (
      <TouchableOpacity style={styles.storeInnerWrapper} activeOpacity={0.7} onPress={toggleDeliveryAddressModal}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.DELIVERY_ADDRESS}</Text>
          <Text allowFontScaling={false} style={[styles.openModalLabelInfo, {color: getDeliveryAddressText()}]}>
            {deliveryAddress ? deliveryAddress : APP_CONSTANTS.ADD_ADDRESS}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <Image source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDestinationVillageInfo = () => {
    return (
      <TouchableOpacity onPress={toggleDestinationVillageModal} style={styles.storeInnerWrapper} activeOpacity={0.7}>
        <View style={styles.rowInformationWrapper}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.DESTINATION_VILLAGE}</Text>
          <Text allowFontScaling={false} style={[styles.openModalLabelInfo, {color: getDeliveryAddressText(), width: '90%'}]}>
            {deliveryAddress ? deliveryAddress : APP_CONSTANTS.ADD_DESTINATION_VILLAGE}
          </Text>
        </View>
        <View style={styles.rightIconWrapper}>
          <Image source={IMAGES.RIGHT_ARROW} resizeMode={IMAGES_RESIZE_MODES.COVER} style={styles.rightArrowStyle} />
        </View>
      </TouchableOpacity>
    );
  };
  const renderPickupTimeSection = () => (
    <TouchableOpacity onPress={togglePickupTimeModal} style={styles.storeInnerWrapper}>
      <View style={styles.rowInformationWrapper}>
        <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.PICKUP_TIME}</Text>
        <Text allowFontScaling={false} style={[styles.openModalLabelInfo, {color: getTimeTextColor()}]}>{getSelectedDateTime()}</Text>
      </View>
      <View style={styles.rightIconWrapper}>
        <Image source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
      </View>
    </TouchableOpacity>
  );

  const renderSpecialInstructionSection = () => (
    <TouchableOpacity
      onPress={toggleInstructionsModal}
      style={[styles.storeInnerWrapper, {marginTop: hp('3%')}]}
      activeOpacity={0.7}>
      <View style={styles.rowInformationWrapper}>
        <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.SPECIAL_INSTRUCTION} </Text>
        <Text
            allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.openModalLabelInfo, {color: specialInstructions ? COLORS.BLACK : COLORS.MAIN_LIGHT}]}>
          {specialInstructions ? specialInstructions : APP_CONSTANTS.ADD_INSTRUCTION_HERE}
        </Text>
      </View>
      <View style={styles.rightIconWrapper}>
        <Image source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
      </View>
    </TouchableOpacity>
  );

  const renderPaymentInformationView = useMemo(() => {
    return (
      <TouchableOpacity
        style={[styles.mainWrapper, isBushOrder && styles.payment]}
        activeOpacity={0.7}
        onPress={openAddPaymentModal}>
        <View style={{marginStart: wp('6%')}}>
          <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.PAYMENT}</Text>
          <View style={[styles.storeInnerWrapper, {paddingBottom: hp('1.2%'), width: '100%'}]}>
            <View style={styles.rowInformationWrapper}>
              <Text allowFontScaling={false}
                style={[styles.openModalLabelInfo, {color: selectedCardsString ? COLORS.BLACK : COLORS.MAIN_LIGHT}]}>
                {selectedCardsString || APP_CONSTANTS.ADD_PAYMENT_METHOD}
              </Text>
            </View>
            <View style={styles.rightIconWrapper}>
              <Image source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [isBushOrder, selectedCardsString]);

  const renderFreightToAirLine = useMemo(() => {
    if (isBushOrder) {
      return (
        <View style={styles.freight}>
          <Divider style={styles.freightDivider} />
          <TouchableOpacity activeOpacity={0.8} style={styles.freightContent} onPress={onPressFreightCheckBox}>
            <CheckBox isSelected={isFreightToAirlineSelected} disabled />
            <Text allowFontScaling={false} style={styles.freightText}>{APP_CONSTANTS.PAY_FREIGHT_TO_AIRLINE}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [isBushOrder, isFreightToAirlineSelected, onPressFreightCheckBox]);

  const renderListFooterComponent = () => {
    return (
      <TouchableOpacity activeOpacity={1} style={{backgroundColor: COLORS.WHITE}}>
        <View style={[styles.divider, styles.dividerII]} />
        <BillingInformationView
          isFreightToAirline={isFreightToAirlineSelected}
          ref={billingValuesRef}
          snapTaxForgiven={snapTaxForgiven}
        />
        <View style={styles.buttonContainer}>
          <View
            style={[
              styles.btnWrapper,
              {
                backgroundColor: isPlaceOrderDisabled ? COLORS.DISABLE_BUTTON_COLOR : COLORS.ACTIVE_BUTTON_COLOR,
              },
            ]}>
            <Button
              label={APP_CONSTANTS.PLACE_ORDER}
              color={COLORS.WHITE}
              disabled={btnDisable}
              width="90%"
              onPress={placeOrder}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemSeparatorView = () => {
    return <View style={styles.itemSeparator} />;
  };

  const renderCartItems = ({item}) => <CartItemConfirmationCard item={item} />;

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

  const renderInstructionModal = () => (
    <InstructionsModal
      visible={visibleInstructionsModal}
      onRequestClose={toggleInstructionsModal}
      onSave={setSpecialInstructions}
      previousData={specialInstructions}
    />
  );

  const renderPaymentModal = useMemo(
    () => (
      <AddPaymentModal
        visible={visibleAddPaymentModal}
        isTransactionErrorModal={isTransactionModal}
        onCloseTransactionModal={onCloseTransactionModal}
        onRequestClose={closeAddPaymentModal}
        isPaymentRemaining={isPaymentRemaining}
        snapTaxForgiven={snapTaxForgiven}
        onShowPaymentToast={onShowPaymentToast}
        transactionErrors={transactionErrors}
      />
    ),
    [
      isPaymentRemaining,
      isTransactionModal,
      onCloseTransactionModal,
      snapTaxForgiven,
      transactionErrors,
      visibleAddPaymentModal,
    ],
  );

  const renderDeliveryAddressModal = () => (
    <DeliveryAddressModal
      isVisible={visibleDeliveryAddressModal}
      closeModal={toggleDeliveryAddressModal}
      defaultData={addressData}
      onAddressChange={getAddress}
    />
  );

  const renderDestinationVillageAddressModal = () => (
    <DestinationVillageModal
      isVisible={visibleDestinationVillageModal}
      closeModal={toggleDestinationVillageModal}
      defaultData={destinationVillageData}
      onDestinationVillageChange={getDestinationVillage}
    />
  );

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

  return (
    <ScreenWrapperComponent
      headerTitle={`CHECKOUT (${cartItemsLength})`}
      withBackButton
      isLoading={isLoading}
      isScrollView={false}
      containerStyle={styles.screenContainer}>
      <CheckoutOrderSteps currentPage={2}/>
      <TouchableOpacity activeOpacity={1} style={styles.listWrapper}>
        <List
          data={cartItems}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeaderComponent}
          ListFooterComponent={renderListFooterComponent}
          ItemSeparatorComponent={renderItemSeparatorView}
          renderItem={renderCartItems}
        />
        {renderContactInformationModal?.()}
        {renderPickupTimeModal?.()}
        {renderInstructionModal?.()}
        {renderPaymentModal}
        {renderDeliveryAddressModal?.()}
        {renderDestinationVillageAddressModal?.()}
        {renderOrderNotificationPreferenceModal?.()}
        {renderFreightToAirlineModal()}
      </TouchableOpacity>
      {renderApiErrorDialog?.()}
      <ToastComponent toastRef={toastRef} positionValue={260} position={'bottom'} />
      <FlashMessage
        floating
        ref={flashRef}
        position={'bottom'}
        backgroundColor={COLORS.GRAY_TEXT_0_9}
        color={COLORS.WHITE}
        style={styles.flashScreenStyle}
        titleStyle={styles.flashTitle}
        textStyle={styles.flashTitle}
        duration={4000}
      />
      <ShareCartModal visible={isShareCartModal} onClose={onCloseShareModal} />
    </ScreenWrapperComponent>
  );
};

export default PickUp;
