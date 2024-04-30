import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SectionList,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import styles from './styles';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {APP_CONSTANTS} from '../../constants/Strings';
import useSearchProducts from '../../hooks/useSearchProducts';
import SaleItem from '../../components/SaleItemsAutoPlay/SaleItem';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {getSubDepartmentsProducts} from '../../services/ApiCaller';
import useProductItem from '../../hooks/useProductItem';
import NoDataComponent from '../../components/NoDataComponent';
import {COLORS, FONTS, getFontSize, IMAGES} from '../../theme';
import {logToConsole} from '../../configs/ReactotronConfig';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';
import DepartmentProductCard from '../../components/SaleItemsAutoPlay/DepartmentProductCard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImageComponent from '../../components/ImageComponent';
import {departmentItemRWQuantityHandler} from '../../utils/productUtils';
import {log} from '@react-native-firebase/crashlytics/lib/modular';
import {FlashList} from '@shopify/flash-list';

const SubDepartmentsProducts = ({route, navigation}) => {
  const {
    deptId = 0,
    comingFromHome = false,
    order,
    saleType,
    onSelectOrder = () => {},
    onSelectSaleType = () => {},
  } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const [subDepartmentProductsListing, setSubDepartmentProductsListing] =
    useState([]);

  const [departmentInfo, setDepartmentInfo] = useState({});

  const useStoreNumberSelector = () =>
    useMemo(() => state => state.general.loginInfo.userInfo?.StoreNumber, []);

  const StoreNumber = useSelector(useStoreNumberSelector());

  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

  const fetchSubDepartmentsProducts = async () => {
    setIsLoading(true);
    let params = {
      DISCOUNT_TYPE: 'sale',
      STORE_NUMBER: StoreNumber,
      DEPT_ID: deptId,
      ORDER: order,
    };
    const {response = {}} = comingFromHome
      ? await getSubDepartmentsProducts(params)
      : await getSubDepartmentsProducts({
          DEPT_ID: deptId,
          DISCOUNT_TYPE: saleType ? 'sale' : '',
          STORE_NUMBER: StoreNumber,
          ORDER: order,
        });
    const {ok = false, status = 0} = response ?? {};
    if (ok && status === 200) {
      const data = (response || {}).data?.subDepartments || [];
      const departmentData = (response || {}).data?.department || {};
      setDepartmentInfo(departmentData);
      let modifiedData = [];
      for (const item of data) {
        let modifiedItem = await departmentItemRWQuantityHandler(
          item,
          cartItems,
        );
        modifiedData.push(modifiedItem);
      }
      setSubDepartmentProductsListing(modifiedData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubDepartmentsProducts();
  }, [order, saleType, deptId]);

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
    renderSearchJSX,
    renderHeaderJSX,
    renderShopFiltersJSX,
  } = useSearchProducts({
    isOnSale: comingFromHome,
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
    if (!search) {
      onClearFilters();
    }
  }, [search]);

  const getItemKeys = useCallback(item => item._id, []);
  const getProductItemLayout = useCallback(
    (data, index) => ({
      length: 295,
      offset: 295 * index,
      index,
    }),
    [],
  );

  const goToProductScreen = (subDepartmentId, subDepartmentName) => {
    navigation.navigate(comingFromHome ? 'OnSaleStack' : 'ShopStack', {
      screen: 'Products',
      params: {
        screen: 'Drawer',
        params: {
          departmentName: departmentInfo?.E_COMM_DEPT_NAME,
          departmentId: departmentInfo.DEPT_ID?.[0],
          subDepartmentId,
          subDepartmentName,
          onSaleTag: comingFromHome,
          isPartyEligible: false,
          comingFromHome,
        },
      },
    });
  };

  const onItemPress = useCallback(
    (item, index) => {
      navigation.navigate('ProductDetails', {
        item,
        comingFrom: 'SALE DETAILS',
        entryPoint: MIX_PANEL_SCREENS.HOME,
        index,
      });
    },
    [navigation],
  );

  const renderHorizontalItemList = department => {
    return (
      <TouchableOpacity activeOpacity={1} key={department._id}>
        <ScrollView
          style={styles.productdetailheader}
          contentContainerStyle={{paddingEnd: 20}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {department.items.map((item, itemIndex) => (
            <DepartmentProductCard
              key={`${item._id}-${itemIndex}`}
              item={item}
              onItemPress={() => onItemPress(item, itemIndex)}
              onUnitSelectionChange={({item: product}) =>
                changeSelectionOfUnitForProduct(product, itemIndex)
              }
            />
          ))}
        </ScrollView>
      </TouchableOpacity>
    );
  };
  const changeSelectionOfUnitForProduct = (item = {}, itemIndex = 0) => {
    setSubDepartmentProductsListing(prevDepartments => {
      const updatedDepartments = [...prevDepartments];
      updatedDepartments.forEach(deptItem => {
        if (deptItem.items && deptItem.items.length > itemIndex) {
          deptItem.items = [...deptItem.items];
          if (deptItem.items[itemIndex].SKU === item.SKU) {
            deptItem.items[itemIndex] = item;
          }
        }
      });
      return updatedDepartments;
    });
  };

  const handlePress = () => {
    onSelectOrder('');
  };
  const handleSaleCrossTap = () => {
    onSelectSaleType('');
  };
  const renderSubDeptListHeader = () => {
    const orderFilterValue =
      order === 'desc'
        ? 'High to Low'
        : order === 'asc'
        ? 'Low to High'
        : order;
    const orderSaleFilterValue = saleType === 'SALE_PRICE' ? 'On Sale' : '';
    return (
      <>
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
        {/*<Text style={styles.departmentNameWrapper}>*/}
        {/*  {departmentInfo?.E_COMM_DEPT_NAME}*/}
        {/*</Text>*/}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <Text allowFontScaling={false} style={styles.departmentNameWrapper}>
          {departmentInfo?.E_COMM_DEPT_NAME}
        </Text>
      </>
    );
  };

  const AppliedFilter = ({value, onPress}) => {
    if (value) {
      return (
        <View style={styles.filtersContainer}>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.filter}>
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
      <View style={{flex: 1, flexGrow: 1}}>
        <SectionList
          stickyHeaderHiddenOnScroll
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{paddingBottom: 20}}
          sections={subDepartmentProductsListing.map(department => ({
            title: department?.E_COMM_CLASS_NAME,
            data: [department],
          }))}
          renderSectionHeader={({section}) => (
            <TouchableOpacity activeOpacity={1} style={styles.headerwrapper}>
              <Text allowFontScaling={false} style={styles.sectionHeaderStyle}>{section.title}</Text>
              <TouchableOpacity
                onPress={() =>
                  goToProductScreen(section?.data?.[0]?.CLASS, section?.title)
                }>
                <Text allowFontScaling={false} style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item._id + index}
          renderItem={({item}) => renderHorizontalItemList(item)}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={listEmptyComponentForDeptProducts()}
        />
      </View>
    );
  };
  const renderSubDepartmentsProducts = () => {
    return !search ? renderProductDetail() : null;
  };
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
        // contentWrapperStyle={{
        //   backgroundColor: 'black',
        //   flex: 1,
        //   width: SCREEN_WIDTH,
        // }}
      />
    );
  };
  const listEmptyComponent = () => {
    if (!loading) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: SCREEN_HEIGHT / 6,
          }}>
          <NoDataComponent />
        </View>
      );
    }
    return null;
  };

  const listEmptyComponentForDeptProducts = () => {
    if (!isLoading) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: SCREEN_HEIGHT / 6,
          }}>
          <NoDataComponent />
        </View>
      );
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
      isLoading={isLoading}
      headerTitle={
        comingFromHome ? APP_CONSTANTS.DEALS_HEADER : APP_CONSTANTS.SHOP_HEADER
      }
      showCartButton
      withBackButton
      isScrollView={false}
      containerStyle={styles.screenWrapper}
      hasSpinner={true}>
      <SafeAreaView style={styles.safeArea} forceInset={{top: 'never'}}>
        {renderSearchJSX}
        {!search ? renderSubDeptListHeader() : null}
        {renderProducts()}
        {!search && renderSubDepartmentsProducts()}
      </SafeAreaView>
    </ScreenWrapperComponent>
  );
};

export default SubDepartmentsProducts;
