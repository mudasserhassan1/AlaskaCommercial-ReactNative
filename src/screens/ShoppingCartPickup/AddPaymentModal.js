import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {styles} from './modalStyles';
import {useDispatch, useSelector} from 'react-redux';
import BottomSheetModal from '../../components/BottomSheetModal';
import SnapIframesModal from '../../components/SnapModals/SnapIframesModal';
import SnapBalanceModal from '../../components/SnapModals/SnapBalanceModal';
import SNAPBenefitModal from '../../components/SnapModals/SNAPBenefitModal';
import AddSTAModal from '../../components/StoreChargeModals/AddSTAModal';
import DebitSaveModal from '../../components/DebitCardModals/DebitSaveModal';
import VirtualWalletModal from '../../components/VirtualWalletModal';
import GiftCardNumberModal from '../../components/GiftCardModals/GiftCardNumberModal';
import GiftCardBalanceModal from '../../components/GiftCardModals/GiftCardBalanceModal';
import AddedPaymentsModal from './AddedPaymentsModal';
import PaymentOptionsModal from './PaymentOptionsModal';
import DialogBox from '../../components/DialogBox';
import {
  cancelOrder,
  deletePaymentMethodCall,
  getEigenBalance,
  getPaymentMethods,
  getPaymentsConfig,
  getVwBalance,
  postDebitCardToken,
  postGiftCard,
  postStoreCharge,
} from '../../services/ApiCaller';
import {logToConsole} from '../../configs/ReactotronConfig';
import {
  addCartPayments,
  addPaymentMethod,
  deletePaymentMethod,
  removeCartAllPayments,
  removeCartPayment,
  savePaymentMethods,
  savePaymentsConfig,
  updatePaymentMethod,
} from '../../redux/actions/payment';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  BILLING_KEYS,
  CARD_USAGE_TYPE,
  PAYMENT_METHOD_STATUS,
  PAYMENT_METHODS,
  PIN_TYPE,
  PROMISE_STATUSES,
  SCREEN_HEIGHT,
} from '../../constants/Common';
import {
  DIALOG_BOX_KEYS,
  DIALOG_BOX_LEFT_BUTTON,
  DIALOG_BOX_RIGHT_BUTTON,
  DIALOG_BOX_SINGLE_BUTTON,
  DIALOG_BOX_TITLES,
  FULL_AMOUNT,
  MODAL_BUTTON_TITLES,
  MODAL_GUEST_BUTTON_TITLES,
  MODAL_GUEST_SKIP_BUTTON,
  MODAL_IS_BOTTOM,
  MODAL_KEYS,
  MODAL_SKIP_BUTTON,
  MODAL_SKIP_BUTTON_TITLES,
  MODAL_TITLES,
} from './Constants';
import {useKeyboard} from '@react-native-community/hooks';
import {
  BigNumber,
  checkIfBushTaxExempt,
  checkIfPaymentRemaining,
  checkIfSnapEligible,
  formatAmountValue,
  getRemainingOrderTotal,
  getRemainingTotalForSnapFood,
  getSnapSelectedAmount,
  getSnapTaxForgiven,
} from '../../utils/calculationUtils';
import allSettled from 'promise.allsettled';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import {COLORS} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {Divider, paymentMethodTitle} from './PaymentsButtons';
import {resetToHome} from '../../utils/navigationUtils';
import useIsGuest from '../../hooks/useIsGuest';

let transactionErrorIndex = 0;

