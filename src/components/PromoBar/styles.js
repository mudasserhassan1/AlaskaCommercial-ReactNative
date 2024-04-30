// import {StyleSheet} from 'react-native';
// import {COLORS, FONTS, getFontSize} from '../../theme';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {PROMO_CROSS_ICON_WIDTH, SCREEN_WIDTH} from '../../constants/Common';
//
// const styles = StyleSheet.create({
//   promoParentView: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textTicker: {
//     color: COLORS.GRAY_6,
//     fontFamily: FONTS.MEDIUM,
//     fontSize: getFontSize(15),
//     lineHeight: 17,
//     textAlign: 'center',
//   },
//   promoContainer: {
//     height: hp('5%'),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.WHITE,
//   },
//   promoTextView: {
//     // width: SCREEN_WIDTH - PROMO_CROSS_ICON_WIDTH,
//     width: SCREEN_WIDTH,
//     alignItems: 'center',
//   },
//   promoActionIconView: {
//     width: PROMO_CROSS_ICON_WIDTH,
//     alignItems: 'flex-start',
//   },
// });
//
// export default styles;

import {StyleSheet} from 'react-native';
import {COLORS, FONTS, getFontSize} from '../../theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  promoParentView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTicker: {
    color: COLORS.GRAY_6,
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(13),
    lineHeight: 15,
    textAlign: 'center',
  },
  promoContainer: {
    height: hp('5%'),
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    marginStart: 10,
  },
  promoTextView: {
    width: wp('88%'),
    alignItems: 'center',
  },
  close: {
    width: 20,
    height: 20,
  },
});

export default styles;
