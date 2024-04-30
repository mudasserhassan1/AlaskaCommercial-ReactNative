import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import LabelRadioItem from '../LabelRadioItem';
import useDepartmentsHook from '../useDepartmentsHook';
import {getFilterDepartmentsProducts} from '../../services/ApiCaller';
import {useSelector} from 'react-redux';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImageComponent from '../ImageComponent';
import {COLORS, FONTS, getFontSize, IMAGES} from '../../theme';
import {useRoute} from '@react-navigation/native';

const DepartmentProductsDrawerContent = ({navigation}) => {
  const [headerHeight, setHeaderHeight] = useState(250);
  const [order, setOrder] = useState('');
  const [saleType, setSaleType] = useState('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const route = useRoute();

  const comingFromHome = route?.params?.comingFromHome;

  useEffect(() => {
    navigation.setParams({
      // ...route?.params,
      order,
      saleType,
      onSelectOrder,
      onSelectSaleType,
    });
  }, [order, saleType, isFilterLoading, navigation]);

  const useStoreNumberSelector = () =>
    useMemo(() => state => state.general?.loginInfo?.userInfo?.StoreNumber, []);

  const useUserIdSelector = () =>
    useMemo(() => state => state.general?.loginInfo?.userId, []);

  const StoreNumber = useSelector(useStoreNumberSelector());
  const userId = useSelector(useUserIdSelector());

  const SALE_TYPES = {
    [APP_CONSTANTS.ON_SALE]: 'SALE_PRICE',
    // [APP_CONSTANTS.APP_ONLY]: 'APP_PRICE',
  };

  const ORDER = {
    [APP_CONSTANTS.LOW_TO_HIGH]: 'asc',
    [APP_CONSTANTS.HIGH_TO_LOW]: 'desc',
  };

  const getFilteredProducts = useCallback(
    async (selectedOrder, saleType) => {
      setIsFilterLoading(true);
      try {
        const response = await getFilterDepartmentsProducts({
          ORDER: selectedOrder,
          DISCOUNT_TYPE: saleType,
          STORE_NUMBER: StoreNumber,
        });
        // logToConsole({response});
      } catch (error) {
      } finally {
        setIsFilterLoading(false);
      }
    },
    [order, saleType, StoreNumber, userId],
  );

  const onSelectOrder = useCallback(selectedOrder => {
    setOrder(selectedOrder);
    {
      comingFromHome && setSaleType('SALE_PRICE');
    }
    // getFilteredProducts(selectedOrder, saleType);
  }, []);

  const onSelectSaleType = useCallback(selectedSaleType => {
    setSaleType(selectedSaleType);
    // getFilteredProducts(order, selectedSaleType);
  }, []);
  const goToSubDeptProductsScreen = deptId => {
    setSelectedDepartment(null);
    navigation.navigate(comingFromHome ? 'OnSaleStack' : 'ShopStack', {
      screen: 'SubDepartmentsProducts',
      initial: false,
      params: {
        screen: 'Drawer',
        params: {
          deptId: deptId,
        },
      },
    });
    // navigation.navigate('SubDepartmentsProducts', {
    //   deptId: deptId,
    //   comingFromHome: comingFromHome,
    // });
  };
  const listHeader = () => {
    return (
      <View
        onLayout={e =>
          setHeaderHeight(e.nativeEvent.layout.height || headerHeight)
        }>
        {!selectedDepartment ? (
          <>
            <Text allowFontScaling={false} style={[styles.header, {marginStart: wp('6%')}]}>
              {APP_CONSTANTS.PRICE}
            </Text>
            {Object.keys(ORDER).map(key => (
              <LabelRadioItem
                key={key}
                size={17}
                label={key}
                isSelected={ORDER[key] === order}
                onItemPress={() => onSelectOrder(ORDER[key])}
              />
            ))}
            {!comingFromHome ? (
              <>
                <Text
                    allowFontScaling={false}
                  style={[
                    styles.header,
                    {marginVertical: 24, marginStart: wp('6%')},
                  ]}>
                  {APP_CONSTANTS.SALE_TYPE}
                </Text>
                {Object.keys(SALE_TYPES).map(key => (
                  <LabelRadioItem
                    key={key}
                    size={17}
                    label={key}
                    isSelected={SALE_TYPES[key] === saleType}
                    onItemPress={() => onSelectSaleType(SALE_TYPES[key])}
                  />
                ))}
              </>
            ) : null}
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedDepartment(null)}
            style={{
              paddingTop: Platform.OS === 'ios' ? 0 : 40,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '22%',
                marginStart: wp('4%'),
              }}>
              <ImageComponent
                source={IMAGES.FILTER_BACK_ARROW}
                resizeMode={'contain'}
                style={{height: 26, width: 26}}
              />
              <Text
                  allowFontScaling={false}
                style={{
                  fontSize: getFontSize(17),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: COLORS.BLACK,
                  lineHeight: 21,
                }}>
                Back
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.categoriesTitle}>
          <Text allowFontScaling={false} numberOfLines={2} style={[styles.header, {width: '60%'}]}>
            {selectedDepartment
              ? selectedDepartment?.E_COMM_DEPT_NAME
              : APP_CONSTANTS.CATEGORIES}
          </Text>
          <TouchableOpacity
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={() =>
              selectedDepartment !== null
                ? goToSubDeptProductsScreen(selectedDepartment?.DEPT_ID?.[0])
                : navigation.closeDrawer()
            }>
            <Text allowFontScaling={false} style={styles.changeText}>{APP_CONSTANTS.VIEW_ALL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const {
    renderDepartmentsJSX,
    renderSubDepartmentJSX,
    selectedDepartment,
    setSelectedDepartment,
  } = useDepartmentsHook({
    onSaleTag: comingFromHome,
    listHeaderComponent: listHeader,
    viewOffset: -(headerHeight - 50),
    filter: true,
    comingFromHome: comingFromHome,
  });

  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight || 0}}>
      {selectedDepartment ? renderSubDepartmentJSX() : renderDepartmentsJSX}
    </SafeAreaView>
  );
};

export default DepartmentProductsDrawerContent;
