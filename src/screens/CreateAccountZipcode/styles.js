import {Dimensions, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize, COLORS} from '../../theme';
import {SCREEN_HEIGHT} from '../../constants/Common';

export const styles = StyleSheet.create({
  container: {
    paddingBottom: SCREEN_HEIGHT * 0.05,
    flex: 1,
  },
  mainParent: {flexGrow: 1, backgroundColor: COLORS.WHITE},
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginStart: wp('3%'),
    marginEnd: wp('3%'),
  },
  headerBackImage: {tintColor: COLORS.BLACK, height: 24, width: 24},
  buttonWrapperContainer: {
    marginTop: hp('2%'),
    marginStart: wp('3%'),
    marginEnd: wp('3%'),
  },
  checkBox: {
    marginBottom: 10,
  },
  btnWrapper: {
    width: '95%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginBottom: 20,
  },
  userPreferenceWrapper: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: hp('1.7%'),
    flexGrow: 1,
  },
  storeNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    width: wp('90%'),
    marginTop: hp('1.2%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: COLORS.GRAY_4,
    backgroundColor: COLORS.WHITE,
    paddingStart: wp('2%'),
  },
  storeNameText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontStyle: 'normal',
  },
  textWrapper: {
    marginStart: wp('5%'),
    marginTop: hp('3%'),
  },
  textHeader: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(20),
    fontStyle: 'normal',
    letterSpacing: -0.3,
  },
  nearByText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(17),
    marginTop: hp('1%'),
    color: COLORS.GRAY_5,
    marginEnd: wp('6%'),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.34,
  },
  bandwidthWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('3%'),
    paddingVertical: 3,
  },
  bandwidthText: {
    fontSize: getFontSize(17),
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
  },
  errorStyle: {
    width: wp('90%'),
    justifyContent: 'center',
    marginTop: hp('1.5%'),
    marginBottom: -6,
    height: hp('2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: hp('1.7%'),
  },
  backtoLoginText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(17),
    fontFamily: FONTS.MEDIUM,
  },
});
