import {APP_CONSTANTS} from '../../constants/Strings';
import {PAYMENT_METHODS} from '../../constants/Common';

export const DIALOG_BOX_KEYS = {
  METHODS: 'METHODS',
  DEBIT_CARD_SAVE: 'DEBIT_CARD_SAVE',
  DELETE_PAYMENT: 'DELETE_PAYMENT',
  ERROR: 'ERROR',
  VW_BALANCE: 'VW_BALANCE',
  GC_BALANCE: 'GC_BALANCE',
  GC_SAVE: 'GC_SAVE',
  STA_SAVE: 'STA_SAVE',
  CANCEL_ERROR: 'CANCEL_ERROR',
  CANCEL_CONFIRM: 'CANCEL_CONFIRM',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  SNAP_FEATURE_DISABLED: 'SNAP_FEATURE_DISABLED',
  STA_DISABLED: 'STA_DISABLED',
  SNAP_ALERT: 'SNAP_ALERT',
};

export const DIALOG_BOX_TITLES = {
  [DIALOG_BOX_KEYS.DEBIT_CARD_SAVE]: APP_CONSTANTS.ERROR,
  [DIALOG_BOX_KEYS.DELETE_PAYMENT]: APP_CONSTANTS.DELETE_CARD,
  [DIALOG_BOX_KEYS.STA_SAVE]: APP_CONSTANTS.ERROR,
  [DIALOG_BOX_KEYS.CANCEL_CONFIRM]: APP_CONSTANTS.CANCEL_ORDER,
  [DIALOG_BOX_KEYS.SNAP_FEATURE_DISABLED]: APP_CONSTANTS.ONLINE_SNAP_COMING_SOON,
  [DIALOG_BOX_KEYS.STA_DISABLED]: APP_CONSTANTS.STA_COMING_SOON,
  [DIALOG_BOX_KEYS.SNAP_ALERT]: APP_CONSTANTS.EBT_CARD_ALERT,
};

export const DIALOG_BOX_LEFT_BUTTON = {
  [DIALOG_BOX_KEYS.DEBIT_CARD_SAVE]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.GC_SAVE]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.ERROR]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.STA_SAVE]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.TRANSACTION_ERROR]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.SNAP_FEATURE_DISABLED]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.STA_DISABLED]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.SNAP_ALERT]: APP_CONSTANTS.OK,
  [DIALOG_BOX_KEYS.CANCEL_CONFIRM]: APP_CONSTANTS.NO,
};

export const DIALOG_BOX_RIGHT_BUTTON = {
  [DIALOG_BOX_KEYS.DELETE_PAYMENT]: APP_CONSTANTS.YES,
  [DIALOG_BOX_KEYS.CANCEL_CONFIRM]: APP_CONSTANTS.YES,
};

export const DIALOG_BOX_SINGLE_BUTTON = {
  [DIALOG_BOX_KEYS.DEBIT_CARD_SAVE]: true,
  [DIALOG_BOX_KEYS.GC_SAVE]: true,
  [DIALOG_BOX_KEYS.ERROR]: true,
  [DIALOG_BOX_KEYS.STA_SAVE]: true,
  [DIALOG_BOX_KEYS.TRANSACTION_ERROR]: true,
  [DIALOG_BOX_KEYS.SNAP_FEATURE_DISABLED]: true,
  [DIALOG_BOX_KEYS.STA_DISABLED]: true,
  [DIALOG_BOX_KEYS.SNAP_ALERT]: true,
};

export const MODAL_KEYS = {
  ADD_CARD: 'ADD_CARD',
  ADDED_PAYMENTS: 'ADDED_PAYMENTS',

  //SNAP Card
  SNAP_PAN: 'SNAP_PAN',
  // SNAP_PIN: 'SNAP_PIN',
  SNAP_FOOD: 'SNAP_FOOD',
  SNAP_CASH: 'SNAP_CASH',
  // SNAP_BALANCE: 'SNAP_BALANCE',

  // Credit/Debit Card
  DEBIT_CARD_SAVE: 'DEBIT_CARD_SAVE',

  //GiftCard
  GC_NUMBER: 'GC_NUMBER',
  GC_BALANCE: 'GC_BALANCE',
  GC_BENEFIT: 'GC_BENEFIT',

  //Virtual Wallet
  VW_BENEFIT: 'VW_BENEFIT',
  VIRTUAL_WALLET: 'VIRTUAL_WALLET',

  //Store Charge Account
  STA_ADD: 'STA_ADD',
  STA_BENEFIT: 'STA_BENEFIT',
};

