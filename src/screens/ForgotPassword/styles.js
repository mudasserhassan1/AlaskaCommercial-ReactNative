import {StyleSheet, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';

export const styles = StyleSheet.create({
  headerBackImage: {
    tintColor: COLORS.BLACK,
    height: 24,
    width: 24,
  },
  wrapper: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  errorStyle: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('4%'),
    height: hp('2%'),
    marginBottom: hp('-1.2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: hp('1.3%'),
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
  inputFieldWrapper: {
    marginStart: wp('2%'),
    marginEnd: wp('2%'),
    alignItems: 'center',
    marginTop: hp('.5%'),
  },
  subtitle: {
    color: COLORS.BLACK,
    fontSize: Platform.OS === 'ios' ? 23 : 20,
    fontWeight: '700',
    textAlign: 'left',
    width: wp('90%'),
    fontFamily: 'SFProDisplay-Medium',
  },
  instructionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: Platform.OS === 'ios' ? 20 : 17,
    width: wp('90%'),
    color: COLORS.GRAY_5,
  },
  marginTop: {
    marginTop: hp('2%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
});
