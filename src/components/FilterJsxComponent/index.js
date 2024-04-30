import {COLORS} from '../../theme';
import {ActivityIndicator, Platform, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import React, {useEffect, useMemo, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import Entypo from 'react-native-vector-icons/Entypo';
import BottomSheetModal from '../BottomSheetModal';
import LabelRadioItem from '../LabelRadioItem';
import styles from './styles';

const FilterJsxComponent = ({
  onSelectOrderBy,
  onSelectSaleType,
  onClearAll,
  orderBy,
  saleType,
  isOnSale,
  isLoading,
}) => {
  const [isOrderByModal, setIsOrderByModal] = useState(false);
  const [isSaleTypeModal, setIsSaleTypeModal] = useState(false);
  const [selectedOrderBy, setSelectedOrderBy] = useState('');
  const [selectedSaleType, setSelectedSaleType] = useState('');

  const handleOrderByDone = () => {
    if (isOrderByModal) {
      onSelectOrderBy(selectedOrderBy);
    } else {
      onSelectSaleType(selectedSaleType);
    }
    onCrossPress();
  };

  useEffect(() => {
    setSelectedOrderBy(orderBy);
  }, [orderBy]);

  useEffect(() => {
    setSelectedSaleType(saleType);
  }, [saleType]);

  const handleClearAll = () => {
    typeof onClearAll === 'function' && onClearAll();
    showMessage({
      message: 'All filters are cleared',
      backgroundColor: COLORS.BLACK,
      statusBarHeight: Platform.OS === 'android' ? StatusBar.currentHeight : undefined,
      floating: Platform.OS === 'android',
    });
  };

  const onCrossPress = () => {
    setIsOrderByModal(false);
    setIsSaleTypeModal(false);
  };

  const isBottomDisabled = useMemo(() => {
    if (isOrderByModal) {
      return !selectedOrderBy || selectedOrderBy === orderBy;
    } else {
      return !selectedSaleType || selectedSaleType === saleType;
    }
  }, [isOrderByModal, orderBy, saleType, selectedOrderBy, selectedSaleType]);

  const isClearDisabled = (!orderBy && !saleType) || isLoading;

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.filterTextWrapper}>
          <Text allowFontScaling={false} style={styles.filterText}>{APP_CONSTANTS.FILTER}</Text>
          <TouchableOpacity
            disabled={isClearDisabled}
            activeOpacity={0.6}
            onPress={handleClearAll}
            style={styles.clearWrapper}>
            <Text
                allowFontScaling={false}
              style={[
                styles.clear,
                isClearDisabled && {
                  color: COLORS.DISABLE_BUTTON_COLOR,
                },
              ]}>
              {APP_CONSTANTS.CLEAR_ALL}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filtersWrapper}>
          {!!isOnSale && (
            <View style={styles.sortByWrapper}>
              <Text allowFontScaling={false} style={styles.priceText}>{APP_CONSTANTS.SALE_TYPE}</Text>
              <TouchableOpacity onPress={() => setIsSaleTypeModal(true)} style={styles.buttonWrapper}>
                <Text allowFontScaling={false} style={styles.priceSortText}>{saleType || 'Select'}</Text>
                <Entypo name={'chevron-down'} color={COLORS.BLACK} size={16} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.sortByWrapper}>
            <Text allowFontScaling={false} style={styles.priceText}>{APP_CONSTANTS.PRICE}</Text>
            <TouchableOpacity onPress={() => setIsOrderByModal(true)} style={styles.buttonWrapper}>
              <Text allowFontScaling={false} style={styles.priceSortText}>{orderBy || 'Select'}</Text>
              <Entypo name={'chevron-down'} color={COLORS.BLACK} size={16} />
            </TouchableOpacity>
          </View>
        </View>
        {/*{isLoading && <ActivityIndicator color={'red'} style={styles.loader} />}*/}
      </View>
      <BottomSheetModal
        visible={isOrderByModal || isSaleTypeModal}
        title={isSaleTypeModal ? APP_CONSTANTS.SALE_TYPE : APP_CONSTANTS.PRICE}
        isButtonDisabled={isBottomDisabled}
        buttonTitle={APP_CONSTANTS.UPDATE}
        onBottomPress={handleOrderByDone}
        onCrossPress={onCrossPress}>
        {isOrderByModal &&
          [APP_CONSTANTS.HIGH_TO_LOW, APP_CONSTANTS.LOW_TO_HIGH]?.map(label => (
            <LabelRadioItem
              size={17}
              label={label}
              isSelected={label === selectedOrderBy}
              onItemPress={() => setSelectedOrderBy(label)}
            />
          ))}
        {isSaleTypeModal &&
          [APP_CONSTANTS.ON_SALE]?.map(label => (
            <LabelRadioItem
              size={17}
              label={label}
              isSelected={label === selectedSaleType}
              onItemPress={() => setSelectedSaleType(label)}
            />
          ))}
      </BottomSheetModal>
    </>
  );
};

export default FilterJsxComponent;
