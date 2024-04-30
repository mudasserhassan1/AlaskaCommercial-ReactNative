import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS, FONTS, getFontSize} from '../../theme';

export default StyleSheet.create({
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  scrollContainer: {flexGrow: 1, paddingBottom: 20},
  productInfoParent: {
    marginEnd: wp('6.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unavailable: {
    marginLeft: wp('6%'),
  },
  listIcon: {width: 20, height: 20},
  priceAndNameView: {width: '80%', marginStart: wp('6%')},
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  discountedPriceText: {
    marginStart: wp('3%'),
    textDecorationLine: 'line-through',
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(12),
    bottom: 1,
  },
  itemPriceText: {
    fontSize: getFontSize(18),
    fontFamily: FONTS.BOLD,
    letterSpacing: 0,
  },
  shopContainer: {
    flex: 1,
  },
  featuresParent: {
    paddingBottom: hp('1.7%'),
    // marginTop: hp('1.7%'),
    paddingVertical: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: wp('10%'),
  },
  cakeFeaturesContainer: {
    paddingBottom: hp('1.7%'),
    // marginTop: hp('1.7%'),
    paddingVertical: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
    paddingLeft: wp('6%'),
  },
  featureTextHeader: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    letterSpacing: -0.25,
  },
  eligibleText: {
    marginVertical: hp('1%'),
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 22,
    letterSpacing: -0.15,
    color:COLORS.BLACK
  },
  featuresText: {
    marginTop: hp('1%'),
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 22,
    letterSpacing: -0.15,
    marginVertical: 2.5,
    color: COLORS.BLACK,
  },
  youMayLikeParent: {
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
  productNameText: {
    marginTop: hp('1%'),
    fontSize: getFontSize(15),
    lineHeight: 18,
    letterSpacing: 0,
    color: '#000000',
    fontFamily: FONTS.MEDIUM,
  },
  customizeButtonContainer: {
    width: wp('87%'),
    height: 50,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent: 'center',
    borderRadius: 7,
    alignSelf: 'center',
    // marginTop: hp('1%'),
  },
  addToCartStyles: {
    fontFamily: FONTS.REGULAR,
    letterSpacing: 0,
    fontSize: getFontSize(17),
    textAlign: 'center',
    color: COLORS.WHITE,
  },
  descriptionInput: {
    borderRadius: wp('2%'),
    borderColor: COLORS.GRAY0_15,
    borderWidth: 1,
    height: 114,
    opacity: 6,
    paddingLeft: 10,
    paddingTop: 20,
    textAlignVertical: 'top',
    width: '100%',
    color:COLORS.BLACK
  },
  descriptionTextStyles: {
    color: COLORS.BLACK,
  },
  listIconButton: {
    marginTop: 10,
  },
  limitText: {
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.15,
    color: COLORS.CHARCOAL_GREY_60,
    position: 'absolute',
    bottom: 20,
    right: 12,
    fontFamily: FONTS.REGULAR,
  },
  imageSliderContainer: {
    backgroundColor: COLORS.WHITE,
    // marginTop: hp('1.7%'),
    paddingBottom: hp('2%'),
  },
  modalInputContainer: {width: '87.5%', alignSelf: 'center'},
  modalDescription: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    marginBottom: 15,
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
  snapFlagView: {
    marginEnd: wp('6.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snapFlag: {
    fontSize: getFontSize(13),
    marginLeft: wp('6%'),
    marginTop: 0,
  },
  AddToCartContainer: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: wp('4%'),
    marginTop:3
  },
});
