import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';

import {getFontSize, getFontWeight} from '../../theme';
const SearchListHeader = ({headerText}) => {
  return <Text allowFontScaling={false} style={styles.headerText}>{headerText}</Text>;
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    marginStart: widthPercentageToDP('6%'),
    fontWeight: getFontWeight('600'),
    fontStyle: 'normal',
    lineHeight: 20,
    marginVertical: heightPercentageToDP('1.3%'),
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
});
export default SearchListHeader;
