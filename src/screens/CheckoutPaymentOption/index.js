import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../theme';
import {Button} from '../../components';
import {styles} from './styles';
import AddPaymentModal from '../ShoppingCartPickup/AddPaymentModal';
import {formatPhoneNumber} from '../../utils';
import {APP_CONSTANTS} from '../../constants/Strings';
import {BILLING_KEYS, PAYMENT_METHODS} from '../../constants/Common';
import DialogBox from '../../components/DialogBox';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import ToastComponent from '../../components/ToastComponent';
import {
  checkIfBushTaxExempt,
  checkIfPaymentRemaining,
  getBillingInfo,
  getSnapSelectedAmount,
  getSnapTaxForgiven,
} from '../../utils/calculationUtils';
import FlashMessage from 'react-native-flash-message';
import useNotificationPermissionModal from '../../components/useNotificationPermissionModal';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import useIsGuest from '../../hooks/useIsGuest';
import CheckoutOrderSteps from '../../components/CheckoutOrderSteps';
import {logToConsole} from '../../configs/ReactotronConfig';
import {useIsFocused} from '@react-navigation/native';
import {Divider} from '../ShoppingCartPickup/PaymentsButtons';
import CheckBox from '../../components/CheckBox';
import {
  removeCartAllPayments,
  saveCartInvoice,
} from '../../redux/actions/payment';

