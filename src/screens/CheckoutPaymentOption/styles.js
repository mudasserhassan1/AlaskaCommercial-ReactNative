import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },
  container: {
    marginTop: hp('2%'),
  },
  itemSeparator: {
    marginStart: wp('6%'),
    borderBottomWidth: 1,
    width: '94%',
    borderBottomColor: COLORS.GRAY0_5,
  },
  topControlSegments: {
    width: wp('90%'),
    height: 50,
    marginTop: hp('2%'),
    borderColor: COLORS.MAIN,
    borderRadius: 6,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  segmentView: {
    width: '50%',
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBoxMessage: {
    marginTop: 5,
  },
  infoWrapper: {
    // marginTop: hp('1.7%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  userNameWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    justifyContent: 'center',
  },
  userName: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: getFontSize(18),
    color: COLORS.BLACK,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  zipcodeText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(13),
    color: COLORS.BLACK,
    marginTop: hp('2%'),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.26,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  btnWrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('3%'),
  },
  errorStyle: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp('6%'),
    height: hp('2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: Platform.OS === 'ios' ? 14 : 13,
  },
  editTextWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
  },
  verticalSeparator: {
    height: 50,
    width: '.5%',
    backgroundColor: COLORS.GRAY0_5,
  },
  modal_divider: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInformationDivider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('1%'),
    width: '100%',
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('1%'),
  },
  dividerII: {
    width: '94%',
    marginStart: wp('6%'),
  },
  mainWrapper: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: hp('1.7%'),
    justifyContent: 'center',
  },
  payment: {
    paddingBottom: 0,
  },
  freight: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: hp('1.7%'),
    alignSelf: 'stretch',
  },
  freightDivider: {
    marginLeft: wp('5%'),
    marginBottom: hp('1.7%'),
  },
  freightContent: {
    flexDirection: 'row',
    paddingHorizontal: hp('3%'),
    marginTop:hp('1%')
  },
  freightText: {
    marginHorizontal: wp('3%'),
    fontSize: 15,
    color: COLORS.BLACK,
  },
  textWrapper: {
    marginStart: wp('6%'),
  },
  textHeader: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: getFontSize(15),
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  editProfileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginEnd: wp('6%'),
  },
  editText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Medium',
    fontStyle: 'normal',
    letterSpacing: -0.26,
    textAlign: 'right',
  },
  // labelText: {
  //   fontSize: getFontSize(13),
  //   fontFamily: 'SFProDisplay-Medium',
  //   fontStyle: "normal",
  //   lineHeight: 22,
  //   letterSpacing: -0.31,
  //   color: COLORS.BLACK
  // },
  // lebelInfo: {
  //   fontSize: getFontSize(13),
  //   marginTop: hp('.8%'),
  //   fontFamily: 'SFProDisplay-Regular',
  //   fontWeight: '500',
  //   fontStyle: 'normal',
  //   lineHeight: 22,
  //   letterSpacing: -0.31,
  //   color: COLORS.BLACK,
  // },

  labelText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
  },
  labelInfo: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.25,
    lineHeight: 22,
    color: COLORS.BLACK,
    marginTop: hp('.5%'),
  },
  userInfoWrapper: {
    marginTop: hp('1.2%'),
    justifyContent: 'center',
  },
  bottomLabelText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
  },

  storeWrapper: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    paddingBottom: hp('1.2%'),
    paddingTop: hp('1.2%'),
  },
  storeInnerWrapper: {
    flexDirection: 'row',
  },
  openModalLabelInfo: {
    fontSize: getFontSize(15),
    marginTop: hp('.8%'),
    fontFamily: FONTS.REGULAR,
    color: COLORS.MAIN_LIGHT,
  },
  ordernumber: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('2%'),
  },
  blankView: {
    height: hp('1.7%'),
    backgroundColor: '#f4f4f4',
  },
  rightArrowStyle: {
    width: 10,
    height: 15,
    alignSelf: 'flex-end',
  },
  listWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    flex: 1,
  },
  screenContainer: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  rowInformationWrapper: {width: '90%'},
  rightIconWrapper: {justifyContent: 'center', width: '5%'},
  modalText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
    marginHorizontal: wp('6%'),
    fontSize: getFontSize(15),
    lineHeight: 24,
  },
  flashScreenStyle: {
    marginBottom: 100,
    alignSelf: 'center',
    padding: 15,
  },
  flashTitle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    lineHeight: 16,
    textAlign: 'center',
  },
  sendStoreContainer: {
    backgroundColor: COLORS.GREY_II,
    paddingVertical: hp('1.7%'),
    paddingHorizontal: wp(6),
  },
  shareToStore: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(16),
    color: COLORS.BLACK,
    fontStyle: 'normal',
    marginBottom: 8,
  },
  clickHere: {
    fontFamily: FONTS.SEMI_BOLD,
    textDecorationLine: 'underline',
  },
  shareToStoreInfo: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(14),
    lineHeight: 18,
    color: COLORS.BLACK,
  },
});
