import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS, FONTS, getFontSize} from '../../theme';

export default StyleSheet.create({
  cardContainer: {
    width: wp('35%'),
    marginTop: hp('3%'),
    marginStart: wp('6%'),
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  scrollContainer: {flexGrow: 1, paddingBottom: 20},
  productParentView: {backgroundColor: COLORS.WHITE},
  productInfoParent: {paddingBottom: hp('2%'), marginEnd: wp('6%')},
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  listIcon: {width: 18, height: 18},
  addedlistIcon: {width: 32, height: 30},
  priceAndNameView: {width: '80%', marginStart: wp('6%')},
  priceContainer: {
    // marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPriceText: {
    marginStart: wp('3%'),
    textDecorationLine: 'line-through',
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(12),
    // bottom: 2,
  },
  secondaryPriceLabel: {
    color: COLORS.GRAY_6,
    marginStart: 10,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    // alignSelf: 'center',
  },
  featuredProductImage: {
    height: hp('12%'),
    width: wp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  onSaleText: {
    marginTop: hp('2%'),
    fontSize: getFontSize(10),
    color: COLORS.MAIN,
    fontFamily: 'SFProDisplay-Medium',
  },
  itemPriceText: {
    fontSize: getFontSize(18),
    fontFamily: FONTS.BOLD,
    color: COLORS.MAIN,
  },
  itemDescriptionText: {
    marginTop: hp('1%'),
    fontSize: getFontSize(14),
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-Regular',
  },
  shopContainer: {
    flex: 1,
  },
  featuresParent: {
    // marginTop: hp('1.7%'),
    paddingVertical: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: wp('10%'),
  },
  featureTextHeader: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    letterSpacing: -0.25,
    fontStyle: 'normal',
  },
  eligibleText: {
    marginTop: hp('1%'),
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 22,
    letterSpacing: -0.15,
    color: COLORS.BLACK,
  },
  featuresText: {
    marginTop: hp('0.5%'),
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 22,
    letterSpacing: -0.15,
    marginVertical: 2.5,
    color: COLORS.BLACK,
  },
  youMayLikeParent: {
    // marginTop: hp('2%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
    backgroundColor: COLORS.WHITE,
  },
  youMightAlsoLikeHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    alignItems: 'center',
  },
  youMayLikeHeaderText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(21),
    color: COLORS.BLACK,
  },
  seeAllText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    color: COLORS.MAIN,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  bannerImage: {width: 100, height: 40},
  availabilityParentView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '98%',
    height: 45,
    marginTop: hp('2%'),
  },
  upcView: {
    marginTop: hp('1.2%'),
  },
  upcText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  productNameText: {
    marginTop: hp('1.5%'),
    fontSize: getFontSize(15),
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: '#000000',
    fontFamily: FONTS.MEDIUM,
  },
  productDetailImage: {
    height: 200,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetailImageWrapper: {
    height: 300,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  averageWeightText: {
    marginTop: hp('0.5%'),
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(14),
    lineHeight: 22,
    letterSpacing: -0.15,
    color: COLORS.GRAY_6,
  },
  snapFlag: {
    fontSize: getFontSize(13),
    marginLeft: wp('6%'),
    marginTop: 0,
  },
  approxText: {
    fontSize: getFontSize(12),
    color: '#616060',
    fontFamily: FONTS.REGULAR,
    marginBottom: 4,
  },
  saleitemPriceContainer: {
    backgroundColor: COLORS.YELLOW,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    alignSelf: 'flex-start',
  },
  approxStyleWrapper: {marginTop: 5},
  addToListText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('2%'),
    letterSpacing: 0.46,
    lineHeight: 26,
    color: COLORS.MAIN,
  },
});
