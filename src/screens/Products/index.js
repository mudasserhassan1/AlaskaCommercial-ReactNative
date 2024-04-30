import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../theme';
import AddToListModal from '../../components/AddToListModal';
import shopStyles from './styles';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import DialogBox from '../../components/DialogBox';
import useSearchProducts from '../../hooks/useSearchProducts';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import useIsGuest from '../../hooks/useIsGuest';
import {getResourcesForQuantityChange} from '../../utils/productUtils';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {emitter} from '../../navigation/navigators/BottomTabsNavigator';
import {TAB_EVENTS} from '../../constants/Events';
import {navigationRef} from '../../utils/navigationUtils';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {SCREEN_WIDTH} from '../../constants/Common';
import {logToConsole} from '../../configs/ReactotronConfig';

const Products = ({navigation, route}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);

  const myToast = useRef();
  const flatListRef = useRef();

  const {
    departmentName = '',
    subDepartmentName = '',
    departmentId = '',
    subDepartmentId = '',
    isPartyEligible,
    comingFrom,
    onSaleTag = false,
    comingFromHome = false,
    fromDrawer = false,
    fromBanner = false,
    fromHomeDept = false,
  } = route.params ?? {};

  const {
    list,
    search,
    loading,
    loadingMore,
    onResetAll,
    onUpdateList,
    onRefreshSearch,
    renderSearchJSX,
    refreshingSearch,
    isInitialLoading,
    onEndReachedSearch,
    renderSaleFiltersJSX,
    isSearchOrFilterApplied,
  } = useSearchProducts({
    isOnSale: comingFromHome,
    departmentId,
    subDepartmentId,
    isPartyEligible,
    listRef: flatListRef,
    doFirstInitialSearch: true,
    comingFromHome,
    subDepartmentName,
    departmentName,
    fromDrawer,
    fromBanner,
    fromHomeDept,
  });

  const entryPoint = onSaleTag
    ? MIX_PANEL_SCREENS.ON_SALE
    : MIX_PANEL_SCREENS.SHOP;
  const isGuest = useIsGuest();

  const onTabPress = useCallback(
    e => {
      const {name: currentScreen} =
        navigationRef?.current?.getCurrentRoute?.() ?? {};
      if (
        navigation.isFocused() &&
        currentScreen === 'Products' &&
        isSearchOrFilterApplied
      ) {
        e.preventDefault();
        onResetAll();
      }
    },
    [isSearchOrFilterApplied, navigation],
  );

  useEffect(() => {
    // emitter.on(TAB_EVENTS.TAB_PRESS_SHOP, onTabPress);
    emitter.on(TAB_EVENTS.TAB_PRESS_SALE, onTabPress);
    return () => {
      // emitter.off(TAB_EVENTS.TAB_PRESS_SHOP, onTabPress);
      emitter.off(TAB_EVENTS.TAB_PRESS_SALE, onTabPress);
    };
  }, [onTabPress]);

  const toggleVisibleModal = () => {
    setVisibleModal(!visibleModal);
  };

  const handleQuantityChange = (index, operation, minimumQuantity) => {
    let clickedItem = list[index];
    let {clickedItem: updatedItem} = getResourcesForQuantityChange(
      clickedItem,
      operation,
      minimumQuantity,
    );
    list[index] = updatedItem;
    onUpdateList([...list]);
  };

  const changeSelectionOfUnit = (item = {}, itemIndex = 0) => {
    list[itemIndex] = item;
    onUpdateList([...list]);
  };

  const goToDetailScreen = (item, index) => {
    return navigation.navigate('ProductDetails', {
      item,
      index,
      departmentName,
      subDepartmentName,
      entryPoint,
    });
  };

  const keyExtractor = useCallback(
    (item, index) => String(item?._id || index),
    [],
  );

  const listEmptyComponent = () => {
    if (!list?.length && !loading && !isInitialLoading) {
      return (
        <View style={shopStyles.emptyListParentView}>
          <Text allowFontScaling={false} style={shopStyles.emptyListNoRecordText}>No Record found</Text>
          <Text allowFontScaling={false} style={shopStyles.emptyListNoRecordDescription}>
            {APP_CONSTANTS.NO_RECORD_MESSAGE}
          </Text>
        </View>
      );
    }
    return null;
  };

  const listHeaderComponent = () => {
    return (
      <>
        {!search ? (
          <Text allowFontScaling={false}  style={styles.searchtext}>{subDepartmentName}</Text>
        ) : null}
        {search ? (
          <Text allowFontScaling={false} style={styles.searchtext}>Search Results for "{search}"</Text>
        ) : null}
      </>
    );
  };

  const renderProducts = ({item, index}) => {
    const isEven = (index + 1) % 2 === 0;
    return (
      <SaleItem
        contentWrapperStyle={{
          width: SCREEN_WIDTH / 2,
          alignItems: 'center',
          paddingStart: !isEven ? 22 : 0,
          paddingEnd: !isEven ? 0 : 22,
        }}
        onUnitSelectionChange={({item: product}) =>
          changeSelectionOfUnit(product, index)
        }
        item={item}
        onItemPress={goToDetailScreen}
      />
    );
  };

  const renderAddToListModal = () => {
    if (!isGuest) {
      return (
        <AddToListModal
          visible={visibleModal}
          onRequestClose={toggleVisibleModal}
          selectedItem={selectedItem}
          entryPoint={entryPoint}
          showApiErrorDialog={() => setIsVisibleApiErrorDialog(true)}
        />
      );
    }
    return null;
  };

  const handleBackButtonPress = () => {
    if (comingFrom !== 'Home') {
      navigation.goBack();
    } else {
      navigation.pop();
      navigation.navigate('Home');
    }
  };

  const listFooterComponent = () => {
    if (loadingMore) {
      return (
        <View style={styles.listFooterView}>
          <ActivityIndicator
            color={COLORS.MAIN}
            size="small"
            style={styles.loader}
          />
        </View>
      );
    }
    return <View />;
  };

  const renderProductsList = () => (
    <FlatList
      ref={flatListRef}
      data={list}
      refreshing={refreshingSearch}
      numColumns={2}
      contentContainerStyle={shopStyles.listContentContainer}
      keyExtractor={keyExtractor}
      extraData={loading}
      ListEmptyComponent={listEmptyComponent()}
      ListHeaderComponent={listHeaderComponent()}
      renderItem={renderProducts}
      onRefresh={onRefreshSearch}
      onEndReached={onEndReachedSearch}
      onEndReachedThreshold={0.5}
      windowSize={15}
      initialNumToRender={10}
      ListFooterComponent={listFooterComponent}
      keyboardDismissMode={'on-drag'}
      keyboardShouldPersistTaps={'handled'}
    />
  );

  const renderApiErrorDialog = () => (
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

  return (
    <ScreenWrapperComponent
      isLoading={isInitialLoading}
      headerTitle={
        comingFromHome ? APP_CONSTANTS.DEALS_HEADER : APP_CONSTANTS.SHOP_HEADER
      }
      onBackButtonPress={handleBackButtonPress}
      withBackButton
      showCartButton
      isScrollView={true}
      hasSpinner={true}
      containerStyle={{
        flex: 1,
        flexGrow: 1,
        backgroundColor: COLORS.WHITE,
        paddingBottom: 0,
      }}>
      <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
        {renderSearchJSX}
        <View style={{paddingTop: 10}}>{renderSaleFiltersJSX}</View>
        {renderProductsList()}
        {renderAddToListModal()}
        {renderApiErrorDialog()}
        <ToastComponent toastRef={myToast} />
      </SafeAreaView>
    </ScreenWrapperComponent>
  );
};

export default Products;
