import React, {useCallback, useMemo, useRef, useState} from 'react';
import {APP_CONSTANTS} from '../constants/Strings';
import {useDispatch, useSelector} from 'react-redux';
import DialogBox from '../components/DialogBox';
import {useRoute} from '@react-navigation/native';
import AddToListModal from '../components/AddToListModal';
import {
  CAKE_TYPES,
  RANDOM_WEIGHT_KEYS,
  RANDOM_WEIGHT_VALUES,
} from '../constants/Common';
import {getListsOfUser, updateListItems} from '../services/ApiCaller';
import {lodashDebounce} from '../utils/transformUtils';
import {changeList} from '../redux/actions/general';
import {isCustomCake} from '../utils/cakeUtils';
import {formatAmountValue, getTrueWeight} from '../utils/calculationUtils';
import {
  getColorSchemeForProduct,
  getItemMinimumQuantity,
  getItemPriceQuantity,
  getQuantityLimit,
  getResourcesForQuantityChange,
  isAppPriceEligible,
  isRandomWeightItem as isRandomWeightItemUtils,
  setAppropriateQuantity,
} from '../utils/productUtils';
import ToastComponent from '../components/ToastComponent';
import {navigateTo} from '../utils/navigationUtils';
import {MixPanelInstance} from '../utils/mixpanelUtils';
import useIsGuest from './useIsGuest';
import {STATUSES} from '../constants/Api';
import {logToConsole} from '../configs/ReactotronConfig';

