import React, {memo, useMemo} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import {styles} from './modalStyles';
import {AddedCardsButton, PaymentOptionButton} from './PaymentsButtons';
import {PAYMENT_METHODS} from '../../constants/Common';
import {MODAL_KEYS, MODAL_TITLES} from './Constants';
import {
  BigNumber,
  formatAmountValue,
  getSnapSelectedAmount,
} from '../../utils/calculationUtils';
import {useSelector} from 'react-redux';
import {Button} from '../../components';
import {logToConsole} from '../../configs/ReactotronConfig';

const AddedPaymentsModal = ({
  snapCards = [],
  debitCards = [],
  giftCards = [],
  storeCharges = [],
  virtualWallets = [],
  transactionErrors = [],
  cartPayments = [],
  remainingOrderTotal,
  remainingOrderTotalEdit,
  isProfileScreen,
  isOrderReviewScreen,
  isPaymentRemaining,
  isTransactionError,
  isTestPaymentsEnabled,
  onPressAddCard,
  onSelectPaymentMethod,
  onEditPaymentMethod,
  onRemovePaymentMethod,
  onCancelOrder,
  isGuest,
}) => {
  const {FirstName, LastName} = useSelector(
    ({
      general: {
        loginInfo: {userInfo: {FirstName = '', LastName = ''} = {}},
      } = {},
    }) => ({
      FirstName,
      LastName,
    }),
  );

  const availablePaymentMethodSelector = useMemo(
    () => state => state.payment.payments,
    [],
  );
  const availablePaymentMethods = useSelector(availablePaymentMethodSelector);

  const isAvailablePaymentMethods = useMemo(
    () =>
      !!availablePaymentMethods &&
      Object.keys(availablePaymentMethods).length > 0,
    [availablePaymentMethods],
  );

  // const getFailedMethodsMessage = useMemo(() => {
  //   let titles = transactionErrors.map(({title} = {}) => title);
  //   if (!titles?.length) {
  //     return '';
  //   } else if (titles?.length === 1) {
  //     return `${titles[0]} was declined.`;
  //   } else if (titles?.length === 2) {
  //     return `${titles[0]} and ${titles[1]} were declined.`;
  //   } else {
  //     return `${titles.join(', ')} were declined`;
  //   }
  // }, [transactionErrors]);

  const declineAmount = () => {
    return transactionErrors.reduce((total, transactionError) => {
      return total + transactionError.amount;
    }, 0);
  };

  const getFailedMethodsMessage = useMemo(() => {
    let titles = transactionErrors.map(({title} = {}) => title);
    let message = '';
    if (!titles?.length) {
      message = '';
    } else if (titles?.length === 1) {
      message = `${titles[0]} was declined.`;
    } else if (titles?.length === 2) {
      message = `${titles[0]} and ${titles[1]} were declined.`;
    } else {
      message = `${titles.join(', ')} were declined.`;
    }
    return {message, length: titles.length};
  }, [transactionErrors]);

  const {
    [PAYMENT_METHODS.SNAP_FOOD]: {amount: snapFoodSelectedAmount = 0.0} = {},
    [PAYMENT_METHODS.SNAP_CASH]: {amount: snapCashSelectedAmount = 0.0} = {},
    [PAYMENT_METHODS.EIGEN]: debitCardSelected = {},
    [PAYMENT_METHODS.VIRTUAL_WALLET]: vwSelected = {},
    [PAYMENT_METHODS.GIFT_CARD]: gcSelected = {},
    [PAYMENT_METHODS.STORE_CHARGE]: staSelected = {},
  } = cartPayments || {};

  const {amount: vwSelectedAmount = 0} = vwSelected || {};
  const {amount: gcSelectedAmount = 0} = gcSelected || {};
  const {amount: staSelectedAmount = 0} = staSelected || {};

  const isVirtualWalletAdded = vwSelectedAmount > 0;
  const isGiftCardAdded = gcSelectedAmount > 0;
  const isStoreChargeAdded = staSelectedAmount > 0;
  const isDebitCardAdded = !!debitCardSelected?.paymentMethodId;

  const isSnapPaymentAdded = useMemo(
    () =>
      BigNumber(
        getSnapSelectedAmount({
          food: snapFoodSelectedAmount,
          cash: snapCashSelectedAmount,
        }),
      ).gt(0),
    [snapCashSelectedAmount, snapFoodSelectedAmount],
  );

  const selectedPaymentsAmount = useMemo(() => {
    return {
      [PAYMENT_METHODS.SNAP]: [
        {text: 'SNAP', amount: snapFoodSelectedAmount},
        {text: 'EBT Cash', amount: snapCashSelectedAmount},
      ],
      [PAYMENT_METHODS.VIRTUAL_WALLET]: [
        {text: 'Charged', amount: vwSelectedAmount},
      ],
      [PAYMENT_METHODS.GIFT_CARD]: [
        {text: 'Charged', amount: gcSelectedAmount},
      ],
      [PAYMENT_METHODS.STORE_CHARGE]: [
        {text: 'Charged', amount: staSelectedAmount},
      ],
      [PAYMENT_METHODS.EIGEN]: [
        {
          text: 'Allocated Amount',
          amount: remainingOrderTotalEdit,
          showZero: true,
        },
      ],
    };
  }, [
    gcSelectedAmount,
    remainingOrderTotal,
    remainingOrderTotalEdit,
    snapCashSelectedAmount,
    snapFoodSelectedAmount,
    staSelectedAmount,
    vwSelectedAmount,
  ]);

  // const renderErrorText = useMemo(() => {
  //   const isCancelOrder = isTransactionError && !isDebitCardAdded;
  //   if (!isTransactionError || isCancelOrder) {
  //     return (
  //       <Text style={styles.errorMessage}>
  //         {APP_CONSTANTS.ADD_ANOTHER_PAYMENT_METHODS}
  //         <Text style={styles.boldText}>{` balance of $${formatAmountValue(remainingOrderTotalEdit) ?? '0.00'}`}</Text>
  //         {isCancelOrder && <Text>{' or cancel order.'}</Text>}
  //       </Text>
  //     );
  //   } else if (isTransactionError) {
  //     return (
  //       <Text style={styles.errorMessage}>
  //         {`${getFailedMethodsMessage} The remaining amount of $${
  //           formatAmountValue(remainingOrderTotalEdit) ?? '0.00'
  //         } has been added with your credit card.`}
  //       </Text>
  //     );
  //   }
  //   return null;
  // }, [getFailedMethodsMessage, isDebitCardAdded, isTransactionError, remainingOrderTotal, remainingOrderTotalEdit]);

  const renderErrorText = useMemo(() => {
    const isCancelOrder = isTransactionError && !isDebitCardAdded;
    const declinedAmount = declineAmount();
    if (!isTransactionError || isCancelOrder) {
      return (
        <Text style={styles.errorMessage}>
          {APP_CONSTANTS.ADD_ANOTHER_PAYMENT_METHODS}
          <Text style={styles.boldText}>{` balance of $${
            formatAmountValue(remainingOrderTotalEdit) ?? '0.00'
          }`}</Text>
          {isCancelOrder && <Text>{' or cancel order.'}</Text>}
        </Text>
      );
    } else if (isTransactionError) {
      if (
        getFailedMethodsMessage.message.includes('Credit/Debit') &&
        getFailedMethodsMessage.length > 1
      ) {
        return (
          <Text style={styles.errorMessage}>
            {`${getFailedMethodsMessage.message} Please use another payment method or try again later.`}
          </Text>
        );
      } else {
        return (
          <Text style={styles.errorMessage}>
            {`${getFailedMethodsMessage.message} The remaining amount of $${
              formatAmountValue(declinedAmount) ?? '0.00'
            } has been added with your credit card.`}
          </Text>
        );
      }
    } else if (
      getFailedMethodsMessage.message.includes('Credit/Debit') &&
      getFailedMethodsMessage.length === 1
    ) {
      return (
        <Text style={styles.errorMessage}>
          Credit/Debit card was declined. Please use another payment method to
          proceed with this order.
        </Text>
      );
    }
    return null;
  }, [
    getFailedMethodsMessage,
    isDebitCardAdded,
    isTransactionError,
    remainingOrderTotal,
    remainingOrderTotalEdit,
  ]);

  const renderErrorMessage = useMemo(() => {
    if (
      isTransactionError ||
      (isPaymentRemaining &&
        (isSnapPaymentAdded ||
          isVirtualWalletAdded ||
          isGiftCardAdded ||
          isStoreChargeAdded))
    ) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorTextContainer}>
            <Text style={styles.errorMessage}>{'* '}</Text>
            {renderErrorText}
          </View>
          {isTransactionError && (
            <Button
              label={APP_CONSTANTS.CANCEL_ORDER}
              onPress={onCancelOrder}
              labelStyle={styles.cancelButtonLabel}
              buttonStyle={styles.cancelButton}
            />
          )}
        </View>
      );
    }
    return null;
  }, [
    isPaymentRemaining,
    isTransactionError,
    isSnapPaymentAdded,
    isVirtualWalletAdded,
    isGiftCardAdded,
    isStoreChargeAdded,
    renderErrorText,
    onCancelOrder,
  ]);

  const isCardAdded =
    snapCards?.length > 0 ||
    giftCards?.length > 0 ||
    storeCharges?.length > 0 ||
    debitCards?.length > 0;
  const renderCommonView = () => {
    return (
      <Pressable>
        {!isOrderReviewScreen ? <View style={styles.modal_divider} /> : null}

        {renderErrorMessage}
        {!isProfileScreen && isAvailablePaymentMethods && (
          <Text style={styles.savedCardsText}>
            {isOrderReviewScreen
              ? APP_CONSTANTS.PAYMENT_METHOD
              : APP_CONSTANTS.AVAILABLE_PAYMENT_METHODS}
          </Text>
        )}
        {isProfileScreen && (
          <Text style={styles.savedCardText}>
            {APP_CONSTANTS.AVAILABLE_PAYMENT_METHODS}
          </Text>
        )}
        {!!isTestPaymentsEnabled &&
          snapCards?.map(card => {
            if (isOrderReviewScreen && !isSnapPaymentAdded) {
              return null;
            }
            return (
              <AddedCardsButton
                disabled={!!isProfileScreen}
                isProfileScreen={isProfileScreen}
                onPressRemove={onRemovePaymentMethod}
                onPress={onSelectPaymentMethod}
                onEditPressed={onEditPaymentMethod}
                method={card}
                isSelected={isSnapPaymentAdded}
                isOrderReviewScreen={isOrderReviewScreen}
                amounts={selectedPaymentsAmount?.[PAYMENT_METHODS.SNAP]}
                methods={[PAYMENT_METHODS.SNAP_CASH, PAYMENT_METHODS.SNAP_FOOD]}
              />
            );
          })}
        {debitCards?.map(card => {
          if (
            isOrderReviewScreen &&
            debitCardSelected?.paymentMethodId !== card?._id
          ) {
            return null;
          }

          return (
            <AddedCardsButton
              disabled={!!isProfileScreen}
              isProfileScreen={isProfileScreen}
              onPressRemove={onRemovePaymentMethod}
              onEditPressed={onEditPaymentMethod}
              onPress={onSelectPaymentMethod}
              isOrderReviewScreen={isOrderReviewScreen}
              method={card}
              isSelected={debitCardSelected?.paymentMethodId === card?._id}
              amounts={selectedPaymentsAmount?.[PAYMENT_METHODS.EIGEN]}
              methods={[PAYMENT_METHODS.EIGEN]}
            />
          );
        })}
        {giftCards?.map(card => {
          if (
            isOrderReviewScreen &&
            gcSelected?.paymentMethodId !== card?._id
          ) {
            return null;
          }
          return (
            <AddedCardsButton
              title={`${FirstName} ${LastName}`}
              isProfileScreen={isProfileScreen}
              onPressRemove={onRemovePaymentMethod}
              onPress={onSelectPaymentMethod}
              isOrderReviewScreen={isOrderReviewScreen}
              onEditPressed={onEditPaymentMethod}
              method={card}
              isSelected={
                gcSelected?.paymentMethodId === card?._id && isGiftCardAdded
              }
              amounts={selectedPaymentsAmount?.[PAYMENT_METHODS.GIFT_CARD]}
              methods={[PAYMENT_METHODS.GIFT_CARD]}
            />
          );
        })}
        {storeCharges?.map(card => {
          if (
            isOrderReviewScreen &&
            staSelected?.paymentMethodId !== card?._id
          ) {
            return null;
          }
          return (
            <AddedCardsButton
              disabled={!!isProfileScreen}
              isProfileScreen={isProfileScreen}
              onPressRemove={onRemovePaymentMethod}
              onPress={onSelectPaymentMethod}
              onEditPressed={onEditPaymentMethod}
              isOrderReviewScreen={isOrderReviewScreen}
              method={card}
              isSelected={
                staSelected?.paymentMethodId === card?._id && isStoreChargeAdded
              }
              amounts={selectedPaymentsAmount?.[PAYMENT_METHODS.STORE_CHARGE]}
              methods={[PAYMENT_METHODS.STORE_CHARGE]}
            />
          );
        })}
        {virtualWallets?.map(card => {
          if (
            isOrderReviewScreen &&
            vwSelected?.paymentMethodId !== card?._id
          ) {
            return null;
          }
          return (
            <AddedCardsButton
              title={`${FirstName} ${LastName}`}
              withRemove={false}
              onPress={onSelectPaymentMethod}
              isProfileScreen={isProfileScreen}
              onEditPressed={onEditPaymentMethod}
              isOrderReviewScreen={isOrderReviewScreen}
              isSelected={
                vwSelected?.paymentMethodId === card?._id &&
                isVirtualWalletAdded
              }
              method={card}
              amounts={selectedPaymentsAmount?.[PAYMENT_METHODS.VIRTUAL_WALLET]}
              methods={[PAYMENT_METHODS.VIRTUAL_WALLET]}
            />
          );
        })}
      </Pressable>
    );
  };

  const renderProfileView = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.profileAddedContainer}>
        {isProfileScreen && (
          <Text style={styles.headerTextStyle}>
            {MODAL_TITLES[MODAL_KEYS.ADDED_PAYMENTS]}
          </Text>
        )}
        {renderCommonView()}
      </ScrollView>
    );
  };

  return <>{renderProfileView()}</>;
};

export default memo(AddedPaymentsModal);
