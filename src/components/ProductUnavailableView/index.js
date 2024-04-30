import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS, IMAGES} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import ImageComponent from '../ImageComponent';

const ProductUnavailableView = ({color = COLORS.BLACK_40, containerStyle}) => {
  return (
    <View style={[styles.notAvailableProducts, containerStyle]}>
      <ImageComponent source={IMAGES.CART} style={[styles.cartImage, {tintColor: color}]} />
      <View style={styles.notAvailableTextWrapper}>
        <Text allowFontScaling={false} style={[styles.notAvailableText, {color}]}>Temporarily Unavailable</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  notAvailableProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    justifyContent: 'flex-start',
    height: hp('4%'),
  },
  cartImageWrapper: {},
  cartImage: {
    width: 15,
    height: 15,
  },
  notAvailableTextWrapper: {
    alignSelf: 'center',
    marginStart: wp('2%'),
  },
  notAvailableText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    letterSpacing: -0.24,
    textAlign: 'center',
  },
});
export default ProductUnavailableView;