const useProductItem = ({
  onSetList,
  list,
  onSetRefresh,
  comingFrom,
  product,
  isRefund,
  entryPoint,
  departmentName,
  subDepartmentName,
} = {}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);
  const [isQuantityLoading, setIsQuantityLoading] = useState(false);

  const route = useRoute();
  const dispatch = useDispatch();
  const myToast = useRef();

  const idSelector = useMemo(
    () => state => state.general.loginInfo.userInfo._id || '',
    [],
  );
  const isLowBandwidthSelector = useMemo(
    () => state => state.general.loginInfo.userInfo.isLowBandwidth || false,
    [],
  );
  const listItemsSelector = useMemo(
    () => state => state.general.listItems || [],
    [],
  );

  const _id = useSelector(idSelector);

  const isLowBandwidth = useSelector(isLowBandwidthSelector);

  const listItems = useSelector(listItemsSelector);

  const isGuest = useIsGuest();

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
  const limit = getQuantityLimit(product);

  const closeModal = () => {
    setVisibleModal(false);
  };

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
    // logToConsole({innerItem:innerItem?.[0]})
    // logToConsole({isRandomWeightItem,averageWeightPerUnit,customerOrderUnitOfMeasure});
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
    // logToConsole({customerUnitOfMeasureSelection});
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

  const adjustedTrueWeight = useMemo(
    () => formatAmountValue(getTrueWeight(trueWeight, tare)),
    [trueWeight, tare],
  );

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

  const trueWeightPrice = useMemo(() => {
    return formatAmountValue(mainPrice * adjustedTrueWeight);
  }, [adjustedTrueWeight, mainPrice]);

  const totalPrice = useMemo(() => {
    if (isApplyingAvgPricePerEach) {
      return formatAmountValue(averagePricePerUnit * quantity);
    }
    if (isTrueWeightAdded) {
      return trueWeightPrice;
    }
    return formatAmountValue(price * quantity);
  }, [
    averagePricePerUnit,
    isApplyingAvgPricePerEach,
    isTrueWeightAdded,
    price,
    quantity,
    trueWeightPrice,
  ]);

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

  const resolvedQuantity = useMemo(() => {
    if (isTrueWeightAdded) {
      return adjustedTrueWeight;
    }
    return quantity;
  }, [adjustedTrueWeight, isTrueWeightAdded, quantity]);

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

  /**
   * If INVENTORY_IGNORE_FLAG = "Y", disable functionality of STOCK_ON_HAND.
   * If INVENTORY_IGNORE_FLAG = "N", enable functionality of STOCK_ON_HAND
   * @returns {boolean}
   */
  const isTemporaryUnavailable = useMemo(
    () =>
      storeOverrideTemporaryOutOfStock ||
      (inventoryIgnoreFlag === 'N' && parseInt(stockOnHand, 10) < 1),
    [inventoryIgnoreFlag, stockOnHand, storeOverrideTemporaryOutOfStock],
  );

  const isMinusDisabled = useMemo(
    () =>
      quantity === minimumQuantity &&
      isRandomWeightItem &&
      unitOfMeasure === RANDOM_WEIGHT_KEYS.WT,
    [isRandomWeightItem, minimumQuantity, quantity, unitOfMeasure],
  );

  const isProductACustomCake = useMemo(() => isCustomCake(product), [product]);

  const isProductACustomCupCake = useMemo(
    () => formRequired === CAKE_TYPES.CUPCAKE,
    [formRequired],
  );

  const handleUpdateQuantity = async (updatedList, listId) => {
    setIsQuantityLoading(true);
    const {response = {}} = await updateListItems(updatedList, listId);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      await getLists();
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiError();
    }
  };

  const getLists = async () => {
    const {response = {}} = await getListsOfUser(_id);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    setIsQuantityLoading(false);
    if (ok && status === STATUSES.OK) {
      const {
        data: {response: lists = []},
      } = response ?? {};
      dispatch(changeList(lists));
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiError();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onQuantityChangeCall = useCallback(
    lodashDebounce(handleUpdateQuantity, 1000),
    [],
  );

  const handleApiError = () => {
    return setIsVisibleApiErrorDialog(true);
  };

  const goToDetailScreen = useCallback(
    (item, index) =>
      navigateTo('ProductDetails', {
        item,
        comingFrom: comingFrom ?? 'SALE DETAILS',
        index,
        deptInfo: route?.params ?? {},
        entryPoint,
      }),
    [comingFrom, entryPoint, route?.params],
  );

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

  const handleQuantityChange = useCallback(
    (index, operation, minimumQ) => {
      let clickedItem = list[index];
      let {
        userSelectedQty,
        key,
        clickedItem: updatedItem,
      } = getResourcesForQuantityChange(
        clickedItem,
        operation,
        minimumQ || minimumQuantity,
      );

      list[index] = {
        ...updatedItem,
        Quantity: userSelectedQty,
      };
      onSetList?.([...list]);
      onSetRefresh?.(prevState => !prevState);
      return {
        key,
        index,
        operation,
        item: list[index],
      };
    },
    [list, minimumQuantity, onSetList, onSetRefresh],
  );

  const onSelectItem = useCallback((item, index, cakeSelections = {}) => {
    if (isCustomCake(item) && cakeSelections) {
      item = {...item, cakeSelections};
    }
    setSelectedItem(item);
    setVisibleModal(true);
  }, []);

  const renderApiErrorDialog = useMemo(() => {
    return (
      <DialogBox
        visible={isVisibleApiErrorDialog}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL}
        closeModal={() => setIsVisibleApiErrorDialog(false)}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onCancelPress={() => setIsVisibleApiErrorDialog(false)}
        onConfirmPress={() => setIsVisibleApiErrorDialog(false)}
      />
    );
  }, [isVisibleApiErrorDialog]);

  const renderToast = useMemo(() => {
    return <ToastComponent toastRef={myToast} />;
  }, []);

  const renderAddToListModal = useMemo(() => {
    if (!isGuest) {
      return (
        <AddToListModal
          visible={visibleModal}
          onRequestClose={closeModal}
          entryPoint={entryPoint}
          selectedItem={selectedItem}
          showApiErrorDialog={() => setIsVisibleApiErrorDialog(true)}
        />
      );
    }
    return null;
  }, [selectedItem, isGuest, visibleModal]);

  const renderDialogs = useMemo(() => {
    return (
      <>
        {renderAddToListModal}
        {renderApiErrorDialog}
        {renderToast}
      </>
    );
  }, [renderAddToListModal, renderApiErrorDialog, renderToast]);

  return {
    renderAddToListModal,
    renderToast,
    renderApiErrorDialog,
    renderDialogs,
    goToDetailScreen,
    onSelectItem,
    onDisplayMessage,
    handleQuantityChange,
    handleUnitChange,
    onQuantityChangeCall,
    isQuantityLoading,
    onSetRefresh,
    isLowBandwidth,
    listItems,
    productId,
    sku,
    queryId,
    position,
    averagePricePerUnit,
    stockOnHand,
    skuDescription,
    productName,
    features,
    unitOfMeasure,
    averageWeightPerUnit,
    snapFlag: snapFlag || innerItem?.[0]?.['SNAP FLAG'],
    primaryUpc,
    primaryUpcIndicator,
    departmentId,
    subDepartmentId,
    formRequired,
    cakeType: formRequired,
    price,
    isGuest,
    mainPrice,
    tare: tare || 0,
    quantity,
    mainColor,
    lightColor,
    getBannerType,
    isOnSale,
    isTemporaryUnavailable,
    isProductACustomCake,
    isProductACustomCupCake,
    limit,
    isRandomWeightItem,
    isMinusDisabled,
    isDropDownSelector,
    dropDownData,
    customerOrderUnitOfMeasure,
    avgWeightPerEachUnit: averageWeightPerUnit,
    mainPriceLabel,
    secondaryPriceLabel,
    sellUnitOfMeasure,
    isApplyingAvgPricePerEach,
    totalPrice,
    resolvedQuantity,
    trueWeight,
    trueWeightPrice,
    adjustedTrueWeight,
    minimumQuantity,
    onTrackProduct,
    isLbPriceselected,
  };
};

export default useProductItem;
