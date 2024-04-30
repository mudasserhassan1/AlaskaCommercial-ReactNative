import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS, IMAGES} from '../../theme';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import ProductUnavailableView from '../../components/ProductUnavailableView';
import ProductQuantityStepper from '../../components/ProductQuantityStepper';
import ProductUnitPicker from '../../components/ProductUnitPicker';
import AddToCartButton from '../../components/AddToCartButton';
import {
  getItemsYouMayLike,
  getProduct,
  triggerItemClickedEvent,
  updateListItems,
} from '../../services/ApiCaller';
import {getDetailImageUrl} from '../../utils/imageUrlUtils';
import ProductImageComponent from '../../components/ProductImageComponent';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {goToOnSale} from '../../utils/navigationUtils';
import {
  getQuantityLimit,
  itemRWQuantityHandler,
  splitFeaturesIntoArray,
} from '../../utils/productUtils';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {
  IMAGES_RESIZE_MODES,
  RANDOM_WEIGHT_VALUES,
} from '../../constants/Common';
import {MIX_PANEL_EVENTS, MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {STATUSES} from '../../constants/Api';
import useProductItem from '../../hooks/useProductItem';
import DialogBox from '../../components/DialogBox';
import SnapEligibilityText from '../../components/SnapEligibilityText';
import NoDataComponent from '../../components/NoDataComponent';
import {formatAmountValue} from '../../utils/calculationUtils';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {logToConsole} from '../../configs/ReactotronConfig';

const ProductDetails = ({navigation, route}) => {
  const [featuresState, setFeaturesState] = useState([]);

  // const {StoreNumber, isLowBandwidth} = useSelector(
  //   ({
  //     general: {
  //       listItems = [],
  //       loginInfo: {
  //         userInfo: {StoreNumber = '', isLowBandwidth = false} = {},
  //       } = {},
  //     } = {},
  //   } = {}) => ({
  //     StoreNumber,
  //     isLowBandwidth,
  //     listItems,
  //   }),
  // );

  const useStoreNumberSelector = () =>
    useMemo(
      () => state => state.general?.loginInfo?.userInfo?.StoreNumber ?? '',
      [],
    );

  const useIsLowBandwidthSelector = () =>
    useMemo(
      () => state => state.general.loginInfo?.userInfo?.isLowBandwidth ?? false,
      [],
    );

  const useListItemsSelector = () =>
    useMemo(() => state => state.general?.listItems ?? [], []);

  const StoreNumber = useSelector(useStoreNumberSelector());
  const isLowBandwidth = useSelector(useIsLowBandwidthSelector());
  const listItems = useSelector(useListItemsSelector());

  let {
    item = {},
    index = 0,
    comingFrom = '',
    listId,
    list = [],
    searchQuery,
    entryPoint,
    departmentName,
    subDepartmentName,
  } = route?.params ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingItem, setIsFetchingItem] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [product, setProduct] = useState(item);
  const [youMightLikeProducts, setYouMightLikeProducts] = useState([]);
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);
  const [isRetryModalHidden, setIsRetryModalHidden] = useState(true);
  const flatListRef = useRef();

  item = product?._id ? product : item;

  const {
    productId,
    sku,
    queryId,
    position,
    isGuest,
    productName,
    features,
    unitOfMeasure,
    snapFlag,
    primaryUpcIndicator,
    primaryUpc,
    departmentId,
    subDepartmentId,
    quantity: productQty,
    mainColor,
    lightColor,
    renderDialogs,
    getBannerType,
    isOnSale,
    isTemporaryUnavailable,
    avgWeightPerEachUnit,
    handleQuantityChange,
    onQuantityChangeCall,
    onSelectItem,
    onDisplayMessage,
    isQuantityLoading,
    mainPriceLabel,
    secondaryPriceLabel,
    dropDownData,
    isDropDownSelector,
    handleUnitChange,
    isMinusDisabled,
    onTrackProduct,
    cakeType,
    isApplyingAvgPricePerEach,
  } = useProductItem({
    list: [product],
    onSetList: list => setProduct(list?.[0] || {}),
    comingFrom,
    product: item,
    entryPoint: MIX_PANEL_SCREENS.PRODUCT_DETAILS,
    departmentName,
    subDepartmentName,
  });

  const {onSale = false, regularPrice = 0.0} = isOnSale();
  const bannerType = getBannerType();
  const limit = getQuantityLimit(item);

  const cartItemsSelector = useMemo(
    () => state => state.general.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

  const previouslyTrackedId = useRef('');

  useEffect(() => {
    if (cakeType) {
      navigation.replace('CakesDetailsScreen', {item});
    }
  }, [cakeType, item, navigation]);

  useEffect(() => {
    if (productId && productId !== previouslyTrackedId.current) {
      onTrackProduct(MIX_PANEL_EVENTS.VIEW_ITEM_DETAIL_PAGE, entryPoint);
      previouslyTrackedId.current = productId;
    }
  }, [entryPoint, onTrackProduct, productId]);

  useEffect(() => {
    const featuresArray = splitFeaturesIntoArray(features);
    setFeaturesState(featuresArray);
    onValueChange(RANDOM_WEIGHT_VALUES[unitOfMeasure]);
  }, []);

  const onValueChange = useCallback(
    async unit => {
      if (RANDOM_WEIGHT_VALUES[unitOfMeasure] === unit) {
        return;
      }
      const updatedItem = await handleUnitChange({unit});
      setProduct(updatedItem);
      if (comingFrom === APP_CONSTANTS.LIST) {
        list.Products[index] = updatedItem;
        await updateListItems(list?.Products, listId).then(async () => {});
      }
    },
    [comingFrom, handleUnitChange, index, list.Products, listId],
  );

  const onFetchData = async ({st, dp, cls, _id, fetchedSKU} = {}) => {
    setIsLoading(true);
    try {
      await getYouMayAlsoLikeItems({
        store: StoreNumber || st,
        deptId: departmentId || dp,
        classId: subDepartmentId || cls,
        id: productId || _id,
        sku: sku || fetchedSKU,
      });
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const onFetchItem = async () => {
    try {
      setIsVisibleApiErrorDialog(false);
      setIsFetchingItem(true);
      setIsDataLoaded(false);
      const {response = {}} = await getProduct({
        sku: searchQuery?.SKU,
        storeNumber: StoreNumber,
      });
      const {
        data: {response: usersSearchResults = {}} = {},
        isUnderMaintenance,
      } = response ?? {};
      if (response?.ok) {
        const {
          _id,
          STORE: st,
          item: itm,
          SKU: fetchedSKU,
        } = usersSearchResults || {};
        const {
          CLASS_ID: cls = '',
          DEPT_ID: dp = '',
          FORM_REQUIRED = '',
          FEATURES,
        } = itm?.[0] || {};
        let modifiedItem = await itemRWQuantityHandler(usersSearchResults);
        setProduct(modifiedItem);
        setFeaturesState(splitFeaturesIntoArray(FEATURES));
        if (!FORM_REQUIRED) {
          onFetchData({st, cls, dp, _id, fetchedSKU});
        }
      } else {
        throw response;
      }
    } catch (e) {
      setIsFetchingItem(false);
      // setIsVisibleApiErrorDialog(true);
      setProduct(null);
    } finally {
      setIsFetchingItem(false);
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    if (!cakeType) {
      searchQuery?.SKU ? onFetchItem() : onFetchData();
    }
  }, [searchQuery?.SKU]);

  useEffect(() => {
    if (!searchQuery?.SKU && queryId && !cakeType) {
      triggerItemClickedEvent({queryId, position, SKU: sku});
    }
  }, [searchQuery?.SKU, queryId, position, sku]);

  const unitInCart = useCallback(
    item => {
      const itemExists = cartItems?.find(obj => obj?.item === item?.SKU);
      if (itemExists && item) {
        item.CUSTOMER_UNIT_OF_MEASURE_SELECTION =
          itemExists.customerUnitOfMeasureSelection;
      }
      return item;
    },
    [cartItems],
  );

  function isItemInCart() {
    for (const cartItem of cartItems) {
      if (cartItem.itemObj._id === item?._id) {
        return true;
      }
    }
    return false;
  }

  const isItemInCart_ = useMemo(() => isItemInCart(), [cartItems]);

  const getYouMayAlsoLikeItems = async params => {
    setIsLoading(true);
    const {response = {}} = await getItemsYouMayLike(params);
    setIsLoading(false);
    const {ok = false, status = 0} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: youMayLikeItems = []} = {}} = response ?? {};
      let modifiedSaleItems = [];
      for (const itm of youMayLikeItems) {
        let modifiedItem = await itemRWQuantityHandler(itm);
        modifiedItem = unitInCart(modifiedItem);
        modifiedSaleItems.push(modifiedItem);
      }
      setYouMightLikeProducts(modifiedSaleItems);
    }
  };

  const toggleVisibleModal = useCallback(() => {
    onSelectItem(product, 0);
  }, [onSelectItem, product]);

  const onUpdateQuantity = operation => {
    const {item: updatedItem} = handleQuantityChange(0, operation);
    setProduct(updatedItem);
    if (comingFrom === APP_CONSTANTS.LIST) {
      list.Products[index] = updatedItem;
      onQuantityChangeCall(list?.Products || [], listId);
    }
  };

  const handleSeeAll = useCallback(() => {
    if (onSale) {
      return goToOnSale();
    }
    return navigation.navigate('ShopStack', {
      screen: 'Products',
      initial: false,
      params: {
        departmentId: [departmentId],
        subDepartmentId: [subDepartmentId],
      },
    });
  }, [departmentId, navigation, onSale, subDepartmentId]);

  const handleItemPress = useCallback(
    item => {
      navigation.push('ProductDetails', {
        entryPoint: MIX_PANEL_SCREENS.PRODUCT_DETAILS,
        item,
        index,
      });
    },
    [index, navigation],
  );

  const renderSnapFlag = useMemo(() => {
    return (
      <SnapEligibilityText
        textStyle={[styles.snapFlag, bannerType && {marginLeft: 10}]}
        snapFlag={snapFlag}
      />
    );
  }, [bannerType, snapFlag]);

  const renderSaleBanner = useMemo(() => {
    if (bannerType) {
      return (
        <ImageComponent
          source={IMAGES[bannerType]}
          style={styles.bannerImage}
          resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
        />
      );
    }
    return null;
  }, [bannerType]);

  const renderListIcon = useMemo(() => {
    if (!isTemporaryUnavailable && !isGuest) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleVisibleModal}>
          <ImageComponent
            source={IMAGES.MENU_LIST_ICON}
            style={styles.listIcon}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }, [isGuest, isTemporaryUnavailable, toggleVisibleModal]);

  const renderApproxKeyWord = useMemo(() => {
    const {SELL_UNIT_OF_MEASURE: sellUnitOfMeasure} = item?.item?.[0] || {};
    return (
      <View style={styles.approxStyleWrapper}>
        {isApplyingAvgPricePerEach ? (
          <View
            style={{
              height: hp('2.2%'),
              marginBottom: global.isiPhone7or8 ? hp('0.7%') : 0,
            }}>
            <Text allowFontScaling={false} style={styles.approxtext}>approx</Text>
          </View>
        ) : (
          <View
            style={{
              height: hp('2.2%'),
              marginBottom: global.isiPhone7or8 ? hp('0.7%') : 0,
            }}
          />
        )}
      </View>
    );
  }, [mainPriceLabel]);
  const renderProductInfoView = () => (
    <View style={styles.productInfoParent}>
      <View style={styles.bannerContainer}>
        {renderSaleBanner}
        {renderSnapFlag}
        {renderListIcon}
      </View>
      <View style={styles.priceAndNameView}>
        {renderApproxKeyWord}
        {renderPriceContainer}
        <Text
            allowFontScaling={false}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.productNameText}>
          {productName}
        </Text>
        {renderUpcView}
        {renderAvailabilityView()}
        {/*{renderListIcon}*/}
      </View>
    </View>
  );

  // const renderMainPrice = useMemo(() => {
  //   return (
  //     <Text style={[styles.itemPriceText, {color: mainColor}]}>
  //       {mainPriceLabel}
  //     </Text>
  //   );
  // }, [mainPriceLabel, mainColor]);

  const renderMainPrice = useMemo(() => {
    const {SALE_PRICE: salePrice} = item || {};
    return (
      <View
        style={
          salePrice !== null
            ? styles.saleitemPriceContainer
            : styles.itemPriceContainer
        }>
        <Text allowFontScaling={false} style={[styles.itemPriceText, {color: mainColor}]}>
          {mainPriceLabel}
        </Text>
      </View>
    );
  }, [mainPriceLabel, mainColor]);

  const renderDiscountedPrice = useMemo(() => {
    if (onSale) {
      return (
        <Text allowFontScaling={false} style={[styles.discountedPriceText, {color: lightColor}]}>
          Reg. ${formatAmountValue(regularPrice)} {unitOfMeasure}
        </Text>
      );
    }
    return null;
  }, [lightColor, onSale, regularPrice]);

  const renderSecondaryPrice = useMemo(() => {
    return (
      <Text allowFontScaling={false} style={styles.secondaryPriceLabel}>{secondaryPriceLabel}</Text>
    );
  }, [secondaryPriceLabel]);

  const renderPriceContainer = useMemo(() => {
    return (
      <View style={styles.priceContainer}>
        {renderMainPrice}
        {renderDiscountedPrice}
        {/*{renderSecondaryPrice}*/}
      </View>
    );
  }, [renderDiscountedPrice, renderMainPrice, renderSecondaryPrice]);

  const renderAvailabilityView = () => {
    if (!isTemporaryUnavailable) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent:
              dropDownData?.length > 1 ? 'space-between' : 'flex-start',
            width: '98%',
            height: 45,
            marginTop: hp('2%'),
          }}>
          <ProductQuantityStepper
            onMinusPress={() => onUpdateQuantity('decrement')}
            onPlusPress={() => onUpdateQuantity('increment')}
            isMinusDisabled={isMinusDisabled}
            value={productQty}
            qtyLimit={limit}
            containerStyle={{
              width: '40%',
              marginRight: dropDownData?.length > 1 ? 22 : 0,
            }}
            isLoading={isQuantityLoading}
          />
          {/*<View style={{width: '25%'}}>*/}
          {dropDownData?.length > 1 && (
            <ProductUnitPicker
              data={dropDownData}
              value={RANDOM_WEIGHT_VALUES[unitOfMeasure]}
              onChange={onValueChange}
              disabled={!isDropDownSelector || isItemInCart_}
              productDetailScreen={true}
            />
          )}
          {/*</View>*/}

          <AddToCartButton
            item={product}
            navigation={navigation}
            isDisabled={productQty > limit}
            showDisabledColor
            onAddToCartSuccess={() =>
              onTrackProduct(
                MIX_PANEL_EVENTS.ADD_ITEM_TO_CART,
                MIX_PANEL_SCREENS.PRODUCT_DETAILS,
              )
            }
            showConfirmation={onDisplayMessage}
            containerStyle={{width: '33%', marginLeft: 22}}
          />
        </View>
      );
    }
    return <ProductUnavailableView />;
  };

  const renderSnapFlagText = useMemo(() => {
    if (snapFlag === 'Y') {
      return (
        <Text allowFontScaling={false} style={styles.eligibleText}>
          {APP_CONSTANTS.ELIGIBLE_FOR_SNAP}
        </Text>
      );
    }
    return null;
  }, [snapFlag]);

  const renderFeaturesContainer = () => (
    <View style={styles.featuresParent}>
      <Text allowFontScaling={false} style={styles.featureTextHeader}>
        {APP_CONSTANTS.PRODUCT_FEATURES}
      </Text>
      {renderSnapFlagText}
      {featuresState?.map(itm =>
        itm ? <Text allowFontScaling={false} style={styles.featuresText}>{itm}</Text> : null,
      )}
      {avgWeightPerEachUnit ? (
        <Text allowFontScaling={false} style={styles.averageWeightText}>
          Average Weight Per Unit {avgWeightPerEachUnit.toFixed(2)} lbs
        </Text>
      ) : null}
    </View>
  );

  const renderYouMayLikeHeader = useMemo(
    () => (
      <View style={styles.youMightAlsoLikeHeaderView}>
        <Text allowFontScaling={false} style={styles.youMayLikeHeaderText}>
          {APP_CONSTANTS.YOU_MIGHT_ALSO_LIKE}
        </Text>
        {/*<TouchableOpacity onPress={handleSeeAll}>*/}
        {/*  <Text style={styles.seeAllText}>{APP_CONSTANTS.SEE_ALL}</Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    ),
    [handleSeeAll],
  );

  const renderSaleItems = () => {
    if (isLoading) {
      return (
        <View style={styles.youMayLikeParent}>
          {renderYouMayLikeHeader}
          <ActivityIndicator
            size={'small'}
            color={COLORS.MAIN}
            style={{marginTop: hp('2%')}}
          />
        </View>
      );
    }
    if (!isLoading && youMightLikeProducts.length !== 0) {
      return (
        <View style={styles.youMayLikeParent}>
          {renderYouMayLikeHeader}
          <FlatList
            data={youMightLikeProducts}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            horizontal
            bounces={false}
            contentContainerStyle={styles.flatList}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            disableScrollViewPanResponder
            ref={flatListRef}
          />
        </View>
      );
    }
    if (!isLoading && youMightLikeProducts.length === 0) {
      return null;
    }
  };
  const changeSelectionOfUnit = (item = {}, itemIndex = 0) => {
    youMightLikeProducts[itemIndex] = item;
    setYouMightLikeProducts([...youMightLikeProducts]);
  };
  const renderItem = ({item, index}) => (
    <SaleItem
      onUnitSelectionChange={({item: itemproduct}) =>
        changeSelectionOfUnit(itemproduct, index)
      }
      entryPoint={MIX_PANEL_SCREENS.PRODUCT_DETAILS}
      item={item}
      onItemPress={handleItemPress}
    />
  );
  const keyExtractor = (item, index) => String(item?._id || index);

  const renderUpcView = useMemo(() => {
    if (primaryUpcIndicator === 'Y') {
      return (
        <View style={styles.upcView}>
          <Text allowFontScaling={false} style={styles.upcText}>UPC: {primaryUpc}</Text>
        </View>
      );
    }
    return null;
  }, [primaryUpc, primaryUpcIndicator]);

  const renderProductImage = () => {
    return (
      <ProductImageComponent
        isDetails
        imageUrl={getDetailImageUrl(sku, isLowBandwidth)}
        containerStyle={styles.productDetailImageWrapper}
        imageStyle={styles.productDetailImage}
      />
    );
  };
  const renderUI = () => {
    if (isDataLoaded && !product) {
      return (
        <NoDataComponent
          messageStyle={{paddingHorizontal: 20, marginTop: 10}}
          header={APP_CONSTANTS.NO_PRODUCT_FOUND}
          message={APP_CONSTANTS.NO_PRODUCT_FOUND_MESSAGE}
        />
      );
    } else if (!isDataLoaded && !(product && product._id)) {
      return null;
    } else {
      return (
        <>
          <>
            {renderProductImage()}
            {renderProductInfoView()}
          </>
          {renderFeaturesContainer()}
          {renderSaleItems()}
        </>
      );
    }
  };

  return (
    <>
      <ScreenWrapperComponent
        isLoading={isFetchingItem && isRetryModalHidden}
        headerTitle={APP_CONSTANTS.DETAILS}
        withBackButton
        showCartButton
        containerStyle={{flexGrow: 1, paddingBottom: 0,backgroundColor:COLORS.WHITE}}>
        {renderUI()}

        <DialogBox
          visible={isVisibleApiErrorDialog}
          title={APP_CONSTANTS.ALASKA_COMMERCIAL}
          closeModal={() => setIsVisibleApiErrorDialog(false)}
          message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
          cancelButtonLabel={APP_CONSTANTS.CANCEL}
          confirmButtonLabel={APP_CONSTANTS.RETRY}
          onCancelPress={() => setIsVisibleApiErrorDialog(false)}
          onConfirmPress={onFetchItem}
          onModalHide={() => setIsRetryModalHidden(true)}
          onModalWillShow={() => setIsRetryModalHidden(false)}
        />
      </ScreenWrapperComponent>
      {renderDialogs}
    </>
  );
};

export default ProductDetails;
