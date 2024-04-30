import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Image, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, IMAGES} from '../../theme';
import {Button, List} from '../../components';
import {styles} from './style';
import {formatPhoneNumber, formatNumberForBackend} from '../../utils';
import {APP_CONSTANTS} from '../../constants/Strings';
import ContactInformationModal from '../../components/ContactInformationModal';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import BillingInformationView from '../../components/BillingInformationView';
import moment from 'moment';
import {completeOrder} from '../../services/ApiCaller';
import {getItemsFromCart} from '../../utils/cartUtils';
import {camelToSnakeCase, snakeToCamelCase} from '../../utils/transformUtils';
import {BILLING_KEYS, PAYMENT_METHODS} from '../../constants/Common';
import DialogBox from '../../components/DialogBox';
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
import {
  Divider,
  getPaymentErrorTitle,
} from '../ShoppingCartPickup/PaymentsButtons';
import {
  removeCartAllPayments,
  removeCartPayment,
} from '../../redux/actions/payment';
import ShareCartModal from '../../components/ShareCartModal';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import useIsGuest from '../../hooks/useIsGuest';
import {STATUSES} from '../../constants/Api';
import CheckoutOrderSteps from '../../components/CheckoutOrderSteps';
import PickupTimeModal from '../../components/PickUpTimeModal';
import {
  getCompleteAddress,
  getCompleteDestinationVillage,
} from '../../utils/addressUtils';
import DestinationVillageModal from '../../components/DestinationVillageModal';
import DeliveryAddressModal from '../../components/DeliveryAddressModal';
import {
  getInitialState,
  getdeliveryDateFromRedux,
  getAddressFromRedux,
} from './constants';
import AddPaymentModal from '../ShoppingCartPickup/AddPaymentModal';
import {logToConsole} from '../../configs/ReactotronConfig';
import {formatTime} from '../../utils/timeUtils';
import useDeviceInfo from '../../hooks/useDeviceInfo';

