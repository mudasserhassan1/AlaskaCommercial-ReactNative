import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  errorStyle: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    height: hp('2%'),
    marginBottom: -3,
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: 13,
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
  subtitle: {
    color: COLORS.BLACK,
    fontSize: getFontSize(20),
    textAlign: 'left',
    width: wp('90%'),
    fontFamily: FONTS.MEDIUM,
    letterSpacing: -0.3,
  },
  changePasswordHeader: {
    color: COLORS.BLACK,
    fontSize: getFontSize(15),
    textAlign: 'left',
    width: wp('90%'),
    lineHeight: 22,
    letterSpacing: -0.25,
    fontFamily: FONTS.SEMI_BOLD,
    marginTop: hp('1%'),
  },
  passwordSettingInstructionText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(17),
    width: wp('90%'),
    lineHeight: 22,
    letterSpacing: -0.41,
    color: COLORS.GRAY_6,
  },
  marginTop: {
    marginTop: hp('2%'),
  },
  instructionText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(17),
    width: wp('90%'),
    lineHeight: 22,
    color: COLORS.GRAY_6,
  },
});
