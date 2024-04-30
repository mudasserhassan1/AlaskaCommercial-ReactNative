import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  itemContainer: {
    marginStart: wp('6%'),
  },
  dateStyle: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.BOLD,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: COLORS.BLACK,
  },
  orderListCardParent: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
  },
  dateWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTypeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reOrderTextStyle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.MAIN,
    marginEnd: wp('6%'),
  },
  priceTextStyle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    marginTop: hp('1%'),
    letterSpacing: 0,
    color: COLORS.BLACK,
  },
  divider: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    marginTop: hp('.5%'),
    alignSelf: 'flex-end',
    width: '100%',
  },
  shipStatus: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('3%'),
  },
  shippedType: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('2.5%'),
    color: COLORS.BLACK_40,
  },
  orderStatus: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    marginEnd: wp('6%'),
    marginStart: wp('6%'),
    flexShrink: 1,
    color: COLORS.BLACK,
  },
  orderTypeText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK_40,
    marginStart: wp('2%'),
  },
  icon: {
    alignSelf: 'flex-end',
  },
  iconStyle: {width: 18, height: 18},
});
