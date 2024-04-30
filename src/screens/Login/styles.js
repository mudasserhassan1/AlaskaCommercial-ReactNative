import {StyleSheet, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  LogoView: {
    alignSelf: 'center',
    alignItems: 'center',
    // marginTop: hp('3%'),
  },
  dividerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  signinText: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 23 : 20,
    marginTop: hp('5%'),
    fontStyle: 'normal',
    textAlign: 'left',
    width: wp('90%'),
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Medium',
  },
  inputWrapper: {
    alignItems: 'center',
  },
  errorStyle: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginBottom: -6,
    height: hp('2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: hp('1.7%'),
  },
  forgotPasswordText: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 18 : 15,
    marginTop: hp('1%'),
    textAlign: 'right',
    marginEnd: wp('6%'),
    justifyContent: 'flex-end',
    fontWeight: '500',
    textDecorationLine: 'underline',
    fontFamily: FONTS.MEDIUM,
  },
  Logo: {
    width: 100,
    height: 100,
  },
  containerMain: {
    flex: 1,
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('5%'),
  },
  guestButton: {
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    marginTop: hp('4%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('2%'),
  },
  notMember: {
    fontSize: Platform.OS === 'ios' ? 18 : 15,
    fontWeight: '500',
    fontFamily: FONTS.MEDIUM,
    color: '#000',
  },
  notMemberWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  signInContainer: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5%'),
  },
  signInButton: {
    flex: 1,
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: wp('2%'),
  },
  biometricsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(3),
  },
  biometricsIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  biometricsName: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    marginLeft: 5,
  },
});
