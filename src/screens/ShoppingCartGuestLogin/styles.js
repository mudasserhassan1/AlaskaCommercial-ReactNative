import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
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
  },
  infoWrapper: {
    marginTop: hp('1.7%'),
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

  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('30%'),
    marginTop: hp('1.7%'),
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
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
    alignItems: 'flex-start',
    marginStart: wp('6%'),
    height: hp('2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(13),
  },
  editTextWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  verticalSeparator: {
    height: 50,
    borderRightWidth: 1,
    borderColor: COLORS.GRAY0_5,
  },
  modal_divider: {
    borderBottomWidth: 1,
    width: '100%',
    borderColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountToGetSavingsText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    color: COLORS.GRAY_6,
    marginStart: wp('2%'),
    fontStyle: 'normal',
    lineHeight: 20,
  },
  underlinedText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  createAccountToGetSavingsView: {
    flexDirection: 'row',
    width: '70%',
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
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
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
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: COLORS.GRAY_6,
    justifyContent: 'center',
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 10,
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
