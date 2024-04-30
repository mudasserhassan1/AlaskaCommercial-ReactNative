import {
  addItemsToCart,
  getCartItems,
  removeItemFromCartAPI,
  updateCart,
} from '../services/ApiCaller';
import {
  changeCartItems,
  updateCartItemsCount,
  updateZipCodeDetails,
} from '../redux/actions/general';
import {snakeToCamelCase} from './transformUtils';
import {isCustomCake} from './cakeUtils';
import {APP_CONSTANTS} from '../constants/Strings';
import {getItemPriceQuantity, setAppropriateQuantity} from './productUtils';
import {STATUSES} from '../constants/Api';
import {logToConsole} from '../configs/ReactotronConfig';

export const addItemToCart = async (dispatch, params, options) => {
  const {response = {}} = await addItemsToCart(params, options);
  const {
    ok = false,
    status = 0,
    isNetworkError,
    data,
    isUnderMaintenance,
  } = response ?? {};
  if (ok && status === STATUSES.OK) {
    dispatch(updateCartItemsCount(data?.total ?? 0));
  } else {
    if (!isUnderMaintenance) {
      throw {status, isNetworkError};
    }
  }
};

// export const getItemsFromCart = async dispatch => {
//   const {response = {}} = (await getCartItems()) ?? {};
//   const {
//     ok = false,
//     status = 0,
//     isNetworkError,
//     isUnderMaintenance,
//   } = response ?? {};
//   if (ok && status === STATUSES.OK) {
//     const {data = {}} = response ?? {};
//     const {
//       response: cartResponse = {},
//       zipCodeDetail = {},
//       storeDetail,
//       specialSkus = {},
//     } = data ?? {};
//     const {items = []} = cartResponse ?? {};
//     for (const cartItem of items) {
//       const {itemObj = {}, quantity = 0} = cartItem ?? {};
//       cartItem.itemObj = await setAppropriateQuantity(itemObj, quantity);
//     }
//     dispatch(changeCartItems(items));
//     dispatch(
//       updateZipCodeDetails({
//         zipCodeDetail: snakeToCamelCase(zipCodeDetail),
//         storeDetail: snakeToCamelCase(storeDetail),
//         specialSKUs: specialSkus,
//       }),
//     );
//   } else {
//     if (!isUnderMaintenance) {
//       throw {status, isNetworkError};
//     }
//   }
// };

export const getItemsFromCart = async (dispatch, updateTotalCount = true) => {
  const {response = {}} = (await getCartItems()) ?? {};
  const {
    ok = false,
    status = 0,
    isNetworkError,
    isUnderMaintenance,
  } = response ?? {};
  if (ok && status === STATUSES.OK) {
    const {data = {}} = response ?? {};
    const {
      response: cartResponse = {},
      zipCodeDetail = {},
      storeDetail,
      specialSkus = {},
    } = data ?? {};
    const {items = []} = cartResponse ?? {};
    for (const cartItem of items) {
      const {itemObj = {}, quantity = 0} = cartItem ?? {};
      cartItem.itemObj = await setAppropriateQuantity(itemObj, quantity);
    }
    dispatch(changeCartItems(items));
    if (updateTotalCount) {
      dispatch(updateCartItemsCount(items?.length));
    }
    dispatch(
      updateZipCodeDetails({
        zipCodeDetail: snakeToCamelCase(zipCodeDetail),
        storeDetail: snakeToCamelCase(storeDetail),
        specialSKUs: specialSkus,
      }),
    );
  } else {
    if (!isUnderMaintenance) {
      throw {status, isNetworkError};
    }
  }
};

