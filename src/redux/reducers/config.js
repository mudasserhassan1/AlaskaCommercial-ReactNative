import {
  HOME_DEPARTMENTS,
  HOME_SALE_ITEMS,
  PROMOS,
  SET_FIRST_VISIT,
  SET_IS_ONBOARDED,
  SET_FIRST_EVER_VISIT,
  TOGGLE_SNAP_FEATURES,
  RESET_USER_CONFIG,
  SET_IS_CART_VIEWED,
  SET_IS_GUEST_CART_VIEWED,
  POPULAR_ITEMS_IN_YOUR_AREA,
  SUB_DEPARTMENTS, SET_DEPARTMENTS_PRODUCTS,
} from "../types/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer} from "redux-persist";

const initialState = {
  isOnboarded: false,
  homeSaleItems: [],
  promos: [],
  homeDepartments: [],
  isFirstVisit: true,
  isFirstEverVisit: true,
  isTestPaymentsEnabled: false,
  isUserCartViewed: false,
  isGuestCartViewed: false,
  popularItemsInYourArea: [],
  subDepartments:[],
  departmentsProducts:[]
};

const configReducer = (state = initialState, action) => {
  const {type} = action || {};
  switch (type) {
    case SET_IS_ONBOARDED:
      return {
        ...state,
        isOnboarded: action.payload,
      };
    case HOME_SALE_ITEMS:
      return {
        ...state,
        homeSaleItems: action.payload,
      };
    case HOME_DEPARTMENTS:
      return {
        ...state,
        homeDepartments: action.payload,
      };
    case PROMOS:
      return {
        ...state,
        promos: action.payload,
      };
    case SET_FIRST_VISIT:
      return {
        ...state,
        isFirstVisit: action.payload,
      };
    case SET_FIRST_EVER_VISIT:
      return {
        ...state,
        isFirstEverVisit: action.payload,
      };
    case TOGGLE_SNAP_FEATURES:
      return {
        ...state,
        isTestPaymentsEnabled: action.payload,
      };
    case RESET_USER_CONFIG:
      return {
        ...state,
        homeSaleItems: [],
        promos: [],
        homeDepartments: [],
        isFirstVisit: true,
      };
    case SET_IS_CART_VIEWED:
      return {
        ...state,
        isUserCartViewed: action.payload,
      };
    case SET_IS_GUEST_CART_VIEWED:
      return {
        ...state,
        isGuestCartViewed: action.payload,
      };
    case POPULAR_ITEMS_IN_YOUR_AREA:
      return {
        ...state,
        popularItemsInYourArea: action.payload,
      };
    case SUB_DEPARTMENTS:
      return {
        ...state,
        subDepartments: action.payload,
      };
    default:
      return state;
  }
};

export default configReducer;
// const providerPersistConfig = {
//   key: 'config',
//   storage: AsyncStorage,
// };
// export default persistReducer(providerPersistConfig, configReducer);




