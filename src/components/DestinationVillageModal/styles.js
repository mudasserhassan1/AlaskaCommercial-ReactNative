import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';

export default StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
  inputsWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    borderWidth: 1,
    borderRadius: hp('1%'),
    borderColor: COLORS.GRAY_2,
    justifyContent: 'center',
  },
  inputRow: {flexDirection: 'row'},
  inputFullRowItem: {width: '100%'},
  rowItem: {width: '49.5%'},
  changePassword: {
    fontSize: getFontSize(17),
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    color: COLORS.BLACK,
    marginTop: hp('.5%'),
  },
  verticalSeparator: {
    height: 50,
    width: 1,
    backgroundColor: COLORS.GRAY0_5,
  },
  modal_divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
  },
  input: {
    height: 50,
    opacity: 6,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    paddingLeft: 10,
    color: COLORS.BLACK,
    borderRadius: wp('2%'),
  },
  invalidZipCodeAlertTitle: {width: '70%', alignSelf: 'center'},
  dialogMessageContainer: {
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('3%'),
  },
  bushinformation: {
    display: 'flex',
    flexDirection: 'row',

    width: '100%',
  },
  stateInput:{
    marginStart:"35%",
    borderLeftWidth:1,
    borderLeftColor:COLORS.GRAY_2
  }
});
