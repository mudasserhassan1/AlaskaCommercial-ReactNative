import {COLORS} from '../theme';
import {
  RANDOM_WEIGHT_KEYS,
  RANDOM_WEIGHT_UNITS,
  RANDOM_WEIGHT_VALUES,
} from '../constants/Common';
import {formatAmountValue} from './calculationUtils';
import {logToConsole} from '../configs/ReactotronConfig';

export const isAppPriceEligible = appPrice => {
  return !!parseFloat(appPrice);
};

export const splitFeaturesIntoArray = featuresString => {
  let featuresArray = [];
  if (featuresString) {
    featuresArray = featuresString.split('~');
  }
  return featuresArray;
};

export const getColorSchemeForProduct = (item, isSubstituted = false) => {
  const {APP_PRICE: appPrice = null, SALE_PRICE: salePrice = null} = item ?? {};

  if (isSubstituted) {
    return {
      mainColor: COLORS.GRAY0_25,
      lightColor: COLORS.GRAY0_25,
    };
  }
  if (salePrice) {
    return {
      mainColor: COLORS.BLACK,
      lightColor: COLORS.GREY_V,
    };
  }
  if (isAppPriceEligible(appPrice)) {
    return {
      mainColor: COLORS.BLACK,
      lightColor: COLORS.GREY_V,
    };
  }
  return {
    mainColor: COLORS.BLACK,
    lightColor: COLORS.BLACK,
  };
};
/**
 * Function that modifies the item
 * @param item
 * @param quantity
 * @returns {Promise<*>}
 */
export const setAppropriateQuantity = (item, quantity) => {
  const {APP_PRICE: appPrice = null, SALE_PRICE: salePrice = null} = item ?? {};

  if (salePrice) {
    item = {...item, SALE_PRICE_SELL_QTY: quantity};
  } else if (isAppPriceEligible(appPrice)) {
    item = {...item, APP_PRICE_SELL_QTY: quantity};
  } else {
    item = {...item, REG_PRICE_SELL_QTY: quantity};
  }

  return item;
};
/**
 * Function that returns the quantity limit
 * MAX_ORDER_REG_PRICE, MAX_ORDER_APP_PRICE and MAX_ORDER_SALE_PRICE
 * mimics the limit for quantity. One for each price type.
 * @param item
 * @returns {number}
 */
export const getQuantityLimit = item => {
  const {
    REG_PRICE: regularPrice = null,
    MAX_ORDER_REG_PRICE: maxOrderRegularPrice = null,
    APP_PRICE: appPrice = null,
    MAX_ORDER_APP_PRICE: maxOrderAppPrice = null,
    SALE_PRICE: salePrice = null,
    MAX_ORDER_SALE_PRICE: maxOrderSalePrice = null,
  } = item ?? {};
  if (!!salePrice && !!maxOrderSalePrice) {
    return parseInt(maxOrderSalePrice, 10);
  }
  if (isAppPriceEligible(appPrice) && !!maxOrderAppPrice) {
    return parseInt(maxOrderAppPrice, 10);
  }
  if (!!regularPrice && !!maxOrderRegularPrice) {
    return parseInt(maxOrderRegularPrice, 10);
  }
  //May be required to return STOCK_ON_HAND by default at some point in the future.
  // return stockOnHand
};
export const isRandomWeightItem = (
  sellUnitOfMeasure,
  customerOrderUnitOfMeasure,
) => {
  return (
    sellUnitOfMeasure === RANDOM_WEIGHT_VALUES.lb &&
    RANDOM_WEIGHT_UNITS.includes(customerOrderUnitOfMeasure)
  );
};
export const getItemMinimumQuantity = ({
  isRandomWeight,
  unitOfMeasure,
  averageWeightPerUnit,
}) => {
  if (isRandomWeight && unitOfMeasure === RANDOM_WEIGHT_KEYS.WT) {
    return Math.ceil(averageWeightPerUnit);
  }
  return 1;
};

