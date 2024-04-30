import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import {SCREEN_WIDTH} from '../../constants/Common';

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
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  btnWrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: 15,
  },
  buttonWrapper: {
    width: 171,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: wp('2%'),
    marginTop: 20,
    marginBottom: 20,
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
    width: SCREEN_WIDTH,
  },
  scheduleinformationandbuttondivider: {
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
    width: '94%',
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
    paddingTop: hp('3%'),
    justifyContent: 'center',
  },
  selectedDateAndTimeMainWrapper: {
    backgroundColor: COLORS.WHITE,
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
  sectionDivider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 10,
    width: '100%',
  },
  freightContent: {
    flexDirection: 'row',
    paddingHorizontal: hp('3%'),
  },
  freightText: {
    marginHorizontal: wp('3%'),
    fontSize: 15,
    color: COLORS.BLACK,
  },
  textWrapper: {
    paddingHorizontal: wp('6%'),
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
  },
  editText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Medium',
    fontStyle: 'normal',
    letterSpacing: -0.26,
    textAlign: 'right',
  },

  labelText: {
    fontSize: getFontSize(13),
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
    color: COLORS.BLACK,
    marginTop: hp('0.2%'),
  },
  userInfoWrapper: {
    paddingVertical: 10,
  },
  bottomLabelText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK,
  },

  storeWrapper: {
    marginTop: 18,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
  storeInnerWrapper: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
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
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  rowInformationWrapper: {width: '97%'},
  columnInformationWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightIconWrapper: {justifyContent: 'center'},
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

  segmentText: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(17),
    lineHeight: 22,
  },
  phoneInput: {
    height: 50,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    paddingLeft: 10,
    borderRadius: wp('2%'),
    lineHeight: 22,
    letterSpacing: -0.36,
    color:COLORS.BLACK
  },
  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },

  createAccountToGetSavingsText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    color: COLORS.GRAY_6,
    marginStart: wp('2%'),
    fontStyle: 'normal',
    lineHeight: 20,
    paddingTop: '0.4%',
  },
  underlinedText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  createAccountToGetSavingsView: {
    flexDirection: 'row',
    marginStart: wp('6%'),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: hp('2%'),
  },
  inputFieldsWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    borderWidth: 1,
    borderRadius: hp('2%'),
    borderColor: COLORS.GRAY0_5,
    justifyContent: 'center',
  },
  continueAsGuestText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  continueAsGuestTextWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    marginVertical: hp('2%'),
    justifyContent: 'center',
  },

  twoFieldsContainer: {flexDirection: 'row'},
  fullRowField: {width: '100%'},
  halfRowField: {width: '49.5%'},
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnchecked: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: COLORS.GRAY_6,
    justifyContent: 'center',
    marginTop: 1.8,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.GRAY_6,
  },
  bottomTextStyle: {
    marginStart: wp('2%'),
    color: COLORS.GRAY_6,
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontStyle: 'normal',
    lineHeight: 20,
    width: wp('80%'),
  },
  viewWrapper: {
    marginTop: hp('1%'),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  passwordRequirementTextStyle: {
    color: COLORS.GRAY_5,
    fontSize: getFontSize(17),
    fontFamily: FONTS.REGULAR,
    width: wp('85%'),
    marginTop: hp('2%'),
    fontWeight: 'normal',
    lineHeight: 22,
  },
  alreadyMemberWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  loginTextStyle: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: getFontSize(15),
    fontWeight: '500',
  },
  passwordViewContainer: {
    backgroundColor: COLORS.GREY_BACKGROUND,
    marginTop: 12,
    marginBottom: 10,
  },
  passwordsContainer: {
    marginStart: wp('6%'),
  },
  marginTop: {
    marginTop: hp('2%'),
  },
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp('1%'),
  },
  underLinedText: {
    marginStart: wp('2%'),
    color: COLORS.GRAY_6,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(16),
    fontStyle: 'normal',
    width: wp('80%'),
    textDecorationLine: 'underline',
  },
});
