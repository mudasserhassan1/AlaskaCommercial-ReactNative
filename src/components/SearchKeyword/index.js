import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

const SearchKeyword = ({text, onPress, style, textPadding}) => {
  return (
    <TouchableOpacity style={[styles.parentView, style, textPadding]} onPress={onPress}>
      <Text allowFontScaling={false} numberOfLines={2} style={styles.textStyle}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  parentView: {
    justifyContent: 'center',
    marginStart: widthPercentageToDP('6%'),
    marginEnd: widthPercentageToDP('6%'),
  },
  textStyle: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    fontStyle: 'normal',
    lineHeight: 25,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
    textTransform: 'capitalize',
  },
});
export default SearchKeyword;
