import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getItems, getOnSaleProducts} from '../services/ApiCaller';
import {StyleSheet, Text, View} from 'react-native';
import {debounce} from 'lodash';
import {APP_CONSTANTS, SEARCH_DEBOUNCE_DELAY} from '../constants/Strings';
import SearchComponent from '../components/SearchComponent';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {getFontSize, COLORS, IMAGES} from '../theme';
import {pageLimits} from '../constants/Common';
import FilterJsxComponent from '../components/FilterJsxComponent';
import {MixPanelInstance} from '../utils/mixpanelUtils';
import ProductFiltersModal from '../components/ProductFiltersModal';
import {CancelToken} from 'apisauce';
import {itemRWQuantityHandler} from '../utils/productUtils';
import {STATUSES} from '../constants/Api';
import {logToConsole} from '../configs/ReactotronConfig';

const pageLimit = pageLimits.SMALL;

const SALE_TYPES = {
  [APP_CONSTANTS.ON_SALE]: 'SALE_PRICE',
  // [APP_CONSTANTS.APP_ONLY]: 'APP_PRICE',
};

const ORDER = {
  [APP_CONSTANTS.LOW_TO_HIGH]: 'asc',
  [APP_CONSTANTS.HIGH_TO_LOW]: 'desc',
};

const useSearchProducts = ({
  isOnSale = false,
  listRef,
  departmentId = '',
  subDepartmentId = '',
  isPartyEligible = false,
  allowEmptySearch = true,
  searchJSXProps,
  search: initialSearch = '',
  doFirstInitialSearch = false,
  comingFromHome = false,
  departmentName = '',
  fromDrawer = false,
  fromBanner = false,
  fromHomeDept = false,
  subDepartmentName = '',
} = {}) => {
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isAlreadyInitialSearched, setIsAlreadyInitialSearched] =
    useState(doFirstInitialSearch);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [pageNo, setPagNo] = useState(1);
  const [refreshingSearch, setRefreshing] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [saleType, setSaleType] = useState('');
  const [inDepartments, setInDepartments] = useState({});

  useEffect(() => {
    if (
      !isAlreadyInitialSearched &&
      doFirstInitialSearch &&
      initialSearch !== search
    ) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      doFirstInitialSearch = false;
      setIsAlreadyInitialSearched(true);
    }
  }, [initialSearch, doFirstInitialSearch]);

  const hasMore = useRef(true);

  const useStoreNumberSelector = () =>
    useMemo(
      () => state => state.general?.loginInfo?.userInfo.StoreNumber ?? '',
      [],
    );

  const useIsLowBandwidthSelector = () =>
    useMemo(
      () => state => state.general?.loginInfo?.userInfo.isLowBandwidth ?? false,
      [],
    );

  const useUserIdSelector = () =>
    useMemo(() => state => state.general?.loginInfo?.userId ?? '', []);

  const StoreNumber = useSelector(useStoreNumberSelector());
  const isLowBandwidth = useSelector(useIsLowBandwidthSelector());
  const userId = useSelector(useUserIdSelector());

  const cancelTokenRef = useRef(null);

  const scrollToTop = useCallback(() => {
    listRef?.current?.scrollToOffset?.({offset: 0, animated: false});
  }, [listRef]);

  const cartItemsSelector = useMemo(
    () => state => state.general.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

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

  const getProducts = useCallback(
    async (
      search = '',
      page = 1,
      searching = true,
      order = orderBy,
      sale = saleType,
      departments = inDepartments,
    ) => {
      if (!search && !allowEmptySearch) {
        setList([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      cancelTokenRef.current?.cancel?.();
      cancelTokenRef.current = CancelToken.source();

      if (hasMore.current || page === 1) {
        hasMore.current = true;
        setLoading(true);
        setPagNo(page);
        const params = {
          page,
          limit: pageLimit,
          store: StoreNumber,
          searchString: search,
          search,
          isPartyEligible: isPartyEligible && !search,
          sort: SALE_TYPES[sale]
            ? SALE_TYPES[sale]
            : ORDER[order]
            ? 'REG_PRICE'
            : '',
          order: ORDER[order],
          userId,
        };
        if (!search && !isOnSale) {
          params.deptId = departmentId;
          params.classId = isPartyEligible ? '' : subDepartmentId;
        }
        if (isOnSale) {
          const filteredDepartment = Object.values(departments)?.[0] || {};
          params.deptId = filteredDepartment?.departmentId || '';
          params.classId = filteredDepartment?.subDepartmentId || '';
        }
        if (!search && comingFromHome) {
          params.deptId = departmentId;
          params.classId = isPartyEligible ? '' : subDepartmentId;
        }
        const apiCallFunction = isOnSale ? getOnSaleProducts : getItems;
        const {response = {}} = await apiCallFunction(params, {
          cancelToken: cancelTokenRef.current.token,
        });
        const {ok = false, status = 0} = response ?? {};
        if (ok && status === STATUSES.OK) {
          const {data: {response: products = []} = {}} = response ?? {};
          if (products?.length < pageLimit) {
            hasMore.current = false;
          }
          MixPanelInstance.trackSearch({term: search, results: products});
          let itemsWithCustomUnitOfMeasureField = [];
          for (const item of products) {
            let modifiedItem = await itemRWQuantityHandler(item);
            modifiedItem = unitInCart(modifiedItem);
            itemsWithCustomUnitOfMeasureField.push(modifiedItem);
          }
          setList(prevState => {
            return page === 1
              ? itemsWithCustomUnitOfMeasureField
              : [...prevState, ...itemsWithCustomUnitOfMeasureField];
          });
          if (page === 1) {
            scrollToTop();
          }
        }
      }
      setLoading(false);
      setRefreshing(false);
      setIsFilterLoading(false);
      setIsInitialLoading(false);
      setIsAlreadyInitialSearched(false);
    },
    [
      scrollToTop,
      inDepartments,
      userId,
      orderBy,
      saleType,
      allowEmptySearch,
      StoreNumber,
      departmentId,
      subDepartmentId,
      isPartyEligible,
      isOnSale,
      departmentName,
    ],
  );

  useEffect(() => {
    if (fromDrawer && !fromBanner) {
      setIsInitialLoading(!initialSearch);
      getProducts();
    }
  }, [
    fromDrawer,
    StoreNumber,
    isPartyEligible,
    initialSearch,
    departmentId,
    subDepartmentId,
    departmentName,
    subDepartmentName,
    getProducts,
  ]);

  useEffect(() => {
    if (fromHomeDept && isPartyEligible && !fromBanner && !fromDrawer) {
      setIsInitialLoading(!initialSearch);
      getProducts();
    }
  }, [fromHomeDept, isPartyEligible, getProducts]);

  useEffect(() => {
    if (fromBanner) {
      setIsInitialLoading(!initialSearch);
      getProducts();
    }
  }, [fromBanner, getProducts]);

  useEffect(() => {
    if (
      (initialSearch || allowEmptySearch) &&
      isAlreadyInitialSearched &&
      !fromBanner &&
      !fromHomeDept
    ) {
      setSearch(initialSearch);
      setIsInitialLoading(!initialSearch);
      getProducts(initialSearch);
    }
  }, [
    StoreNumber,
    isPartyEligible,
    initialSearch,
    departmentId,
    subDepartmentId,
    allowEmptySearch,
    isAlreadyInitialSearched,
    departmentName,
  ]);

  const sRef = useRef(''); //TODO: Apply proper fix.

  useEffect(() => {
    sRef.current = search;
  }, [search]);

  const getFilteredProducts = useCallback(
    async (order, sale, departments, searchTerm = sRef.current) => {
      try {
        setIsFilterLoading(true);
        setPagNo(1);
        hasMore.current = true;
        await getProducts(searchTerm, 1, false, order, sale, departments);
      } catch (e) {
        logToConsole({getFilteredProducts: e.message});
      } finally {
        setIsFilterLoading(false);
      }
    },
    [getProducts],
  );

  const onSelectDepartment = useCallback(
    (department, value) => {
      let departments = {};
      if (department && value) {
        departments = {[department]: value};
      }
      setInDepartments(departments);
      setSearch('');
      getFilteredProducts(orderBy, saleType, departments, '');
    },
    [orderBy, saleType],
  );

  const onRemoveSaleType = useCallback(async () => {
    setSaleType('');
    // setOrderBy('');
    getFilteredProducts(orderBy, '', inDepartments);
  }, [inDepartments]);

  const onSelectOrderBy = useCallback(
    async order => {
      let sale = saleType;
      setOrderBy(order);
      if (isOnSale && !saleType) {
        // setSaleType(APP_CONSTANTS.ON_SALE);
        sale = APP_CONSTANTS.ON_SALE;
      }
      getFilteredProducts(
        order,
        isOnSale ? APP_CONSTANTS.ON_SALE : '',
        inDepartments,
      );
    },
    [inDepartments, isOnSale, saleType],
  );

  const onSelectSaleType = useCallback(
    sale => {
      setSaleType(sale);
      getFilteredProducts(orderBy ? orderBy : '', sale, inDepartments);
    },
    [orderBy, inDepartments],
  );

  const onClearFilters = () => {
    setOrderBy('');
    setSaleType('');
    setInDepartments({});
  };

  const onResetAll = (fetchData = true) => {
    setSearch('');
    onClearFilters();
    if (fetchData) {
      getFilteredProducts('', '', {}, '');
    }
  };

  const onClearAllFilters = useCallback(() => {
    onClearFilters();
    getFilteredProducts('', '', {});
  }, []);

  const onRefreshSearch = useCallback(async () => {
    setRefreshing(true);
    await getProducts(search);
  }, [getProducts, search]);

  const onEndReachedSearch = useCallback(async () => {
    if (!refreshingSearch && !loading && hasMore.current) {
      await getProducts(search, pageNo + 1);
    }
  }, [getProducts, loading, pageNo, refreshingSearch, search]);

  const onSubmitEditing = useCallback(async () => {
    if (isLowBandwidth) {
      await getProducts(search);
    }
  }, [getProducts, isLowBandwidth, search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onGetSearched = useCallback(
    debounce(getProducts, SEARCH_DEBOUNCE_DELAY),
    [],
  );

  const updateSearch = useCallback(
    (value, isCrossPress) => {
      setSearch(value);
      if (Object.keys(inDepartments)?.length) {
        setInDepartments({});
      }
      (!isLowBandwidth || isCrossPress) &&
        onGetSearched(value, 1, true, orderBy, saleType, {});
    },
    [inDepartments, isLowBandwidth, onGetSearched, orderBy, saleType],
  );

  const onUpdateList = updatesList => {
    setList(updatesList);
  };

  const renderSearchJSX = useMemo(
    () => (
      <View style={styles.searchComponentWrapper}>
        <SearchComponent
          leftImage
          placeholder={
            isOnSale
              ? APP_CONSTANTS.SEARCH_DEALS_ITEMS
              : APP_CONSTANTS.SEARCH_ITEMS
          }
          isLoading={
            loading && !refreshingSearch && pageNo === 1 && !isInitialLoading
          }
          leftImageSrc={IMAGES.SEARCH_ICON}
          onChangeText={updateSearch}
          onSubmitEditing={onSubmitEditing}
          loaderStyle={[
            styles.loaderStyle,
            searchJSXProps?.rightImageSrc && {right: wp('6.3%')},
          ]}
          value={search}
          withCrossButton
          {...(searchJSXProps || {})}
        />
      </View>
    ),
    [
      isOnSale,
      loading,
      refreshingSearch,
      pageNo,
      isInitialLoading,
      updateSearch,
      onSubmitEditing,
      searchJSXProps,
      search,
    ],
  );

  const renderHeaderJSX = () => (
    <View style={styles.listHeaderView}>
      <Text allowFontScaling={false} style={styles.listHeaderText}>
        {search ? APP_CONSTANTS.PRODUCTS : APP_CONSTANTS.DEPARTMENTS}
      </Text>
    </View>
  );

  const renderShopFiltersJSX = useMemo(() => {
    return (
      <FilterJsxComponent
        isLoading={isFilterLoading}
        orderBy={orderBy}
        onClearAll={onClearAllFilters}
        saleType={saleType}
        isOnSale={isOnSale}
        onSelectSaleType={onSelectSaleType}
        onSelectOrderBy={onSelectOrderBy}
      />
    );
  }, [
    isFilterLoading,
    orderBy,
    onClearAllFilters,
    saleType,
    isOnSale,
    onSelectSaleType,
    onSelectOrderBy,
  ]);

  const renderSaleFiltersJSX = useMemo(() => {
    return (
      <ProductFiltersModal
        isLoading={isFilterLoading}
        orderBy={orderBy}
        onClearAll={onClearAllFilters}
        saleType={saleType}
        isOnSale={isOnSale}
        onSelectSaleType={onSelectSaleType}
        onSelectOrderBy={onSelectOrderBy}
        inDepartments={inDepartments}
        onSelectDepartment={onSelectDepartment}
        onRemoveSaleType={onRemoveSaleType}
      />
    );
  }, [
    inDepartments,
    isFilterLoading,
    isOnSale,
    onClearAllFilters,
    onRemoveSaleType,
    onSelectDepartment,
    onSelectOrderBy,
    onSelectSaleType,
    orderBy,
    saleType,
  ]);

  return {
    list,
    loading,
    refreshingSearch,
    onRefreshSearch,
    onUpdateList,
    onClearFilters,
    onResetAll,
    onEndReachedSearch,
    onGetSearched,
    search,
    isInitialLoading,
    getProducts,
    hasMore,
    pageNo,
    loadingMore: !refreshingSearch && loading && pageNo > 1,
    isSearchOrFilterApplied: !!(
      search ||
      Object.keys(inDepartments).length ||
      saleType ||
      orderBy
    ),
    renderShopFiltersJSX,
    renderSaleFiltersJSX,
    renderSearchJSX,
    renderHeaderJSX,
  };
};

const styles = StyleSheet.create({
  searchComponentWrapper: {
    height: 75,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderStyle: {
    right: wp('1%'),
  },
  listHeaderView: {
    paddingStart: wp('6%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
    backgroundColor: COLORS.WHITE,
  },
  listHeaderText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Semibold',
    letterSpacing: -0.03,
    lineHeight: 25,
  },
});

export default useSearchProducts;
