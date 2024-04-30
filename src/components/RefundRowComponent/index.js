import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';

const RefundRowComponent = ({title, description, style}) => {
  return (
    <View style={styles.itemStatusWrapper}>
      <View style={[styles.itemStatusInnerWrapper, style]}>
        <Text allowFontScaling={false} style={styles.headerLabel}>{title}</Text>
        <Text allowFontScaling={false} style={styles.headerDescriptionText}>{description}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  itemStatusWrapper: {
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemStatusInnerWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    width: '78%',
  },
  headerLabel: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: COLORS.BLACK,
  },
  headerDescriptionText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
    marginTop: heightPercentageToDP('.5%'),
  },
});

export default RefundRowComponent;
