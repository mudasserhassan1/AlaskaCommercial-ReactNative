import {
  ADD_PAYMENT_METHOD,
  SAVE_CART_INVOICE,
  SAVE_PAYMENT_METHODS,
  SAVE_PAYMENTS_CONFIG,
  UPDATE_PAYMENT_METHOD,
  ADD_CART_PAYMENT,
  REMOVE_CART_ALL_PAYMENTS,
  REMOVE_CART_PAYMENT,
  DELETE_PAYMENT_METHOD,
} from '../types';

export const addPaymentMethod = data => dispatch => {
  dispatch({
    type: ADD_PAYMENT_METHOD,
    payload: data,
  });
};

export const updatePaymentMethod = data => dispatch => {
  dispatch({
    type: UPDATE_PAYMENT_METHOD,
    payload: data,
  });
};

export const savePaymentMethods = data => dispatch => {
  dispatch({
    type: SAVE_PAYMENT_METHODS,
    payload: data,
  });
};

export const deletePaymentMethod = data => dispatch => {
  dispatch({
    type: DELETE_PAYMENT_METHOD,
    payload: data,
  });
};

export const savePaymentsConfig = data => dispatch => {
  dispatch({
    type: SAVE_PAYMENTS_CONFIG,
    payload: data,
  });
};

export const saveCartInvoice = data => dispatch => {
  dispatch({
    type: SAVE_CART_INVOICE,
    payload: data,
  });
};

export const addCartPayments = data => dispatch => {
  dispatch({
    type: ADD_CART_PAYMENT,
    payload: data,
  });
};

export const removeCartAllPayments = data => dispatch => {
  dispatch({
    type: REMOVE_CART_ALL_PAYMENTS,
    payload: data,
  });
};

export const removeCartPayment = data => dispatch => {
  dispatch({
    type: REMOVE_CART_PAYMENT,
    payload: data,
  });
};
