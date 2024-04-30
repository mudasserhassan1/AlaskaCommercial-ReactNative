// import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   ActivityIndicator,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import {useSelector} from 'react-redux';
// import styles from './styles';
// import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
// import {APP_CONSTANTS} from '../../constants/Strings';
// import useSearchProducts from '../../hooks/useSearchProducts';
// import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
// import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
// import useProductItem from '../../hooks/useProductItem';
// import NoDataComponent from '../../components/NoDataComponent';
// import {COLORS} from '../../theme';
// import {getAllPopularItems} from '../../services/ApiCaller';
// import {logToConsole} from '../../configs/ReactotronConfig';
// import {STATUSES} from '../../constants/Api';
// import {SCREEN_WIDTH} from '../../constants/Common';
// import {itemRWQuantityHandler} from '../../utils/productUtils';
// import {FlashList} from '@shopify/flash-list';
//
// const PopularItems = ({route}) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const flatListRef = useRef(null);
//   const [popularItemsList, setPopularItemsList] = useState([]);
//   const hasMore = useRef(true);
//   // const {StoreNumber} = useSelector(
//   //   ({general: {loginInfo: {userInfo: {StoreNumber = ''} = {}} = {}}}) => ({
//   //     StoreNumber,
//   //   }),
//   // );
//
//   const useStoreNumberSelector = () =>
//     useMemo(
//       () => state => state.general?.loginInfo?.userInfo?.StoreNumber ?? '',
//       [],
//     );
//
//   const StoreNumber = useSelector(useStoreNumberSelector());
//
//   const {onSaleTag = false, search: searchText} = route.params || {};
//
//   const {
//     list,
//     search,
//     loading,
//     loadingMore,
//     onUpdateList,
//     refreshingSearch,
//     onRefreshSearch,
//     onEndReachedSearch,
//     onClearFilters,
//     onResetAll,
//     renderSearchJSX,
//     renderHeaderJSX,
//     renderShopFiltersJSX,
//   } = useSearchProducts({
//     isOnSale: onSaleTag,
//     allowEmptySearch: false,
//     search: searchText,
//     doFirstInitialSearch: !!searchText,
//   });
//   const {goToDetailScreen} = useProductItem({
//     list,
//     onSetList: onUpdateList,
//     entryPoint: onSaleTag ? MIX_PANEL_SCREENS.ON_SALE : MIX_PANEL_SCREENS.SHOP,
//   });
//
//   useEffect(() => {
//     getAllPopularItemsInYourArea();
//   }, []);
//
//   const getAllPopularItemsInYourArea = async () => {
//     if (isLoading || !hasMore.current) {
//       return;
//     }
//     setIsLoading(true);
//     const {response = {}} = await getAllPopularItems({
//       store: StoreNumber,
//       page: page,
//     });
//     const {
//       ok = false,
//       status = 0,
//       data: {response: popularItemsInYourArea = []} = {},
//     } = response ?? {};
//     let modifiedPopularItems = [];
//     for (const result of popularItemsInYourArea) {
//       const modifiedItem = await itemRWQuantityHandler(result);
//       modifiedPopularItems.push(modifiedItem);
//     }
//     if (ok && status === STATUSES.OK && modifiedPopularItems.length > 0) {
//       setPopularItemsList(prevItems => [...prevItems, ...modifiedPopularItems]);
//       setPage(prevPage => prevPage + 1);
//     } else {
//       hasMore.current = false;
//     }
//     setIsLoading(false);
//   };
//
//   const onEndReached = () => {
//     if (!isLoading && hasMore.current) {
//       getAllPopularItemsInYourArea();
//     }
//   };
//
//   const onRefresh = () => {
//     setPage(1);
//     setPopularItemsList([]);
//     hasMore.current = true;
//   };
//
//   const getItemKeys = item => item._id;
//   const changeSelectionOfUnitForProduct = (item = {}, itemIndex = 0) => {
//     popularItemsList[itemIndex] = item;
//     setPopularItemsList([...popularItemsList]);
//   };
//   const changeSelectionOfUnit = (item = {}, itemIndex = 0) => {
//     list[itemIndex] = item;
//     onUpdateList([...list]);
//   };
//   const renderItemList = ({item, index}) => {
//     const isEven = (index + 1) % 2 === 0;
//     return (
//       <SaleItem
//         item={item}
//         containerStyle={{marginHorizontal: 0}}
//         contentWrapperStyle={{
//           width: SCREEN_WIDTH / 2,
//           alignItems: 'center',
//           paddingStart: !isEven ? 22 : 0,
//           paddingEnd: !isEven ? 0 : 22,
//         }}
//         onUnitSelectionChange={({item: product}) =>
//           changeSelectionOfUnitForProduct(product, index)
//         }
//         onItemPress={() => goToDetailScreen(item, index)}
//       />
//     );
//   };
//
//   const renderHeader = () => {
//     return (
//       <View style={styles.headerwrapper}>
//         <Text style={styles.headertext}>Popular Items In Your Area</Text>
//       </View>
//     );
//   };
//
//   const listEmptyComponent = () => (!isLoading ? <NoDataComponent /> : null);
//
//   const renderListFooterComponent = () =>
//     isLoading ? (
//       <View style={styles.listFooterView}>
//         <ActivityIndicator color={COLORS.MAIN} size="small" />
//       </View>
//     ) : (
//       <View />
//     );
//
//   const renderProductList = () => {
//     return !search ? renderProductDetail() : null;
//   };
//
//   const renderProductDetail = () => {
//     if (!isLoading && popularItemsList && !popularItemsList?.length > 0) {
//       return <NoDataComponent />;
//     } else {
//       return (
//         <FlatList
//           data={popularItemsList}
//           numColumns={2}
//           contentContainerStyle={styles.listContainer}
//           keyExtractor={getItemKeys}
//           onEndReached={onEndReached}
//           onEndReachedThreshold={0.01}
//           renderItem={renderItemList}
//           ListHeaderComponent={renderHeader}
//           ListFooterComponent={renderListFooterComponent}
//         />
//       );
//     }
//   };
//
//   const getProductItemLayout = useCallback(
//     (data, index) => ({
//       length: 295,
//       offset: 295 * index,
//       index,
//     }),
//     [],
//   );
//
//   const renderListHeader = () => {
//     return (
//       <>
//         {search ? (
//           <Text style={styles.searchtext}>Search Results for "{search}"</Text>
//         ) : null}
//         {renderHeaderJSX}
//         {search && list?.length ? renderShopFiltersJSX : null}
//       </>
//     );
//   };
//
//   const renderProductItem = ({item, index}) => {
//     const isEven = (index + 1) % 2 === 0;
//     return (
//       <SaleItem
//         contentWrapperStyle={{
//           width: SCREEN_WIDTH / 2,
//           alignItems: 'center',
//           paddingStart: !isEven ? 22 : 0,
//           paddingEnd: !isEven ? 0 : 22,
//         }}
//         onUnitSelectionChange={({item: product}) =>
//           changeSelectionOfUnit(product, index)
//         }
//         item={item}
//         onItemPress={goToDetailScreen}
//         forItemId={item?._id}
//       />
//     );
//   };
//
//   logToConsole({list})
//   const renderProducts = () => {
//     if (search) {
//       if (
//         !loading &&
//         search &&
//         search?.length > 0 &&
//         list &&
//         !list?.length > 0
//       ) {
//         return <NoDataComponent />;
//       } else {
//         return (
//           <FlatList
//             refreshing={refreshingSearch}
//             ref={flatListRef}
//             data={list}
//             numColumns={2}
//             contentContainerStyle={styles.listContainer}
//             keyExtractor={getItemKeys}
//             getItemLayout={getProductItemLayout}
//             onRefresh={onRefreshSearch}
//             onEndReached={onEndReachedSearch}
//             onEndReachedThreshold={0.01}
//             windowSize={10}
//             maxToRenderPerBatch={8}
//             renderItem={renderProductItem}
//             ListHeaderComponent={renderListHeader()}
//             ListFooterComponent={renderListFooterComponent}
//             keyboardDismissMode={'on-drag'}
//             keyboardShouldPersistTaps={'handled'}
//           />
//         );
//       }
//     }
//   };
//
//   return (
//     <ScreenWrapperComponent
//       isLoading={isLoading}
//       headerTitle={APP_CONSTANTS.SHOP_HEADER}
//       showCartButton
//       withBackButton
//       isScrollView={false}
//       containerStyle={{flex: 1}}
//       hasSpinner={false}>
//       <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
//         {renderSearchJSX}
//         {renderProductList()}
//         {renderProducts()}
//       </SafeAreaView>
//     </ScreenWrapperComponent>
//   );
// };
//
// export default PopularItems;

