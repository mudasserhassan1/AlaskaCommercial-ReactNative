import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {FONTS, getFontSize, COLORS} from '../../theme';

export const styles = StyleSheet.create({
  parenContainer: {flex: 1, backgroundColor: COLORS.WHITE},
  wrapper: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  headerBackImage: {tintColor: COLORS.BLACK, height: 24, width: 24},
  resendCodeText: {
    color: COLORS.BLACK,
    fontSize: getFontSize(15),
    marginTop: hp('1.5%'),
    textAlign: 'left',
    width: wp('90%'),
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'SFProDisplay-Medium',
  },
  subtitle: {
    color: COLORS.BLACK,
    fontSize: getFontSize(20),
    textAlign: 'left',
    width: wp('90%'),
    fontFamily: FONTS.SEMI_BOLD,
  },
  instructionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(17),
    width: wp('90%'),
    color: COLORS.GRAY_5,
    lineHeight: 22,
    letterSpacing: -0.34,
  },
  marginTop: {
    marginTop: hp('2%'),
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('5%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY_2,
    borderBottomWidth: 1,
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('4%'),
  },
  verifyLater: {
    color: COLORS.BLACK,
    fontSize: getFontSize(15),
    marginTop: hp('2%'),
    textAlign: 'center',
    width: wp('90%'),
    textDecorationLine: 'underline',
    fontFamily: 'SFProDisplay-Medium',
    letterSpacing: -0.3,
  },
});
