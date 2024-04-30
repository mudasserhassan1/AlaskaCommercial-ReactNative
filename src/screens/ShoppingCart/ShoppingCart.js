import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {COLORS, IMAGES} from '../../theme';
import {Button, List} from '../../components';
import {styles} from './styles';
import {
  changeCartItems,
  changeSelectedSegment,
  setDeliveryType,
} from '../../redux/actions/general';
import CartItemCard from '../../components/CartItemCard';
import {APP_CONSTANTS} from '../../constants/Strings';
import {getItemsFromCart, updateCartProducts} from '../../utils/cartUtils';
import DialogBox from '../../components/DialogBox';
import CartMoreModal from '../../components/CartMoreModal';
import {debounce} from 'lodash';
import BillingInformationView from '../../components/BillingInformationView';
import {BigNumber, getFloatValue} from '../../utils/calculationUtils';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {showDialogWithTimeout} from '../../utils/helperUtils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {BILLING_KEYS, DIALOG_OUT_ANIMATION_TIME} from '../../constants/Common';
import ErrorMessage from '../../components/ErrorMessage';
import useIsGuest from '../../hooks/useIsGuest';
import {
  getQuantityLimit,
  getResourcesForQuantityChange,
} from '../../utils/productUtils';
import AddToListModal from '../../components/AddToListModal';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import CarItemHiddenItem from '../../components/CartItemCard/CarItemHiddenItem';
import {removeCartAllPayments} from '../../redux/actions/payment';
import {setCheckoutInfo} from '../../redux/actions/checkoutinfo';