export const itemRWQuantityHandler = async item => {
  const {
    SELL_UNIT_OF_MEASURE,
    CUSTOMER_ORDER_UNIT_OF_MEASURE,
    AVG_WEIGHT_PER_EACH_UNIT,
  } = item?.item?.[0] || {};
  const minimumQuantity = getItemMinimumQuantity({
    averageWeightPerUnit: AVG_WEIGHT_PER_EACH_UNIT,
    unitOfMeasure: RANDOM_WEIGHT_KEYS[SELL_UNIT_OF_MEASURE],
    isRandomWeight: isRandomWeightItem(
      SELL_UNIT_OF_MEASURE,
      CUSTOMER_ORDER_UNIT_OF_MEASURE,
    ),
  });

  const {quantity} = getItemPriceQuantity(item, minimumQuantity);
  let modifiedItem =
    quantity > 1 ? await setAppropriateQuantity(item, quantity) : item;
  return {
    ...modifiedItem,
    CUSTOMER_UNIT_OF_MEASURE_SELECTION: SELL_UNIT_OF_MEASURE,
  };
};

export const departmentItemRWQuantityHandler = async (departmentProducts,cartItems) => {
  const modifiedItems = departmentProducts.items.map(subDepartmentProducts => {
    const item = subDepartmentProducts.item[0] || {};
    const {
      SELL_UNIT_OF_MEASURE,
      CUSTOMER_ORDER_UNIT_OF_MEASURE,
      AVG_WEIGHT_PER_EACH_UNIT,
    } = item;

    const minimumQuantity = getItemMinimumQuantity({
      averageWeightPerUnit: AVG_WEIGHT_PER_EACH_UNIT,
      unitOfMeasure: RANDOM_WEIGHT_KEYS[SELL_UNIT_OF_MEASURE],
      isRandomWeight: isRandomWeightItem(
        SELL_UNIT_OF_MEASURE,
        CUSTOMER_ORDER_UNIT_OF_MEASURE,
      ),
    });
    const {quantity} = getItemPriceQuantity(subDepartmentProducts, minimumQuantity);
    const itemExists = cartItems?.find(cartItem => cartItem?.item === item.SKU);

    let modifiedItem =
      quantity > 1 ? setAppropriateQuantity(subDepartmentProducts, quantity) : subDepartmentProducts;
    subDepartmentProducts = modifiedItem;
    if (itemExists && item.SKU) {
      subDepartmentProducts.CUSTOMER_UNIT_OF_MEASURE_SELECTION = itemExists.customerUnitOfMeasureSelection;
    }
    else {
      subDepartmentProducts.CUSTOMER_UNIT_OF_MEASURE_SELECTION = SELL_UNIT_OF_MEASURE;
    }
    return {
      ...subDepartmentProducts,
    };
  });
  return {
    ...departmentProducts,
    items: modifiedItems,
  };
};

// export const departmentItemRWQuantityHandler = async departmentProducts => {
//   const modifiedItems = departmentProducts.items.map(subDepartmentProducts => {
//     const item = subDepartmentProducts.item[0] || {};
//     const {
//       SELL_UNIT_OF_MEASURE,
//       CUSTOMER_ORDER_UNIT_OF_MEASURE,
//       AVG_WEIGHT_PER_EACH_UNIT,
//     } = item;
//
//     const minimumQuantity = getItemMinimumQuantity({
//       averageWeightPerUnit: AVG_WEIGHT_PER_EACH_UNIT,
//       unitOfMeasure: RANDOM_WEIGHT_KEYS[SELL_UNIT_OF_MEASURE],
//       isRandomWeight: isRandomWeightItem(
//         SELL_UNIT_OF_MEASURE,
//         CUSTOMER_ORDER_UNIT_OF_MEASURE,
//       ),
//     });
//     const {quantity} = getItemPriceQuantity(
//       subDepartmentProducts,
//       minimumQuantity,
//     );
//     let modifiedItem =
//       quantity > 1
//         ? setAppropriateQuantity(subDepartmentProducts, quantity)
//         : subDepartmentProducts;
//     subDepartmentProducts = modifiedItem;
//     subDepartmentProducts.CUSTOMER_UNIT_OF_MEASURE_SELECTION =
//       SELL_UNIT_OF_MEASURE;
//     return {
//       ...subDepartmentProducts,
//     };
//   });
//   return {
//     ...departmentProducts,
//     items: modifiedItems,
//   };
// };

