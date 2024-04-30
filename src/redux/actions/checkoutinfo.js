import {SET_CHECKOUT_INFO} from '../types';

export const setCheckoutInfo = data => dispatch => {
  dispatch({
    type: SET_CHECKOUT_INFO,
    payload: data,
  });
};
