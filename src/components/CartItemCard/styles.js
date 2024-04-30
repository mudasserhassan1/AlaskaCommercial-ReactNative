import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';
const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    paddingEnd: widthPercentageToDP('6%'),
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  productBannerView: {
    width: '25%',
  },
  productBannerImage: {
    width: 90,
    height: 22,
    position: 'absolute',
    marginBottom: hp('0.8%'),
    marginStart: 20,
  },
  productImageView: {
    width: '28%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 55,
  },
  productImageContainer: {
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
  },
  productInfoContainer: {
    width: '75%',
  },
  productDescriptionContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  productDescriptionText: {
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    lineHeight: 19,
    flexShrink: 1,
    letterSpacing: -0.29,
    fontFamily: FONTS.REGULAR,
  },
  moreIconWrapper: {
    alignItems: 'flex-end',
    paddingLeft: wp('5%'),
  },
  moreIcon: {
    fontSize: getFontSize(13),
    color: COLORS.MAIN,
    lineHeight: 19,
    letterSpacing: -0.29,
    fontFamily: FONTS.REGULAR,
  },
  productPriceParent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  // singleItemPriceView: {
  //   marginTop: hp('0.7%'),
  // },
  productPriceText: {
    fontSize: getFontSize(15),
    letterSpacing: -0.2,
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
  },
  approxtest: {
    fontSize: getFontSize(11),
    letterSpacing: -0.07,
    color: '#616060',
    // paddingTop:20,
    marginTop:10,
    marginBottom:-10,
    // marginBottom: 2,
    fontFamily: FONTS.REGULAR,
  },
  salePriceText: {
    backgroundColor: '#FFD54F',
    padding: 4,
    borderRadius: 4,
    // marginTop: 10,
  },
  totalPriceContainer: {
    width: '30%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  discountedPriceText: {
    textDecorationLine: 'line-through',
    fontSize: getFontSize(10),
    marginTop: hp('0.2%'),
    fontFamily: FONTS.MEDIUM,
  },
  snapFlag: {
    fontSize: getFontSize(13),
    marginLeft: wp(1),
    marginTop: hp('2%'),
  },
});
export default styles;
