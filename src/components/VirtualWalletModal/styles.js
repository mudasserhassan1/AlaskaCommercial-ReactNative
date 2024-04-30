import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize, getFontWeight} from '../../theme';

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
    marginStart: wp('6%'),
    marginRight: wp('6%'),
  },
  modalContainer: {
    flexDirection: 'row',
  },
  barCodeText: {
    letterSpacing: 5,
    fontWeight: getFontWeight('600'),
  },
  subHeaderText: {
    fontSize: getFontSize(15),
    fontWeight: getFontWeight('500'),
    fontStyle: 'normal',
    letterSpacing: -0.36,
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
    height: 18,
    fontSize: getFontSize(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    marginTop: hp('.7%'),
    color: COLORS.CHARCOAL_GREY_60,
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
  loader: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
});

export default styles;
