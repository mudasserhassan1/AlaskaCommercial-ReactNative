import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    paddingBottom: hp('1.5%'),
    paddingTop: hp('1.5%'),
    width: '100%',
    backgroundColor: COLORS.WHITE,
  },
  productBannerImage: {
    width: 90,
    height: 22,
    marginStart: 25,
  },
  productBannerView: {
    width: '25%',
  },
  substituteText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    lineHeight: 16,
    letterSpacing: -0.21,
    color: COLORS.MAIN,
  },
  productImage: {
    width: 70,
    height: 50,
  },
  productDescriptionText: {
    fontSize: getFontSize(13),
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
  },
  itemDescWrapper: {
    width: '69%',
  },
  itemDescInnerWrapper: {
    width: '70%',
  },
  quantityWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginEnd: wp('6%'),
  },
  quantityInnerWrapper: {
    width: '70%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  qtyText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('5%'),
    // marginTop:15
  },
  priceTextWrapper: {
    width: '30%',
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
  },
  unitText: {
    color: COLORS.BLACK_40,
    fontFamily: FONTS.REGULAR,
  },
  lineThroughText: {
    textDecorationLine: 'line-through',
    fontSize: getFontSize(12),
    fontFamily: FONTS.SEMI_BOLD,
  },
  productImageContainer: {
    height: 66,
    alignItems: 'center',
  },
  snapFlag: {
    fontSize: getFontSize(13),
    marginLeft: wp(1),
  },
  singleItemPriceView: {
    alignItems: 'flex-start',
  },
  approxtest: {
    fontSize: getFontSize(11),
    letterSpacing: -0.07,
    color: '#616060',
    marginTop:10,
    marginBottom:-10,
    fontFamily: FONTS.REGULAR,
  },
  salePriceText: {
    marginTop: 17,
    backgroundColor: COLORS.YELLOW,
    padding: 4,
    borderRadius: 4,
  },
  productPriceText: {
    fontSize: getFontSize(15),
    letterSpacing: -0.2,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
  },
  discountedPriceText: {
    textDecorationLine: 'line-through',
    fontSize: getFontSize(10),
    marginTop: hp('0.2%'),
    fontFamily: FONTS.MEDIUM,
  },
});
export default styles;
