import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../../theme';
import {getFontSize, getFontWeight} from '../../../theme';

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
  headerCrossImage: {tintColor: COLORS.BLACK},
  modalView: {
    marginHorizontal: wp('6%'),
  },
  errorTextStyle: {
    marginHorizontal: 0,
  },
  pinView: {
    height: 90,
  },
  modalContainer: {
    marginTop: 10,
  },
  barCodeText: {
    letterSpacing: 5,
    fontWeight: getFontWeight('600'),
  },
  subHeaderText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    lineHeight: 16,
    letterSpacing: -0.33,
    color: COLORS.BLACK,
  },
  accountNumber: {
    height: 18,
    fontSize: getFontSize(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.24,
    marginStart: wp('2%'),
    color: COLORS.CHARCOAL_GREY_60,
  },
  availableBalanceText: {
    fontSize: getFontSize(15),
    lineHeight: 16,
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.GRAY_6,
    paddingTop: hp('2%'),
  },
  barCodeView: {
    paddingBottom: 5,
    paddingTop: 5,
    borderWidth: 1,
    borderColor: COLORS.GRAY_4,
    marginBottom: hp('1%'),
    marginTop: hp('2.3%'),
  },
  btnWrapper: {
    width: '100%',
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    marginTop: hp('1.2%'),
    borderRadius: wp('2%'),
    marginBottom: 10,
  },
  topicContainer: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  descriptionInputView: {
    height: 120,
    marginTop: hp('1.5%'),
    borderWidth: 1,
    borderRadius: wp('2%'),
    borderColor: COLORS.GRAY0_25,
  },
  crossButtonView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // width: 90,
  },
  crossIcon: {
    width: 218,
    height: 28,
  },
  erroMessage: {
    marginHorizontal: 0,
    marginTop: 10,
  },
  listItemSeparator: {
    borderBottomWidth: 1,
    width: '100%',
    borderColor: COLORS.GRAY0_5,
  },
  listRow: {
    width: '100%',
    paddingHorizontal: wp('1%'),
    paddingVertical: wp('3%'),
    alignSelf: 'center',
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnchecked: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.BLACK,
  },
  uncheckedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.GRAY0_15,
  },
  descriptionView: {
    flexDirection: 'row',
    marginStart: wp('3.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Medium',
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  descriptionText: {
    color: COLORS.GRAY_6,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Regular',
    marginTop: hp('0.7%'),
  },
  inputContainer: {
    marginStart: wp('7%'),
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: wp('2%'),
    width: wp('42%'),
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GRAY_2,
    borderWidth: 1,
    borderRadius: 10,
    height: 52,
  },
  dollar: {
    color: COLORS.GRAY_03,
    fontSize: getFontSize(11),
    fontFamily: 'SFProDisplay-Regular',
  },
  input: {
    fontSize: getFontSize(11),
    flex: 1,
    height: '100%',
  },
  remainingBalanceText: {
    fontSize: getFontSize(12),
    lineHeight: 16,
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.GRAY_6,
    paddingTop: hp('1%'),
    paddingBottom: hp('.5%'),
  },
  textFieldWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.GRAY_2,
    justifyContent: 'center',
    marginVertical: 5,
    height: 52,
    marginTop: 15,
    paddingHorizontal: wp('3%'),
  },
});

export default styles;
