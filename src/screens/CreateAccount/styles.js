import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  wrapper: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  errorStyle: {
    width: wp('90%'),
    marginTop: Platform.OS === 'ios' ? 6 : 3,
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.29,
  },
  subtitle: {
    color: '#000',
    fontSize: Platform.OS === 'ios' ? 23 : 20,
    fontWeight: '600',
    textAlign: 'left',
    width: wp('90%'),
    fontStyle: 'normal',
    fontFamily: 'SFProDisplay-Semibold',
  },
  passwordSettingInstructionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: Platform.OS === 'ios' ? 20 : 17,
    width: wp('90%'),
    fontStyle: 'normal',
  },
  marginTop: {
    marginTop: hp('2%'),
  },
  marginTop1: {
    marginTop: hp('1.2%'),
  },
  bottomTextStyle: {
    marginStart: wp('2%'),
    color: COLORS.GRAY_6,
    fontSize: Platform.OS === 'ios' ? 18 : 15,
    fontStyle: 'normal',
    width: wp('80%'),
  },
  underLinedText: {
    marginStart: wp('2%'),
    color: COLORS.GRAY_6,
    fontSize: Platform.OS === 'ios' ? 18 : 15,
    fontStyle: 'normal',
    width: wp('80%'),
    textDecorationLine: 'underline',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp('1%'),
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('4%'),
  },
  radioUnchecked: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: COLORS.GRAY_TEXT_0_78,
    justifyContent: 'center',
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: COLORS.GRAY_TEXT_0_78,
  },
  phoneInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    width: wp('90%'),
    marginTop: hp('1.2%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    backgroundColor: COLORS.WHITE,
  },
  phoneInput: {
    width: '90%',
    color: 'black',
    paddingLeft: wp('2.5%'),
    fontFamily: 'SFProDisplay-Regular',
    fontStyle: 'normal',
    fontSize: Platform.OS === 'ios' ? 18 : 15,
  },
});