import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import styles from './styles';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {APP_CONSTANTS} from '../../constants/Strings';
import useSearchProducts from '../../hooks/useSearchProducts';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import useProductItem from '../../hooks/useProductItem';
import NoDataComponent from '../../components/NoDataComponent';
import {COLORS} from '../../theme';
import {getAllPopularItems} from '../../services/ApiCaller';
import {STATUSES} from '../../constants/Api';
import {SCREEN_WIDTH} from '../../constants/Common';
import {itemRWQuantityHandler} from '../../utils/productUtils';

const PopularItems = ({route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const flatListRef = useRef(null);
  const [popularItemsList, setPopularItemsList] = useState([]);
  const hasMore = useRef(true);
  const {StoreNumber} = useSelector(
    ({general: {loginInfo: {userInfo: {StoreNumber = ''} = {}} = {}}}) => ({
      StoreNumber,
    }),
  );
  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

  // logToConsole({cartItems})

  const {onSaleTag = false, search: searchText} = route.params || {};

  const {
    list,
    search,
    loading,
    loadingMore,
    onUpdateList,
    refreshingSearch,
    onRefreshSearch,
    onEndReachedSearch,
    onClearFilters,
    onResetAll,
    renderSearchJSX,
    renderHeaderJSX,
    renderShopFiltersJSX,
  } = useSearchProducts({
    isOnSale: onSaleTag,
    allowEmptySearch: false,
    search: searchText,
    doFirstInitialSearch: !!searchText,
  });
  const {goToDetailScreen} = useProductItem({
    list,
    onSetList: onUpdateList,
    entryPoint: onSaleTag ? MIX_PANEL_SCREENS.ON_SALE : MIX_PANEL_SCREENS.SHOP,
  });

  useEffect(() => {
    getAllPopularItemsInYourArea();
  }, []);

  const getAllPopularItemsInYourArea = async () => {
    if (isLoading || !hasMore.current) {
      return;
    }
    setIsLoading(true);
    const {response = {}} = await getAllPopularItems({
      store: StoreNumber,
      page: page,
    });
    const {
      ok = false,
      status = 0,
      data: {response: popularItemsInYourArea = []} = {},
    } = response ?? {};
    let modifiedPopularItems = [];
    for (const result of popularItemsInYourArea) {
      let modifiedItem = await itemRWQuantityHandler(result);
      modifiedItem = unitInCart(modifiedItem);
      modifiedPopularItems.push(modifiedItem);
    }
    if (ok && status === STATUSES.OK && modifiedPopularItems.length > 0) {
      setPopularItemsList(prevItems => [...prevItems, ...modifiedPopularItems]);
      setPage(prevPage => prevPage + 1);
    } else {
      hasMore.current = false;
    }
    setIsLoading(false);
  };

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

  const onEndReached = () => {
    if (!isLoading && hasMore.current) {
      getAllPopularItemsInYourArea();
    }
  };

  const onRefresh = () => {
    setPage(1);
    setPopularItemsList([]);
    hasMore.current = true;
  };

  const getItemKeys = item => item._id;
  const changeSelectionOfUnitForProduct = (item = {}, itemIndex = 0) => {
    popularItemsList[itemIndex] = item;
    setPopularItemsList([...popularItemsList]);
  };
  const changeSelectionOfUnit = (item = {}, itemIndex = 0) => {
    list[itemIndex] = item;
    onUpdateList([...list]);
  };

  const SaleItemFromHome = true;

  const renderItemList = ({item, index}) => {
    const isEven = (index + 1) % 2 === 0;
    return (
      <SaleItem
        item={item}
        saleItemFromHome={SaleItemFromHome}
        containerStyle={{marginHorizontal: 0}}
        contentWrapperStyle={{
          width: SCREEN_WIDTH / 2,
          alignItems: 'center',
          paddingStart: !isEven ? 22 : 0,
          paddingEnd: !isEven ? 0 : 22,
        }}
        onUnitSelectionChange={({item: product}) =>
          changeSelectionOfUnitForProduct(product, index)
        }
        onItemPress={() => goToDetailScreen(item, index)}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerwrapper}>
        <Text allowFontScaling={false}  style={styles.headertext}>Popular Items In Your Area</Text>
      </View>
    );
  };

  const listEmptyComponent = () => (!isLoading ? <NoDataComponent /> : null);

  const renderListFooterComponent = () =>
    isLoading ? (
      <View style={styles.listFooterView}>
        <ActivityIndicator color={COLORS.MAIN} size="small" />
      </View>
    ) : (
      <View />
    );

  const renderProductList = () => {
    return !search ? renderProductDetail() : null;
  };

  const renderProductDetail = () => (
    // <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
    <FlatList
      data={popularItemsList}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      keyExtractor={getItemKeys}
      // columnWrapperStyle={{marginHorizontal: 30}}
      // onRefresh={onRefresh}
      // refreshing={isLoading}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.01}
      renderItem={renderItemList}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={listEmptyComponent}
      ListFooterComponent={renderListFooterComponent}
    />
    // </TouchableOpacity>
  );

  const getProductItemLayout = useCallback(
    (data, index) => ({
      length: 160,
      offset: 160 * index,
      index,
    }),
    [],
  );

  const renderListHeader = () => {
    return (
      <>
        {search ? (
          <Text allowFontScaling={false} style={styles.searchtext}>Search Results for "{search}"</Text>
        ) : null}
        {renderHeaderJSX}
        {search && list?.length ? renderShopFiltersJSX : null}
      </>
    );
  };

  const renderProductItem = ({item, index}) => {
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

  const renderProducts = () => {
    if (search) {
      return (
        <FlatList
          refreshing={refreshingSearch}
          ref={flatListRef}
          data={list}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          keyExtractor={getItemKeys}
          getItemLayout={getProductItemLayout}
          onRefresh={onRefreshSearch}
          onEndReached={onEndReachedSearch}
          onEndReachedThreshold={0.01}
          windowSize={10}
          maxToRenderPerBatch={7}
          renderItem={renderProductItem}
          ListHeaderComponent={renderListHeader()}
          ListEmptyComponent={listEmptyComponent()}
          ListFooterComponent={renderListFooterComponent}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'handled'}
        />
      );
    }
  };

  return (
    <ScreenWrapperComponent
      isLoading={isLoading}
      headerTitle={APP_CONSTANTS.SHOP_HEADER}
      showCartButton
      withBackButton
      isScrollView={false}
      containerStyle={{flex: 1}}
      hasSpinner={false}>
      <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
        {renderSearchJSX}
        {renderProductList()}
        {renderProducts()}
      </SafeAreaView>
    </ScreenWrapperComponent>
  );
};

export default PopularItems;