const AddPaymentModal = ({
  visible,
  isTransactionErrorModal,
  transactionErrors,
  onCloseTransactionModal,
  onRequestClose,
  onShowPaymentToast,
  isPaymentRemaining,
  snapTaxForgiven = 0,
  onToggleLoading,
  isProfileScreen = false,
  isOrderReviewScreen = false,
  selectedPayments = [],
}) => {
  const usePaymentsSelector = () =>
    useMemo(() => state => state.payment?.payments, []);

  const useCartInvoiceSelector = () =>
    useMemo(() => state => state.payment?.cartInvoice, []);

  const useCartPaymentsSelector = () =>
    useMemo(() => state => state.payment?.cartPayments, []);

  const usePaymentsConfigSelector = () =>
    useMemo(() => state => state.payment?.paymentsConfig, []);

  const useZipCodeDetailSelector = () =>
    useMemo(() => state => state.general?.zipCodeDetail, []);

  const useSpecialSKUsSelector = () =>
    useMemo(() => state => state.general?.specialSKUs, []);
  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems ?? [],
    [],
  );

  const payments = useSelector(usePaymentsSelector());
  const cartInvoice = useSelector(useCartInvoiceSelector());
  const cartPayments = useSelector(useCartPaymentsSelector());
  const paymentsConfig = useSelector(usePaymentsConfigSelector());
  const zipCodeDetail = useSelector(useZipCodeDetailSelector());
  const specialSKUs = useSelector(useSpecialSKUsSelector());
  const cartItems = useSelector(cartItemsSelector);

  const useIsTestPaymentsEnabledSelector = () =>
    useMemo(() => state => state.config?.isTestPaymentsEnabled ?? false, []);

  const isTestPaymentsEnabled = useSelector(useIsTestPaymentsEnabledSelector());

  const selectedDeliveryType = useSelector(
    state => state.general?.selectedDeliveryType,
  );

  const {
    [BILLING_KEYS.FOOD_STAMP_SUBTOTAL]: foodStampSubtotal = 0.0,
    [BILLING_KEYS.TOTAL_AMOUNT]: totalAmount = 0.0,
    [BILLING_KEYS.SNAP_TAX]: snapTax = 0.0,
  } = cartInvoice ?? {};

  const [modalKey, setModalKey] = useState('');
  const [dialogBoxKey, setDialogBoxKey] = useState('');
  const [isErrorDialog, setIsErrorDialog] = useState(false);
  const [dialogBoxMessage, setDialogBoxMessage] = useState('');
  const [tempCartPayment, setTempCartPayment] = useState({});
  const [isTransactionError, setIsTransactionError] = useState(false);
  const [isEditPayment, setIsEditPayment] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRetryModalHidden, setIsRetryModalHidden] = useState(true);
  const [isIframeLoading, setIframeLoading] = useState(false);
  const [isFoodBenefitLoading, setFoodBenefitLoading] = useState(false);
  const [isDebitSaveLoading, setDebitSaveLoading] = useState(false);
  const [isCashBenefitLoading, setCashBenefitLoading] = useState(false);
  const [isBalanceLoading, setBalanceLoading] = useState(false);
  const [isGiftCardLoading, setIsGiftCardLoading] = useState(false);

  const [isGiftCardNumberDisabled, setIsGiftCardNumberDisabled] =
    useState(false);
  const [isGCBenefitDisabled, setIsGCBenefitDisabled] = useState(false);
  const [isAddSTADisabled, setIsAddSTADisabled] = useState(true);
  const [isSnapFoodDisabled, setSnapFoodDisabled] = useState(false);
  const [isSnapCashDisabled, setSnapCashDisabled] = useState(false);
  const [isVWBenefitDisabled, setVWBenefitDisabled] = useState(false);
  const [isDebitSaveDisabled, setDebitSaveDisabled] = useState(false);
  const [isSTABenefitDisabled, setIsSTABenefitDisabled] = useState(false);

  const debitFormRef = useRef(null);
  const snapFoodRef = useRef(null);
  const snapCashRef = useRef(null);
  const vwBenefitRef = useRef(null);
  const gcBenefitRef = useRef(null);
  const staBenefitRef = useRef(null);
  const staAddRef = useRef(null);
  const gcRef = useRef(null);
  const paymentToDelete = useRef(null);
  const flashRef = useRef(null);
  const errorDetails = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const {top = 0, bottom = 0} = useSafeAreaInsets();

  const isGuest = useIsGuest();
  const isBushOrder = selectedDeliveryType === APP_CONSTANTS.BUSH_DELIVERY;

  useEffect(() => {}, []);

  useEffect(() => {
    transactionErrorIndex = 0;
    // dispatch(removeCartAllPayments({}));
  }, []);

  useEffect(() => {
    if (isTransactionErrorModal) {
      setDialogBoxKey(DIALOG_BOX_KEYS.TRANSACTION_ERROR);
    } else {
      setDialogBoxKey('');
    }
  }, [isTransactionErrorModal]);

  useEffect(() => {
    if (visible) {
      // setModalKey(MODAL_KEYS.ADDED_PAYMENTS);
      setModalKey('');
    } else {
      setModalKey('');
    }
  }, [visible]);

  useEffect(() => {
    if (dialogBoxKey) {
      setIsErrorDialog(true);
    }
  }, [dialogBoxKey]);

  const keyboardHeight = keyboard?.keyboardShown
    ? keyboard?.keyboardHeight + (Platform.OS === 'android' ? 60 : 40)
    : widthPercentageToDP('10%') + bottom;

  const {
    [PAYMENT_METHODS.SNAP]: snapCardsArr = [],
    [PAYMENT_METHODS.EIGEN]: debitCardsArr = [],
    [PAYMENT_METHODS.GIFT_CARD]: giftCardArr = [],
    [PAYMENT_METHODS.VIRTUAL_WALLET]: virtualWalletArr = [],
    [PAYMENT_METHODS.STORE_CHARGE]: storeChargeArr = [],
  } = payments ?? {};

  const {
    [PAYMENT_METHODS.SNAP_FOOD]: {
      amount: snapFoodSelectedAmount = 0.0,
      option: snapFoodSelectedOption,
    } = {},
    [PAYMENT_METHODS.SNAP_CASH]: {
      amount: snapCashSelectedAmount = 0.0,
      option: snapCashSelectedOption,
    } = {},
    [PAYMENT_METHODS.VIRTUAL_WALLET]: {
      amount: vwSelectedAmount = 0.0,
      option: vwSelectedAmountOption,
    } = {},
    [PAYMENT_METHODS.GIFT_CARD]: {
      amount: gcSelectedAmount = 0.0,
      option: gcSelectedAmountOption,
    } = {},
    [PAYMENT_METHODS.STORE_CHARGE]: {
      amount: staSelectedAmount = 0.0,
      option: staSelectedAmountOption,
      purchaseOrder: staPurchaseOrder,
    } = {},
    [PAYMENT_METHODS.EIGEN]: debitCardSelected,
  } = cartPayments ?? {};
  // logToConsole({cartPayments})

  const {
    gcSelectedId,
    staSelectedId,
    vwSelectedId = virtualWalletArr?.[0]?._id,
    snapSelectedId = snapCardsArr?.[0]?._id,
  } = tempCartPayment || {};

  const vwSelected = useMemo(
    () =>
      vwSelectedId &&
      virtualWalletArr?.find(card => card?._id === vwSelectedId),
    [virtualWalletArr, vwSelectedId],
  );

  const gcSelected = useMemo(
    () => gcSelectedId && giftCardArr?.find(card => card?._id === gcSelectedId),
    [giftCardArr, gcSelectedId],
  );

  const staSelected = useMemo(
    () =>
      staSelectedId &&
      storeChargeArr?.find(card => card?._id === staSelectedId),
    [storeChargeArr, staSelectedId],
  );

  const snapCardSelected = useMemo(
    () =>
      snapSelectedId &&
      snapCardsArr?.find(card => card?._id === snapSelectedId),
    [snapCardsArr, snapSelectedId],
  );

  let {amount: vwBalance = 0.0} = vwSelected || {};
  let {amount: gcBalance = 0.0} = gcSelected || {};
  let {
    cashBenefitsBalance = 0.0,
    foodStampBalance = 0.0,
    status: snapStatus,
  } = snapCardSelected ?? {};

  cashBenefitsBalance = useMemo(
    () => BigNumber(formatAmountValue(cashBenefitsBalance)),
    [cashBenefitsBalance],
  );
  foodStampBalance = useMemo(
    () => BigNumber(formatAmountValue(foodStampBalance)),
    [foodStampBalance],
  );
  vwBalance = useMemo(
    () => BigNumber(formatAmountValue(vwBalance)),
    [vwBalance],
  );
  gcBalance = useMemo(
    () => BigNumber(formatAmountValue(gcBalance)),
    [gcBalance],
  );

  const {bushOrderTaxExempt} = zipCodeDetail || {};
  const isBushTaxExempt = checkIfBushTaxExempt(bushOrderTaxExempt);
  const isDebitSelected = debitCardSelected?.paymentMethodId;
  //
  // const isSnapPinModal = useMemo(
  //   () =>
  //     [PAYMENT_METHOD_STATUS.PIN_EXPIRED, PAYMENT_METHOD_STATUS.PENDING_PIN_LVT, PAYMENT_METHOD_STATUS.ACTIVE].includes(
  //       snapStatus,
  //     ),
  //   [snapStatus],
  // );

  const snapSelectedAmount = useMemo(
    () =>
      getSnapSelectedAmount({
        food: snapFoodSelectedAmount,
        cash: snapCashSelectedAmount,
      }),
    [snapCashSelectedAmount, snapFoodSelectedAmount, isEditPayment, modalKey],
  );

  const remainingOrderTotal = useMemo(() => {
    const remainingTotal = getRemainingOrderTotal({
      snapTaxForgiven: 0 /*isEditPayment ? 0 : snapTaxForgiven*/,
      totalAmount,
      // snapAmount: snapSelectedAmount,
      snapAmount: snapSelectedAmount,
      vwAmount: vwSelectedAmount,
      gcAmount: gcSelectedAmount,
      staAmount: staSelectedAmount,
    });
    return BigNumber(remainingTotal).gt(0) ? remainingTotal : 0;
  }, [
    gcSelectedAmount,
    snapSelectedAmount,
    snapTaxForgiven,
    staSelectedAmount,
    totalAmount,
    vwSelectedAmount,
  ]);

  const remainingTotalForSnapFood = useMemo(
    () =>
      getRemainingTotalForSnapFood({
        snapTax,
        isBushTaxExempt,
        foodStampSubtotal,
        remainingOrderTotal,
        snapFoodEligibleAmount: BigNumber(foodStampSubtotal),
      }),
    [
      foodStampSubtotal,
      isBushTaxExempt,
      remainingOrderTotal,
      snapTax,
      isEditPayment,
      modalKey,
    ],
  );
  const snapSelectedAmountEdit = useMemo(
    () =>
      getSnapSelectedAmount({
        food: snapFoodSelectedAmount,
        cash: snapCashSelectedAmount,
      }),
    [snapCashSelectedAmount, snapFoodSelectedAmount, isEditPayment, modalKey],
  );

  const remainingOrderTotalEdit = useMemo(() => {
    const remainingTotal = getRemainingOrderTotal({
      snapTaxForgiven: snapTaxForgiven, //0 /*isOrderReviewScreen? snapTaxForgiven: isEditPayment ? 0 : snapTaxForgiven*/,
      totalAmount,
      snapAmount:
        isEditPayment && modalKey === MODAL_KEYS.SNAP_FOOD
          ? 0
          : isEditPayment && modalKey === MODAL_KEYS.SNAP_CASH
          ? BigNumber(snapSelectedAmountEdit).minus(snapCashSelectedAmount)
          : snapSelectedAmountEdit,
      vwAmount:
        isEditPayment && modalKey === MODAL_KEYS.VW_BENEFIT
          ? 0
          : vwSelectedAmount,
      gcAmount:
        isEditPayment && modalKey === MODAL_KEYS.GC_BENEFIT
          ? 0
          : gcSelectedAmount,
      staAmount:
        isEditPayment && modalKey === MODAL_KEYS.STA_BENEFIT
          ? 0
          : staSelectedAmount,
    });
    return BigNumber(remainingTotal).gt(0) ? remainingTotal : 0;
  }, [
    gcSelectedAmount,
    snapSelectedAmount,
    snapTaxForgiven,
    staSelectedAmount,
    totalAmount,
    vwSelectedAmount,
    isEditPayment,
    modalKey /*, isOrderReviewScreen*/,
  ]);

  const remainingTotalForSnapFoodEdit = useMemo(
    () =>
      getRemainingTotalForSnapFood({
        snapTax,
        isBushTaxExempt,
        foodStampSubtotal,
        remainingOrderTotal: remainingOrderTotalEdit,
        snapFoodEligibleAmount: BigNumber(foodStampSubtotal),
      }),
    [
      foodStampSubtotal,
      isBushTaxExempt,
      remainingOrderTotalEdit,
      snapTax,
      isEditPayment,
      modalKey,
    ],
  );

  const onFetchPaymentMethods = useCallback(async () => {
    if (!isProfileScreen) {
      return;
    }
    const {response} = await getPaymentMethods();
    const {ok = false, isUnderMaintenance} = response ?? {};
    if (ok) {
      const {data: {response: methods = []} = {}} = response ?? {};
      dispatch(savePaymentMethods({methods}));
    } else {
      if (!isUnderMaintenance) {
        throw response;
      } else {
        closeRoot({forceClose: true});
      }
    }
  }, [dispatch]);

  const onFetchPaymentsConfig = useCallback(async () => {
    if (paymentsConfig?.fisConfig?.paypageId) {
      return;
    }
    const {response} = await getPaymentsConfig();
    const {data: {response: config = {}} = {}} = response ?? {};
    dispatch(savePaymentsConfig({config}));
  }, [dispatch, paymentsConfig?.fisConfig?.paypageId]);

  const onFetchPaymentsMeta = useCallback(async () => {
    setIsLoading(true);
    const all = await allSettled([
      onFetchPaymentMethods(),
      onFetchPaymentsConfig(),
    ]);
    setIsLoading(false);
    if (all.some(promise => promise?.status === PROMISE_STATUSES.REJECTED)) {
      setDialogBoxKey(DIALOG_BOX_KEYS.METHODS);
    }
  }, [onFetchPaymentsConfig, onFetchPaymentMethods]);

  const onCancelOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const {response} = await cancelOrder();
      if (!response.ok) {
        throw response;
      } else {
        resetToHome();
      }
    } catch (e) {
      const {isUnderMaintenance} = e;
      if (!isUnderMaintenance) {
        logToConsole({onCancelOrderError: e});
        setDialogBoxKey(DIALOG_BOX_KEYS.CANCEL_ERROR);
      } else {
        closeRoot({forceClose: true});
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onCancelOrderPress = useCallback(() => {
    setDialogBoxKey(DIALOG_BOX_KEYS.CANCEL_CONFIRM);
  }, []);

  const onVWBalanceInquiry = useCallback(
    async id => {
      try {
        id = id || vwSelectedId;
        setIsLoading(true);
        const {response} = await getVwBalance();
        if (response.ok) {
          const {data: {response: details = {}} = {}} = response || {};
          dispatch(
            updatePaymentMethod({
              _id: id,
              method: PAYMENT_METHODS.VIRTUAL_WALLET,
              details: {...vwSelected, ...details},
            }),
          );
        } else {
          if (!response?.isUnderMaintenance) {
            throw response;
          } else {
            closeRoot({forceClose: true});
          }
        }
      } catch (e) {
        logToConsole({onVWBalanceInquiryError: e});
        errorDetails.current = {onVWBalanceInquiryError: e};
        setDialogBoxKey(DIALOG_BOX_KEYS.VW_BALANCE);
      } finally {
        setIsLoading(false);
      }
      setIsLoading(false);
    },
    [dispatch, vwSelected, vwSelectedId],
  );

  const onGCBalanceInquiry = useCallback(
    async id => {
      try {
        id = id || gcSelectedId;
        setIsLoading(true);
        const {response} = await getEigenBalance({id});
        if (response.ok) {
          const {data: {response: details = {}} = {}} = response || {};
          dispatch(
            updatePaymentMethod({
              _id: id,
              method: PAYMENT_METHODS.GIFT_CARD,
              details: {...gcSelected, ...details},
            }),
          );
        } else {
          if (!response?.isUnderMaintenance) {
            throw response;
          } else {
            closeRoot({forceClose: true});
          }
        }
      } catch (e) {
        logToConsole({onGCBalanceInquiryError: e});
        errorDetails.current = {onGCBalanceInquiryError: e};
        setDialogBoxKey(DIALOG_BOX_KEYS.GC_BALANCE);
      } finally {
        setIsLoading(false);
      }
      setIsLoading(false);
    },
    [dispatch, gcSelected, gcSelectedId],
  );

  useEffect(() => {
    onFetchPaymentsMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof onToggleLoading === 'function') {
      onToggleLoading(
        (!modalKey || [MODAL_KEYS.ADD_CARD].includes(modalKey)) &&
          isRetryModalHidden &&
          isLoading,
      );
    }
  }, [isLoading, isRetryModalHidden, modalKey, onToggleLoading]);

  const checkIfPaymentPending = useCallback(
    (updated = {}) =>
      checkIfPaymentRemaining({
        snapTaxForgiven,
        totalAmount,
        snapAmount: snapSelectedAmount,
        vwAmount: vwSelectedAmount,
        gcAmount: gcSelectedAmount,
        staAmount: staSelectedAmount,
        isDebitSelected,
        ...updated,
      }),
    [
      snapTaxForgiven,
      totalAmount,
      snapSelectedAmount,
      vwSelectedAmount,
      gcSelectedAmount,
      staSelectedAmount,
      isDebitSelected,
    ],
  );

  const toggleVirtualWalletModal = (show = false, id) => {
    if (show) {
      if (isProfileScreen) {
        setModalKey(MODAL_KEYS.VIRTUAL_WALLET);
      } else {
        setTimeout(() => {
          onVWBalanceInquiry(id);
        }, 600);
        setModalKey(MODAL_KEYS.VW_BENEFIT);
      }
    } else {
      closeRoot();
    }
  };

  const openGiftCardModal = useCallback(
    ({isPin = false, _id} = {}) => {
      if (isPin) {
        setTimeout(() => {
          onGCBalanceInquiry(_id);
        }, 600);
        setModalKey(
          isProfileScreen ? MODAL_KEYS.GC_BALANCE : MODAL_KEYS.GC_BENEFIT,
        );
      } else {
        setModalKey(MODAL_KEYS.GC_NUMBER);
      }
    },
    [isProfileScreen, onGCBalanceInquiry],
  );

  const onSnapIframeSuccess = useCallback(() => {
    closeRoot();
  }, []);

  const closeRoot = useCallback(
    ({forceClose = false, isPaymentPending} = {}) => {
      if ((isPaymentPending ?? isPaymentRemaining) && !forceClose) {
        setModalKey('');
      } else {
        onRequestClose();
        setModalKey('');
      }
      setIsEditPayment(false);
    },
    [isPaymentRemaining, isEditPayment],
  );

  const toggleAddSNAPCardModal = useCallback(
    (show = false) => {
      if (!isTestPaymentsEnabled) {
        setDialogBoxKey(DIALOG_BOX_KEYS.SNAP_FEATURE_DISABLED);
        return;
      }
      if (show) {
        setModalKey(
          /*isSnapPinModal ? MODAL_KEYS.SNAP_PIN : */ MODAL_KEYS.SNAP_PAN,
        );
      } else {
        closeRoot();
      }
    },
    [closeRoot, isTestPaymentsEnabled /*, isSnapPinModal*/],
  );

  const toggleAddCreditCardModal = useCallback(
    ({show = false} = {}) => {
      if (show) {
        setModalKey(MODAL_KEYS.DEBIT_CARD_SAVE);
      } else {
        closeRoot();
      }
    },
    [closeRoot],
  );

  const onToggleAddStoreCharge = ({show = true} = {}) => {
    if (show) {
      setModalKey(MODAL_KEYS.STA_ADD);
    } else {
      closeRoot();
    }
  };

  const onSelectSTAPlan = () => {
    onToggleAddStoreCharge({show: true});
  };

  const closeSnapFoodModal = () => {
    closeRoot();
  };

  const onSkipFoodModal = () => {
    closeSnapFoodPinModal({showNext: true});
  };

  const onSkipCashModal = () => {
    closeSnapCashModal();
    onDisplayUSDAAlert();
  };

  const openSnapCashIfRequired = () => {
    // if (isEditPayment) {
    //     if (snapCashSelectedAmount > 0) {
    //         setModalKey(MODAL_KEYS.SNAP_CASH);
    //     } else {
    //         closeRoot()
    //     }
    // } else {
    setModalKey(MODAL_KEYS.SNAP_CASH);
    // }
  };

  const closeSnapFoodPinModal = useCallback(
    ({showNext} = {}) => {
      if (showNext /*&& cashBenefitsBalance.gt(0)*/) {
        openSnapCashIfRequired();
      } else {
        closeRoot({isPaymentPending: showNext});
      }
    },
    [cashBenefitsBalance, closeRoot],
  );

  const closeSnapCashPinModal = useCallback(
    ({isPaymentPending} = {}) => {
      closeRoot({isPaymentPending});
    },
    [closeRoot],
  );

  const onSubmitGiftCard = useCallback(
    async ({usageType = CARD_USAGE_TYPE.MULTIPLE}) => {
      try {
        setIsGiftCardLoading(true);
        const cardNumber = gcRef.current?.getCardNumber?.();
        const saveCard = gcRef.current?.getSaveForTransaction?.();
        const {response} = await postGiftCard({
          usageType:
            saveCard || isProfileScreen
              ? CARD_USAGE_TYPE.MULTIPLE
              : CARD_USAGE_TYPE.SINGLE,
          cardNumber,
        });
        const {error, response: details} = response?.data || {};
        if (!response.ok || error || !details) {
          if (!response?.isUnderMaintenance) {
            throw error || response;
          } else {
            closeRoot({forceClose: true});
          }
        } else {
          dispatch(
            addPaymentMethod({
              method: PAYMENT_METHODS.GIFT_CARD,
              details: {...details, type: PAYMENT_METHODS.GIFT_CARD},
            }),
          );
        }
        setModalKey(MODAL_KEYS.GC_BALANCE);
        setTempCartPayment({gcSelectedId: details?._id});
        await onGCBalanceInquiry(details?._id);
      } catch (e) {
        logToConsole({ErrorOnSubmitGiftCard: e});
        errorDetails.current = {ErrorOnSubmitGiftCard: e};
        setDialogBoxMessage(e?.error?.message || e?.message);
        setDialogBoxKey(DIALOG_BOX_KEYS.GC_SAVE);
      } finally {
        setIsGiftCardLoading(false);
      }
    },
    [dispatch, onGCBalanceInquiry],
  );

  const selectDebitCard = card => {
    const {status, _id} = card || {};
    if (status !== PAYMENT_METHOD_STATUS.ACTIVE) {
      toggleAddCreditCardModal({show: true});
    } else {
      checkForDebitToast();
      dispatch(
        addCartPayments({
          method: PAYMENT_METHODS.EIGEN,
          details: {
            paymentMethodId: _id,
            subTitle: paymentMethodTitle(card)?.subTitle || '',
            type: PAYMENT_METHODS.EIGEN,
          },
        }),
      );
    }
  };

  const onSubmitDebitCard = useCallback(
    async ({usageType = CARD_USAGE_TYPE.MULTIPLE, data}) => {
      try {
        setIsLoading(true);
        const {response} = await postDebitCardToken({...data, usageType});
        const {error, paymentMethod: details} = response?.data || {};
        if (!response.ok || error || !details) {
          if (!response?.isUnderMaintenance) {
            throw error || response;
          } else {
            closeRoot({forceClose: true});
          }
        } else {
          dispatch(
            addPaymentMethod({
              method: PAYMENT_METHODS.EIGEN,
              details: {...details, type: PAYMENT_METHODS.EIGEN},
            }),
          );
          if (!isProfileScreen) {
            selectDebitCard(details);
            setModalKey('');
          } else {
            closeRoot();
          }
        }
      } catch (e) {
        logToConsole({ErrorOnSubmitDebitCard: e});
        errorDetails.current = {ErrorOnSubmitDebitCard: e};
        setDialogBoxMessage(e?.message);
        setDialogBoxKey(DIALOG_BOX_KEYS.DEBIT_CARD_SAVE);
      } finally {
        setIsLoading(false);
      }
    },
    [closeRoot, dispatch, isProfileScreen],
  );

  const onSubmitStoreCharge = async ({
    usageType = CARD_USAGE_TYPE.MULTIPLE,
  }) => {
    try {
      const info = staAddRef?.current?.getSTAInfo();
      const saveCard = staAddRef?.current?.getSaveForTransaction();
      setIsLoading(true);
      const {response} = await postStoreCharge({
        ...info,
        usageType:
          saveCard || isProfileScreen
            ? CARD_USAGE_TYPE.MULTIPLE
            : CARD_USAGE_TYPE.SINGLE,
      });
      const {error, response: details} = response?.data || {};
      if (!response.ok || error || !details) {
        if (!response?.isUnderMaintenance) {
          throw error || response;
        } else {
          closeRoot({forceClose: true});
        }
      } else {
        dispatch(
          addPaymentMethod({
            method: PAYMENT_METHODS.STORE_CHARGE,
            details: {...details, type: PAYMENT_METHODS.STORE_CHARGE},
          }),
        );
        isProfileScreen ? closeRoot() : setModalKey('');
      }
    } catch (e) {
      logToConsole({ErrorOnSubmitStoreCharge: e});
      errorDetails.current = {ErrorOnSubmitStoreCharge: e};
      setDialogBoxMessage(e?.message);
      setDialogBoxKey(DIALOG_BOX_KEYS.STA_SAVE);
    } finally {
      setIsLoading(false);
    }
  };

  const showDebitToast = useCallback(
    ({showToast = true, message, amount}) => {
      if (showToast && isDebitSelected) {
        onShowPaymentToast?.(
          BigNumber(amount).gte(totalAmount)
            ? message
            : APP_CONSTANTS.APPLIED_FULL_AMOUNT,
        );
      }
    },
    [isDebitSelected, onShowPaymentToast, totalAmount],
  );

  const onSubmitSnapFood = () => {
    snapFoodRef.current.onSubmitForm?.();
  };

  const onSubmitDebitForm = args => {
    debitFormRef.current.onSubmitForm?.(args);
  };

  const onSnapFoodSuccess = useCallback(
    info => {
      const {amount = 0.0} = info ?? {};
      let taxForgiven;
      taxForgiven = getSnapTaxForgiven({
        amount,
        snapTax,
        subTotal: foodStampSubtotal,
        isBushTaxExempt,
      });
      const isPaymentPending = checkIfPaymentPending({
        snapAmount: amount,
        snapTaxForgiven: taxForgiven,
        isDebitSelected: false,
      });
      showDebitToast({
        showToast: !isPaymentPending,
        message: APP_CONSTANTS.SNAP_APPLIED_FULL_AMOUNT,
        amount: formatAmountValue(BigNumber(amount).plus(taxForgiven)),
      });
      closeSnapFoodPinModal({
        showNext: isPaymentPending,
      });
    },
    [
      snapTax,
      foodStampSubtotal,
      isBushTaxExempt,
      checkIfPaymentPending,
      showDebitToast,
      closeSnapFoodPinModal,
    ],
  );

  const onDisplayUSDAAlert = useCallback(
    ({isPaymentPending = true} = {}) => {
      const {freightChargeItem, handlingFeeItem} = specialSKUs || {};
      if (
        isPaymentPending &&
        parseFloat(snapFoodSelectedAmount) > 0 &&
        (!checkIfSnapEligible(handlingFeeItem) ||
          !checkIfSnapEligible(freightChargeItem))
      ) {
        setTimeout(() => {
          setDialogBoxKey(DIALOG_BOX_KEYS.SNAP_ALERT);
        }, 1000);
      }
    },
    [snapFoodSelectedAmount, specialSKUs],
  );

  const onSnapCashSuccess = useCallback(
    info => {
      const {amount = 0.0, showToast} = info ?? {};
      const snapAmount = getSnapSelectedAmount({
        food: snapFoodSelectedAmount,
        cash: amount,
      });
      showDebitToast({
        showToast,
        message: APP_CONSTANTS.SNAP_APPLIED_FULL_AMOUNT,
        amount: formatAmountValue(BigNumber(snapAmount).plus(snapTaxForgiven)),
      });
      const isPaymentPending = checkIfPaymentPending({snapAmount});
      closeSnapCashPinModal({isPaymentPending});
      // setTimeout(() => {
      onDisplayUSDAAlert({isPaymentPending});
      // }, 200)
    },
    [
      snapFoodSelectedAmount,
      showDebitToast,
      snapTaxForgiven,
      checkIfPaymentPending,
      onDisplayUSDAAlert,
      closeSnapCashPinModal,
    ],
  );

  const onSubmitVWBenefit = () => {
    const {amount = 0, showToast} =
      vwBenefitRef.current?.addCartPayment?.() ?? {};
    showDebitToast({
      showToast,
      message: APP_CONSTANTS.VW_APPLIED_FULL_AMOUNT,
      amount,
    });
    closeRoot({isPaymentPending: checkIfPaymentPending({vwAmount: amount})});
  };

  const onSubmitGCBenefit = () => {
    const {amount = 0, showToast} =
      gcBenefitRef.current?.addCartPayment?.() ?? {};
    showDebitToast({
      showToast,
      message: APP_CONSTANTS.GC_APPLIED_FULL_AMOUNT,
      amount,
    });
    closeRoot({isPaymentPending: checkIfPaymentPending({gcAmount: amount})});
  };

  const onSubmitSTABenefit = () => {
    const {amount = 0, showToast} =
      staBenefitRef.current?.addCartPayment?.() ?? {};
    showDebitToast({
      showToast,
      message: APP_CONSTANTS.STA_APPLIED_FULL_AMOUNT,
      amount,
    });
    closeRoot({isPaymentPending: checkIfPaymentPending({staAmount: amount})});
  };

  const onSubmitSnapCash = () => {
    snapCashRef.current.onSubmitForm?.();
  };

  const closeSnapCashModal = () => {
    logToConsole({snapCashSelectedAmount, remainingOrderTotalEdit});
    snapCashRef?.current?.skipOrCancelSnapCashAmount(
      snapCashSelectedAmount,
      remainingOrderTotalEdit,
      isEditPayment,
    );
    closeRoot();
  };

  const onCloseSnapBalanceModal = (showNext = false) => {
    if (showNext) {
      if (BigNumber(foodStampSubtotal).gt(0)) {
        setModalKey(MODAL_KEYS.SNAP_FOOD);
      } else {
        openSnapCashIfRequired();
      }
    } else {
      closeRoot();
    }
  };

  const onRemovePaymentMethod = card => {
    paymentToDelete.current = card;
    setDialogBoxKey(DIALOG_BOX_KEYS.DELETE_PAYMENT);
  };

  const checkForDebitToast = () => {
    let length = 1;
    let message = APP_CONSTANTS.APPLIED_FULL_AMOUNT;
    if (BigNumber(remainingOrderTotal).lte(0)) {
      if (snapFoodSelectedAmount > 0 && snapCashSelectedAmount > 0) {
        length = 2;
      }
      if (Object.values(cartPayments)?.length > length) {
        message = APP_CONSTANTS.APPLIED_FULL_AMOUNT;
      } else if (snapSelectedAmount > 0) {
        message = APP_CONSTANTS.SNAP_APPLIED_FULL_AMOUNT;
      } else if (gcSelectedAmount > 0) {
        message = APP_CONSTANTS.GC_APPLIED_FULL_AMOUNT;
      } else if (staSelectedAmount > 0) {
        message = APP_CONSTANTS.STA_APPLIED_FULL_AMOUNT;
      } else if (vwSelectedAmount > 0) {
        message = APP_CONSTANTS.VW_APPLIED_FULL_AMOUNT;
      }
      flashRef.current?.showMessage?.({message, backgroundColor: COLORS.BLACK});
    }
  };

  const onConfirmRemovePayment = useCallback(async () => {
    try {
      setIsLoading(true);
      const {_id, type} = paymentToDelete.current || {};
      const {response} = await deletePaymentMethodCall({_id});
      if (response.ok) {
        dispatch(deletePaymentMethod({method: type, _id}));
      } else {
        if (!response?.isUnderMaintenance) {
          throw response;
        } else {
          closeRoot({forceClose: true});
        }
      }
    } catch (e) {
      setTimeout(() => {
        setDialogBoxKey(DIALOG_BOX_KEYS.ERROR);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const onSelectPaymentMethod = card => {
    if (isOrderReviewScreen) {
      return;
    }

    const {type, status, _id, isSelected, methods} = card || {};

    if (isTransactionError) {
      setIsTransactionError(false);
    }

    if (isSelected) {
      dispatch(removeCartPayment({methods}));
      return;
    }

    if (
      !isProfileScreen &&
      type !== PAYMENT_METHODS.EIGEN &&
      BigNumber(remainingOrderTotal).lte(0)
    ) {
      flashRef.current?.showMessage?.({
        message: APP_CONSTANTS.PAYMENT_FULFILLED,
        backgroundColor: COLORS.BLACK,
      });
      return;
    }

    if (type === PAYMENT_METHODS.SNAP) {
      // setModalKey(isSnapPinModal ? MODAL_KEYS.SNAP_PIN : MODAL_KEYS.SNAP_PAN);
      onCloseSnapBalanceModal(true);
      return;
    }

    if (type === PAYMENT_METHODS.EIGEN) {
      selectDebitCard(card);
      return;
    }

    if (type === PAYMENT_METHODS.VIRTUAL_WALLET) {
      setTempCartPayment({vwSelectedId: _id});
      toggleVirtualWalletModal(true, _id);
      return;
    }

    if (type === PAYMENT_METHODS.STORE_CHARGE) {
      if (BigNumber(staSelectedAmount).gt(0)) {
        flashRef.current?.showMessage?.({
          message: APP_CONSTANTS.SINGLE_STA_ALLOWED,
          backgroundColor: COLORS.BLACK,
        });
        return;
      }
      setTempCartPayment({staSelectedId: _id});
      setModalKey(MODAL_KEYS.STA_BENEFIT);
      return;
    }

    if (type === PAYMENT_METHODS.GIFT_CARD) {
      if (BigNumber(gcSelectedAmount).gt(0)) {
        flashRef.current?.showMessage?.({
          message: APP_CONSTANTS.SINGLE_GC_ALLOWED,
          backgroundColor: COLORS.BLACK,
        });
        return;
      }
      setTempCartPayment({gcSelectedId: _id});
      openGiftCardModal({isPin: status === PAYMENT_METHOD_STATUS.ACTIVE, _id});
    }
  };
  const onEditPaymentMethod = card => {
    const {type, status, _id, isEdit, methods} = card || {};

    if (isTransactionError) {
      setIsTransactionError(false);
    }
    setIsEditPayment(true);
    if (type === PAYMENT_METHODS.SNAP) {
      if (snapFoodSelectedAmount <= 0 && snapCashSelectedAmount > 0) {
        setModalKey(MODAL_KEYS.SNAP_CASH);
      } else {
        setModalKey(MODAL_KEYS.SNAP_FOOD);
      }
      return;
    }

    if (type === PAYMENT_METHODS.EIGEN) {
      selectDebitCard(card);
      return;
    }

    if (type === PAYMENT_METHODS.VIRTUAL_WALLET) {
      setTempCartPayment({vwSelectedId: _id});
      toggleVirtualWalletModal(true, _id);
      return;
    }

    if (type === PAYMENT_METHODS.STORE_CHARGE) {
      setTempCartPayment({staSelectedId: _id});
      setModalKey(MODAL_KEYS.STA_BENEFIT);
      return;
    }

    if (type === PAYMENT_METHODS.GIFT_CARD) {
      setTempCartPayment({gcSelectedId: _id});
      openGiftCardModal({isPin: status === PAYMENT_METHOD_STATUS.ACTIVE, _id});
    }
  };

  const onPressAddCard = () => {
    setIsErrorDialog(false);
    setModalKey(MODAL_KEYS.ADD_CARD);
  };

  const onErrorModalHide = () => {
    setIsRetryModalHidden(true);
    setDialogBoxKey('');
  };

  const onConfirmPress = () => {
    switch (dialogBoxKey) {
      case DIALOG_BOX_KEYS.METHODS:
        onFetchPaymentsMeta();
        break;
      case DIALOG_BOX_KEYS.VW_BALANCE:
        onVWBalanceInquiry();
        break;
      case DIALOG_BOX_KEYS.GC_BALANCE:
        onGCBalanceInquiry();
        break;
      case DIALOG_BOX_KEYS.DELETE_PAYMENT:
        onConfirmRemovePayment();
        break;
      case DIALOG_BOX_KEYS.CANCEL_ERROR:
      case DIALOG_BOX_KEYS.CANCEL_CONFIRM:
        onCancelOrder();
        break;
    }
    setIsErrorDialog(false);
  };

  const onCancelRetry = () => {
    switch (dialogBoxKey) {
      case DIALOG_BOX_KEYS.METHODS:
        closeRoot({forceClose: true});
        if (isProfileScreen) {
          navigation.goBack();
        }
        break;
      case DIALOG_BOX_KEYS.VW_BALANCE:
      case DIALOG_BOX_KEYS.GC_BALANCE:
        closeRoot({isPaymentPending: true});
        break;
      case DIALOG_BOX_KEYS.TRANSACTION_ERROR:
        if (transactionErrorIndex < transactionErrors.length - 1) {
          setTimeout(() => {
            ++transactionErrorIndex;
            setDialogBoxKey(DIALOG_BOX_KEYS.TRANSACTION_ERROR);
          }, 400);
        } else {
          setIsTransactionError(true);
          onCloseTransactionModal?.();
          transactionErrorIndex = 0;
        }
        break;
    }
    setIsErrorDialog(false);
  };

  const dialogBoxMessages = useMemo(() => {
    switch (dialogBoxKey) {
      case DIALOG_BOX_KEYS.DEBIT_CARD_SAVE:
      case DIALOG_BOX_KEYS.GC_SAVE:
      case DIALOG_BOX_KEYS.STA_SAVE:
        return dialogBoxMessage;
      case DIALOG_BOX_KEYS.TRANSACTION_ERROR:
        return transactionErrors?.[transactionErrorIndex]?.message;
      case DIALOG_BOX_KEYS.DELETE_PAYMENT:
        return APP_CONSTANTS.DELETE_CARD_CONFIRMATION;
      case DIALOG_BOX_KEYS.SNAP_ALERT:
        return APP_CONSTANTS.USDA_MESSAGE;
      case DIALOG_BOX_KEYS.CANCEL_CONFIRM:
        return APP_CONSTANTS.CONFIRM_CANCEL_ORDER;
      case DIALOG_BOX_KEYS.SNAP_FEATURE_DISABLED:
        return APP_CONSTANTS.SNAP_FEATURE_MESSAGE;
      case DIALOG_BOX_KEYS.STA_DISABLED:
        return APP_CONSTANTS.STA_COMING_SOON_MESSAGE;
      default:
        return APP_CONSTANTS.SOME_THING_WENT_WRONG;
    }
  }, [dialogBoxKey, dialogBoxMessage, transactionErrors]);

  const dialogBoxTitle = useMemo(() => {
    switch (dialogBoxKey) {
      case DIALOG_BOX_KEYS.TRANSACTION_ERROR:
        return transactionErrors?.[transactionErrorIndex]?.modalTitle;
      default:
        return DIALOG_BOX_TITLES[dialogBoxKey];
    }
  }, [dialogBoxKey, transactionErrors]);

  const onSkipPress = () => {
    switch (modalKey) {
      case MODAL_KEYS.SNAP_FOOD:
        onSkipFoodModal();
        break;
      case MODAL_KEYS.SNAP_CASH:
        onSkipCashModal();
        break;
      case MODAL_KEYS.DEBIT_CARD_SAVE:
        onSubmitDebitForm(/*{usageType: CARD_USAGE_TYPE.SINGLE}*/);
        break;
      case MODAL_KEYS.GC_NUMBER:
        onSubmitGiftCard({usageType: CARD_USAGE_TYPE.SINGLE});
        break;
      case MODAL_KEYS.STA_ADD:
        onSubmitStoreCharge({usageType: CARD_USAGE_TYPE.SINGLE});
        break;
    }
  };

  const onCrossPress = () => {
    switch (modalKey) {
      case MODAL_KEYS.ADD_CARD:
      case MODAL_KEYS.ADDED_PAYMENTS:
        closeRoot({forceClose: true});
        break;
      case MODAL_KEYS.SNAP_PAN:
        toggleAddSNAPCardModal();
        break;
      case MODAL_KEYS.SNAP_FOOD:
        closeSnapFoodModal();
        break;
      case MODAL_KEYS.SNAP_CASH:
        closeSnapCashModal();
        break;
      case MODAL_KEYS.VW_BENEFIT:
      case MODAL_KEYS.VIRTUAL_WALLET:
        toggleVirtualWalletModal(false);
        break;
      case MODAL_KEYS.DEBIT_CARD_SAVE:
      case MODAL_KEYS.GC_NUMBER:
      case MODAL_KEYS.GC_BALANCE:
      case MODAL_KEYS.GC_BENEFIT:
      case MODAL_KEYS.STA_ADD:
      case MODAL_KEYS.STA_BENEFIT:
        closeRoot();
        break;
    }
  };

  const onBottomPress = () => {
    switch (modalKey) {
      case MODAL_KEYS.ADD_CARD:
        setModalKey('');
        break;
      case MODAL_KEYS.ADDED_PAYMENTS:
        onRequestClose();
        break;
      // case MODAL_KEYS.SNAP_BALANCE:
      //   onCloseSnapBalanceModal(!isProfileScreen);
      //   break;
      case MODAL_KEYS.SNAP_FOOD:
        onSubmitSnapFood();
        break;
      case MODAL_KEYS.SNAP_CASH:
        onSubmitSnapCash();
        break;
      case MODAL_KEYS.VW_BENEFIT:
        onSubmitVWBenefit();
        break;
      case MODAL_KEYS.VIRTUAL_WALLET:
        toggleVirtualWalletModal(false);
        break;
      case MODAL_KEYS.DEBIT_CARD_SAVE:
        onSubmitDebitForm(/*{usageType: isGuest ? CARD_USAGE_TYPE.SINGLE : CARD_USAGE_TYPE.MULTIPLE}*/);
        break;
      case MODAL_KEYS.GC_NUMBER:
        onSubmitGiftCard({
          usageType: isGuest
            ? CARD_USAGE_TYPE.SINGLE
            : CARD_USAGE_TYPE.MULTIPLE,
        });
        break;
      case MODAL_KEYS.GC_BALANCE:
        closeRoot();
        break;
      case MODAL_KEYS.GC_BENEFIT:
        onSubmitGCBenefit();
        break;
      case MODAL_KEYS.STA_ADD:
        onSubmitStoreCharge({
          usageType: isGuest
            ? CARD_USAGE_TYPE.SINGLE
            : CARD_USAGE_TYPE.MULTIPLE,
        });
        break;
      case MODAL_KEYS.STA_BENEFIT:
        onSubmitSTABenefit();
        break;
    }
  };

  const modalIsSkipDisabled = useMemo(() => {
    return {
      [MODAL_KEYS.GC_NUMBER]: isGiftCardNumberDisabled,
      [MODAL_KEYS.STA_ADD]: isAddSTADisabled,
      [MODAL_KEYS.DEBIT_CARD_SAVE]: isDebitSaveDisabled,
    };
  }, [isAddSTADisabled, isDebitSaveDisabled, isGiftCardNumberDisabled]);

  const modalIsSkipButton = useMemo(() => {
    if (isProfileScreen) {
      return false;
    }
    return isGuest
      ? MODAL_GUEST_SKIP_BUTTON[modalKey]
      : MODAL_SKIP_BUTTON[modalKey];
  }, [isGuest, isProfileScreen, modalKey]);

  const modalButtonTitle = useMemo(() => {
    return isGuest
      ? MODAL_GUEST_BUTTON_TITLES[modalKey]
      : MODAL_BUTTON_TITLES[modalKey];
  }, [isGuest, modalKey]);

  const modalIsBottomDisabled = useMemo(() => {
    return {
      [MODAL_KEYS.ADDED_PAYMENTS]: isPaymentRemaining,
      [MODAL_KEYS.SNAP_FOOD]: isSnapFoodDisabled,
      [MODAL_KEYS.SNAP_CASH]: isSnapCashDisabled,
      [MODAL_KEYS.VW_BENEFIT]: isVWBenefitDisabled,
      [MODAL_KEYS.GC_NUMBER]: isGiftCardNumberDisabled,
      [MODAL_KEYS.GC_BENEFIT]: isGCBenefitDisabled,
      [MODAL_KEYS.STA_ADD]: isAddSTADisabled,
      [MODAL_KEYS.STA_BENEFIT]: isSTABenefitDisabled,
      [MODAL_KEYS.DEBIT_CARD_SAVE]: isDebitSaveDisabled,
    };
  }, [
    isPaymentRemaining,
    isSnapFoodDisabled,
    isSnapCashDisabled,
    isVWBenefitDisabled,
    isGiftCardNumberDisabled,
    isGCBenefitDisabled,
    isAddSTADisabled,
    isSTABenefitDisabled,
    isDebitSaveDisabled,
  ]);

  const isCustomLoading =
    isRetryModalHidden &&
    (isLoading ||
      isBalanceLoading ||
      isIframeLoading ||
      isCashBenefitLoading ||
      isFoodBenefitLoading ||
      isDebitSaveLoading ||
      isGiftCardLoading);

  const renderAddPayment = () => {
    // if (isProfileScreen || modalKey === MODAL_KEYS.ADD_CARD) {
    if (isOrderReviewScreen) {
      return null;
    }
    return (
      <PaymentOptionsModal
        isProfileScreen={isProfileScreen}
        isSnapDisabled={isTestPaymentsEnabled && snapCardSelected?._id}
        toggleAddCreditCardModal={toggleAddCreditCardModal}
        toggleAddSNAPCardModal={toggleAddSNAPCardModal}
        openGiftCardModal={openGiftCardModal}
        openStoreChargeModal={onToggleAddStoreCharge}
      />
    );
    // }
    // return null;
  };

  const renderAddedPayments = () => {
    // if (isProfileScreen || modalKey === MODAL_KEYS.ADDED_PAYMENTS) {
    return (
      <AddedPaymentsModal
        isTestPaymentsEnabled={isTestPaymentsEnabled}
        snapCards={snapCardsArr}
        debitCards={debitCardsArr}
        giftCards={giftCardArr}
        virtualWallets={virtualWalletArr}
        storeCharges={storeChargeArr}
        cartPayments={cartPayments}
        transactionErrors={transactionErrors}
        onCancelOrder={onCancelOrderPress}
        isTransactionError={isTransactionError}
        isPaymentRemaining={isPaymentRemaining}
        onSelectPaymentMethod={onSelectPaymentMethod}
        remainingOrderTotal={remainingOrderTotal}
        remainingOrderTotalEdit={remainingOrderTotalEdit}
        onEditPaymentMethod={onEditPaymentMethod}
        onRemovePaymentMethod={onRemovePaymentMethod}
        onPressAddCard={onPressAddCard}
        closeModal={onRequestClose}
        isProfileScreen={isProfileScreen}
        isGuest={isGuest}
        isOrderReviewScreen={isOrderReviewScreen}
      />
    );
    // }
    // return null;
  };

  const renderGiftCardNumber = () => {
    if (modalKey === MODAL_KEYS.GC_NUMBER) {
      return (
        <GiftCardNumberModal
          isProfileScreen={isProfileScreen}
          isGuest={isGuest}
          ref={gcRef}
          onBottomDisabled={setIsGiftCardNumberDisabled}
        />
      );
    }
    return null;
  };

  const renderGiftCardBalance = () => {
    if (modalKey === MODAL_KEYS.GC_BALANCE) {
      return <GiftCardBalanceModal availableBalance={gcBalance} />;
    }
    return null;
  };

  const renderDebitSave = () => {
    if (modalKey === MODAL_KEYS.DEBIT_CARD_SAVE) {
      return (
        <DebitSaveModal
          isGuest={isGuest}
          onBottomDisabled={setDebitSaveDisabled}
          onToggleLoading={setDebitSaveLoading}
          ref={debitFormRef}
          isProfileScreen={isProfileScreen}
          onSubmitSuccess={onSubmitDebitCard}
          remainingOrderTotal={remainingOrderTotalEdit}
        />
      );
    }
    return null;
  };

  const renderSnapIframes = () => {
    if ([MODAL_KEYS.SNAP_PAN /*, MODAL_KEYS.SNAP_PIN*/]?.includes(modalKey)) {
      return (
        <SnapIframesModal
          isProfileScreen={isProfileScreen}
          modalKey={modalKey}
          closeModal={onCrossPress}
          onSuccess={onSnapIframeSuccess}
          onToggleLoading={setIframeLoading}
          isPinModal={/*isSnapPinModal*/ false}
          withSingleButton={false}
        />
      );
    }
    return null;
  };

  const renderSNAPFoodBenefit = () => {
    if (modalKey === MODAL_KEYS.SNAP_FOOD) {
      return (
        <SNAPBenefitModal
          ref={snapFoodRef}
          benefitTitle={APP_CONSTANTS.FOOD_BENEFITS}
          pinType={PIN_TYPE.SNAP_FOOD}
          method={PAYMENT_METHODS.SNAP_FOOD}
          availableBalance={foodStampBalance}
          remainingEligibleAmount={remainingTotalForSnapFoodEdit}
          onSubmitPayment={onSnapFoodSuccess}
          onBottomDisabled={setSnapFoodDisabled}
          onToggleLoading={setFoodBenefitLoading}
          card={snapCardSelected}
          previousAmount={
            snapFoodSelectedAmount > 0 ? snapFoodSelectedAmount + '' : ''
          }
          previousOption={snapFoodSelectedOption}
        />
      );
    }
    return null;
  };

  const renderSNAPCashBenefit = () => {
    if (modalKey === MODAL_KEYS.SNAP_CASH) {
      return (
        <SNAPBenefitModal
          ref={snapCashRef}
          benefitTitle={APP_CONSTANTS.EBT_CASH_BENEFITS}
          pinType={PIN_TYPE.SNAP_CASH}
          method={PAYMENT_METHODS.SNAP_CASH}
          availableBalance={cashBenefitsBalance}
          remainingEligibleAmount={remainingOrderTotalEdit}
          onSubmitPayment={onSnapCashSuccess}
          onBottomDisabled={setSnapCashDisabled}
          onToggleLoading={setCashBenefitLoading}
          card={snapCardSelected}
          previousAmount={
            snapCashSelectedAmount > 0 ? snapCashSelectedAmount + '' : ''
          }
          previousOption={snapCashSelectedOption}
        />
      );
    }
    return null;
  };

  const renderGCBenefit = () => {
    if (modalKey === MODAL_KEYS.GC_BENEFIT) {
      return (
        <SNAPBenefitModal
          ref={gcBenefitRef}
          benefitTitle={`${APP_CONSTANTS.GIFT_CARD_ENDING_IN} ${
            gcSelected?.lastFour || ''
          }`}
          method={PAYMENT_METHODS.GIFT_CARD}
          availableBalance={gcBalance}
          remainingEligibleAmount={remainingOrderTotalEdit}
          onBottomDisabled={setIsGCBenefitDisabled}
          card={gcSelected}
          previousAmount={gcSelectedAmount > 0 ? gcSelectedAmount + '' : ''}
          previousOption={gcSelectedAmountOption}
        />
      );
    }
    return null;
  };

  const renderVirtualWalletPayment = () => {
    if (modalKey === MODAL_KEYS.VW_BENEFIT) {
      return (
        <SNAPBenefitModal
          ref={vwBenefitRef}
          pinType={PIN_TYPE.VIRTUAL_WALLET}
          method={PAYMENT_METHODS.VIRTUAL_WALLET}
          availableBalance={vwBalance}
          remainingEligibleAmount={remainingOrderTotalEdit}
          onBottomDisabled={setVWBenefitDisabled}
          card={vwSelected}
          previousAmount={vwSelectedAmount > 0 ? vwSelectedAmount + '' : ''}
          previousOption={vwSelectedAmountOption}
        />
      );
    }
    return null;
  };

  const renderVirtualWallet = () => {
    if (modalKey === MODAL_KEYS.VIRTUAL_WALLET) {
      return (
        <VirtualWalletModal
          contentOnly
          visible
          closeModal={onCrossPress}
          onToggleLoading={setIsLoading}
        />
      );
    }
    return null;
  };

  const renderAddStoreCharge = () => {
    if (modalKey === MODAL_KEYS.STA_ADD) {
      return (
        <AddSTAModal
          ref={staAddRef}
          isProfileScreen={isProfileScreen}
          isGuest={isGuest}
          onSelectPlan={onSelectSTAPlan}
          onBottomDisabled={setIsAddSTADisabled}
        />
      );
    }
    return null;
  };

  const renderStoreChargeBenefit = () => {
    if (modalKey === MODAL_KEYS.STA_BENEFIT) {
      return (
        <SNAPBenefitModal
          ref={staBenefitRef}
          method={PAYMENT_METHODS.STORE_CHARGE}
          benefitTitle={`${APP_CONSTANTS.STA_ENDING_IN} ${
            staSelected?.lastFour || ''
          }`}
          remainingEligibleAmount={remainingOrderTotalEdit}
          onBottomDisabled={setIsSTABenefitDisabled}
          card={staSelected}
          previousAmount={staSelectedAmount > 0 ? staSelectedAmount + '' : ''}
          previousOption={staSelectedAmountOption}
          staPurchaseOrder={staPurchaseOrder}
        />
      );
    }
    return null;
  };

  const renderDialogBox = show => {
    if (show) {
      return (
        <DialogBox
          hasBackdrop={
            isProfileScreen ||
            isTransactionErrorModal ||
            dialogBoxKey === DIALOG_BOX_KEYS.SNAP_ALERT
          }
          onCancelPress={onCancelRetry}
          onModalHide={onErrorModalHide}
          onConfirmPress={onConfirmPress}
          errorDetails={errorDetails.current}
          visible={isErrorDialog && !isCustomLoading}
          isSingleButton={DIALOG_BOX_SINGLE_BUTTON[dialogBoxKey]}
          onModalWillShow={() => {
            setIsRetryModalHidden(false);
          }}
          title={dialogBoxTitle || APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
          message={dialogBoxMessages || APP_CONSTANTS.SOME_THING_WENT_WRONG}
          cancelButtonLabel={
            DIALOG_BOX_LEFT_BUTTON[dialogBoxKey] || APP_CONSTANTS.CANCEL
          }
          confirmButtonLabel={
            DIALOG_BOX_RIGHT_BUTTON[dialogBoxKey] || APP_CONSTANTS.RETRY
          }
        />
      );
    }
    return null;
  };

  const renderCheckoutModals = () => {
    if (!isProfileScreen) {
      return (
        <>
          {/*{renderAddPayment()}*/}
          {/*{renderAddedPayments()}*/}
          {renderGiftCardNumber()}
          {renderGiftCardBalance()}
          {renderGCBenefit()}
          {renderDebitSave()}
          {renderSnapIframes()}
          {/*{renderSnapBalance()}*/}
          {renderSNAPFoodBenefit()}
          {renderSNAPCashBenefit()}
          {renderVirtualWalletPayment()}
          {renderAddStoreCharge()}
          {renderStoreChargeBenefit()}
          {renderDialogBox(true)}
        </>
      );
    }
    return null;
  };

  const renderProfileModals = () => {
    if (isProfileScreen) {
      return (
        <>
          {renderDebitSave()}
          {renderSnapIframes()}
          {renderGiftCardNumber()}
          {renderGiftCardBalance()}
          {/*{renderSnapBalance()}*/}
          {renderVirtualWallet()}
          {renderAddStoreCharge()}
          {renderDialogBox(modalKey)}
        </>
      );
    }
    return null;
  };

  const getScreenWrapper = (isProfileScreen = false) => {
    if (!isProfileScreen) {
      return ScrollView;
    }
    return View;
  };

  const ScreenWrapper = getScreenWrapper(isProfileScreen);


  const renderProfileView = () => {
    // if (isProfileScreen) {
    return (
      <ScrollView>
        {renderAddedPayments()}
        {renderAddPayment()}
        {renderDialogBox(!modalKey)}
      </ScrollView>
    );
    // }
    // return null;
  };

  const renderCheckoutView = () => {
    if (!isProfileScreen) {
      return <>{renderDialogBox(isTransactionErrorModal)}</>;
    }
    return null;
  };

  const onRemoveAllPayments = useCallback(() => {
    dispatch(removeCartAllPayments());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      {renderProfileView()}
      {renderCheckoutView()}
      <BottomSheetModal
        visible={modalKey}
        avoidKeyboard={false}
        closeOnBackdrop={false}
        onCrossPress={onCrossPress}
        onBottomPress={onBottomPress}
        title={MODAL_TITLES[modalKey]}
        onSkipButtonPress={onSkipPress}
        isCustomLoading={isCustomLoading}
        buttonStyles={styles.modalButton}
        headerTitleStyle={styles.modalTitle}
        buttonTitle={modalButtonTitle}
        loaderStyle={{paddingBottom: keyboardHeight}}
        isButtonDisabled={modalIsBottomDisabled[modalKey]}
        showButton={modalKey && MODAL_IS_BOTTOM[modalKey]}
        skipButtonTitle={MODAL_SKIP_BUTTON_TITLES[modalKey]}
        isSkipDisabled={modalIsSkipDisabled[modalKey] || false}
        showSkipButton={modalIsSkipButton}
        containerStyle={[
          {maxHeight: SCREEN_HEIGHT - top, paddingBottom: keyboardHeight - 20},
        ]}>
        {renderCheckoutModals()}
        {renderProfileModals()}
        <FlashMessage
          floating
          ref={flashRef}
          position={'bottom'}
          backgroundColor={COLORS.GRAY_TEXT_0_9}
          color={COLORS.WHITE}
          style={styles.flashStyle}
          titleStyle={styles.flashTitle}
          textStyle={styles.flashTitle}
          duration={4000}
        />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default memo(AddPaymentModal);
