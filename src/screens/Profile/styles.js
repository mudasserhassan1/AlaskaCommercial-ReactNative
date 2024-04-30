// import {StyleSheet} from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import {FONTS, COLORS, getFontSize, getFontWeight} from '../../theme';
//
// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
//   scrollContainer: {paddingBottom: 40},
//   divider: {
//     height: 1,
//     width: '100%',
//     backgroundColor: COLORS.GRAY0_5,
//     marginTop: hp('1.2%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginStart: wp('6%'),
//   },
//   mainWrapper: {
//     backgroundColor: COLORS.WHITE,
//     marginTop: hp('1.7%'),
//     paddingBottom: hp('1.7%'),
//     justifyContent: 'center',
//   },
//   dialogTitleWrapper: {width: '70%', alignSelf: 'center'},
//   textWrapper: {
//     marginTop: hp('2%'),
//   },
//   textHeader: {
//     fontFamily: FONTS.SEMI_BOLD,
//     fontSize: getFontSize(15),
//     paddingBottom: hp('1%'),
//   },
//   editProfileWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginStart: wp('6%'),
//     marginEnd: wp('6%'),
//   },
//   editText: {
//     color: COLORS.MAIN,
//     fontSize: getFontSize(14),
//     fontFamily: FONTS.MEDIUM,
//   },
//   labelText: {
//     fontSize: getFontSize(13),
//     fontFamily: FONTS.MEDIUM,
//   },
//   labelInfo: {
//     fontSize: getFontSize(15),
//     fontFamily: FONTS.REGULAR,
//     fontWeight: 'normal',
//     fontStyle: 'normal',
//     letterSpacing: -0.25,
//     lineHeight: 22,
//     color: COLORS.BLACK,
//     marginTop: hp('.5%'),
//   },
//   infoWrapper: {
//     marginTop: hp('1.2%'),
//     justifyContent: 'center',
//     marginStart: wp('6%'),
//     marginEnd: wp('6%'),
//   },
//   bottomLabelText: {
//     fontSize: getFontSize(15),
//     fontFamily: FONTS.MEDIUM,
//     fontWeight: getFontWeight('600'),
//     fontStyle: 'normal',
//     lineHeight: 22,
//     color: COLORS.BLACK,
//   },
//   storeInfoSeparator: {
//     height: 1,
//     width: '100%',
//     backgroundColor: COLORS.GRAY0_5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginStart: wp('6%'),
//   },
//   storeWrapper: {
//     marginTop: hp('1.7%'),
//     backgroundColor: COLORS.WHITE,
//     justifyContent: 'center',
//   },
//   storeInnerWrapper: {
//     marginStart: wp('6%'),
//     marginEnd: wp('6%'),
//     paddingTop: hp('1.2%'),
//     paddingBottom: hp('1.2%'),
//   },
//   storeTextWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: hp('2%'),
//   },
//   changePasswordTextWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: hp('1.2%'),
//     paddingBottom: hp('1.2%'),
//   },
//   changePassword: {
//     fontSize: getFontSize(17),
//     fontFamily: FONTS.REGULAR,
//     fontWeight: 'normal',
//     fontStyle: 'normal',
//     lineHeight: 22,
//     color: COLORS.BLACK,
//     marginTop: hp('.5%'),
//   },
//   shopWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: hp('1.5%'),
//     marginStart: wp('6%'),
//     marginEnd: wp('6%'),
//   },
//   editTextWrapper: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     width: 100,
//     height: 40,
//   },
//   rightArrowWrapper: {justifyContent: 'center'},
//   rightArrow: {width: 8, height: 25, alignSelf: 'flex-end'},
// });

import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize, getFontWeight} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  scrollContainer: {paddingBottom: 40},
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    marginVertical: hp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  shopsectiondivider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1.7%'),
  },
  mainWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    justifyContent: 'center',
  },
  shopmainWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    justifyContent: 'center',
    paddingHorizontal: wp('6%'),
  },
  ProfilemainWrapper: {
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    paddingVertical: hp('1.2%'),
  },
  dialogTitleWrapper: {width: '70%', alignSelf: 'center'},
  textWrapper: {
    paddingVertical: hp('1.8%'),
  },
  profileInnerWrapper:{

  },
  profileHeadingStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'),
  },
  textHeader: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
  editProfileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(14),
    fontFamily: FONTS.MEDIUM,
  },
  labelText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
  },
  labelInfo: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.25,
    lineHeight: 22,
    color: '#3C3C4399',
    marginTop: hp('.5%'),
  },
  labelInfoForStore: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.25,
    lineHeight: 22,
    color: COLORS.BLACK,
    marginTop: hp('.5%'),
  },
  infoWrapper: {
    // marginTop: hp('1.2%'),
    justifyContent: 'center',
    marginHorizontal:wp('6%')
  },
  bottomLabelText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    fontWeight: getFontWeight('600'),
    fontStyle: 'normal',
    lineHeight: 22,
    color: COLORS.BLACK,
  },
  storeInfoSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  storeWrapper: {
    marginTop: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
  storeInnerWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    paddingVertical: hp('1.8%'),
  },
  storeTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('1.7%'),
  },
  changePasswordTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
  },
  changePassword: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    color: COLORS.BLACK,
    // marginTop: hp('.5%'),
  },
  shopWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
  },
  snapEligibiltyWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.7%'),
    paddingHorizontal: wp('6%'),
    backgroundColor: COLORS.WHITE,
  },

  editTextWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    height: 40,
  },
  rightArrowWrapper: {justifyContent: 'center'},
  rightArrow: {width: 8, height: 25, alignSelf: 'flex-end'},
});
