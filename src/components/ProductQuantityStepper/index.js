import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import styles from './styles';
import ImageComponent from '../ImageComponent';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ProductQuantityStepper = ({
  containerStyle,
  onMinusPress,
  isDisabled = false,
  onPlusPress,
  value,
  qtyLimit,
  isLoading = false,
  isMinusDisabled = false,
  isRemoveItemEnabled = false,
  isPlusDisabled = false,
  itemStyle,
  unitOfMeasure,
  comingFromList = false,
}) => {
  qtyLimit = parseInt(qtyLimit, 10);
  const limited = !!(qtyLimit && value > qtyLimit);
  let unit;
  if (unitOfMeasure === 'WT') {
    unit = 'lb';
  } else {
    unit = '';
  }
  const onDisabledMinusPress = () => {
    if (isRemoveItemEnabled) {
      onMinusPress();
    }
  };

  const renderValue = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          color={!comingFromList ? COLORS.MAIN : COLORS.WHITE}
          size={'small'}
        />
      );
    }
    return (
      <Text
          allowFontScaling={false}
        style={[
          !comingFromList
            ? {
                fontSize: 18,
                width: 38,
                fontWeight: 'bold',
                textAlign: 'center',
              }
            : null,
          {
            color: !comingFromList
              ? COLORS.BLACK
              : limited
              ? COLORS.MAIN
              : COLORS.WHITE,
          },

          // {color: limited ? COLORS.MAIN : COLORS.BLACK},
        ]}>
        {value} {unit}
      </Text>
    );
  };

  return (
    <View
      style={[
        {
          width: global.isiPhone7or8 ? wp('26%') : wp('31%'),
          alignItems: 'flex-start',
        },
        // styles.stepperParentView,
        itemStyle,
        containerStyle,
      ]}>
      <View
        style={[
          styles.stepperView,
          !comingFromList
            ? {
                borderWidth: 1,
                width: '100%',
                height: 38,
                borderRadius: 6,
                overflow: 'hidden',
              }
            : null,
          !comingFromList
            ? {borderColor: limited ? COLORS.MAIN : COLORS.BLACK_40}
            : null,
        ]}>
        <TouchableOpacity
          disabled={isLoading || isMinusDisabled}
          onPress={onMinusPress}
          style={styles.stepperCellView}>
          {!comingFromList ? (
            <Text allowFontScaling={false} style={styles.stepperCellText}>-</Text>
          ) : (
            <ImageComponent
              source={IMAGES.DECREASE_ICON}
              style={styles.quantitychangeicon}
            />
          )}
          {isMinusDisabled && (
            <TouchableOpacity
              onPress={onDisabledMinusPress}
              activeOpacity={0}
              style={styles.disableStepper}
            />
          )}
        </TouchableOpacity>
        {!comingFromList ? <View style={styles.verticalSeparator} /> : null}
        <View style={styles.stepperValueView}>{renderValue()}</View>
        {!comingFromList ? <View style={styles.verticalSeparator} /> : null}
        <TouchableOpacity
          disabled={isLoading || isDisabled || isPlusDisabled}
          onPress={onPlusPress}
          style={styles.stepperCellView}>
          {!comingFromList ? (
            <Text allowFontScaling={false} style={styles.stepperCellText}>+</Text>
          ) : (
            <ImageComponent
              source={IMAGES.INCREASE_ICON}
              style={styles.quantitychangeicon}
              resizeMode={'contain'}
            />
          )}
        </TouchableOpacity>
      </View>
      {!!limited && (
        <View style={styles.errorViewStyle}>
          <Text allowFontScaling={false} style={styles.errorText}>
            {APP_CONSTANTS.MAX_SALE_LIMIT} {qtyLimit}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductQuantityStepper;