const ShoppingCart = ({navigation}) => {
  const [visibleMoreModal, setVisibleMoreModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(
    () => false,
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [loadingItems, setLoadingItems] = useState([]);
  const [isUpdateCallFailed, setIsUpdateCallFailed] = useState(false);
  const [isAddToListDialogVisible, setIsAddToListDialogVisible] =
    useState(false);

  const cartMoreRef = useRef(null);
  const cartItemsSelector = useMemo(
    () => state => state.general.cartItems || [],
    [],
  );
  const loginInfoSelector = useMemo(
    () => state => state.general.loginInfo || {},
    [],
  );
  const guestSelectedSegmentIndexSelector = useMemo(
    () => state => state.general.guestSelectedSegmentIndex,
    [],
  );
  const segmentsSelector = useMemo(
    () => state => state.general.segments || '',
    [],
  );
  const zipCodeDetailSelector = useMemo(
    () => state => state.general.zipCodeDetail,
    [],
  );
  const cartItems = useSelector(cartItemsSelector);

  const loginInfo = useSelector(loginInfoSelector);

  const guestSelectedSegmentIndex = useSelector(
    guestSelectedSegmentIndexSelector,
  );
  const segments = useSelector(segmentsSelector);
  const zipCodeDetail = useSelector(zipCodeDetailSelector);
  const isGuest = useIsGuest();

  const cartInvoiceSelector = useMemo(
    () => state => state.payment.cartInvoice,
    [],
  );
  const cartInvoice = useSelector(cartInvoiceSelector);

  const [swiping, setSwiping] = useState(false);

  const {userInfo = {}} = loginInfo ?? {};
  const {StoreNumber = '', Store = '', ZipCode = ''} = userInfo ?? {};
  let {homeDeliveryMinimum = '$0'} = zipCodeDetail || {};
  homeDeliveryMinimum = useMemo(() => {
    return BigNumber(getFloatValue(homeDeliveryMinimum));
  }, [homeDeliveryMinimum]);

  const isHomeDeliveryError = useMemo(() => {
    return (
      segments?.[guestSelectedSegmentIndex] === APP_CONSTANTS.HOME_DELIVERY &&
      homeDeliveryMinimum.gt(0) &&
      !!cartItems.length &&
      homeDeliveryMinimum.gt(cartInvoice?.[BILLING_KEYS.SUBTOTAL] || 0)
    );
  }, [
    cartInvoice,
    cartItems.length,
    guestSelectedSegmentIndex,
    homeDeliveryMinimum,
    segments,
  ]);

  const dispatch = useDispatch();

  const retryAction = useRef(null);
  const updatedCartItemsRef = useRef(null);
  const selectedItemRef = useRef(null);
  const oldQuantityRef = useRef(null);
  const itemBeforeUpdateRef = useRef(null);

  const showApiErrorDialog = () => setIsVisibleApiErrorDialog(true);
  const hideApiErrorDialog = () => setIsVisibleApiErrorDialog(false);

  const handleRetry = () => {
    hideApiErrorDialog();
    setTimeout(() => retryAction.current(), DIALOG_OUT_ANIMATION_TIME + 10);
  };

  const handleCancel = () => {
    hideApiErrorDialog();
    if (isUpdateCallFailed) {
      getCart(false, false).then(() => {});
    }
  };
  useEffect(() => {
    getCart().then(() => {});
  }, [Store, StoreNumber, ZipCode]);

  // useEffect(() => {
  //   navigation.setParams({isItemSwiping: swiping});
  // }, [navigation, swiping]);

  const getCart = async (loading = true, errorHandling = true) => {
    setIsLoading(loading);
    await getItemsFromCart(dispatch)
      .then(() => {
        setIsDataLoaded(true);
      })
      .catch(e => {
        retryAction.current = getCart;
        const {isNetworkError} = e ?? {};
        if (!isNetworkError && errorHandling) {
          handleApiError();
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsDataLoaded(true);
      });
  };

  const updateCartItems = async (products, clickedItem) => {
    const {_id = ''} = clickedItem ?? selectedItemRef.current ?? {};
    let tempLoadingItems = [];
    tempLoadingItems.push(_id);
    setLoadingItems(tempLoadingItems);

    await updateCartProducts(
      products ?? updatedCartItemsRef.current ?? [],
      dispatch,
      StoreNumber,
    )
      .then(() => {
        setIsUpdateCallFailed(false);
        setLoadingItems([]);
      })
      .catch(e => {
        retryAction.current = updateCartItems;
        setIsUpdateCallFailed(true);
        const {isNetworkError} = e ?? {};
        setLoadingItems([]);
        if (!isNetworkError) {
          handleApiError();
        }
      });
  };

  const handleApiError = () => {
    showDialogWithTimeout(showApiErrorDialog);
  };

  const showCartMoreModal = () => {
    setVisibleMoreModal(true);
  };

  const closeMoreModal = () => {
    setVisibleMoreModal(false);
    if (!visibleMoreModal) {
      closeOpenRow();
    }
  };

  const handleQuantityChange = async (
    index,
    operation,
    minimumQuantity = 1,
  ) => {
    let clickedItem = cartItems[index].itemObj;
    let {
      userSelectedQty,
      clickedItem: updatedItem,
      oldSelectedQty,
    } = getResourcesForQuantityChange(clickedItem, operation, minimumQuantity);

    itemBeforeUpdateRef.current = clickedItem;
    oldQuantityRef.current = oldSelectedQty;
    selectedItemRef.current = updatedItem;

    if (oldSelectedQty === minimumQuantity && operation === 'decrement') {
      onSetSelectedItem(clickedItem, index);
      cartMoreRef.current?.onRemoveItemFromCart?.();
      return;
    }

    cartItems[index].itemObj = updatedItem;
    cartItems[index].quantity = userSelectedQty;
    dispatch(changeCartItems([...cartItems]));
    updatedCartItemsRef.current = cartItems;
    debounceOnQtyChange(cartItems, updatedItem);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceOnQtyChange = useCallback(
    debounce((updatedCart, clickedItem) => {
      updateCartItems(updatedCart, clickedItem).then(() => {});
    }, 700),
    [],
  );

  const proceedToCheckout = useCallback(() => {
    dispatch(removeCartAllPayments({}));
    dispatch(
      setCheckoutInfo({
        checkoutInformation: null,
        deliveryDetail: null,
        address: null,
      }),
    );
    navigation.navigate('CheckoutOrderDetail');
  }, [navigation, isGuest]);

  const setFocusOnControlSegment = useCallback(
    index => {
      dispatch(changeSelectedSegment(index));
      dispatch(setDeliveryType(segments[index]));
    },
    [dispatch, segments],
  );

  const onSetSelectedItem = (item, index) => {
    setSelectedItem(cartItems[index]);
    setSelectedItemIndex(index);
  };

  const onMorePress = (item, index) => {
    onSetSelectedItem(item, index);
    showCartMoreModal();
    // toggleMoreModal(true);
  };

  const getButtonDisabilityStatus = useMemo(() => {
    let filteredItems = [];
    if (cartItems) {
      filteredItems = cartItems.filter(item => {
        return item.quantity > getQuantityLimit(item.itemObj);
      });
    }
    return Boolean(filteredItems.length > 0);
  }, [cartItems]);

  const ItemSeparatorView = () => {
    return (
      <View
        style={[styles.divider, {marginStart: widthPercentageToDP('6%')}]}
      />
    );
  };

  const renderListHeaderComponent = () => {
    return (
      <View style={styles.infoWrapper}>
        {cartItems.length > 0 && (
          <View style={styles.cartHeaderView}>
            <Text allowFontScaling={false} style={styles.cartHeaderText}>
              {cartItems.length}{' '}
              {cartItems.length === 1
                ? APP_CONSTANTS.ITEM
                : APP_CONSTANTS.ITEMS}
            </Text>
          </View>
        )}
        {!!isHomeDeliveryError && (
          <View style={{marginTop: 10, marginHorizontal: -5}}>
            <ErrorMessage
              error={`Order subtotal does not meet the required minimum of $${homeDeliveryMinimum} for home delivery orders`}
              textStyles={styles.errorText}
            />
          </View>
        )}
      </View>
    );
  };

  const renderListFooterComponent = () => {
    return (
      <>
        <View style={styles.sectionDivider} />
        <View>
          <BillingInformationView />
          {renderButton()}
        </View>
      </>
    );
  };

  const renderListEmptyComponent = () => {
    return (
      <View style={styles.listEmptyParentView}>
        <FastImage
          source={IMAGES.PLACE_HOLDER_IMAGE}
          style={styles.placeholderImage}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text allowFontScaling={false} style={styles.emptyListNoRecordDescription}>
          {APP_CONSTANTS.EMPTY_CART_MESSAGE}
        </Text>
      </View>
    );
  };
  const renderButton = () => {
    const isDisabled = getButtonDisabilityStatus || isHomeDeliveryError;
    return (
      <View style={styles.buttonView}>
        <View
          style={[
            styles.btnWrapper,
            {
              backgroundColor: isDisabled
                ? COLORS.DISABLE_BUTTON_COLOR
                : COLORS.ACTIVE_BUTTON_COLOR,
            },
          ]}>
          <Button
            label={APP_CONSTANTS.PROCEED_TO_CHECKOUT}
            color={COLORS.WHITE}
            disabled={isDisabled}
            width="90%"
            onPress={proceedToCheckout}
          />
        </View>
      </View>
    );
  };

  const renderCartItems = ({item, index}) => {
    return (
      <CartItemCard
        isSwipeAble={isDataLoaded}
        item={item}
        index={index}
        onPlusPress={(_, minimumQuantity) =>
          handleQuantityChange(index, 'increment', minimumQuantity)
        }
        onMinusPress={(_, minimumQuantity) =>
          handleQuantityChange(index, 'decrement', minimumQuantity)
        }
        onMorePress={() => onMorePress(item, index)}
        isLoading={loadingItems.includes(item.itemObj._id)}
        onRowDidOpen={onRowDidOpen}
        keyExtractor={getKeys}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
        onDeleteRow={deleteRow}
        onAddToList={addToList}
        onSwipeStart={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
      />
    );
  };

  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isVisibleApiErrorDialog}
        closeModal={hideApiErrorDialog}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        onConfirmPress={handleRetry}
        onCancelPress={handleCancel}
      />
    );
  };
  const renderMoreModal = () => (
    <CartMoreModal
      visible={visibleMoreModal}
      onRequestClose={closeMoreModal}
      selectedItem={selectedItem}
      selectedItemIndex={selectedItemIndex}
      ref={cartMoreRef}
      setLoading={setIsLoading}
      onDeleted={() => {
        closeOpenRow();
      }}
    />
  );

  const renderDeliveryTypes = useMemo(() => {
    return (
      <View style={styles.topControlSegments}>
        {segments.map((item, index) => {
          return (
            <TouchableOpacity
              disabled={segments.length === 1}
              activeOpacity={0.7}
              style={[styles.segmentView]}
              key={index.toString()}
              onPress={() => setFocusOnControlSegment(index)}>
              <Text
                  allowFontScaling={false}
                style={{
                  color:
                    index === guestSelectedSegmentIndex
                      ? COLORS.MAIN
                      : COLORS.BLACK,
                  ...styles.segment_deliverytype,
                }}>
                {item}
              </Text>
              <View
                style={{
                  backgroundColor:
                    index === guestSelectedSegmentIndex
                      ? COLORS.MAIN
                      : COLORS.WHITE,
                  ...styles.segmented_selectedstyle,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [guestSelectedSegmentIndex, segments, setFocusOnControlSegment]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = rowKey => {
    deleteItem(rowKey);
    cartMoreRef.current?.onRemoveItemFromCart?.();
  };
  const openRowRef = useRef(null);
  const onRowDidOpen = ref => {
    if (openRowRef?.current !== ref?.current) {
      closeOpenRow();
    }
    openRowRef.current = ref?.current;
  };

  const closeOpenRow = () => {
    if (openRowRef.current && openRowRef.current.closeRow) {
      openRowRef.current.closeRow();
    }
  };
  const onLeftActionStatusChange = rowKey => {};

  const onRightActionStatusChange = rowKey => {};

  const onRightAction = rowKey => {
    console.log('onRightAction', rowKey);
    deleteItem(rowKey);
    cartMoreRef.current?.onRemoveItemFromCart?.();
    closeOpenRow();
  };

  const addToList = rowKey => {
    setSelectedItem(cartItems[rowKey]);
    setSelectedItemIndex(rowKey);
    setIsAddToListDialogVisible(true);
  };
  const deleteItem = rowKey => {
    setSelectedItem(cartItems[rowKey]);
    setSelectedItemIndex(rowKey);
  };
  const onLeftAction = rowKey => {
    addToList(rowKey);
    closeOpenRow();
    console.log('onLeftAction', rowKey);
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(65);
    const rowLeftActionAnimatedValue = new Animated.Value(95);

    return (
      <CarItemHiddenItem
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowLeftActionAnimatedValue={rowLeftActionAnimatedValue}
        onClose={() => {
          addToList(data.index);
        }}
        onDelete={() => deleteRow(rowMap, data.index)}
      />
    );
  };
  const getKeys = (item, index) => index.toString();

  const renderAddToListModal = () => {
    // if (isAddToListDialogVisible) {
    return (
      <AddToListModal
        visible={isAddToListDialogVisible}
        onRequestClose={() => {
          setIsAddToListDialogVisible(false);
          closeOpenRow();
        }}
        selectedItem={selectedItem ? selectedItem.itemObj : {}}
        entryPoint={MIX_PANEL_SCREENS.CART}
        showApiErrorDialog={() => {
          // setIsVisibleApiErrorDialog(true);
        }}
      />
    );
    // }
    // return null;
  };

  const onSwipeStart = () => {
    setSwiping(true);
  };

  const onSwipeEnd = () => {
    setSwiping(false);
  };
  return (
    <ScreenWrapperComponent
      headerTitle={`CART (${cartItems.length})`}
      withBackButton
      isLoading={isLoading}
      isScrollView={false}
      containerStyle={{flex: 1}}>
      {renderDeliveryTypes}

      <View style={styles.listContainer}>
        <List
          scrollEnabled={!swiping}
          data={cartItems}
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={renderListEmptyComponent}
          ListHeaderComponent={renderListHeaderComponent}
          ListFooterComponent={
            cartItems.length > 0 ? renderListFooterComponent : () => {}
          }
          ItemSeparatorComponent={ItemSeparatorView}
          keyExtractor={(item, index) => String(item?._id || index)}
          renderItem={renderCartItems}
          scrollIndicatorInsets={{right: 0.1}}
        />
      </View>
      {renderMoreModal()}
      {renderApiErrorDialog()}
      {renderAddToListModal()}
    </ScreenWrapperComponent>
  );
};

export default ShoppingCart;
