import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {useSelector} from 'react-redux';
import {APP_CONSTANTS} from '../../constants/Strings';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import useSearchProducts from '../../hooks/useSearchProducts';
import shopStyles from '../Products/styles';
import {useNavigation} from '@react-navigation/native';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import useProductItem from '../../hooks/useProductItem';
import NoDataComponent from '../../components/NoDataComponent';
import {COLORS} from '../../theme';
import {logToConsole} from '../../configs/ReactotronConfig';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {SCREEN_WIDTH} from '../../constants/Common';
import {FlashList} from '@shopify/flash-list';

const SubDepartmentScreen = ({route}) => {
  const {
    departmentName,
    isPartyEligible,
    departmentsId,
    comingFromHome = false,
  } = route.params || {};
  // const {subDepartments = []} = useSelector(({config}) => config);
  const useSubDepartmentsSelector = () =>
    useMemo(() => state => state.config.subDepartments ?? [], []);
  const subDepartments = useSelector(useSubDepartmentsSelector());
  const flatListRef = useRef(null);
  const navigation = useNavigation();

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

  let {onSaleTag = false, search: searchText} = route.params || {};
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
  useEffect(() => {
    navigation.setParams({search});
  }, [navigation, search]);
  const renderTitle = () => {
    return (
      <View style={styles.wrapper}>
        <Text
            allowFontScaling={false}
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={styles.featureText}>
          {departmentName}
        </Text>
        <TouchableOpacity onPress={() => onPressViewAllHandler(departmentsId)}>
          <Text allowFontScaling={false} style={styles.changeText}>{APP_CONSTANTS.VIEW_ALL}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onPressViewAllHandler = deptId => {
    navigation.navigate('ShopStack', {
      screen: 'SubDepartmentsProducts',
      initial: false,
      params: {
        screen: 'Drawer',
        params: {
          deptId: deptId,
        },
      },
    });
  };

  const goToProductScreen = (subDepartmentId, subDepartmentName) => {
    navigation.navigate('ShopStack', {
      screen: 'Products',
      params: {
        screen: 'Drawer',
        params: {
          isPartyEligible,
          departmentName,
          departmentsId,
          subDepartmentId,
          subDepartmentName,
          onSaleTag,
        },
      },
    });
  };
  const renderComponentForEmptyList = () => {
    if (!subDepartments?.length) {
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

  const renderSubDepartments = () => {
    return !search ? renderSubDepartmentsJSX() : null;
  };

  const renderSubDepartmentsJSX = () => {
    return (
      <View style={{flex: 1, backgroundColor: COLORS.WHITE, height: '100%'}}>
        <ScrollView style={{flex: 1}}>
          {subDepartments?.map((subDepartment, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                goToProductScreen(
                  subDepartment?.CLASS,
                  subDepartment?.E_COMM_CLASS_NAME,
                )
              }
              style={styles.header}
              key={subDepartment._id}>
              <View style={styles.subdepartmentView}>
                <Text allowFontScaling={false} style={styles.headerText}>
                  {subDepartment?.E_COMM_CLASS_NAME}
                </Text>
              </View>
              {index !== subDepartments?.length - 1 && (
                <View style={styles.separator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  const getProductItemLayout = useCallback(
    (data, index) => ({
      length: 295,
      offset: 295 * index,
      index,
    }),
    [],
  );

  const getItemKeys = useCallback(item => item._id, []);

  const changeSelectionOfUnit = useCallback(
    (item = {}, itemIndex = 0) => {
      list[itemIndex] = item;
      onUpdateList([...list]);
    },
    [list, onUpdateList],
  );

  const renderProductItem = ({item, index}) => {
    const isEven = (index + 1) % 2 === 0;
    return (
      // <ProductCard
      //   item={item}
      //   index={index}
      //   onItemPress={() => goToDetailScreen(item, index)}
      //   onListIconPress={onSelectItem}
      //   onPlusPress={handleQuantityChange}
      //   onMinusPress={handleQuantityChange}
      //   showCartConfirmation={onDisplayMessage}
      //   entryPoint={
      //     onSaleTag ? MIX_PANEL_SCREENS.ON_SALE : MIX_PANEL_SCREENS.SHOP
      //   }
      //   onUnitSelectionChange={({item: product}) =>
      //     changeSelectionOfUnit(product, index)
      //   }
      //   containerStyle={styles.productItem}
      // />
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

  const renderListHeader = () => {
    return (
      <>
        {search ? (
          <Text allowFontScaling={false} style={styles.searchtext}>Search Results for "{search}"</Text>
        ) : null}
        {/*<ZipCodeInfoComponent />*/}
        {renderHeaderJSX}
        {search && list?.length ? renderShopFiltersJSX : null}
      </>
    );
  };

  const listEmptyComponent = () => {
    if (!loading) {
      return <NoDataComponent />;
    }
    return null;
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
          <FlashList
            refreshing={refreshingSearch}
            ref={flatListRef}
            data={list}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            keyExtractor={getItemKeys}
            // getItemLayout={getProductItemLayout}
            onRefresh={onRefreshSearch}
            onEndReached={onEndReachedSearch}
            onEndReachedThreshold={0.01}
            windowSize={10}
            maxToRenderPerBatch={7}
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

  return (
    <ScreenWrapperComponent
      headerTitle={
        comingFromHome ? APP_CONSTANTS.DEALS_HEADER : APP_CONSTANTS.SHOP_HEADER
      }
      showCartButton
      withBackButton
      isScrollView={false}
      containerStyle={styles.screenWrapper}
      hasSpinner={false}>
      <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
        {renderSearchJSX}
        {!search && renderTitle()}
        {renderSubDepartments()}
        {renderComponentForEmptyList()}
        {renderProducts()}
        {renderDialogs}
      </SafeAreaView>
    </ScreenWrapperComponent>
  );
};
export default SubDepartmentScreen;