export const MODAL_TITLES = {
  [MODAL_KEYS.ADD_CARD]: APP_CONSTANTS.ADD_NEW_PAYMENT_METHOD,
  [MODAL_KEYS.ADDED_PAYMENTS]: APP_CONSTANTS.ADD_PAYMENT_METHODS,
  // [MODAL_KEYS.SNAP_BALANCE]: APP_CONSTANTS.SNAP_BALANCE,
  [MODAL_KEYS.SNAP_PAN]: APP_CONSTANTS.ADD_SNAP_CARD,
  // [MODAL_KEYS.SNAP_PIN]: APP_CONSTANTS.RETRIEVE_SNAP_BALANCE_TITLE,
  [MODAL_KEYS.SNAP_FOOD]: APP_CONSTANTS.SNAP_OPTIONS,
  [MODAL_KEYS.SNAP_CASH]: APP_CONSTANTS.SNAP_OPTIONS,
  [MODAL_KEYS.DEBIT_CARD_SAVE]: APP_CONSTANTS.ADD_CREDIT_OR_DEBIT_CARD,
  [MODAL_KEYS.VW_BENEFIT]: APP_CONSTANTS.VIRTUAL_WALLET_ACCOUNT,
  [MODAL_KEYS.VIRTUAL_WALLET]: APP_CONSTANTS.VIRTUAL_WALLET,
  [MODAL_KEYS.GC_NUMBER]: APP_CONSTANTS.ADD_GIFT_CARD,
  [MODAL_KEYS.GC_BALANCE]: APP_CONSTANTS.GC_BALANCE,
  [MODAL_KEYS.GC_BENEFIT]: APP_CONSTANTS.GC_OPTIONS,
  [MODAL_KEYS.STA_ADD]: APP_CONSTANTS.ADD_STA,
  [MODAL_KEYS.STA_BENEFIT]: APP_CONSTANTS.STA_SAVED,
};

export const MODAL_IS_BOTTOM = {
  [MODAL_KEYS.SNAP_PAN]: false,
  // [MODAL_KEYS.SNAP_PIN]: false,
};

export const MODAL_BUTTON_TITLES = {
  [MODAL_KEYS.ADD_CARD]: APP_CONSTANTS.CONTINUE_TO_PAYMENT,
  [MODAL_KEYS.ADDED_PAYMENTS]: APP_CONSTANTS.CONTINUE_TO_CHECKOUT,
  // [MODAL_KEYS.SNAP_BALANCE]: APP_CONSTANTS.DONE,
  [MODAL_KEYS.SNAP_FOOD]: APP_CONSTANTS.SUBMIT_SNAP_PAYMENT,
  [MODAL_KEYS.SNAP_CASH]: APP_CONSTANTS.SUBMIT_SNAP_PAYMENT,
  // [MODAL_KEYS.SNAP_PIN]: APP_CONSTANTS.RETRIEVE_SNAP_BALANCE,
  [MODAL_KEYS.SNAP_PAN]: APP_CONSTANTS.SUBMIT,
  [MODAL_KEYS.DEBIT_CARD_SAVE]: APP_CONSTANTS.SUBMIT,
  [MODAL_KEYS.VW_BENEFIT]: APP_CONSTANTS.SUBMIT_VW_PAYMENT,
  [MODAL_KEYS.VIRTUAL_WALLET]: APP_CONSTANTS.DONE,
  [MODAL_KEYS.GC_NUMBER]: APP_CONSTANTS.RETRIEVE_GC_BALANCE_SUBMIT,
  [MODAL_KEYS.GC_BENEFIT]: APP_CONSTANTS.SUBMIT_GIFT_CARD_PAYMENT,
  [MODAL_KEYS.GC_BALANCE]: APP_CONSTANTS.DONE,
  [MODAL_KEYS.STA_ADD]: APP_CONSTANTS.SUBMIT,
  [MODAL_KEYS.STA_BENEFIT]: APP_CONSTANTS.SUBMIT_STA,
};

