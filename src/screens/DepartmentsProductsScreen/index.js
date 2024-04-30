import React, {useRef, useCallback, useState, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  SectionList,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import styles from './styles';
import ImageComponent from '../../components/ImageComponent';
import {SCREEN_WIDTH} from '../../constants/Common';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {APP_CONSTANTS} from '../../constants/Strings';
import useSearchProducts from '../../hooks/useSearchProducts';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {COLORS, FONTS, getFontSize, IMAGES} from '../../theme';
import {getFilterDepartmentsProducts} from '../../services/ApiCaller';
import NoDataComponent from '../../components/NoDataComponent';
import {navigateTo, navigationRef} from '../../utils/navigationUtils';
import {emitter} from '../../navigation/navigators/BottomTabsNavigator';
import {TAB_EVENTS} from '../../constants/Events';
import {logToConsole} from '../../configs/ReactotronConfig';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {departmentItemRWQuantityHandler} from '../../utils/productUtils';
import {FlashList} from '@shopify/flash-list';

const DepartmentsProducts = ({route, navigation}) => {
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(0);
  const sectionListRef = useRef();
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentsProducts, setDepartmentProducts] = useState([]);
  const [departmentProductsListing, setDepartmentProductsListing] = useState(
    [],
  );
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const useStoreNumberSelector = () =>
    useMemo(
      () => state => state.general?.loginInfo?.userInfo?.StoreNumber ?? '',
      [],
    );

  const useShowSnapEligibilitySelector = () =>
    useMemo(
      () => state =>
        state.general.loginInfo?.userInfo?.showSnapEligibility ?? false,
      [],
    );

  const StoreNumber = useSelector(useStoreNumberSelector());

  const cartItemsSelector = useMemo(
    () => state => state.general.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

  let {
    onSaleTag = false,
    search: searchText,
    comingFromHome = false,
    order = '',
    saleType = '',
    onSelectOrder = () => {},
    onSelectSaleType = () => {},
  } = route.params || {};
  const lastScrollRequest = useRef({});

  useEffect(() => {
    fetchDepartmentsProducts();
  }, [order, saleType, StoreNumber]);

  const {
    list,
    search,
    loading,
    loadingMore,
    onUpdateList,
    refreshingSearch,
    onRefreshSearch,
    onEndReachedSearch,
    onResetAll,
    renderSearchJSX,
    isSearchOrFilterApplied,
  } = useSearchProducts({
    listRef: flatListRef,
    isOnSale: comingFromHome,
    search: searchText,
    doFirstInitialSearch: true,
    isPartyEligible: false,
    isShopSection: !comingFromHome,
  });
  const goToDetailScreen = useCallback(
    (item, index) =>
      navigateTo('ProductDetails', {
        item,
        comingFrom: comingFromHome ?? 'SALE DETAILS',
        index,
        deptInfo: route?.params ?? {},
        entryPoint: onSaleTag
          ? MIX_PANEL_SCREENS.ON_SALE
          : MIX_PANEL_SCREENS.SHOP,
      }),
    [comingFromHome, onSaleTag, route?.params],
  );

  const onTabPress = useCallback(
    e => {
      const {name: currentScreen} =
        navigationRef?.current?.getCurrentRoute?.() ?? {};
      if (
        navigation.isFocused() &&
        currentScreen === 'DepartmentProductsScreen' &&
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

  const fetchDepartmentsProducts = async () => {
    setIsLoading(true);
    let params = {
      DISCOUNT_TYPE: 'sale',
      STORE_NUMBER: StoreNumber,
      ORDER: order,
    };
    let shopParams = {
      DISCOUNT_TYPE: saleType ? 'sale' : '',
      STORE_NUMBER: StoreNumber,
      ORDER: order,
    };
    const response = await getFilterDepartmentsProducts(
      comingFromHome ? params : shopParams,
    );
    logToConsole({response});
    const status = response?.response?.status ?? 0;
    if (status === 200) {
      const data = response?.response?.data || [];
      let modifiedData = [];
      for (const item of data) {
        let modifiedItem = await departmentItemRWQuantityHandler(
          item,
          cartItems,
        );
        modifiedData.push(modifiedItem);
      }
      setDepartmentProducts(modifiedData);
      setIsLoading(false);
    }
  };

  const allItemsObject = {
    title: 'All Items',
  };
  const formattedData = departmentsProducts.map(department => ({
    title: department.E_COMM_DEPT_NAME,
  }));
  formattedData.unshift(allItemsObject);

  const scrollToDepartment = departmentIndex => {
    setSelectedDepartmentIndex(departmentIndex);
    const params = {
      animated: true,
      sectionIndex: departmentIndex > 0 ? departmentIndex - 1 : departmentIndex,
      itemIndex: 0,
      viewPosition: 0,
    };
    lastScrollRequest.current = params;
    sectionListRef?.current?.scrollToLocation(params);
  };

  const onItemPress = useCallback((item, index) => {
    navigation.navigate('ProductDetails', {
      item,
      comingFrom: 'SALE DETAILS',
      entryPoint: MIX_PANEL_SCREENS.HOME,
      index,
    });
  }, []);

  const onPressViewAllHandler = deptId => {
    if (deptId === 'partytray') {
      navigation.navigate(comingFromHome ? 'OnSaleStack' : 'ShopStack', {
        screen: 'Products',
        initial: false,
        params: {
          screen: 'Drawer',
          params: {
            isPartyEligible: true,
            departmentName: 'Party Trays',
            onSaleTag: true,
            comingFromHome,
            subDepartmentName: 'Party Trays',
          },
        },
      });
    } else {
      navigation.navigate(comingFromHome ? 'OnSaleStack' : 'ShopStack', {
        screen: 'SubDepartmentsProducts',
        initial: false,
        params: {
          screen: 'Drawer',
          params: {
            deptId: deptId,
            comingFromHome,
          },
        },
      });
    }
  };

  const renderHorizontalItemList = department => {
    const renderItem = ({item, index}) => (
      <SaleItem
        key={item._id}
        item={item}
        containerStyle={{paddingBottom: hp('4%')}}
        onItemPress={() => onItemPress(item, index)}
        onUnitSelectionChange={({item: product}) =>
          changeSelectionOfUnitForProduct(product, index)
        }
      />
    );

    return (
      <TouchableOpacity activeOpacity={1}>
        <FlatList
          data={department?.items}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingEnd: 30,
          }}
          estimatedItemSize={350}
          windowSize={5}
        />
      </TouchableOpacity>
    );
  };

  const changeSelectionOfUnitForProduct = (item = {}, itemIndex = 0) => {
    setDepartmentProducts(prevDepartments => {
      const updatedDepartments = [...prevDepartments];
      const departmentIndex = updatedDepartments.findIndex(deptItem =>
        deptItem.items.some(subItem => subItem.SKU === item.SKU),
      );
      if (departmentIndex !== -1) {
        const subItemIndex = updatedDepartments[
          departmentIndex
        ].items.findIndex(subItem => subItem.SKU === item.SKU);

        if (subItemIndex !== -1) {
          updatedDepartments[departmentIndex].items[subItemIndex] = item;
        }
      }
      return updatedDepartments;
    });
  };

  // useEffect(() => {
  //   const offset = selectedDepartmentIndex * 130 - 150;
  //   scrollViewRef.current.scrollTo({x: offset, animated: true});
  // }, [selectedDepartmentIndex]);

  const renderListFooter = () => {
    if (isFetchingMore) {
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

  const renderDepartmentsNameList = () => {
    const updatedDepartmentProductsListing = departmentsProducts.map(
      department => ({
        title: department.E_COMM_DEPT_NAME,
      }),
    );
    updatedDepartmentProductsListing.unshift(allItemsObject);

    return (
      <FlatList
        data={updatedDepartmentProductsListing}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingEnd: wp('8%'),
          alignItems: 'center',
          paddingBottom: hp('2%'),
        }}
        style={styles.departmentNameList}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10}}
              activeOpacity={0.9}
              key={index}
              onPress={() => scrollToDepartment(index)}>
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.departmentsName,
                  textDecorationLine:
                    index !== selectedDepartmentIndex ? null : 'underline',
                  color:
                    index === selectedDepartmentIndex
                      ? COLORS.MAIN
                      : COLORS.ALASKA_GREY,
                  fontFamily:
                    index === selectedDepartmentIndex
                      ? FONTS.BOLD
                      : FONTS.REGULAR,
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  // useEffect(() => {
  //   const newDepartments = departmentsProducts.slice(0, lastLoadedIndex);
  //   setDepartmentProductsListing(newDepartments);
  // }, [lastLoadedIndex, departmentsProducts]);

  const handlePress = () => {
    onSelectOrder('');
  };
  const handleSaleCrossTap = () => {
    onSelectSaleType('');
  };

  const renderFilter = () => {
    const orderFilterValue =
      order === 'desc'
        ? 'High to Low'
        : order === 'asc'
        ? 'Low to High'
        : order;
    const orderSaleFilterValue = saleType === 'SALE_PRICE' ? 'On Sale' : '';

    return (
      <TouchableOpacity
        style={{
          marginStart: wp('6%'),
          marginVertical: hp('2%'),
          justifyContent: 'center',
        }}
        onPress={() => navigation.openDrawer()}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <ImageComponent
              source={IMAGES.FILTER}
              style={{height: 20, width: 15}}
              resizeMode={'contain'}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: FONTS.SEMI_BOLD,
                fontSize: getFontSize(15),
                lineHeight: 20,
                letterSpacing: -0.23,
                color: COLORS.BLACK,
                marginLeft: 10,
              }}>
              Filter
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              marginHorizontal: 15,
            }}>
            <AppliedFilter value={orderFilterValue} onPress={handlePress} />
            {!comingFromHome ? (
              <AppliedFilter
                value={orderSaleFilterValue}
                onPress={handleSaleCrossTap}
              />
            ) : null}
          </ScrollView>
        </View>
      </TouchableOpacity>
    );
  };

  const AppliedFilter = ({value, onPress}) => {
    if (value) {
      return (
        <View style={styles.filtersContainer}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.filter}>
            {value}
          </Text>
          <Pressable activeOpacity={0.9} onPress={onPress} hitSlop={10}>
            <ImageComponent
              source={IMAGES.CLOSE_MAIN}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
      );
    }
    return null;
  };

  const renderProductDetail = () => {
    return (
      <View style={{flex: 1}}>
        {!isLoading && renderDepartmentsNameList()}
        <SectionList
          stickyHeaderHiddenOnScroll
          stickySectionHeadersEnabled={false}
          ref={sectionListRef}
          contentContainerStyle={{paddingBottom: 30}}
          // windowSize={3}
          sections={departmentsProducts.map(department => ({
            title: department.E_COMM_DEPT_NAME,
            id: department.DEPT_ID[0],
            data: [department],
          }))}
          renderSectionHeader={({section}) => (
            <TouchableOpacity activeOpacity={1} style={styles.headerwrapper}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.sectionHeaderStyle}>
                {section.title}
              </Text>

              <TouchableOpacity
                onPress={() => onPressViewAllHandler(section.id)}>
                <Text allowFontScaling={false} style={styles.viewAll}>
                  View All
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item._id + index}
          renderItem={({item, index}) => renderHorizontalItemList(item, index)}
          onScrollToIndexFailed={info => {
            logToConsole({Error: info});
            const offset = comingFromHome ? 295 * 9 : 295 * 11;
            sectionListRef.current
              ?.getScrollResponder()
              ?.scrollTo({x: 0, y: offset, animated: true});
            logToConsole({lastScrollRequest: lastScrollRequest.current});
            setTimeout(() => {
              sectionListRef.current?.scrollToLocation(
                lastScrollRequest.current,
              );
            }, 100);
          }}
        />
      </View>
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
  const renderSearchHeader = () => {
    return (
      <>
        {search ? (
          <Text allowFontScaling={false} style={styles.searchtext}>
            Search Results for "{search}"
          </Text>
        ) : null}
      </>
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
            onEndReachedThreshold={0.01}
            windowSize={10}
            maxToRenderPerBatch={7}
            renderItem={renderProductItem}
            ListHeaderComponent={renderSearchHeader}
            ListFooterComponent={renderListFooterComponent}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
          />
        );
      }
    }
  };
  const getItemKeys = useCallback(item => item._id, []);
  const changeSelectionOfUnit = useCallback(
    (item = {}, itemIndex = 0) => {
      list[itemIndex] = item;
      onUpdateList([...list]);
    },
    [list, onUpdateList],
  );
  const getProductItemLayout = useCallback(
    (data, index) => ({
      length: 295,
      offset: 295 * index,
      index,
    }),
    [],
  );

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

  return (
    <ScreenWrapperComponent
      headerTitle={
        comingFromHome ? APP_CONSTANTS.DEALS_HEADER : APP_CONSTANTS.SHOP_HEADER
      }
      showCartButton
      isScrollView={true}
      containerStyle={styles.screenWrapper}
      hasSpinner={true}
      isLoading={isLoading}>
      <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
        {renderSearchJSX}
        {renderFilter()}
        {!search && renderProductDetail()}
        {search && renderProducts()}
      </SafeAreaView>
    </ScreenWrapperComponent>
  );
};

export default DepartmentsProducts;
