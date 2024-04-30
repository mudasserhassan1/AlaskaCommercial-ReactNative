import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp, widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import {COLORS, FONTS} from '../../theme';
import {getFontSize} from '../../theme';

export default StyleSheet.create({
  cardContainer: {
    width: wp('35%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('3%'),
  },
  flatList: {flexGrow: 1, paddingHorizontal: wp(3), paddingEnd: 30},
  featuredProductImage: {
    // height: 120,
    // width: 111,
    height: hp('14%'),
    width: wp('28%'),
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor:COLORS.BLACK,
    // borderWidth:1
  },

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
  itemImage: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
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
  approxtext: {
    color: '#616060',
    fontSize: getFontSize(11),
    fontFamily: FONTS.REGULAR,
  },
  itemRegularPriceText: {
    fontSize: getFontSize(12),
    textDecorationLine: 'line-through',
    color: COLORS.MAIN,
    fontFamily: FONTS.MEDIUM,
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
  snapFlag: {
    fontSize: getFontSize(12),
    marginTop: 0,
    alignSelf: 'flex-start',
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
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  box: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    paddingHorizontal: 8,
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
  customizableText: {
    fontSize: 16,
    fontFamily: FONTS.SEMI_BOLD,
    color: COLORS.WHITE,
  },
  addToCartButton: {
    position: 'absolute',
    right: 3,
    top: 3,
    zIndex: 9999,
  },
});
