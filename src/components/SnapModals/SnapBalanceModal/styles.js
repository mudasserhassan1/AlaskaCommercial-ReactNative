import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../../theme';
import {FONTS, getFontSize} from '../../../theme';

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY0_5,
    marginStart: wp('6%'),
    height: 64,
  },
  boldText: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: FONTS.MEDIUM,
    letterSpacing: -0.24,
  },
  amountText: {
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    marginRight: wp('6%'),
  },
});

export default styles;
