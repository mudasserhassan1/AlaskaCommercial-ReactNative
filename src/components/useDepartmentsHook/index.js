import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  DEPARTMENT_LISTING_ITEM_HEIGHT,
  pageLimits,
} from '../../constants/Common';
import ExpandableComponent from '../ExpandableComponent';
import {getDepartmentsForShopScreen} from '../../services/ApiCaller';
import {useDispatch, useSelector} from 'react-redux';
import NoDataComponent from '../NoDataComponent';
import {COLORS} from '../../theme';
import {STATUSES} from '../../constants/Api';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {setAllDepartments} from '../../redux/actions/general';
import {logToConsole} from '../../configs/ReactotronConfig';

const useDepartmentsHook = ({
  selected = {},
  indexOfClickedDepartment,
  onSaleTag,
  onSelectSubDepartment,
  listHeaderComponent,
  viewOffset,
  filter = false,
  comingFromHome = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const hasMore = useRef(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const state = useNavigationState(state => state);

  const storeNumberSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.StoreNumber ?? 0,
    [],
  );

  const StoreNumber = useSelector(storeNumberSelector);
  // const {allDepartments = []} = useSelector(({general}) => general?.allDepartments);
  const screenName = useNavigationState(
    state => state.routes[state.index].name,
  );

  const cartItemsCountSelector = useMemo(
    () => state => state.general?.allDepartments ?? [],
    [],
  );
  const allDepartments = useSelector(cartItemsCountSelector);

  useEffect(() => {
    if (!allDepartments?.length) {
      fetchDepartments?.(StoreNumber);
    }
  }, [pageNumber, StoreNumber]);

  const getDepartmentsApiCall = getDepartmentsForShopScreen;

  const fetchDepartments = async storeNumber => {
    setIsLoading(true);
    const response = await getDepartmentsApiCall({
      limit: pageLimits.BULK,
      page: pageNumber,
      storeId: storeNumber,
    });
    let departmentsData = [],
      status;
    const {data: {data: departments = []} = {}, status: responseStatus = 0} =
      response || {};
    departmentsData = departments;
    status = responseStatus;
    setIsLoading(false);
    setRefreshing(false);
    if (status === STATUSES.OK) {
      dispatch(setAllDepartments(departmentsData));
    }
  };

  const onRefreshDepartments = () => {
    setRefreshing(true);
    hasMore.current = true;
    indexOfClickedDepartment = -1;
    if (pageNumber === 1) {
      return fetchDepartments(StoreNumber);
    }
    setPageNumber(1);
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: DEPARTMENT_LISTING_ITEM_HEIGHT,
      offset: DEPARTMENT_LISTING_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback(
    item => String(item._id || item.DEPT_ID),
    [],
  );

  const renderItem = ({item, index}) => {
    const {
      isExpanded,
      E_COMM_DEPT_NAME: departmentName = '',
      DEPT_ID: departmentId = '',
    } = item ?? {};
    const hasSubDepartments =
      item?.SUB_DEPARTMENTS && item?.SUB_DEPARTMENTS?.length > 0;
    return (
      <ExpandableComponent
        selected={selected}
        onClickFunction={() => {
          // updateLayout(index);
          if (
            filter &&
            item.E_COMM_DEPT_NAME === 'Party Trays' &&
            screenName === 'Products'
          ) {
            navigation.setParams({
              params: {
                ...restOfParams,
                subDepartmentName: 'Party Trays',
                isPartyEligible: true,
                departmentName,
                departmentId,
                onSaleTag: comingFromHome,
                comingFromHome,
                fromDrawer: filter,
              },
            });
          } else if (filter && item.E_COMM_DEPT_NAME === 'Party Trays') {
            navigation.navigate(comingFromHome ? 'OnSaleStack' : 'ShopStack', {
              screen: 'Products',
              initial: false,
              params: {
                screen: 'Drawer',
                params: {
                  isPartyEligible: true,
                  onSaleTag: comingFromHome,
                  comingFromHome,
                  departmentName,
                  departmentId,
                  subDepartmentName: 'Party Trays',
                  fromDrawer: filter,
                },
              },
            });
          } else if (filter && !selectedDepartment && hasSubDepartments) {
            // logToConsole({item});
            setSelectedDepartment(item);
          }
        }}
        onSale={onSaleTag}
        onSubDepartmentPress={(subDepartmentId, subDepartmentName) => {
          onSelectSubDepartment({
            subDepartmentId,
            subDepartmentName,
            departmentId,
            departmentName,
            onSaleTag,
          });
        }}
        isExpanded={isExpanded}
        item={item}
        filter={filter}
      />
    );
  };
  const renderSeparator = () => <View style={styles.separator} />;
  const renderSubDepartmentItem = ({item}) => {
    return (
      <>
        <View style={styles.wrapper}>
          <TouchableOpacity
            onPress={() =>
              goToProductScreen(
                item?.CLASS,
                item?.E_COMM_CLASS_NAME,
                item?.E_COMM_DEPT_NAME,
                item?.DEPT_ID,
              )
            }>
            <View style={styles.departmentImageView}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.headerText}>
                {item?.E_COMM_CLASS_NAME || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {renderSeparator()}
      </>
    );
  };
  const restOfParams = useMemo(() => {
    const dealsPath = state.routes?.[2]?.state?.routes?.[0]?.params;
    const shopPath = state.routes?.[3]?.state?.routes?.[0]?.params;
    const partyTrayPath = state.routes?.[1]?.state?.routes?.[0]?.params;
    // logToConsole({state});
    // logToConsole({dealsPath, shopPath});
    if (shopPath === undefined && dealsPath === undefined) {
      return partyTrayPath;
    }
    if (shopPath !== undefined) {
      return shopPath;
    } else if (dealsPath !== undefined) {
      return dealsPath;
    }
    return null;
  }, [state]);

  const goToProductScreen = (
    subDepartmentId,
    subDepartmentName,
    departmentName,
    departmentId,
  ) => {
    if (screenName === 'Products') {
      navigation.setParams({
        params: {
          ...restOfParams,
          subDepartmentId,
          subDepartmentName,
          departmentName,
          departmentId,
          onSaleTag,
          comingFromHome: onSaleTag,
          fromDrawer: true,
          isPartyEligible: false,
        },
      });
    } else {
      navigation.navigate(onSaleTag ? 'OnSaleStack' : 'ShopStack', {
        screen: 'Products',
        params: {
          screen: 'Drawer',
          params: {
            subDepartmentId,
            subDepartmentName,
            departmentName,
            departmentId,
            onSaleTag,
            comingFromHome: onSaleTag,
            isPartyEligible: false,
          },
        },
      });
    }
  };
  const listEmptyComponent = () => {
    return isLoading ? null : <NoDataComponent />;
  };

  const renderListFooterComponent = () => {
    if (isLoading && hasMore.current) {
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

  const renderDepartmentsJSX = (
    <FlatList
      ref={flatListRef}
      refreshing={refreshing}
      data={allDepartments}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      onRefresh={onRefreshDepartments}
      keyboardDismissMode={'on-drag'}
      keyboardShouldPersistTaps={'handled'}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListHeaderComponent={listHeaderComponent()}
      // onEndReached={onEndReachedDepartments}
      // onEndReachedThreshold={0.1}
      ListEmptyComponent={listEmptyComponent()}
      // ListFooterComponent={renderListFooterComponent}
    />
  );

  const renderSubDepartmentJSX = () => {
    if (selectedDepartment) {
      const subDepartments = filter && selectedDepartment?.SUB_DEPARTMENTS;
      return (
        <View style={{height: '100%'}}>
          <FlatList
            data={subDepartments}
            renderItem={renderSubDepartmentItem}
            contentContainerStyle={styles.listContainer}
            keyExtractor={keyExtractor}
            // getItemLayout={getItemLayout}
            ListHeaderComponent={listHeaderComponent()}
          />
        </View>
      );
    }
    return null;
  };
  return {
    renderDepartmentsJSX,
    renderSubDepartmentJSX,
    selectedDepartment,
    setSelectedDepartment,
    isLoading,
  };
};

export default useDepartmentsHook;
