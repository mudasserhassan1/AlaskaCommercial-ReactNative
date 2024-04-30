import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

export default StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: hp('8%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: wp('2.5%'),
  },
  titleText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(13),
    lineHeight: 22,
    letterSpacing: -0.31,
    color: COLORS.BLACK,
  },
  subtitle: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.GRAY_03,
  },
  addIcon: {
    width: wp('10%'),
    height: hp('6%'),
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
});
