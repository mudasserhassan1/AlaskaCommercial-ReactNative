import React from 'react';
import {View} from 'react-native';

import {COLORS, IMAGES} from '../../theme';
import {FONTS} from '../../theme';
import Dropdown from './dropdown';
import styles from './styles';
import ImageComponent from '../ImageComponent';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ProductUnitPicker = ({
  value,
  disabled,
  onChange,
  data = [],
  productDetailScreen,
}) => {
  const renderArrowIcon = () => {
    if (!disabled) {
      return (
        <View style={[styles.arrowIconContainer,{height:productDetailScreen ? 38 : 33}]}>
          <ImageComponent
            source={IMAGES.ARROW_DROPDOWN_FILLED}
            style={{height: 24, width: 24}}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.dropDownParent,
        {
          width: productDetailScreen
            ? disabled
              ? '28%'
              : '28%'
            : disabled
            ? wp('24%')
            : wp('23%'),
        },
      ]}>
      {data?.length > 1 ? (
        <Dropdown
          label=""
          data={data}
          disabledItemColor={COLORS.BLACK}
          disabled={disabled}
          value={value}
          onChangeText={onChange}
          containerStyle={[styles.dropDownStyle,{height:productDetailScreen ? 38 : 33}]}
          fontFamily={FONTS.SEMI_BOLD}
          textColor={COLORS.BLACK}
          useNativeDriver={true}
          renderAccessory={renderArrowIcon}
          productDetailScreen={productDetailScreen}
        />
      ) : null}
    </View>
  );
};

export default ProductUnitPicker;
