import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RANDOM_WEIGHT_KEYS, RANDOM_WEIGHT_VALUES} from '../constants/Common';
import {isCustomCake} from '../utils/cakeUtils';
import {formatAmountValue} from '../utils/calculationUtils';
import {
  getColorSchemeForProduct,
  getItemMinimumQuantity,
  getItemPriceQuantity,
  isAppPriceEligible,
  isRandomWeightItem as isRandomWeightItemUtils,
  setAppropriateQuantity,
} from '../utils/productUtils';
import {MixPanelInstance} from '../utils/mixpanelUtils';
import useIsGuest from './useIsGuest';

const useDepartmentProductItem = ({
  product,
  isRefund,
  entryPoint,
  departmentName,
  subDepartmentName,
} = {}) => {
  const myToast = useRef();

  const useIsLowBandwidthSelector = () =>
    useMemo(
      () => state => state.general.loginInfo?.userInfo?.isLowBandwidth ?? false,
      [],
    );

  const isLowBandwidth = useSelector(useIsLowBandwidthSelector());

  const {
    _id: productId = '',
    SKU: sku = '',
    QUERY_ID: queryId,
    POSITION: position,
    REG_PRICE: regularPrice = null,
    APP_PRICE: appPrice = null,
    SALE_PRICE: salePrice = null,
    STOCK_ON_HAND: stockOnHand = null,
    item: innerItem = [],
    CUSTOMER_UNIT_OF_MEASURE_SELECTION: customerUnitOfMeasureSelection = '',
    STORE_OVERRIDE_TEMPORARY_OUT_OF_STOCK:
      storeOverrideTemporaryOutOfStock = false,
    TRUE_WEIGHT: trueWeight = 0,
  } = product ?? {};

  let {
    SKU_DESCRIPTION: skuDescription = '',
    E_COMM_DESCRIPTION_AND_SIZE: productName = '',
    FEATURES: features = '',
    AVG_WEIGHT_PER_EACH_UNIT: averageWeightPerUnit = 0,
    SNAP_FLAG: snapFlag = '',
    PRIMARY_UPC_INDICATOR: primaryUpcIndicator = '',
    FORM_REQUIRED: formRequired = '',
    PRIMARY_UPC: primaryUpc = '',
    DEPT_ID: departmentId = '',
    CLASS_ID: subDepartmentId = '',
    INVENTORY_IGNORE_FLAG: inventoryIgnoreFlag = '',
    SELL_UNIT_OF_MEASURE: sellUnitOfMeasure = '',
    CUSTOMER_ORDER_UNIT_OF_MEASURE: customerOrderUnitOfMeasure = '',
    TARE: tare = 0,
  } = innerItem?.[0] ?? {};

  averageWeightPerUnit = parseFloat(averageWeightPerUnit || 0);

  const {mainColor, lightColor} = getColorSchemeForProduct(product, false);

  //Get sale banner type for product if on sale i.e. app only or on sale
  const getBannerType = isIconOnly => {
    if (isAppPriceEligible(appPrice)) {
      return isIconOnly ? 'ONLINE_ONLY_BANNER' : 'APP_ITEM';
    }
    // if (salePrice) {
    //   return isIconOnly ? 'SALE_ITEM' : 'ON_SALE_BANNER';
    // }

    return '';
  };

  const costType = useMemo(() => {
    if (salePrice) {
      return 'On Sale';
    }
    if (isAppPriceEligible(appPrice)) {
      return 'App Only';
    }
    return 'Regular';
  }, [appPrice, salePrice]);

  const isTrueWeightAdded = trueWeight > 0;

  const onSale = useMemo(() => {
    if (salePrice || isAppPriceEligible(appPrice)) {
      return {onSale: true, regularPrice};
    }
    return {onSale: false};
  }, [appPrice, regularPrice, salePrice]);

  const isOnSale = () => onSale;

  const isRandomWeightItem = useMemo(
    () =>
      isRandomWeightItemUtils(
        sellUnitOfMeasure,
        customerOrderUnitOfMeasure,
        isRefund,
      ),
    [customerOrderUnitOfMeasure, isRefund, sellUnitOfMeasure],
  );

  const isDropDownSelector = useMemo(() => {
    return (
      isRandomWeightItem &&
      averageWeightPerUnit > 0 &&
      customerOrderUnitOfMeasure !== RANDOM_WEIGHT_VALUES.lb
    );
  }, [averageWeightPerUnit, customerOrderUnitOfMeasure, isRandomWeightItem]);

  const dropDownData = useMemo(() => {
    return isDropDownSelector
      ? [
          {
            label: RANDOM_WEIGHT_KEYS[customerOrderUnitOfMeasure],
            value: customerOrderUnitOfMeasure,
          },
          {label: RANDOM_WEIGHT_KEYS.WT, value: RANDOM_WEIGHT_VALUES.lb},
        ]
      : [{label: RANDOM_WEIGHT_KEYS.EA, value: RANDOM_WEIGHT_VALUES.ea}];
  }, [customerOrderUnitOfMeasure, isDropDownSelector]);

  const unitOfMeasure = useMemo(() => {
    return (
      RANDOM_WEIGHT_KEYS[customerUnitOfMeasureSelection] ||
      RANDOM_WEIGHT_KEYS.EA
    );
  }, [customerUnitOfMeasureSelection]);

  const minimumQuantity = useMemo(
    () =>
      getItemMinimumQuantity({
        averageWeightPerUnit,
        unitOfMeasure: RANDOM_WEIGHT_KEYS[customerUnitOfMeasureSelection],
        isRandomWeight: isRandomWeightItem,
      }),
    [averageWeightPerUnit, customerUnitOfMeasureSelection, isRandomWeightItem],
  );

  const {price, quantity} = useMemo(
    () => getItemPriceQuantity(product, minimumQuantity),
    [minimumQuantity, product],
  );

  const isApplyingAvgPricePerEach =
    unitOfMeasure !== RANDOM_WEIGHT_KEYS.WT &&
    isRandomWeightItem &&
    !isTrueWeightAdded &&
    !isRefund;

  const averagePricePerUnit = useMemo(() => {
    if (isRandomWeightItem) {
      return averageWeightPerUnit * price;
    }
  }, [averageWeightPerUnit, isRandomWeightItem, price]);

  const mainPrice = useMemo(() => {
    if (isApplyingAvgPricePerEach) {
      return formatAmountValue(averagePricePerUnit);
    }
    return price;
  }, [averagePricePerUnit, isApplyingAvgPricePerEach, price]);

  const onTrackProduct = useCallback(
    (event, from, extraProps = {}) => {
      MixPanelInstance.trackProduct(event, {
        entryPoint: from || entryPoint,
        sku,
        isRandomWeightItem,
        productName,
        uom: unitOfMeasure,
        upc: primaryUpc,
        cost: mainPrice,
        costType,
        quantity,
        departmentName: departmentName || departmentId,
        subDepartmentName: subDepartmentName || subDepartmentId,
        ...extraProps,
      });
    },
    [
      costType,
      departmentId,
      departmentName,
      entryPoint,
      isRandomWeightItem,
      mainPrice,
      primaryUpc,
      productName,
      quantity,
      sku,
      subDepartmentId,
      subDepartmentName,
      unitOfMeasure,
    ],
  );

  const isLbPriceselected =
    unitOfMeasure === RANDOM_WEIGHT_KEYS.WT &&
    isRandomWeightItem &&
    !isTrueWeightAdded &&
    !isRefund;

  const mainPriceLabel = useMemo(() => {
    return `$${mainPrice} ${isLbPriceselected ? '/ ' : ''}${unitOfMeasure}`;
    // return `$${mainPrice} ea`;
  }, [isApplyingAvgPricePerEach, mainPrice, unitOfMeasure]);

  const secondaryPriceLabel = useMemo(() => {
    if (isRandomWeightItem) {
      if (unitOfMeasure !== RANDOM_WEIGHT_KEYS.WT) {
        return `($${price} lb)`;
      }
      if (isDropDownSelector) {
        return `(approx $${formatAmountValue(averagePricePerUnit)} ${
          RANDOM_WEIGHT_KEYS[customerOrderUnitOfMeasure]
        })`;
      }
    }
    return '';
  }, [
    averagePricePerUnit,
    customerOrderUnitOfMeasure,
    isDropDownSelector,
    isRandomWeightItem,
    price,
    unitOfMeasure,
  ]);

  const isProductACustomCake = useMemo(() => isCustomCake(product), [product]);

  const onDisplayMessage = useCallback(message => {
    myToast.current?.show(message, 1500);
  }, []);

  const handleUnitChange = useCallback(
    async ({unit} = {}) => {
      const minimum = getItemMinimumQuantity({
        averageWeightPerUnit,
        unitOfMeasure: RANDOM_WEIGHT_KEYS[unit],
        isRandomWeight: isRandomWeightItem,
      });
      let updatedItem = {
        ...product,
        CUSTOMER_UNIT_OF_MEASURE_SELECTION: unit,
        Quantity: minimum,
      };
      updatedItem = await setAppropriateQuantity(updatedItem, minimum);
      return updatedItem;
    },
    [averageWeightPerUnit, isRandomWeightItem, product],
  );

  return {
    sku,
    snapFlag,
    isLowBandwidth,
    productName,
    getBannerType,
    secondaryPriceLabel,
    mainPriceLabel,
    lightColor,
    isOnSale,
    onDisplayMessage,
    onTrackProduct,
    dropDownData,
    unitOfMeasure,
    isDropDownSelector,
    handleUnitChange,
    isProductACustomCake,
    isApplyingAvgPricePerEach,
    isLbPriceselected,
  };
};

export default useDepartmentProductItem;
