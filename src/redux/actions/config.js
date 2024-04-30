import {
  HOME_DEPARTMENTS,
  HOME_SALE_ITEMS,
  PROMOS,
  SET_FIRST_VISIT,
  SET_FIRST_EVER_VISIT,
  SET_IS_ONBOARDED,
  TOGGLE_SNAP_FEATURES,
  RESET_USER_CONFIG,
  SET_IS_GUEST_CART_VIEWED,
  SET_IS_CART_VIEWED,
  POPULAR_ITEMS_IN_YOUR_AREA, SUB_DEPARTMENTS, SET_DEPARTMENTS_PRODUCTS,
} from "../types/config";

export const setIsOnboarded = data => dispatch => {
  dispatch({
    type: SET_IS_ONBOARDED,
    payload: data,
  });
};
export const setHomeSaleItems = data => dispatch => {
  dispatch({
    type: HOME_SALE_ITEMS,
    payload: data,
  });
};

export const setHomeDepartments = data => dispatch => {
  dispatch({
    type: HOME_DEPARTMENTS,
    payload: data,
  });
};
export const setPopularItemsInYourArea = data => dispatch => {
  dispatch({
    type: POPULAR_ITEMS_IN_YOUR_AREA,
    payload: data,
  });
};

export const setHomePromos = data => dispatch => {
  dispatch({
    type: PROMOS,
    payload: data,
  });
};

export const setFirstVisit = data => dispatch => {
  dispatch({
    type: SET_FIRST_VISIT,
    payload: data,
  });
};

export const setFirstEverVisit = data => dispatch => {
  dispatch({
    type: SET_FIRST_EVER_VISIT,
    payload: data,
  });
};

export const toggleTestPayments = data => dispatch => {
  dispatch({
    type: TOGGLE_SNAP_FEATURES,
    payload: data,
  });
};

export const resetUserConfig = data => dispatch => {
  dispatch({
    type: RESET_USER_CONFIG,
    payload: data,
  });
};

export const setIsGuestCartViewed = data => dispatch => {
  dispatch({
    type: SET_IS_GUEST_CART_VIEWED,
    payload: data,
  });
};

export const setIsUserCartViewed = data => dispatch => {
  dispatch({
    type: SET_IS_CART_VIEWED,
    payload: data,
  });
};

export const setsubDepartments = data => dispatch => {
  dispatch({
    type: SUB_DEPARTMENTS,
    payload: data,
  });
};
