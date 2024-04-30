import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

import {IMAGES} from '../../theme';
import {styles} from '../../theme/Styles';
import {shopStyles} from '../Shop/styles';
import {changeList} from '../../redux/actions/general';
import {APP_CONSTANTS} from '../../constants/Strings';
import DialogBox from '../../components/DialogBox';
import ProductCard from '../../components/ProductCard';
import {debounce} from 'lodash';
import {
  getSingleList,
  removeItemsFromList,
  updateListItems,
} from '../../services/ApiCaller';
import {addMultipleItemsToCart} from '../../utils/cartUtils';
import ListEditModal from '../../components/ListEditModal';
import ImageComponent from '../../components/ImageComponent';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {showDialogWithTimeout} from '../../utils/helperUtils';
import {
  checkIfCakeSelectionsAreComplete,
  getCakeType,
  isCustomCake,
} from '../../utils/cakeUtils';
import useCakeTimeModal from '../../hooks/useCakeTimeModal';
import {mapListItemsForListApi} from '../../utils/listUtils';
import {getResourcesForQuantityChange} from '../../utils/productUtils';
import {STATUSES} from '../../constants/Api';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import ShareCartModal from '../../components/ShareCartModal';
import {styles as listStyles} from './styles';
import {logToConsole} from '../../configs/ReactotronConfig';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {SCREEN_WIDTH} from '../../constants/Common';
import {useFocusEffect} from '@react-navigation/native';
const ListDetail = ({navigation, route}) => {
  const [addedAll, setAddedAll] = useState(false);
  const [addedAll_, setAddedAll_] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [list, setList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddAllLoading, setIsAddAllLoading] = useState(false);
  const [isRemoveItemModal, setRemoveItemModal] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [isVisibleRemoveAllDialog, setIsVisibleRemoveALlDialog] =
    useState(false);
  const [isVisibleAddAllErrorDialog, setIsVisibleAddAllErrorDialog] =
    useState(false);
  const [loadingItems, setLoadingItems] = useState([]);
  const [isShareCartModal, setIsShareCartModal] = useState(false);

  const dispatch = useDispatch();

  const {
    setIsVisibleCakeTimeModal,
    setIsPartyTrayTimeModal,
    setIsCakeOrPartyTrayTimeModal,
    renderCakeTimeModal,
  } = useCakeTimeModal({
    onConfirmPress: params => addAll(params),
  });

  const listItemsSelector = useMemo(
    () => state => state.general?.listItems || [],
    [],
  );

  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems || [],
    [],
  );

  const listItems = useSelector(state => state.general?.listItems);
  const cartItems = useSelector(cartItemsSelector);

  const {listIndex = 0, listId = ''} = route.params ?? {};
  const currentListProducts = useMemo(() => {
    const {Products = []} = listItems[listIndex];
    return [...Products];
  }, [listItems, listIndex]);

  const myToast = useRef();
  const itemToRemoveFromList = useRef(null);
  const updatedListRef = useRef([]);
  const retryFunction = useRef(null);

  useFocusEffect(
    useCallback(() => {
      getListDetails(false).then(() => {});
    }, [cartItems]),
  );

  const getListDetails = async loading => {
    setIsLoading(loading);
    const {response = {}} = await getSingleList(listId);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    setIsLoading(false);
    if (ok && status === STATUSES.OK) {
      const {data = {}} = response ?? {};
      const {response: products = {}, exist = false} = data || {};
      setList(products);
      setAddedAll(exist);
      listItems[listIndex] = products;
      dispatch(changeList([...listItems]));
    } else if (!isUnderMaintenance && !isNetworkError) {
      retryFunction.current = getListDetails;
      handleApiError();
    }
  };

  function isPartyFlag(currentListProducts) {
    for (const product of currentListProducts) {
      for (const item of product.item) {
        if (item.PARTY_TRAY_FLAG === 'Y') {
          return true;
        }
      }
    }

    return false;
  }

  const addAll = async ({
    isCakeModalDisplayed,
    isPartyItemDisplayed,
    isCakeOrPartyItemDisplayed,
  } = {}) => {
    let hasCustomCakes = false;
    let hasPartyTray = false;
    let hasPartyOrCake = false;
    const {Products = []} = listItems[listIndex] ?? {};
    const hasSomeCakeWithoutSelection = Products.some(item => {
      const isProductACustomCake = isCustomCake(item);
      hasCustomCakes = hasCustomCakes || isProductACustomCake;
      hasPartyTray = isPartyFlag(currentListProducts);
      hasPartyOrCake = hasCustomCakes && hasPartyTray;
      return checkIfCakeSelectionsAreComplete({
        isProductACustomCake,
        cakeSelections: item?.cakeSelections,
        cakeType: getCakeType(item),
      });
    });

    if (hasSomeCakeWithoutSelection) {
      logToConsole('true');
      return showAddAllErrorDialog();
    } else if (hasPartyOrCake && !isCakeOrPartyItemDisplayed) {
      setIsCakeOrPartyTrayTimeModal(true);
    } else if (!hasPartyOrCake && hasCustomCakes && !isCakeModalDisplayed) {
      setIsVisibleCakeTimeModal(true);
    } else if (!hasPartyOrCake && hasPartyTray && !isPartyItemDisplayed) {
      setIsPartyTrayTimeModal(true);
    } else {
      setIsAddAllLoading(true);
      await addMultipleItemsToCart(Products, dispatch, false, false)
        .then(() => {
          setIsAddAllLoading(false);
          setAddedAll(true);
          displayMessage('Items added to cart successfully');
        })
        .catch(() => {
          setIsAddAllLoading(false);
          retryFunction.current = addAll;
          handleApiError();
        });
    }
  };

  const showAddAllErrorDialog = useCallback(
    () => setIsVisibleAddAllErrorDialog(true),
    [],
  );
  const hideAddAllErrorDialog = useCallback(
    () => setIsVisibleAddAllErrorDialog(false),
    [],
  );

  const goToDetailScreen = (item, index) => {
    navigation.navigate('ProductDetails', {
      item,
      list,
      listId,
      comingFrom: APP_CONSTANTS.LIST,
      entryPoint: MIX_PANEL_SCREENS.LIST,
      index,
      listIndex,
      addedToListIndicator: true,
    });
  };

  const goToCakeDetailScreen = (item, index) => {
    logToConsole({item});
    navigation.navigate('CakesDetailsScreen', {
      item,
      list,
      listId,
      comingFrom: APP_CONSTANTS.LIST,
      entryPoint: MIX_PANEL_SCREENS.LIST,
      index,
      listIndex,
    });
  };

  const showApiErrorDialog = () => setIsApiErrorDialogVisible(true);
  const hideApiErrorDialog = () => setIsApiErrorDialogVisible(false);

  const handleRetryAction = () => {
    hideApiErrorDialog();
    setTimeout(() => {
      retryFunction.current();
    }, 250);
  };

  const handleApiError = () => {
    return showDialogWithTimeout(showApiErrorDialog);
  };

  const toggleModal = () => {
    setVisibleEditModal(!visibleEditModal);
  };

  const handleQuantityChange = async (index, operation, minimumQuantity) => {
    let focusedItem = listItems[listIndex]?.Products[index];
    let {clickedItem: updatedItem, oldSelectedQty} =
      getResourcesForQuantityChange(focusedItem, operation, minimumQuantity);
    if (oldSelectedQty === minimumQuantity && operation === 'decrement') {
      itemToRemoveFromList.current = focusedItem;
      setRemoveItemModal(true);
      return;
    }

    listItems[listIndex].Products[index] = updatedItem;
    dispatch(changeList(listItems));
    debounceOnQtyChange(listItems, updatedItem);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceOnQtyChange = useCallback(
    debounce((updatedList, focusedItem) => {
      updatedListRef.current = updatedList;
      itemToRemoveFromList.current = focusedItem;
      updateListProducts().then(() => {});
    }, 1000),
    [listItems],
  );

  const closeModal = () => {
    setIsVisibleRemoveALlDialog(false);
    setRemoveItemModal(false);
  };

  const updateListProducts = async () => {
    const {_id = ''} = itemToRemoveFromList.current ?? {};
    let tempLoadingItems = [];
    tempLoadingItems.push(_id);
    setLoadingItems(tempLoadingItems);

    const {Products = []} = updatedListRef.current[listIndex];
    let modifiedProducts = await mapListItemsForListApi(Products);
    const {response = {}} = await updateListItems(modifiedProducts, listId);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      await getListDetails(false).then(() => {
        setLoadingItems([]);
      });
    } else {
      setLoadingItems([]);
      if (!isNetworkError && !isUnderMaintenance) {
        retryFunction.current = updateListProducts;
        handleApiError();
      }
    }
  };

  const removeAllItems = async () => {
    setIsLoading(true);
    const {response = {}} = await removeItemsFromList(listId, 'all');
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      await getListDetails(true).then(() => setIsLoading(false));
    } else if (!isNetworkError && !isUnderMaintenance) {
      retryFunction.current = removeAllItems;
      handleApiError();
    }
    setIsLoading(false);
  };

  const removeItem = async () => {
    closeModal();
    setTimeout(async () => {
      setIsLoading(true);
      const {SKU: sku = ''} = itemToRemoveFromList?.current ?? {};
      setIsLoading(true);
      const {response = {}} = await removeItemsFromList(listId, sku);
      const {
        ok = false,
        status = 0,
        isNetworkError,
        isUnderMaintenance,
      } = response ?? {};
      if (ok && status === STATUSES.OK) {
        await getListDetails(true);
      } else if (!isNetworkError && !isUnderMaintenance) {
        retryFunction.current = removeItem;
        handleApiError();
      }
      setIsLoading(false);
    }, 250);
  };

  const displayMessage = message => {
    myToast?.current?.show(message, 1500);
  };

  const changeSelectionOfUnit = async (item, unit, itemIndex) => {
    item.CUSTOMER_UNIT_OF_MEASURE_SELECTION = unit;
    listItems[listIndex].Products[itemIndex] = item;
    const {Products: products} = listItems[listIndex];
    dispatch(changeList([...listItems]));
    await updateListItems(products, listId);
  };

  const renderShareList = () => {
    if (currentListProducts?.length) {
      return (
        <>
          <View style={listStyles.shareContainer}>
            <View style={listStyles.shareLeftContainer}>
              <Text allowFontScaling={false} style={listStyles.shareHeading}>
                {APP_CONSTANTS.SHARE_ITEMS}
              </Text>
              <Text allowFontScaling={false} style={listStyles.shareText}>
                {APP_CONSTANTS.SHARE_ITEMS_TEXT}
              </Text>
            </View>
            <Pressable
              onPress={() => setIsShareCartModal(true)}
              style={listStyles.shareButton}>
              <Text allowFontScaling={false} style={listStyles.shareButtonText}>
                {APP_CONSTANTS.SHARE}
              </Text>
            </Pressable>
          </View>
          <View style={listStyles.gap} />
        </>
      );
    }
  };

  const listHeaderComponent = () => {
    const {
      Name: listName = '',
      CreatedAt: creationDate = '',
      Products: items = [],
    } = listItems[listIndex] ?? {};
    return (
      <>
        {renderShareList()}
        <View
          style={[
            shopStyles.infoWrapper,
            !currentListProducts?.length && {marginTop: hp(1.5)},
          ]}>
          <View style={shopStyles.zipCodeWrapper}>
            <View style={styles.listNameWrapper}>
              <View style={listStyles.meta}>
                <Text
                    allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={styles.listNameText}>
                  {listName}
                </Text>
                <View style={styles.creationDateWrapper}>
                  <Text allowFontScaling={false} style={styles.dateText}>
                    {creationDate && moment(creationDate).format('MM/DD/YYYY')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={listStyles.editButton}
                onPress={toggleModal}>
                <Text allowFontScaling={false} style={styles.editText}>{APP_CONSTANTS.EDIT}</Text>
              </TouchableOpacity>
            </View>
            <View style={listStyles.borderII} />
            {items?.length > 0 ? (
              <View style={styles.cartActionsView}>
                <TouchableOpacity
                  disabled={addedAll || isAddAllLoading}
                  activeOpacity={0.8}
                  style={styles.addAllAction}
                  onPress={addAll}>
                  <Text allowFontScaling={false} style={styles.addToCartText}>
                    {addedAll ? APP_CONSTANTS.ADDED : APP_CONSTANTS.ADD_ALL}
                  </Text>
                  <View style={styles.cartImageWrapper}>
                    {isAddAllLoading ? (
                      <ActivityIndicator size={'small'} color={'white'} />
                    ) : (
                      <ImageComponent
                        source={addedAll ? IMAGES.ADDED_ALL : IMAGES.CART}
                        style={styles.cartImage}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsVisibleRemoveALlDialog(true)}>
                  <Text allowFontScaling={false} style={styles.removeAllText}>
                    {APP_CONSTANTS.REMOVE_ALL}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View style={styles.viewMargin} />
          <View style={styles.topBorderedView} />
        </View>
      </>
    );
  };

  const renderItems = ({item, index}) => {
    const isEven = (index + 1) % 2 === 0;
    return (
      <ProductCard
        item={item}
        entryPoint={MIX_PANEL_SCREENS.LIST}
        onMinusPress={handleQuantityChange}
        onPlusPress={handleQuantityChange}
        cakeCartButton
        isRemoveItemEnabled
        addedToListIndicator
        onItemPress={goToDetailScreen}
        onCustomizeButtonPress={() => goToCakeDetailScreen(item, index)}
        index={index}
        cartButtonDisabledHighlight={false}
        onUnitSelectionChange={({item: product, unit}) =>
          changeSelectionOfUnit(product, unit, index)
        }
        isLoading={loadingItems.includes(item._id)}
        onListIconPress={() => {
          itemToRemoveFromList.current = listItems[listIndex].Products[index];
          setRemoveItemModal(true);
        }}
        showCartConfirmation={displayMessage}
        setAddedAll_={setAddedAll_}
        CardFromList={true}
        contentWrapperStyle={{
          width: SCREEN_WIDTH / 2,
          alignItems: 'center',
          paddingStart: !isEven ? 22 : 0,
          paddingEnd: !isEven ? 0 : 22,
        }}
      />

      // <SaleItem
      //   item={item}
      //   entryPoint={MIX_PANEL_SCREENS.LIST}
      //   onMinusPress={handleQuantityChange}
      //   onPlusPress={handleQuantityChange}
      //   cakeCartButton
      //   isRemoveItemEnabled
      //   addedToListIndicator
      //   onItemPress={goToDetailScreen}
      //   onCustomizeButtonPress={goToCakeDetailScreen}
      //   index={index}
      //   cartButtonDisabledHighlight={false}
      //   onUnitSelectionChange={({item: product, unit}) => changeSelectionOfUnit(product, unit, index)}
      //   isLoading={loadingItems.includes(item._id)}
      //   onListIconPress={() => {
      //     itemToRemoveFromList.current = listItems[listIndex].Products[index];
      //     setRemoveItemModal(true);
      //   }}
      //   showCartConfirmation={displayMessage}
      // />

      // <SaleItem
      //   item={item}
      //   containerStyle={{marginHorizontal: 0}}
      //   contentWrapperStyle={{
      //     width: SCREEN_WIDTH / 2,
      //     alignItems: 'center',
      //     paddingStart: !isEven ? 22 : 0,
      //     paddingEnd: !isEven ? 0 : 22,
      //   }}
      //   onUnitSelectionChange={({item: product}) =>
      //     changeSelectionOfUnit(product, index)
      //   }
      //   comingFromList={comingFromList}
      //   onCustomizeButtonPress={() => goToCakeDetailScreen(item, index)}
      //   onItemPress={() => goToDetailScreen(item, index)}
      // />
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.listEmptyComponentView}>
        <Text allowFontScaling={false}>{APP_CONSTANTS.NO_ITEMS_IN_LIST}</Text>
      </View>
    );
  };

  const renderLists = () => {
    return (
      <View style={listStyles.container}>
        <FlatList
          data={currentListProducts || []}
          numColumns={2}
          contentContainerStyle={listStyles.contentContainerStyle}
          ListEmptyComponent={listEmptyComponent}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={item => item._id}
          // extraData={currentListProducts}
          renderItem={renderItems}
        />
      </View>
    );
  };

  const renderMoreModal = () => {
    return (
      <ListEditModal
        visible={visibleEditModal}
        listIndex={listIndex}
        onDisplayMessage={displayMessage}
        onApiError={handleApiError}
        closeModal={toggleModal}
      />
    );
  };

  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={hideApiErrorDialog}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={handleRetryAction}
        onCancelPress={hideApiErrorDialog}
      />
    );
  };

  const renderRemoveAllItemsDialog = () => (
    <DialogBox
      visible={isVisibleRemoveAllDialog}
      closeModal={closeModal}
      title={APP_CONSTANTS.REMOVE_ALL_ITEMS}
      messageContainerStyles={{marginTop: 5}}
      message={
        APP_CONSTANTS.ARE_YOU_SURE_YOU_WANT_TO_REMOVE_ALL_ITEMS_FROM_LIST
      }
      cancelButtonLabel={APP_CONSTANTS.NO}
      confirmButtonLabel={APP_CONSTANTS.YES}
      onConfirmPress={() => {
        closeModal();
        setTimeout(() => removeAllItems(), 250);
      }}
      onCancelPress={() => setIsVisibleRemoveALlDialog(false)}
    />
  );

  const renderRemoveItemDialog = () => {
    return (
      <DialogBox
        visible={isRemoveItemModal}
        closeModal={closeModal}
        title={APP_CONSTANTS.REMOVE_FROM_LIST}
        messageContainerStyles={{marginTop: 5}}
        message={APP_CONSTANTS.REMOVE_FROM_LIST_MESSAGE}
        cancelButtonLabel={APP_CONSTANTS.NO}
        confirmButtonLabel={APP_CONSTANTS.YES}
        onConfirmPress={removeItem}
        onCancelPress={closeModal}
      />
    );
  };

  const renderAddAllErrorDialog = () => (
    <DialogBox
      visible={isVisibleAddAllErrorDialog}
      closeDialog={hideAddAllErrorDialog}
      title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
      message={'Please customize all cake items before adding into the cart.'}
      cancelButtonLabel={APP_CONSTANTS.OK}
      isSingleButton
      onCancelPress={hideAddAllErrorDialog}
    />
  );
  const renderToast = () => (
    <ToastComponent positionValue={260} toastRef={myToast} />
  );

  const renderShareModal = () => (
    <ShareCartModal
      listId={listId}
      visible={isShareCartModal}
      onClose={() => setIsShareCartModal(false)}
    />
  );

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.LIST_HEADER}
      withBackButton
      showCartButton
      isScrollView={false}
      isLoading={isLoading}
      containerStyle={{height: '90%'}}>
      {renderLists()}
      {renderMoreModal()}
      {renderApiErrorDialog()}
      {renderRemoveAllItemsDialog()}
      {renderRemoveItemDialog()}
      {renderAddAllErrorDialog()}
      {renderCakeTimeModal()}
      {renderToast()}
      {renderShareModal()}
    </ScreenWrapperComponent>
  );
};

export default ListDetail;