const CheckoutReviewOrder = ({navigation, route}) => {
  // const {
  //   cartItems,
  //   loginInfo,
  //   selectedDeliveryType,
  //   notificationSettings,
  //   storeDetail,
  //   cartPayments,
  //   cartInvoice,
  //   zipCodeDetail,
  //   isNotificationAllowed,
  //   guestSelectedSegmentIndex,
  //   segments,
  // } = useSelector(
  //   ({
  //     payment: {cartPayments, cartInvoice, payments} = {},
  //     general: {
  //       isNotificationAllowed,
  //       cartItems = [],
  //       loginInfo = {},
  //       selectedDeliveryType = '',
  //       notificationSettings,
  //       storeDetail = {},
  //       zipCodeDetail,
  //       guestSelectedSegmentIndex,
  //       segments,
  //     } = {},
  //   }) => ({
  //     isNotificationAllowed,
  //     cartItems,
  //     loginInfo,
  //     selectedDeliveryType,
  //     notificationSettings,
  //     storeDetail,
  //     cartPayments,
  //     cartInvoice,
  //     payments,
  //     zipCodeDetail,
  //     guestSelectedSegmentIndex,
  //     segments,
  //   }),
  // );

  // const {checkoutInformation, deliveryDetail, address} = useSelector(
  //   ({checkoutinfo: {checkoutInformation, deliveryDetail, address} = {}}) => ({
  //     checkoutInformation,
  //     deliveryDetail,
  //     address,
  //   }),
  // );

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
  const guestSelectedSegmentIndexSelector = useMemo(
    () => state => state.general.guestSelectedSegmentIndex,
    [],
  );
  const segmentsSelector = useMemo(() => state => state.general.segments, []);

  const cartPaymentsSelector = useMemo(
    () => state => state.payment.cartPayments,
    [],
  );
  const cartInvoiceSelector = useMemo(
    () => state => state.payment.cartInvoice,
    [],
  );
  const isNotificationAllowedSelector = useMemo(
    () => state => state.general.isNotificationAllowed,
    [],
  );

  const cartItems = useSelector(cartItemsSelector);
  const loginInfo = useSelector(loginInfoSelector);
  const selectedDeliveryType = useSelector(selectedDeliveryTypeSelector);
  const notificationSettings = useSelector(notificationSettingsSelector);
  const storeDetail = useSelector(storeDetailSelector);
  const zipCodeDetail = useSelector(zipCodeDetailSelector);
  const guestSelectedSegmentIndex = useSelector(
    guestSelectedSegmentIndexSelector,
  );
  const segments = useSelector(segmentsSelector);
  const cartPayments = useSelector(cartPaymentsSelector);
  const cartInvoice = useSelector(cartInvoiceSelector);
  const isNotificationAllowed = useSelector(isNotificationAllowedSelector);

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
  const {StoreLocation = '', ZipCode = '', Store = ''} = userInfo ?? {};
  const [btnDisable, setBtnDisable] = useState(true);
  const [state, setState] = useState(() =>
    getInitialState(checkoutInformation),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [cartItemsLength, setCartItemsLength] = useState(null);
  const [addressData, setAddressData] = useState('');
  const [destinationVillageData, setDestinationVillageData] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryAddressObject, setDeliveryAddressObject] = useState({});
  const [visibleContactInfoModal, setVisibleContactInfoModal] = useState(false);
  const [transactionErrors, setTransactionErrors] = useState([]);
  const [isFreightToAirlineSelected, setIsFreightToAirlineSelected] = useState(
    route?.params?.isFreightToAirlineSelected,
  );
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(false);
  const [visibleAddPaymentModal, setVisibleAddPaymentModal] = useState(false);
  const [alertNotification, setAlertNotification] = useState(false);
  const [textNotification, setTextNotifications] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState(
    route?.params?.instructions,
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [isShareCartModal, setIsShareCartModal] = useState(false);
  const [visiblePickupTimeModal, setVisiblePickupTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleDestinationVillageModal, setVisibleDestinationVillageModal] =
    useState(false);
  const [visibleDeliveryAddressModal, setVisibleDeliveryAddressModal] =
    useState(false);
  const isBushOrder = selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY;
  const isAlertAllowed = alertNotification && isNotificationAllowed;
  const billingValuesRef = useRef();
  const toastRef = useRef();
  const flashRef = useRef(null);
  const selectedSegment = segments[guestSelectedSegmentIndex];
  const dispatch = useDispatch();
  const isGuest = useIsGuest();
  const {bushOrderTaxExempt} = zipCodeDetail || {};
  const isBushTaxExempt = checkIfBushTaxExempt(bushOrderTaxExempt);

  const openAddPaymentModal = () => setVisibleAddPaymentModal(true);

  const closeAddPaymentModal = () => setVisibleAddPaymentModal(false);
  const {
    firstName = '',
    lastName = '',
    email = '',
    contactNumber = '',
  } = state ?? {};

  useEffect(() => {
    setState(getInitialState(checkoutInformation));
  }, [checkoutInformation]);

  useEffect(() => {
    const dateAndTime = getdeliveryDateFromRedux(deliveryDetail);
    setSelectedDate(dateAndTime.selectedDate);
    setSelectedTime(dateAndTime.selectedTime);
    setSelectedDateIndex(dateAndTime.selectedDateIndex);
    setSelectedTimeIndex(dateAndTime.selectedTimeIndex);
  }, [deliveryDetail]);

  useEffect(() => {
    const mnaddressData = getAddressFromRedux(address);
    setAddressData(mnaddressData.addressData);
    const completeAddress = getCompleteAddress(mnaddressData.addressData);
    setDeliveryAddress(completeAddress);
    setDeliveryAddressObject(mnaddressData.addressData);
  }, [address]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY) {
      if (selectedDate !== null) {
        setBtnDisable(false);
      } else {
        setBtnDisable(true);
      }
    } else {
      if (selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP) {
        if (selectedDate && selectedTime !== null) {
          setBtnDisable(false);
        } else {
          setBtnDisable(true);
        }
      } else {
        if (selectedDate !== null && addressData.length !== 0) {
          setBtnDisable(false);
        } else {
          setBtnDisable(true);
        }
      }
    }
  }, [selectedDeliveryType, selectedTime, selectedDate, addressData]);

  //Getting Default delivery address if set by user
  useEffect(() => {
    let address = getAddressBasedOnDeliveryType();
    setDeliveryAddress(address);
    MixPanelInstance.trackViewCheckout({
      cart: cartItems,
      invoice: cartInvoice,
      deliveryType: selectedDeliveryType,
    });
  }, [address]);

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

  //get adress and suit value from adress coming from redux
  const addressvalue = addressData?.Address;
  const suite = addressData?.Suite;

  //getting time and listname from redux values
  const time = selectedTime?.time;
  const listName = selectedTime?.listName;

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

  const {
    [PAYMENT_METHODS.SNAP_FOOD]: {
      amount: snapFoodSelectedAmount = 0.0,
      subTitle: snapFoodSubTitle,
    } = {},
    [PAYMENT_METHODS.SNAP_CASH]: {
      amount: snapCashSelectedAmount = 0.0,
      subTitle: snapCashSubTitle,
    } = {},
    [PAYMENT_METHODS.VIRTUAL_WALLET]: {
      amount: vwSelectedAmount = 0.0,
      subTitle: vwSelectedSubTitle,
    } = {},
    [PAYMENT_METHODS.GIFT_CARD]: {
      amount: gcSelectedAmount = 0.0,
      subTitle: gcSelectedSubTitle,
    } = {},
    [PAYMENT_METHODS.STORE_CHARGE]: {
      amount: staSelectedAmount = 0.0,
      subTitle: staSelectedSubTitle,
    } = {},
    [PAYMENT_METHODS.EIGEN]: {
      paymentMethodId: eigenSelectedPaymentId,
      subTitle: eigenSelectedSubTitle,
    } = {},
  } = cartPayments ?? {};

  const {
    [BILLING_KEYS.FOOD_STAMP_SUBTOTAL]: foodStampSubtotal = 0,
    [BILLING_KEYS.SNAP_TAX]: snapTax = 0,
    [BILLING_KEYS.TOTAL_AMOUNT]: totalAmount = 0,
  } = cartInvoice ?? {};

  const snapSelectedAmount = useMemo(
    () =>
      getSnapSelectedAmount({
        food: snapFoodSelectedAmount,
        cash: snapCashSelectedAmount,
      }),
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

  const toggleDestinationVillageModal = () =>
    setVisibleDestinationVillageModal(prevState => !prevState);

  const togglePickupTimeModal = () =>
    setVisiblePickupTimeModal(prevState => !prevState);
  const toggleApiErrorDialog = () =>
    setIsApiErrorDialogVisible(prevState => !prevState);

  const toggleDeliveryAddressModal = () =>
    setVisibleDeliveryAddressModal(prevState => !prevState);

  const toggleContactInfoModal = () =>
    setVisibleContactInfoModal(prevState => !prevState);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

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

  const onCloseShareModal = () => {
    setIsShareCartModal(false);
  };

  const onSetTransactionErrors = payments => {
    const failedPayments = [];
    const failedMethods = [];
    for (const [key, value] of Object.entries(camelToSnakeCase(payments))) {
      const payment = {
        ...(cartPayments[key] || {}),
        ...(value?.error || value || {}),
      };
      const {title} = getPaymentErrorTitle({...payment});
      failedPayments.push({...payment, modalTitle: `${title} Error`, title});
      failedMethods.push(key);
    }
    dispatch(removeCartPayment({methods: failedMethods}));
    setTransactionErrors(failedPayments);
    return failedPayments?.length;
  };

  const deviceInformation = useDeviceInfo();

  const placeOrder = async () => {
    if (isPlaceOrderDisabled) {
      return toastRef.current?.show('Please enter full payment', 2000);
    }
    const invoice = billingValuesRef.current.getBillingValues();
    if (BigNumber(snapTaxForgiven).gt(0)) {
      invoice[BILLING_KEYS.TAX_FORGIVEN] = BigNumber(
        invoice[BILLING_KEYS.TAX_FORGIVEN],
      ).plus(snapTaxForgiven);
      invoice[BILLING_KEYS.TOTAL_AMOUNT] = BigNumber(
        invoice[BILLING_KEYS.TOTAL_AMOUNT],
      ).minus(snapTaxForgiven);
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
    const {listName: pickupSession = '', time: pickupTime = ''} =
      selectedTime ?? {};
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
      deviceInfo: deviceInformation,
    };
    logToConsole({orderData});
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

  const renderSegmentView = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View>
          <Text allowFontScaling={false} style={styles.selectedindexValue}>
            {selectedSegment}
          </Text>
          <View style={styles.segmented_selectedstyle} />
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  };
  const renderListHeaderComponent = () => {
    return (
      <>
        <View style={{backgroundColor: COLORS.WHITE}}>
          {renderSegmentView()}
          <Text allowFontScaling={false} style={styles.ordernumber}>
            {APP_CONSTANTS.REVIEW_ORDER}
          </Text>
          <Text allowFontScaling={false} style={styles.cartHeaderText}>
            {cartItems.length}{' '}
            {cartItems.length === 1 ? APP_CONSTANTS.ITEM : APP_CONSTANTS.ITEMS}
          </Text>
        </View>
      </>
    );
  };
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
    />
  );

  const renderContactInformation = () => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.mainWrapper}>
        <View style={styles.textWrapper}>
          <View style={styles.editProfileWrapper}>
            <Text allowFontScaling={false} style={styles.textHeader}>
              {APP_CONSTANTS.CONTACT_INFORMATION}
            </Text>
            <TouchableOpacity
              onPress={toggleContactInfoModal}
              activeOpacity={0.7}
              style={styles.editTextWrapper}>
              <Text allowFontScaling={false} style={styles.editText}>
                {APP_CONSTANTS.EDIT}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.userInfoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>
              {APP_CONSTANTS.NAME}
            </Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>
              {firstName} {lastName}
            </Text>
          </View>
          <View style={styles.contactInformationDivider} />
          <View style={styles.userInfoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>
              {APP_CONSTANTS.PHONE_NUM}
            </Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>
              {contactNumber}
            </Text>
          </View>
          <View style={styles.contactInformationDivider} />
          <View style={styles.userInfoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>
              {APP_CONSTANTS.EMAIL}
            </Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>
              {email}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBushDeliveryDetail = () => {
    if (selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.mainWrapper}>
          <View style={styles.textWrapper}>
            <View style={styles.editProfileWrapper}>
              <Text allowFontScaling={false} style={styles.textHeader}>
                {APP_CONSTANTS.BUSH_DELIVERY_INFORMATION}
              </Text>
            </View>
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>
                {APP_CONSTANTS.STORE}
              </Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {Store}
              </Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>
                {APP_CONSTANTS.ZIP_CODE}
              </Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {ZipCode}
              </Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View
              style={[
                styles.userInfoWrapper,
                styles.editHomeDeliveryAdressWrapper,
              ]}>
              <View>
                <Text allowFontScaling={false} style={styles.labelText}>
                  {APP_CONSTANTS.REQUESTED_DELIVERY_TO_AIRLINE}
                </Text>
                <Text allowFontScaling={false} style={styles.labelInfo}>
                  {monthName} {dayValue}, {yearValue}
                </Text>
              </View>
              <TouchableOpacity
                onPress={togglePickupTimeModal}
                activeOpacity={0.7}
                style={styles.editTextWrapper}>
                <Text allowFontScaling={false} style={styles.editText}>
                  {APP_CONSTANTS.EDIT}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>
                {APP_CONSTANTS.DESTINATION_AIRPORT}
              </Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {StoreLocation}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const renderCurbsideDeliveryDetail = () => {
    if (selectedDeliveryType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.mainWrapper}>
          <View style={styles.textWrapper}>
            <View style={styles.editProfileWrapper}>
              <Text allowFontScaling={false} style={styles.textHeader}>
                {APP_CONSTANTS.PICKUP_DATE_AND_TIME}
              </Text>
              <TouchableOpacity
                onPress={togglePickupTimeModal}
                activeOpacity={0.7}
                style={styles.editTextWrapper}>
                <Text allowFontScaling={false} style={styles.editText}>
                  {APP_CONSTANTS.EDIT}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>
                {listName}
              </Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {time}
              </Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>
                {APP_CONSTANTS.DATE}
              </Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {monthName} {dayValue}, {yearValue}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const renderHomeDeliveryDetail = () => {
    if (selectedDeliveryType === APP_CONSTANTS.HOME_DELIVERY) {
      return (
        <TouchableOpacity activeOpacity={1} style={styles.mainWrapper}>
          <View style={styles.textWrapper}>
            <View style={styles.editProfileWrapper}>
              <Text allowFontScaling={false} style={styles.textHeader}>
                {APP_CONSTANTS.DELIVERY_INFORMATION}
              </Text>
            </View>
            <View
              style={[
                styles.userInfoWrapper,
                styles.editHomeDeliveryAdressWrapper,
              ]}>
              <View>
                <Text allowFontScaling={false} style={styles.labelText}>
                  {APP_CONSTANTS.ADDRESS}
                </Text>
                <Text allowFontScaling={false} style={styles.labelInfo}>
                  {addressvalue}
                  {suite ? `, Apt # ${suite}` : ''}
                </Text>
              </View>
              <TouchableOpacity
                onPress={toggleDeliveryAddressModal}
                activeOpacity={0.7}
                style={styles.editTextWrapper}>
                <Text allowFontScaling={false} style={styles.editText}>
                  {APP_CONSTANTS.EDIT}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contactInformationDivider} />
            <View style={styles.userInfoWrapper}>
              <Text allowFontScaling={false} style={styles.labelText}>
                {Store}
              </Text>
              <Text allowFontScaling={false} style={styles.labelInfo}>
                {ZipCode}
              </Text>
            </View>
            <View style={styles.contactInformationDivider} />
            <View
              style={[
                styles.userInfoWrapper,
                styles.editHomeDeliveryAdressWrapper,
              ]}>
              <View>
                <Text allowFontScaling={false} style={styles.labelText}>
                  {APP_CONSTANTS.DELIVERY_DATE}
                </Text>
                <Text allowFontScaling={false} style={styles.labelInfo}>
                  {monthName} {dayValue}, {yearValue}
                </Text>
              </View>
              <TouchableOpacity
                onPress={togglePickupTimeModal}
                activeOpacity={0.7}
                style={styles.editTextWrapper}>
                <Text allowFontScaling={false} style={styles.editText}>
                  {APP_CONSTANTS.EDIT}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const onShowPaymentToast = (message = APP_CONSTANTS.APPLIED_FULL_AMOUNT) => {
    setTimeout(() => {
      flashRef.current?.showMessage?.({
        message: message,
        backgroundColor: COLORS.BLACK,
      });
    }, 600);
  };

  const onCloseTransactionModal = useCallback(() => {
    setIsTransactionModal(false);
    setTimeout(openAddPaymentModal, 400);
  }, []);
  const renderPaymentModal = useMemo(
    () => (
      <AddPaymentModal
        isOrderReviewScreen={true}
        selectedPayments={cartPayments}
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
  const renderListFooterComponent = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{backgroundColor: COLORS.WHITE}}>
        <View style={[styles.divider, styles.dividerII]} />
        <BillingInformationView
          isFreightToAirline={isFreightToAirlineSelected}
          ref={billingValuesRef}
          snapTaxForgiven={snapTaxForgiven}
        />
        <View style={styles.blankView} />
        {renderContactInformation()}
        <View style={styles.blankView} />
        {renderBushDeliveryDetail()}
        {renderCurbsideDeliveryDetail()}
        {renderHomeDeliveryDetail()}
        <View style={[styles.blankView, {marginBottom: hp('1.4%')}]} />
        {renderPaymentModal}
        <View style={styles.buttonContainer}>
          <View
            style={[
              styles.btnWrapper,
              {
                backgroundColor: isPlaceOrderDisabled
                  ? COLORS.DISABLE_BUTTON_COLOR
                  : COLORS.ACTIVE_BUTTON_COLOR,
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
  return (
    <ScreenWrapperComponent
      headerTitle={`CHECKOUT (${cartItemsLength})`}
      withBackButton
      isLoading={isLoading}
      isScrollView={false}
      containerStyle={styles.screenContainer}>
      <CheckoutOrderSteps currentPage={3} />
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
        {renderDestinationVillageAddressModal?.()}
        {renderPickupTimeModal?.()}
        {renderDeliveryAddressModal?.()}
      </TouchableOpacity>
      {renderApiErrorDialog?.()}
      <ToastComponent
        toastRef={toastRef}
        positionValue={260}
        position={'bottom'}
      />
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

export default CheckoutReviewOrder;
