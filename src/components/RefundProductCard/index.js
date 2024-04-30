import {Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';

import {COLORS} from '../../theme';
import {getImageUrl} from '../../utils/imageUrlUtils';
import ProductImageComponent from '../ProductImageComponent';
import {camelToSnakeCase, stringToLowerCase} from '../../utils/transformUtils';
import useProductItem from '../../hooks/useProductItem';
import styles from './styles';
import ProductQuantityStepper from '../ProductQuantityStepper';
import LabelRadioItem from '../LabelRadioItem';

const RefundProductCard = ({item, onItemPress, isSelected, onPlusPress, index, onMinusPress}) => {
  const {item: product, itemStatus = ''} = item ?? {};
  const {isSubstituted, substituteMessage, itemObj, quantity, refundItemQty, ...rest} = product ?? {};

  const snakeCaseRest = useMemo(() => camelToSnakeCase(rest), [rest]);

  const {sku, isLowBandwidth, productName, totalPrice, resolvedQuantity, isRandomWeightItem, isProductACustomCake} =
    useProductItem({
      product: {...snakeCaseRest, quantity, ...itemObj},
    });

  const isUnAvailable = itemStatus === 'Unavailable';
  const disabled = !!(isSubstituted || isUnAvailable || refundItemQty);
  const isQuantityStepper = !isRandomWeightItem && !isProductACustomCake && !disabled;

  const renderSubstituteMessage = () => {
    if (substituteMessage) {
      return <Text allowFontScaling={false} style={styles.substituteMessage}>{stringToLowerCase(substituteMessage)}</Text>;
    }
  };

  const renderQuantityStepper = () => {
    if (isQuantityStepper) {
      return (
        <ProductQuantityStepper
          onPlusPress={() => onPlusPress(index, 'increment')}
          onMinusPress={() => onMinusPress(index, 'decrement')}
          value={resolvedQuantity}
        />
      );
    }
  };

  const renderQuantityInfo = () => {
    if (!isQuantityStepper) {
      return (
        <Text allowFontScaling={false} style={[styles.qtyLabel, disabled && {color: COLORS.DISABLE_BUTTON_COLOR}]}>
          Qty <Text allowFontScaling={false} style={[styles.qtyText, disabled && {color: COLORS.DISABLE_BUTTON_COLOR}]}>{resolvedQuantity}</Text>
        </Text>
      );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      style={styles.productCardParentView}
      onPress={() => {
        !disabled && onItemPress(index);
      }}>
      <View style={styles.productCard}>
        <ProductImageComponent
          imageUrl={getImageUrl(sku, isLowBandwidth)}
          imageStyle={styles.productImage}
          containerStyle={styles.productImageContainer}
        />
        <View style={styles.productInformationView}>
          <Text
              allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.productDescriptionText, disabled && {color: COLORS.DISABLE_BUTTON_COLOR}]}>
            {stringToLowerCase(productName)}
          </Text>
          {renderSubstituteMessage()}
          <View style={styles.qtyTextWrapper}>
            {renderQuantityStepper()}
            {renderQuantityInfo()}
            <View style={styles.priceDifferenceTextWrapper}>
              <Text
                  allowFontScaling={false}
                style={[styles.priceDifferenceText, {color: disabled ? COLORS.DISABLE_BUTTON_COLOR : COLORS.BLACK}]}>
                ${totalPrice}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <LabelRadioItem
        onlyRadio
        size={16}
        isSelected={isSelected}
        isRadioTouchable={false}
        radioBoxStyle={disabled && {borderColor: COLORS.DISABLE_BUTTON_COLOR}}
      />
    </TouchableOpacity>
  );
};

export default RefundProductCard;