const getInitialState = userInfo => {
  const {
    FirstName = '',
    LastName = '',
    PhoneNumber = '',
    Email = '',
  } = userInfo ?? {};
  return {
    firstName: FirstName,
    lastName: LastName,
    email: Email,
    contactNumber: formatPhoneNumber(PhoneNumber),
  };
};
const CheckoutPaymentOption = ({navigation, route}) => {
  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems ?? [],
    [],
  );
  const zipCodeDetailSelector = useMemo(
    () => state => state.general?.zipCodeDetail,
    [],
  );

  const cartPaymentsSelector = useMemo(
    () => state => state.payment?.cartPayments,
    [],
  );
  const cartInvoiceSelector = useMemo(
    () => state => state.payment?.cartInvoice,
    [],
  );
  const paymentsSelector = useMemo(() => state => state.payment?.payments, []);
  const useStoreDetailSelector = () =>
    useMemo(() => state => state.general?.storeDetail, []);
  const useSpecialSKUsSelector = () =>
    useMemo(() => state => state.general?.specialSKUs, []);

  const cartItems = useSelector(cartItemsSelector);
  const zipCodeDetail = useSelector(zipCodeDetailSelector);
  const cartPayments = useSelector(cartPaymentsSelector);
  const cartInvoice = useSelector(cartInvoiceSelector);
  const payments = useSelector(paymentsSelector);
  const storeDetail = useSelector(useStoreDetailSelector());
  const selectedDeliveryType = useSelector(
    state => state.general?.selectedDeliveryType,
  );
  const specialSKUs = useSelector(useSpecialSKUsSelector());

  const {
    [BILLING_KEYS.FOOD_STAMP_SUBTOTAL]: foodStampSubtotal = 0,
    [BILLING_KEYS.SNAP_TAX]: snapTax = 0,
    [BILLING_KEYS.TOTAL_AMOUNT]: totalAmount = 0,
    [BILLING_KEYS.FREIGHT_CHARGE]: freightCharge = 0,
  } = cartInvoice ?? {};

  const instructions = route.params?.instructions ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [cartItemsLength, setCartItemsLength] = useState(null);
  const [transactionErrors, setTransactionErrors] = useState([]);
  const [isFreightToAirlineSelected, setIsFreightToAirlineSelected] = useState(
    freightCharge === 0 && selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY,
  );
  const [isFreightToAirlineModal, setIsFreightToAirlineModal] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);

  const [visibleAddPaymentModal, setVisibleAddPaymentModal] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(false);

  const toastRef = useRef();
  const flashRef = useRef(null);
  const isBushOrder = selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY;
  const dispatch = useDispatch();
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

  const {bushOrderTaxExempt} = zipCodeDetail || {};
  const isBushTaxExempt = checkIfBushTaxExempt(bushOrderTaxExempt);

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

  const isPlaceOrderDisabled = isPaymentRemaining;

  const toggleApiErrorDialog = () =>
    setIsApiErrorDialogVisible(prevState => !prevState);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

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

  const openAddPaymentModal = () => setVisibleAddPaymentModal(true);

  const closeAddPaymentModal = () => setVisibleAddPaymentModal(false);

  const onCloseTransactionModal = useCallback(() => {
    setIsTransactionModal(false);
    setTimeout(openAddPaymentModal, 400);
  }, []);

  const placeOrder = async () => {
    navigation.navigate('CheckoutReviewOrder', {
      isFreightToAirlineSelected: isFreightToAirlineSelected,
      instructions: instructions,
    });
  };

  const onPressFreightCheckBox = useCallback(() => {
    logToConsole('here');
    if (isFreightToAirlineSelected) {
      logToConsole({isFreightToAirlineSelected})
      setIsFreightToAirlineSelected(prevState => {
        const cartInvoice = getBillingInfo(
          cartItems,
          zipCodeDetail,
          storeDetail,
          false,
          {},
          {
            isFreightToAirline: false,
            specialSKUs,
            orderType: selectedDeliveryType,
          },
        );
        dispatch(saveCartInvoice(cartInvoice));
        onRemoveAllPayments();
        return !prevState;
      });
    } else {
      logToConsole({else:true,isFreightToAirlineSelected})
      setIsFreightToAirlineModal(true);
    }
  }, [isFreightToAirlineSelected, onRemoveAllPayments]);

  const onCloseFreightToAirlineModal = () => {
    setIsFreightToAirlineModal(false);
  };

  const onConfirmFreightToAirline = () => {
    onCloseFreightToAirlineModal();
    onRemoveAllPayments();
    setIsFreightToAirlineSelected(prevState => {
      if (!prevState) {
        const cartInvoice = getBillingInfo(
          cartItems,
          zipCodeDetail,
          storeDetail,
          false,
          {},
          {
            isFreightToAirline: true,
            specialSKUs,
            orderType: selectedDeliveryType,
          },
        );
        dispatch(saveCartInvoice(cartInvoice));
        onRemoveAllPayments();
      } else {
        setIsFreightToAirlineModal(true);
      }
      return !prevState;
    });
  };

  const onRemoveAllPayments = useCallback(() => {
    dispatch(removeCartAllPayments());
  }, [dispatch]);

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

  const onShowPaymentToast = (message = APP_CONSTANTS.APPLIED_FULL_AMOUNT) => {
    setTimeout(() => {
      flashRef.current?.showMessage?.({
        message: message,
        backgroundColor: COLORS.BLACK,
      });
    }, 600);
  };

  const renderListFooterComponent = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{backgroundColor: COLORS.WHITE}}>
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
              label={APP_CONSTANTS.CONTINUE}
              color={COLORS.WHITE}
              disabled={!!isPlaceOrderDisabled}
              width="90%"
              onPress={placeOrder}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const isFocused = useIsFocused();

  const renderPaymentModal = useMemo(
    () => (
      <AddPaymentModal
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
      isFocused,
    ],
  );

  const renderFreightToAirLine = useMemo(() => {
    if (isBushOrder) {
      return (
        <View style={styles.freight}>
          <Divider style={styles.freightDivider} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.freightContent}
            onPress={onPressFreightCheckBox}>
            <CheckBox isSelected={isFreightToAirlineSelected} disabled />
            <Text style={styles.freightText}>
              {APP_CONSTANTS.PAY_FREIGHT_TO_AIRLINE}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [isBushOrder, isFreightToAirlineSelected, onPressFreightCheckBox]);
  return (
    <>
      <ScreenWrapperComponent
        headerTitle={`CHECKOUT (${cartItemsLength})`}
        withBackButton
        isLoading={isLoading}
        isScrollView={false}
        containerStyle={styles.screenContainer}>
        <Pressable style={styles.listWrapper}>
          <CheckoutOrderSteps currentPage={2} />
          {renderPaymentModal}
          {renderFreightToAirLine}
          {renderListFooterComponent()}
        </Pressable>
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
      </ScreenWrapperComponent>
      {renderFreightToAirlineModal()}
    </>
  );
};

export default CheckoutPaymentOption;
