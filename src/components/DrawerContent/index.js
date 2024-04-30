import React, {useState} from 'react';
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
import {navigationRef} from '../../utils/navigationUtils';
import {useRoute} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImageComponent from '../ImageComponent';
import {COLORS, FONTS, getFontSize, IMAGES} from '../../theme';
import {logToConsole} from '../../configs/ReactotronConfig';

const DrawerContent = ({state, navigation}) => {
  const [headerHeight, setHeaderHeight] = useState(250);

  const {params} = useRoute();

  // const {
  //   onSelectOrderBy,
  //   onSelectSaleType,
  //   onSelectSubDepartment,
  //   orderBy,
  //   saleType,
  //   inDepartments,
  // } = params || {};
  const {
    onSelectOrderBy,
    onSelectSaleType,
    onSelectSubDepartment,
    orderBy,
    saleType,
    inDepartments,
    onSaleTag,
  } = state.routes?.[0]?.params ?? params ?? {};

  // logToConsole({stateRoute: state.routes?.[0]?.params, params});
  React.useEffect(() => {
    return navigation.addListener('tabPress', e => {
      const {name: currentScreen} =
        navigationRef?.current?.getCurrentRoute?.() ?? {};
      const isFocused = navigation.isFocused();
      if (isFocused) {
        navigation.closeDrawer();
        e.preventDefault();
      }
      if (isFocused && currentScreen !== 'Products') {
        navigation.popToTop();
      }
    });
  }, [navigation]);

  const listHeader = () => {
    return (
      <View
        onLayout={e =>
          setHeaderHeight(e.nativeEvent?.layout?.height || headerHeight)
        }>
        {!selectedDepartment ? (
          <>
            <Text allowFontScaling={false} style={[styles.header, {marginStart: wp('6%')}]}>
              {APP_CONSTANTS.PRICE}
            </Text>
            {[APP_CONSTANTS.HIGH_TO_LOW, APP_CONSTANTS.LOW_TO_HIGH]?.map(
              label => (
                <LabelRadioItem
                  size={17}
                  label={label}
                  isSelected={label === orderBy}
                  onItemPress={() => onSelectOrderBy?.(label)}
                />
              ),
            )}
            {/*{onSaleTag ? (*/}
            {/*  <>*/}
            {/*    <Text*/}
            {/*      style={[*/}
            {/*        styles.header,*/}
            {/*        {marginVertical: 24, marginStart: wp('6%')},*/}
            {/*      ]}>*/}
            {/*      {APP_CONSTANTS.SALE_TYPE}*/}
            {/*    </Text>*/}
            {/*    {[APP_CONSTANTS.ON_SALE]?.map(label => (*/}
            {/*      <LabelRadioItem*/}
            {/*        size={17}*/}
            {/*        label={label}*/}
            {/*        isSelected={label === saleType}*/}
            {/*        onItemPress={() => onSelectSaleType?.(label)}*/}
            {/*      />*/}
            {/*    ))}*/}
            {/*  </>*/}
            {/*) : null}*/}
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
                : navigation.navigate('ShopStack', {
                    screen: 'Departments',
                    initial: true,
                  })
            }>
            <Text allowFontScaling={false} style={styles.changeText}>{APP_CONSTANTS.VIEW_ALL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const goToSubDeptProductsScreen = deptId => {
    setSelectedDepartment(null);
    navigation.navigate(onSaleTag ? 'OnSaleStack' : 'ShopStack', {
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
  const {
    renderDepartmentsJSX,
    renderSubDepartmentJSX,
    selectedDepartment,
    setSelectedDepartment,
  } = useDepartmentsHook({
    selectedDepartment,
    setSelectedDepartment,
    onSaleTag: onSaleTag,
    listHeaderComponent: listHeader,
    viewOffset: -(headerHeight - 50),
    filter: true,
  });

  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight || 0}}>
      {selectedDepartment ? renderSubDepartmentJSX() : renderDepartmentsJSX}
    </SafeAreaView>
  );
};

export default DrawerContent;