export const MODAL_GUEST_BUTTON_TITLES = {
  ...MODAL_BUTTON_TITLES,
  [MODAL_KEYS.GC_NUMBER]: APP_CONSTANTS.RETRIEVE_BALANCE,
  [MODAL_KEYS.SNAP_PAN]: APP_CONSTANTS.SUBMIT,
  [MODAL_KEYS.STA_ADD]: APP_CONSTANTS.SAVE_CHARGE_ACCOUNT_GUEST,
};

export const MODAL_SKIP_BUTTON = {
  [MODAL_KEYS.SNAP_PAN]: false,
  [MODAL_KEYS.SNAP_FOOD]: true,
  [MODAL_KEYS.SNAP_CASH]: true,
  [MODAL_KEYS.DEBIT_CARD_SAVE]: false,
  [MODAL_KEYS.GC_NUMBER]: false,
  [MODAL_KEYS.STA_ADD]: false,
};

export const MODAL_GUEST_SKIP_BUTTON = {
  [MODAL_KEYS.SNAP_PAN]: false,
  [MODAL_KEYS.SNAP_FOOD]: true,
  [MODAL_KEYS.SNAP_CASH]: true,
  [MODAL_KEYS.DEBIT_CARD_SAVE]: false,
  [MODAL_KEYS.GC_NUMBER]: false,
  [MODAL_KEYS.STA_ADD]: false,
};

export const MODAL_SKIP_BUTTON_TITLES = {
  [MODAL_KEYS.SNAP_FOOD]: APP_CONSTANTS.SKIP,
  [MODAL_KEYS.SNAP_CASH]: APP_CONSTANTS.CANCEL,
  [MODAL_KEYS.DEBIT_CARD_SAVE]: APP_CONSTANTS.THIS_TRANSACTION_ONLY,
  [MODAL_KEYS.GC_NUMBER]: APP_CONSTANTS.THIS_TRANSACTION_ONLY,
  [MODAL_KEYS.STA_ADD]: APP_CONSTANTS.THIS_TRANSACTION_ONLY,
};

export const FULL_AMOUNT = 'FULL_AMOUNT';
export const ENTER_AMOUNT = 'ENTER_AMOUNT';

export const BENEFIT_ERRORS = {
  [PAYMENT_METHODS.SNAP_FOOD]: {
    AVAILABLE: APP_CONSTANTS.AMOUNT_EXCEEDS_AVAILABLE_FOOD_BALANCE,
    REMAINING: APP_CONSTANTS.AMOUNT_EXCEEDS_SNAP_SUBTOTAL,
  },
  [PAYMENT_METHODS.SNAP_CASH]: {
    AVAILABLE: APP_CONSTANTS.AMOUNT_EXCEEDS_AVAILABLE_CASH_BALANCE,
    REMAINING: APP_CONSTANTS.AMOUNT_EXCEEDS_SNAP_CASH_SUBTOTAL,
  },
  [PAYMENT_METHODS.VIRTUAL_WALLET]: {
    AVAILABLE: APP_CONSTANTS.AMOUNT_ENTERED_EXCEEDS_AVAILABLE_VIRTUAL_WALLET_BALANCE,
    REMAINING: APP_CONSTANTS.AMOUNT_ENTERED_EXCEEDS_REMAINING_ORDER_TOTAL,
  },
  [PAYMENT_METHODS.GIFT_CARD]: {
    AVAILABLE: APP_CONSTANTS.AMOUNT_ENTERED_EXCEEDS_AVAILABLE_GC_BALANCE,
    REMAINING: APP_CONSTANTS.AMOUNT_ENTERED_EXCEEDS_REMAINING_ORDER_TOTAL,
  },
  [PAYMENT_METHODS.STORE_CHARGE]: {
    AVAILABLE: APP_CONSTANTS.AMOUNT_ENTERED_EXCEEDS_AVAILABLE_STA_BALANCE,
    REMAINING: APP_CONSTANTS.AMOUNT_ENTERED_EXCEEDS_REMAINING_ORDER_TOTAL,
  },
};

export const ANALYTICS_EVENTS = {
  LOGIN: 'login',
  GUEST_LOGIN: 'guest_login',
  SIGNUP: 'signup',
  ONBOARDED: 'onboarded',
  LOGOUT: 'logout',
  NAVIGATION: 'navigation',
  GUEST_SIGNUP: 'guest_signup',
};