export const removeItemsFromCart = async (dispatch, item = {}) => {
  let {
    _id: sku = '',
    decoration = false,
    itemObj = {},
    cakeSelections = {},
  } = item;
  const {decorationType = ''} = cakeSelections;

  let cake = false;
  if (isCustomCake(itemObj)) {
    cake = true;
    if (decorationType && decorationType !== APP_CONSTANTS.NONE) {
      decoration = true;
    }
  }
  const {response = {}} = await removeItemFromCartAPI({
    id: sku,
    decoration,
    cake,
  });
  const {
    ok = false,
    status = 0,
    data,
    isNetworkError,
    isUnderMaintenance,
  } = response ?? {};
  if (ok && status === STATUSES.OK) {
    dispatch(updateCartItemsCount(data?.total ?? 0));
    await getItemsFromCart(dispatch);
  } else {
    if (!isUnderMaintenance) {
      throw {status, isNetworkError};
    }
  }
};

export const filterCartItems = async (
  items,
  fromCart = false,
  fromOrderHistory = false,
) => {
  let products = [];
  for (const item of items) {
    const {
      substitutionAllowed = false,
      createdDate = '',
      customerUnitOfMeasureSelection,
      quantity: Qty,
      Quantity,
    } = fromOrderHistory ? item.item : item;
    const productObject = fromCart
      ? item.itemObj
      : fromOrderHistory
      ? item.item.itemObj
      : item ?? {};
    const {cakeSelections = {}, decoration = false} = fromOrderHistory
      ? item.item
      : item;
    const {
      SKU: sku = '',
      item: innerItem = [],
      CUSTOMER_UNIT_OF_MEASURE_SELECTION,
      QUERY_ID: queryId = '',
      POSITION: position = '',
    } = productObject;
    const {FORM_REQUIRED: formRequired = ''} = innerItem[0];
    const {quantity} = getItemPriceQuantity(productObject);
    let dummyItem = {
      item: sku,
      substitutionAllowed,
      quantity: fromOrderHistory ? Qty : quantity,
      createdDate,
      formRequired,
      queryId,
      position,
      customerUnitOfMeasureSelection:
        customerUnitOfMeasureSelection ?? CUSTOMER_UNIT_OF_MEASURE_SELECTION,
    };
    if (isCustomCake(productObject)) {
      if (cakeSelections) {
        const modifiedCakesSelections = snakeToCamelCase(cakeSelections);
        dummyItem = {...dummyItem, cakeSelections: modifiedCakesSelections};
      }
    }
    //Do not push decoration Separately to the  CART
    if (!decoration) {
      if ((Qty && Qty > 0) || (Quantity && Quantity > 0)) {
        //Remove substituted item that has qty = 0 i.e. Qty is for substituted case
        logToConsole({dummyItem});
        products.push(dummyItem);
      }
    }
  }
  return products;
};

export const addMultipleItemsToCart = async (
  items,
  dispatch,
  fromCart = false,
  fromOrderHistory = false,
) => {
  const products = await filterCartItems(
    items || [],
    fromCart,
    fromOrderHistory,
  );
  logToConsole({products});
  let params = {
    products: products,
  };
  const {response = {}} = await addItemsToCart(params);
  logToConsole({params});
  const {
    ok = false,
    status = 0,
    data = {},
    isNetworkError,
    isUnderMaintenance,
  } = response ?? {};
  if (ok && status === STATUSES.OK) {
    dispatch(updateCartItemsCount(data?.total ?? 0));
  } else {
    if (!isUnderMaintenance) {
      throw {status, message: status, isNetworkError};
    }
  }
};

export const updateCartProducts = async (items, dispatch, StoreNumber) => {
  let products = await filterCartItems(items, true, false);
  products?.forEach((item, index) => {
    products[index] = {...products[index], store: StoreNumber};
  });
  let params = {
    products: products,
    edit: true,
  };
  const {response = {}} = await updateCart(params);
  const {
    ok = false,
    status = 0,
    data,
    isNetworkError,
    isUnderMaintenance,
  } = response ?? {};
  if (ok && status === STATUSES.OK) {
    dispatch(updateCartItemsCount(data?.total ?? 0));
  } else {
    if (!isUnderMaintenance) {
      throw {status, isNetworkError};
    }
  }
};
