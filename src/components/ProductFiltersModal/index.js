import {COLORS, IMAGES} from '../../theme';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import React, {useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import styles from './styles';
import ImageComponent from '../ImageComponent';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {logToConsole} from '../../configs/ReactotronConfig';

const AppliedFilter = ({value, onPress}) => {
  if (value) {
    return (
      <View style={styles.filtersContainer}>
        <Text allowFontScaling={false} numberOfLines={1} style={styles.filter}>
          {value}
        </Text>
        <Pressable activeOpacity={0.9} onPress={onPress} hitSlop={10}>
          <ImageComponent source={IMAGES.CLOSE_MAIN} style={styles.closeIcon} />
        </Pressable>
      </View>
    );
  }
  return null;
};

const ProductFiltersModal = ({
  onSelectOrderBy,
  onSelectSaleType,
  onSelectDepartment,
  onRemoveSaleType,
  onClearAll,
  orderBy,
  saleType,
  inDepartments = {},
  isOnSale,
}) => {
  const isFocused = useIsFocused();
  const {params} = useRoute();

  useEffect(() => {
    if (isFocused) {
      navigation.setParams({
        ...params,
        onSelectOrderBy,
        onSelectSaleType,
        onSelectSubDepartment,
        orderBy,
        saleType,
        inDepartments,
      });
    } else {
      navigation.closeDrawer();
    }
  }, [isFocused, orderBy, saleType, inDepartments]);

  const handleClearAll = () => {
    typeof onClearAll === 'function' && onClearAll();
    showMessage({
      message: 'All filters are cleared',
      backgroundColor: COLORS.BLACK,
      statusBarHeight:
        Platform.OS === 'android' ? StatusBar.currentHeight : undefined,
      floating: Platform.OS === 'android',
    });
  };

  const departments = Object.values(inDepartments);
  const {subDepartmentName, subDepartmentId: selectedSubDepartmentId} =
    departments?.[0] || {};

  const isClearDisabled = !orderBy && !saleType && !departments.length;

  const navigation = useNavigation();
  const onFilterPress = () => {
    navigation.openDrawer();
  };

  const onSelectSubDepartment = ({subDepartmentId, ...rest} = {}) => {
    const subDepartmentIdToString = subDepartmentId?.toString?.();
    if (selectedSubDepartmentId?.toString?.() !== subDepartmentIdToString) {
      onSelectDepartment?.(subDepartmentIdToString, {subDepartmentId, ...rest});
    }
  };

  return (
    <>
      <View style={styles.wrapper}>
        {/*{!isClearDisabled && (*/}
        {/*  <TouchableOpacity*/}
        {/*    activeOpacity={0.6}*/}
        {/*    onPress={handleClearAll}*/}
        {/*    style={styles.clearWrapper}>*/}
        {/*    <Text style={styles.clear}>{APP_CONSTANTS.CLEAR_ALL}</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*)}*/}
        <View style={styles.filterTextWrapper}>
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <ImageComponent
              resizeMode={'contain'}
              source={IMAGES.FILTER}
              style={styles.filterIcon}
            />
            <Text allowFontScaling={false} style={styles.filterText}>{APP_CONSTANTS.FILTER}</Text>
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, flex: 1}}>
            <AppliedFilter
              value={orderBy}
              onPress={() => onSelectOrderBy('')}
            />
            <AppliedFilter value={saleType} onPress={onRemoveSaleType} />
            <AppliedFilter
              value={subDepartmentName}
              onPress={() => onSelectSubDepartment()}
            />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default ProductFiltersModal;
