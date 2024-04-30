import React, {useCallback, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import {COLORS} from '../../theme';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import useSearchProducts from '../../hooks/useSearchProducts';
import NoDataComponent from '../../components/NoDataComponent';
import useProductItem from '../../hooks/useProductItem';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {useNavigation} from '@react-navigation/native';
import useDepartmentsHook from '../../components/useDepartmentsHook';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {emitter} from '../../navigation/navigators/BottomTabsNavigator';
import {TAB_EVENTS} from '../../constants/Events';
import {navigationRef} from '../../utils/navigationUtils';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';
import {logToConsole} from '../../configs/ReactotronConfig';
import {FlashList} from '@shopify/flash-list';

const DepartmentsScreen = ({route}) => {
  const flatListRef = useRef(null);

  const navigation = useNavigation();

  let {
    index: indexOfClickedDepartment = -1,
    onSaleTag = false,
    search: searchText,
  } = route.params || {};

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
    listRef: flatListRef,
    isOnSale: onSaleTag,
    allowEmptySearch: false,
    search: searchText,
    doFirstInitialSearch: !!searchText,
  });

  const {
    renderDialogs,
    handleQuantityChange,
    goToDetailScreen,
    onDisplayMessage,
    onSelectItem,
  } = useProductItem({
    list,
    onSetList: onUpdateList,
    entryPoint: onSaleTag ? MIX_PANEL_SCREENS.ON_SALE : MIX_PANEL_SCREENS.SHOP,
  });

  useEffect(() => {
    if (!search) {
      onClearFilters();
    }
  }, [search]);

  const onTabPress = useCallback(
    e => {
      const {name: currentScreen} =
        navigationRef?.current?.getCurrentRoute?.() ?? {};
      if (navigation.isFocused() && currentScreen === 'Departments') {
        onResetAll(false);
      }
    },
    [navigation],
  );

  useEffect(() => {
    emitter.on(TAB_EVENTS.TAB_PRESS_SHOP, onTabPress);
    return () => {
      emitter.off(TAB_EVENTS.TAB_PRESS_SHOP, onTabPress);
    };
  }, [onTabPress]);

  useEffect(() => {
    navigation.setParams({search});
  }, [navigation, search]);

  const goToShopItems = ({
    subDepartmentId = '',
    subDepartmentName = '',
    departmentId = '',
    departmentName = '',
    isPartyEligible,
  } = {}) => {
    navigation.navigate('ShopStack', {
      screen: 'Products',
      initial: false,
      params: {
        screen: 'Drawer',
        params: {
          isPartyEligible,
          departmentName,
          departmentId,
          subDepartmentId,
          subDepartmentName,
          onSaleTag,
        },
      },
    });
  };

  const getProductItemLayout = useCallback(
    (data, index) => ({
      length: Platform.OS === 'ios' ? 295 : 276,
      offset: Platform.OS === 'ios' ? 295 * index : 276 * index,
      index,
    }),
    [],
  );

  const getItemKeys = useCallback(item => item.SKU, []);

  const changeSelectionOfUnit = useCallback(
    (item = {}, itemIndex = 0) => {
      list[itemIndex] = item;
      onUpdateList([...list]);
    },
    [list, onUpdateList],
  );

  const renderListHeader = () => {
    return (
      <>
        {/*<ZipCodeInfoComponent />*/}
        {search ? (
          <Text allowFontScaling={false} style={styles.searchtext}>Search Results for "{search}"</Text>
        ) : null}
        {renderHeaderJSX}
        {search && list?.length ? renderShopFiltersJSX : null}
      </>
    );
  };

  const renderListFooterComponent = () => {
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
      if (
        !loading &&
        search &&
        search?.length > 0 &&
        list &&
        !list?.length > 0
      ) {
        return <NoDataComponent />;
      } else {
        return (
          <FlatList
            refreshing={refreshingSearch}
            ref={flatListRef}
            data={list}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            keyExtractor={getItemKeys}
            // getItemLayout={getProductItemLayout}
            onRefresh={onRefreshSearch}
            onEndReached={onEndReachedSearch}
            onEndReachedThreshold={0.1}
            windowSize={10}
            maxToRenderPerBatch={8}
            renderItem={renderProductItem}
            ListHeaderComponent={renderListHeader()}
            ListFooterComponent={renderListFooterComponent}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
          />
        );
      }
    }
  };

  const {renderDepartmentsJSX, isLoading} = useDepartmentsHook({
    indexOfClickedDepartment,
    listHeaderComponent: renderListHeader,
    onSaleTag,
    // onSelectSubDepartment: goToShopItems,
    filter: false,
  });

  const renderDepartments = () => {
    return !search ? renderDepartmentsJSX : null;
  };
  const renderTitle = () => {
    return (
      <View style={styles.wrapper}>
        <Text allowFontScaling={false} style={styles.featureText}>{APP_CONSTANTS.CATEGORIES}</Text>
        <Pressable
          hitSlop={20}
          onPress={() =>
            navigation.navigate('DepartmentsProductsScreen', {
              comingFromHome: false,
            })
          }>
          <Text allowFontScaling={false} style={styles.changeText}>{APP_CONSTANTS.VIEW_ALL}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenWrapperComponent
      headerTitle={
        onSaleTag ? APP_CONSTANTS.SALE_HEADER : APP_CONSTANTS.SHOP_HEADER
      }
      showCartButton
      isScrollView={true}
      containerStyle={styles.screenWrapper}
      hasSpinner={true}
      isLoading={isLoading}>
      <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
        {renderSearchJSX}
        {!search && renderTitle()}
        {renderDepartments()}
        {renderProducts()}
        {renderDialogs}
      </SafeAreaView>
    </ScreenWrapperComponent>
  );
};

export default DepartmentsScreen;
