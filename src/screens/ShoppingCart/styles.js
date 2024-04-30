import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

export const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },

  itemContainer: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  dateStyle: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
  },
  dateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingBottom: hp('1.2%'),
  },
  contentContainerStyle: {
    backgroundColor: COLORS.WHITE,
  },
  reOrderTextStyle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: COLORS.MAIN,
  },
  priceTextStyle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    marginTop: hp('1%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
    marginStart: wp('6%'),
    width: '100%',
  },

  shipStatus: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    marginStart: wp('3%'),
  },
  shippedType: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.SEMI_BOLD,
    marginStart: wp('1%'),
    color: COLORS.BLACK_40,
  },
  orderStatus: {
    fontSize: getFontSize(13),
    fontWeight: 'normal',
    fontFamily: FONTS.REGULAR,
  },
  topControlSegments: {
    paddingVertical: hp('2.5%'),
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
  },
  segmentView: {
    marginStart: 20,
    justifyContent: 'center',
  },

  segment_deliverytype: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(15),
  },
  segmented_selectedstyle: {
    marginTop: 10,
    borderRadius: 2.5,
    height: 5,
  },
  userNameWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    justifyContent: 'center',
  },
  userName: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(18),
    color: COLORS.BLACK,
    fontStyle: 'normal',
  },
  zipcodeText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(14),
    color: COLORS.BLACK,
    marginTop: hp('2%'),
  },

  productBannerImage: {
    width: 100,
    height: 42,
  },

  productInformationView: {
    justifyContent: 'flex-start',
  },
  productPriceView: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productSalePrice: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.SEMI_BOLD,
  },
  productDiscountPrice: {
    marginStart: wp('2%'),
    textDecorationLine: 'line-through',
    fontSize: getFontSize(12),
  },

  addToCartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.MAIN,
    width: 90,
    height: 38,
    borderRadius: 6,
    marginTop: hp('2%'),
  },
  addToCartTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  addToCartText: {
    fontSize: getFontSize(15),
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  cartImageWrapper: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartImage: {
    width: 17,
    height: 17,
  },
  notAvailableProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: hp('4%'),
    marginTop: hp('2%'),
  },
  notAvailableTextWrapper: {
    alignSelf: 'center',
    marginStart: wp('4%'),
  },
  notAvailableText: {
    fontSize: getFontSize(15),
    color: COLORS.GRAY_4,
    textAlign: 'center',
  },
  billingAmountWrapper: {
    marginStart: wp('6%'),
    marginTop: hp('1%'),
    paddingBottom: hp('1.2%'),
  },
  billingTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
  },
  billingTextStyle: {
    color: COLORS.GRAY_TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.MAIN,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('1.7%'),
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
    maxHeight: hp('70%'),
  },
  listRow: {
    width: '90%',
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('2%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRow1: {
    paddingVertical: hp('1.8%'),
  },
  createListText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  rightArrowStyle: {
    width: 8,
    height: 25,
    alignSelf: 'flex-end',
  },
  sectionDivider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 5,
    marginTop: hp('.5%'),
    width: '100%',
  },
  cartHeaderView: {marginTop: hp('1.7%'), marginBottom: hp('1.5%')},
  cartHeaderText: {
    marginStart: wp('5%'),
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: 'SFProDisplay-Semibold',
    // marginBottom: -15,
  },
  buttonView: {paddingBottom: 20},
  headerImageStyle: {tintColor: COLORS.WHITE, height: 24, width: 24},
  listEmptyParentView: {
    flex: 1,
    height: hp('65%'),
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListNoRecordText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(20),
  },
  emptyListNoRecordDescription: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
    marginBottom: 10,
  },
  modalText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
    marginHorizontal: wp('6%'),
    fontSize: getFontSize(15),
    lineHeight: 24,
  },
  errorText: {
    fontSize: getFontSize(15),
  },
});
