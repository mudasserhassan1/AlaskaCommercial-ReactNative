import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  parenContainer: {flex: 1, backgroundColor: COLORS.WHITE},
  wrapper: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  headerBackImage: {tintColor: COLORS.BLACK, height: 24, width: 24},
  errorStyle: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    height: hp('2%'),
    marginBottom: hp('-1.2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: hp('1.3%'),
  },
  resendCodeText: {
    color: '#000',
    fontSize: getFontSize(15),
    marginTop: hp('1.5%'),
    textAlign: 'left',
    width: wp('90%'),
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'SFProDisplay-Medium',
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
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'left',
    width: wp('90%'),
    fontFamily: 'SFProDisplay-Medium',
  },
  instructionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 17,
    width: wp('90%'),
    color: COLORS.GRAY_5,
  },
  marginTop: {
    marginTop: hp('2%'),
  },
  inputContainer: {
    marginStart: wp('2%'),
    marginEnd: wp('2%'),
    alignItems: 'center',
    marginTop: hp('.5%'),
  },
});
