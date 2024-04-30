import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useProductItem from '../../hooks/useProductItem';
import ImageComponent from '../ImageComponent';
import {COLORS, IMAGES} from '../../theme';
import styles from './styles';
import {
  IMAGES_RESIZE_MODES,
  RANDOM_WEIGHT_VALUES,
} from '../../constants/Common';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import ProductImageComponent from '../ProductImageComponent';
import {getImageUrl} from '../../utils/imageUrlUtils';
import SnapEligibilityText from '../SnapEligibilityText';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {MIX_PANEL_EVENTS, MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateCartItemsCount} from '../../redux/actions/general';
import {debounce} from 'lodash';
import {addItemToCart, getItemsFromCart} from '../../utils/cartUtils';
import {removeItemFromCartAPI, updateCart} from '../../services/ApiCaller';
import {STATUSES} from '../../constants/Api';
import {APP_CONSTANTS} from '../../constants/Strings';
import DialogBox from '../DialogBox';
import {formatAmountValue} from '../../utils/calculationUtils';
import ProductUnitPicker from '../ProductUnitPicker';
import {getItemPriceQuantity} from '../../utils/productUtils';
import {isCustomCake} from '../../utils/cakeUtils';
import {snakeToCamelCase} from '../../utils/transformUtils';
import useCakeTimeModal from '../../hooks/useCakeTimeModal';
import DialogForGuestUser from '../AuthenticationModalForGuestUser';
import useIsGuest from '../../hooks/useIsGuest';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SaleItem = ({
  item,
  forItemId,
  onItemPress,
  containerStyle,
  contentWrapperStyle,
  onUnitSelectionChange,
  saleItemFromHome = false,
}) => {
  const [isVisibleRemoveItemDialog, setIsVisibleRemoveItemDialog] =
    useState(false);
  const [isLoading, setLoading] = useState(false);
  const [boxPosition, setBoxPosition] = useState('left');
  const [counter, setCounter] = useState(0);
  const boxOpacity = useSharedValue(1);
  const boxWidth = useSharedValue(34);
  const counterRef = useRef(0);
  const [
    isAuthenticatedDialogForGuestUserVisible,
    setIsAuthenticatedDialogForGuestUserVisible,
  ] = useState(false);
  const [isProductPartyTray, setIsProductPartyTray] = useState(false);
  let quantityforlb = item?.item[0]?.AVG_WEIGHT_PER_EACH_UNIT || 1;
  let quantity = Math.ceil(quantityforlb);
  const isGuest = useIsGuest();

  const cartItemsSelector = useMemo(
    () => state => state.general.cartItems ?? [],
    [],
  );

  const storeNumberSelector = useMemo(
    () => state => state.general.loginInfo?.userInfo?.StoreNumber ?? 0,
    [],
  );

  const globalSubstitutionSelector = useMemo(
    () => state =>
      state.general.loginInfo?.userInfo?.GlobalSubstitution ?? false,
    [],
  );

  const cartItems = useSelector(cartItemsSelector);
  const StoreNumber = useSelector(storeNumberSelector);
  const GlobalSubstitution = useSelector(globalSubstitutionSelector);

  const isItemInCart_ = useMemo(() => isItemInCart(), [cartItems]);

  useEffect(() => {
    if (!isItemInCart_) {
      isAddToCartInitiated.current = isItemInCart_;
    }
  }, [isItemInCart_]);

  const isAddToCartInitiated = useRef(isItemInCart_);

  const {
    sku,
    snapFlag,
    isLowBandwidth,
    productName,
    getBannerType,
    secondaryPriceLabel,
    mainPriceLabel,
    isLbPriceselected,
    lightColor,
    mainColor,
    isOnSale,
    onDisplayMessage,
    onTrackProduct,
    dropDownData,
    unitOfMeasure,
    isDropDownSelector,
    handleUnitChange,
    isProductACustomCake,
    isApplyingAvgPricePerEach,
  } = useProductItem({product: item});

  const selectedUnit = RANDOM_WEIGHT_VALUES[unitOfMeasure];

  const {
    setIsVisibleCakeTimeModal,
    setIsPartyTrayTimeModal,
    renderCakeTimeModal,
  } = useCakeTimeModal({
    onConfirmPress: params => toggleBox('increment'),
  });

  const cartItemsCountSelector = useMemo(
    () => state => state.general.cartItemsCount ?? 0,
    [],
  );

  const cartItemsCount = useSelector(cartItemsCountSelector);
  const runOnce = useRef(true);

  const showSnapEligibilitySelector = useMemo(
    () => state =>
      state.general?.loginInfo?.userInfo?.showSnapEligibility ?? false,
    [],
  );

  const showSnapEligibility = useSelector(showSnapEligibilitySelector);
  const dispatch = useDispatch();
  const {onSale = false, regularPrice = 0.0} = isOnSale();
  const bannerType = getBannerType(true);

  useEffect(() => {
    const {item: innerItem = []} = item ?? {};
    let {PARTY_TRAY_FLAG: partyFlag = ''} = innerItem?.[0] ?? {};
    if (partyFlag === 'Y' || partyFlag === 'y') {
      return setIsProductPartyTray(true);
    }
  }, [isProductPartyTray]);

  const isInteractionStarted = useRef(false);

  const quantityInCart = useMemo(() => {
    for (const cartItem of cartItems) {
      if (cartItem?.itemObj?._id === item?._id) {
        return cartItem.quantity;
      }
    }
    return 0;
  }, [cartItems, item?._id]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      isInteractionStarted.current = false;
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isInteractionStarted.current) {
      counterRef.current = quantityInCart;
      setCounter(quantityInCart);
      if (quantityInCart === 0) {
        boxWidth.value = 34;
        setBoxPosition('left');
      } else if (quantityInCart > 0) {
        boxWidth.value = isLbPriceselected ? wp('31%') : wp('25%');
        setBoxPosition('right');
      }
      runOnce.current = false;
    }
  }, [cartItems, quantityInCart]);

  let cartProperties = useMemo(() => {
    return getItemDetailsById(item?._id);
  }, [cartItems]);

  const updateCartOnce = useRef(true);

  useEffect(() => {
    if (
      updateCartOnce.current &&
      cartProperties &&
      counter > 1 &&
      isInteractionStarted.current
    ) {
      updateCartOnce.current = false;
      let products = [
        {
          item: item?.SKU,
          substitutionAllowed: cartProperties.substitutionAllowed,
          quantity: counter,
          createdDate: cartProperties.createdDate,
          formRequired: '',
          queryId: '',
          position: '',
          customerUnitOfMeasureSelection:
            cartProperties.customerUnitOfMeasureSelection,
          store: StoreNumber,
        },
      ];

      let params = {
        products: products,
        edit: true,
      };
      updateCart(params);
    }
  }, [cartProperties, counter]);

  const closeAutheticatedDialogBox = () => {
    setIsAuthenticatedDialogForGuestUserVisible(false);
  };
  const continueAsGuestHandling = () => {
    if (isCustomCake(item)) {
      onPressCustomizeCakeHandler();
    } else {
      toggleBox('increment');
    }
  };

  const onPressCustomizeCakeHandler = () => {
    navigation.push('CakesDetailsScreen', {item});
  };

  function getItemDetailsById(itemId) {
    for (const cartItem of cartItems) {
      if (cartItem.itemObj._id === itemId) {
        return {
          id: cartItem._id,
          quantity: cartItem.quantity,
          createdDate: cartItem.createdDate,
          substitutionAllowed: cartItem.substitutionAllowed,
          customerUnitOfMeasureSelection:
            cartItem.customerUnitOfMeasureSelection,
        };
      }
    }
    return null;
  }

  function isItemInCart() {
    for (const cartItem of cartItems) {
      if (cartItem.itemObj._id === item?._id) {
        return true;
      }
    }
    return false;
  }

  const renderOnlineOnlyBanner = () => {
    if (bannerType) {
      return (
        <ImageComponent
          source={IMAGES[bannerType]}
          // source={IMAGES.ONLINE_ONLY_BANNER}
          style={styles.bannerImage}
          resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
        />
      );
    }
    return null;
  };

  const navigation = useNavigation();

  const closeModal = () => {
    setIsVisibleRemoveItemDialog(false);
  };

  const getDialogMessage = () => {
    return APP_CONSTANTS.REMOVE_FROM_ORDER_MESSAGE;
  };

  const renderRemoveItemDialog = () => {
    return (
      <DialogBox
        visible={isVisibleRemoveItemDialog}
        title={APP_CONSTANTS.REMOVE_FROM_ORDER}
        message={getDialogMessage()}
        closeModal={closeModal}
        messageContainerStyles={{marginTop: 5}}
        confirmButtonLabel={APP_CONSTANTS.YES}
        cancelButtonLabel={APP_CONSTANTS.NO}
        onConfirmPress={() => removeItemFromCart(item)}
        onCancelPress={closeModal}
      />
    );
  };

  const removeItem = () => {
    if (cartProperties) {
      setIsVisibleRemoveItemDialog(true);
    } else {
      return;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceOnQtyChange = useCallback(
    debounce(async params => {
      await updateCart(params).then(
        async () => await getItemsFromCart(dispatch, false),
      );
    }, 700),
    [],
  );

  const removeItemFromCart = async item => {
    setCounter(0);
    dispatch(updateCartItemsCount(cartItems?.length - 1));
    boxWidth.value = withSpring(34, {damping: 15});
    setBoxPosition('left');
    isAddToCartInitiated.current = false;
    setIsVisibleRemoveItemDialog(false);
    let cartProperties = getItemDetailsById(item?._id);
    const {response = {}} = await removeItemFromCartAPI({
      id: cartProperties.id,
    });
    const {
      ok = false,
      status = 0,
      data,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      await getItemsFromCart(dispatch, false).then(() => {
        dispatch(updateCartItemsCount(data?.total ?? 0));
        // setTimeout(() => setLoading(false), 400);
      });
    } else {
      if (!isUnderMaintenance) {
        throw {status, isNetworkError};
      }
    }
  };
  const onChangePickerValue = async unit => {
    if (unit !== selectedUnit) {
      const updateItem = await handleUnitChange({unit});
      typeof onUnitSelectionChange === 'function' &&
        onUnitSelectionChange({unit, item: updateItem});
    }
  };

  useEffect(() => {
    if (boxPosition === 'right') {
      boxWidth.value = withSpring(
        isLbPriceselected ? wp('31') : wp('25%'),
        {damping: 12},
        () => {},
      );
    }
  }, [unitOfMeasure]);

  const toggleBox = operation => {
    if (counter === 0) {
      dispatch(updateCartItemsCount(cartItems?.length + 1));
      boxOpacity.value = withTiming(1, {duration: 500});
      setBoxPosition('right');
      boxWidth.value = withSpring(
        isLbPriceselected ? wp('31%') : wp('25%'),
        {damping: 12},
        () => {},
      );
    }
    setBoxPosition('right');
    setCounter(prevCounter => {
      if (operation === 'decrement') {
        if (prevCounter > 0) {
          if (cartProperties?.customerUnitOfMeasureSelection === 'WT') {
            counterRef.current = Math.max(prevCounter - quantity, quantity);
          } else {
            counterRef.current = Math.max(prevCounter - 1, 1);
          }
        }
      } else {
        if (
          item?.CUSTOMER_UNIT_OF_MEASURE_SELECTION === 'WT' ||
          cartProperties?.customerUnitOfMeasureSelection === 'WT'
        ) {
          counterRef.current = prevCounter + quantity;
        } else {
          counterRef.current = Math.max(prevCounter + 1, 1);
        }
      }
      // if (!isItemInCart_) {
      //   dispatch(updateCartItemsCount(cartItems?.length + 1));
      // }
      if (!isAddToCartInitiated.current) {
        addToCartApi({itemCounter: counterRef?.current}).then(r => {});
        isAddToCartInitiated.current = true;
      } else {
        if (cartProperties && !updateCartOnce.current) {
          let products = [
            {
              item: item?.SKU,
              substitutionAllowed: cartProperties.substitutionAllowed,
              quantity: counterRef?.current,
              createdDate: cartProperties.createdDate,
              formRequired: '',
              queryId: '',
              position: '',
              customerUnitOfMeasureSelection:
                cartProperties.customerUnitOfMeasureSelection,
              store: StoreNumber,
            },
          ];

          let params = {
            products: products,
            edit: true,
          };
          debounceOnQtyChange(params);
        }
      }
      return counterRef.current;
    });
  };

  const addToCartApi = async ({
    isCakeModalDisplayed = false,
    isPartyItemDisplayed = false,
    itemCounter,
  } = {}) => {
    if (isProductACustomCake && !isCakeModalDisplayed) {
      return setIsVisibleCakeTimeModal(true);
    }
    const {
      SKU: sku = '',
      item: innerItem = [],
      CUSTOMER_UNIT_OF_MEASURE_SELECTION = '',
      QUERY_ID: queryId,
      POSITION: position,
    } = item || {};
    const {FORM_REQUIRED: formRequired = ''} = innerItem?.[0] || {};
    let {quantity} = getItemPriceQuantity(item, itemCounter);
    let params = {
      products: [
        {
          item: sku,
          quantity: quantity,
          store: StoreNumber,
          formRequired: formRequired,
          queryId,
          position,
          createdDate: new Date(),
          substitutionAllowed: GlobalSubstitution,
          customerUnitOfMeasureSelection: CUSTOMER_UNIT_OF_MEASURE_SELECTION,
          ...(isCustomCake(item) && {
            cakeSelections: snakeToCamelCase(item.cakeSelections),
          }),
        },
      ],
    };

    await addItemToCart(dispatch, params)
      .then(async () => {
        onTrackProduct(
          MIX_PANEL_EVENTS.ADD_ITEM_TO_CART,
          MIX_PANEL_SCREENS.PRODUCT_DETAILS,
        );
        onDisplayMessage('Item added successfully');
        await getItemsFromCart(dispatch, false);
        setTimeout(() => {
          // adding delay, to show loader for 0.4 seconds, in the mean time redux updated..
          // setIsLoading(false);
        }, 400);
      })
      .catch(e => {
        const {isNetworkError} = e ?? {};
        // setIsLoading(false);
        if (!isNetworkError) {
          onDisplayMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
        }
      });
  };

  const onPressPlus = () => {
    isInteractionStarted.current = true;
    if (isCustomCake(item)) {
      return onPressCustomizeCakeHandler();
    }
    if (isGuest && cartItemsCount === 0 && !isLoading) {
      return setIsAuthenticatedDialogForGuestUserVisible(true);
    }
    if (isProductPartyTray && counter === 0) {
      return togglePartTrayItem();
    }
    return toggleBox('increment');
  };

  const togglePartTrayItem = () => {
    return setIsPartyTrayTimeModal(true);
  };

  const boxStyle = useAnimatedStyle(() => {
    return {
      opacity: boxOpacity.value,
      width: boxWidth.value,
    };
  });

  const renderAddToCartAnimation = () => {
    const counterInLb = counter > 1 ? 'lbs' : 'lb';
    const shouldShowDelete =
      (cartProperties &&
        cartProperties.customerUnitOfMeasureSelection === 'WT' &&
        quantity === counter) ||
      counter === 1 ||
      (!cartProperties &&
        item?.CUSTOMER_UNIT_OF_MEASURE_SELECTION === 'WT' &&
        quantity === counter);

    const isItemACustomCake = isCustomCake(item);
    return (
      <View activeOpacity={0.9} style={styles.container}>
        <Animated.View
          style={[
            isItemACustomCake ? styles.boxForCake : [styles.box, boxStyle],
          ]}>
          <View
            style={
              !isItemACustomCake
                ? {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent:
                      boxPosition === 'left' ? 'center' : 'space-between',
                  }
                : null
            }>
            {boxPosition === 'right' &&
              !isItemACustomCake &&
              (shouldShowDelete ? (
                <Pressable
                  hitSlop={12}
                  activeOpacity={0.9}
                  // disabled={isLoading}
                  onPress={() => removeItem()}>
                  <ImageComponent
                    source={IMAGES.DELETE_ICON}
                    style={styles.quantitychangeicon}
                  />
                </Pressable>
              ) : (
                <Pressable
                  hitSlop={12}
                  activeOpacity={0.9}
                  onPress={() => toggleBox('decrement')}>
                  <ImageComponent
                    source={IMAGES.DECREASE_ICON}
                    style={styles.quantitychangeicon}
                  />
                </Pressable>
              ))}

            {boxPosition === 'right' && !isItemACustomCake ? (
              <Text allowFontScaling={false} style={{color: COLORS.WHITE}}>
                {isLbPriceselected ? `${counter} ${counterInLb}` : `${counter}`}
              </Text>
            ) : null}
            <Pressable hitSlop={12} activeOpacity={0.9} onPress={onPressPlus}>
              {isItemACustomCake ? (
                <Text allowFontScaling={false} style={styles.customizableText}>Customize</Text>
              ) : (
                <ImageComponent
                  source={IMAGES.INCREASE_ICON}
                  style={{height: 22, width: 22}}
                  resizeMode={'contain'}
                />
              )}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    );
  };
  if (item?._id !== forItemId) {
    return (
      <>
        <TouchableOpacity
          style={contentWrapperStyle}
          activeOpacity={1}
          onPress={() => onItemPress(item)}>
          <View style={[styles.cardContainer, containerStyle]}>
            {renderAddToCartAnimation()}
            <ProductImageComponent
              containerStyle={styles.itemImage}
              imageUrl={getImageUrl(sku, isLowBandwidth)}
              imageStyle={styles.featuredProductImage}
            />
            <View style={{marginStart: wp(1)}}>
              {renderOnlineOnlyBanner()}
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
              <View
                style={
                  onSale
                    ? [styles.itemPriceContainer, {marginTop: hp('0%')}]
                    : null
                }>
                <Text allowFontScaling={false} style={styles.itemPriceText}>{`${mainPriceLabel}`}</Text>
              </View>

              {/*{!!secondaryPriceLabel && (*/}
              {/*  <Text style={[styles.itemApproxPriceText, {color: mainColor}]}>*/}
              {/*    {`${secondaryPriceLabel?.substring?.(*/}
              {/*      1,*/}
              {/*      secondaryPriceLabel.length - 1,*/}
              {/*    )}`}*/}
              {/*  </Text>*/}
              {/*)}*/}
              {dropDownData?.length > 1 ? (
                <View style={{marginTop: hp('0.8%')}}>
                  <ProductUnitPicker
                    data={dropDownData}
                    value={selectedUnit}
                    onChange={onChangePickerValue}
                    disabled={!isDropDownSelector || counter > 0}
                    productDetailScreen={false}
                  />
                </View>
              ) : null}
              <View style={{paddingVertical: hp('0.8%')}}>
                {onSale ? (
                  <Text
                      allowFontScaling={false}
                    style={[styles.itemRegularPriceText, {color: lightColor}]}>
                    {`Reg. $${formatAmountValue(regularPrice)}`}
                  </Text>
                ) : null}
              </View>
              <Text
                  allowFontScaling={false}
                numberOfLines={2}
                ellipsizeMode={'tail'}
                style={[
                  styles.itemDescriptionText,
                  {marginBottom: isGuest && !saleItemFromHome ? 20 : 0},
                ]}>
                {productName}
              </Text>
              {showSnapEligibility === false && (
                <View style={{marginTop: 10}} />
              )}
              <SnapEligibilityText
                textStyle={[
                  styles.snapFlag,
                  {
                    marginBottom:
                      saleItemFromHome && snapFlag !== 'N'
                        ? 10
                        : global?.isiPhone7or8 && snapFlag !== 'N'
                        ? 45
                        : snapFlag === 'N'
                        ? 0
                        : 25,

                    marginTop: bannerType ? 0 : 10,
                  },
                ]}
                snapFlag={snapFlag}
                forceDisplay
              />
              {/*    <SnapEligibilityText*/}
              {/*  textStyle={[*/}
              {/*    styles.snapFlag,*/}
              {/*    {*/}
              {/*      marginBottom: snapFlag === 'N' ? 0 : 10,*/}
              {/*      marginTop: bannerType ? 0 : 10,*/}
              {/*    },*/}
              {/*  ]}*/}
              {/*  snapFlag={snapFlag}*/}
              {/*  forceDisplay*/}
              {/*/>*/}
            </View>
          </View>
          {renderRemoveItemDialog()}
        </TouchableOpacity>
        {renderCakeTimeModal()}
        <DialogForGuestUser
          isVisible={isAuthenticatedDialogForGuestUserVisible}
          onClose={closeAutheticatedDialogBox}
          continueAsGuestHandling={continueAsGuestHandling}
        />
      </>
    );
  }
  return null;
};

export default React.memo(SaleItem);
