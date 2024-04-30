import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';

export default StyleSheet.create({
  productCard: {
    width: wp('35%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('3%'),

  },
  productBannerView: {
    width: '27%',
  },
  productBannerImage: {
    width: 100,
    height: 42,
  },
  productImageView: {
    marginStart: wp('1%'),
  },
  productImage: {
    width: 100,
    height: 75,
  },
  productInformationView: {
    width: '73%',
    paddingRight: wp(5),
  },
  productPriceView: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productSalePrice: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.SEMI_BOLD,
    marginEnd: 8,
  },
  productDiscountPrice: {
    marginEnd: 8,
    textDecorationLine: 'line-through',
    fontSize: getFontSize(12),
    fontFamily: FONTS.SEMI_BOLD,
  },
  productDescriptionText: {
    marginTop: 8,
    fontSize: getFontSize(13),
    color: COLORS.BLACK,
    width: '60%',
    fontFamily: FONTS.REGULAR,
  },
  // listIconWrapper: {
  //   width: '100%',
  //   paddingRight: '3%',
  //   // height: '100%',
  //   alignItems: 'flex-end',
  // },
  listIcon: {
    width: 20,
    height: 20,
  },
  addedlistIcon:{width: 40, height: 30},
  parentCard: {
    // flexDirection: 'row',
    // alignItems: 'flex-start',
    // justifyContent: 'space-between',
    // width: '100%',
    // height: 45,
    // // marginTop: hp('3%'),
    // backgroundColor: COLORS.WHITE,
    zIndex:9999,
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
  },
  priceAndDiscountedPriceView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '75%',
  },
  averagePriceText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    letterSpacing: 0,
    color: COLORS.GRAY_6,
    // marginStart: 8,
  },
  customizeButtonContainer: {
    width: wp('38.5%'),
    height: 38,
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  customCakeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '97%',
    marginTop: hp('2.5%'),
  },
  snapFlag: {
    fontFamily: FONTS.MEDIUM,
    fontStyle: 'italic',
    fontSize: getFontSize(11),
    color: COLORS.GREEN_SHADE,
    textAlign: 'center',
    marginTop: 10,
  },
  itemImage: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  featuredProductImage: {
    height: hp('14%'),
    width: wp('28%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  approxtext: {
    color: '#616060',
    fontSize: getFontSize(11),
    fontFamily: FONTS.REGULAR,
  },
  itemPriceContainer: {
    backgroundColor: COLORS.YELLOW,
    borderRadius: 4,
    // paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  itemPriceText: {
    fontSize: getFontSize(16),
    fontFamily: FONTS.BOLD,
    color: COLORS.BLACK,
  },
  itemApproxPriceText: {
    fontSize: getFontSize(8),
    color: COLORS.MAIN,
    fontFamily: 'SFProDisplay-Regular',
  },
  onSaleText: {
    fontSize: getFontSize(8),
    color: COLORS.MAIN,
    fontFamily: 'SFProDisplay-Medium',
  },
  itemDescriptionText: {
    fontSize: getFontSize(13),
    textAlign:"left",
    color: COLORS.BLACK,
    lineHeight: 19,
    fontFamily: 'SFProDisplay-Regular',
  },
  snapFlag_: {
    fontSize: getFontSize(12),
    marginTop: 0,
    alignSelf: 'flex-start',
  },
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  boxForCake: {
    height: 34,
    width: wp('26%'),
    borderRadius: 17,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems:"center",
    paddingHorizontal: 8,
  },
  customizableText: {
    fontSize: 16,
    fontFamily: FONTS.SEMI_BOLD,
    color: COLORS.WHITE,
  },
  cardContainer: {
    width: wp('35%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('3%'),
  },
  flatList: {flexGrow: 1, paddingHorizontal: wp(3), paddingEnd: 30},

  bannerImage: {
    width: 89,
    height: 20,
    top: -20,
    zIndex: 1,
  },
  addToCartImage: {
    width: 36,
    height: 36,
    alignSelf: 'flex-end',
    marginBottom: -37,
    marginRight: 10,
  },
  itemRegularPriceText: {
    fontSize: getFontSize(12),
    textDecorationLine: 'line-through',
    color: COLORS.MAIN,
    fontFamily: FONTS.MEDIUM,
  },
  quantitychange: {
    position: 'absolute',
    right: 3,
    top:3,
    zIndex: 9999,
    // alignSelf: 'flex-end',
    width:widthPercentageToDP('25%'),
    height:34,
    alignItems: 'center',
    backgroundColor: COLORS.MAIN,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantitychangeicon: {
    width: 22,
    height: 22,
  },
  quantity: {
    fontSize: getFontSize(15),
    color: COLORS.WHITE,
    fontFamily: FONTS.MEDIUM,
    marginHorizontal: 4,
  },
  // container: {
  //   position: 'absolute',
  //   right: 0,
  //   top: 0,
  //   zIndex: 999,
  //   alignItems: 'flex-end',
  //   justifyContent: 'center',
  // },
  box: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  moveLeft: {
    height: 34,
    width: wp('32%'),
  },
  moveRight: {
    alignSelf: 'flex-end',
    width: 80,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  addToCartButton: {
    position: 'absolute',
    right: 3,
    top: 3,
    zIndex: 9999,
  },
});