/**
 * Function that returns quantity and price based on their priority
 * @param item
 * @param minimumQuantity
 * @returns {{quantity: (number|number), price: number}} combination of price and qty
 */
export const getItemPriceQuantity = (item, minimumQuantity = 1) => {
  const {
    REG_PRICE_SELL_QTY: regularPriceSellQty = null,
    APP_PRICE: appPrice = null,
    APP_PRICE_SELL_QTY: appPriceSellQty = null,
    SALE_PRICE: salePrice = null,
    SALE_PRICE_SELL_QTY: salePriceSellQty = null,
    REG_PRICE: regularPrice = null,
  } = item ?? {};
  let price;
  let quantity;

  if (salePrice) {
    price = salePrice;
    quantity = !Number.isNaN(parseInt(salePriceSellQty, 10))
      ? parseInt(salePriceSellQty, 10)
      : minimumQuantity;
  } else if (isAppPriceEligible(appPrice)) {
    price = appPrice;
    quantity = !Number.isNaN(parseInt(appPriceSellQty, 10))
      ? parseInt(appPriceSellQty, 10)
      : minimumQuantity;
  } else {
    price = regularPrice;
    quantity = !Number.isNaN(parseInt(regularPriceSellQty, 10))
      ? parseInt(regularPriceSellQty, 10)
      : minimumQuantity;
  }

  return {
    price: formatAmountValue(price),
    quantity:
      (item?.quantity || 0) > 0
        ? parseFloat(item.quantity)
        : quantity >= minimumQuantity
        ? quantity
        : minimumQuantity,
  };
};
/**
 * this function is being used where-ever we are dealing with product quantity
 * @param clickedItem
 * @param operation
 * @param minimumQuantity
 * @param maxQuantity
 * @returns {{clickedItem, userSelectedQty, oldSelectedQty, quantityLimit: (*), key}}
 */
export const getResourcesForQuantityChange = (
  clickedItem,
  operation,
  minimumQuantity = 1,
  maxQuantity = Number.MAX_SAFE_INTEGER,
  isRefund = false,
  refundDefaultQuantity = 0,
) => {
  let userSelectedQty, key;
  const {SALE_PRICE: salePrice = null, APP_PRICE: appPrice = null} =
    clickedItem ?? {};

  let quantityLimit = minimumQuantity;

  key = 'REG_PRICE_SELL_QTY';
  if (salePrice) {
    key = 'SALE_PRICE_SELL_QTY';
  } else if (isAppPriceEligible(appPrice)) {
    key = 'APP_PRICE_SELL_QTY';
  }
  if (isRefund) {
    userSelectedQty = refundDefaultQuantity;
  } else {
    userSelectedQty = parseInt(clickedItem[key], 10);
  }
  userSelectedQty =
    userSelectedQty >= minimumQuantity ? userSelectedQty : minimumQuantity;
  const oldSelectedQty = userSelectedQty;
  if (operation === 'increment' && userSelectedQty < maxQuantity) {
    userSelectedQty += minimumQuantity;
  } else if (operation === 'decrement' && userSelectedQty > quantityLimit) {
    userSelectedQty -= minimumQuantity;
  }
  return {
    quantityLimit,
    userSelectedQty,
    key,
    oldSelectedQty,
    clickedItem: {
      ...clickedItem,
      [key]: userSelectedQty,
    },
  };
};
