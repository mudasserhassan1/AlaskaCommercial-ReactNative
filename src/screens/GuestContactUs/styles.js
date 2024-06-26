import {StyleSheet, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize, COLORS} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: hp('2%'),
    justifyContent: 'center',
  },
  textWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  textHeader: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
    paddingTop: hp('2%'),
    paddingVertical: hp('1%'),
  },
  editProfileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('2%'),
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
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
  descriptionText: {
    fontSize: Platform.OS === 'ios' ? 19 : 17,
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.GRAY_6,
    lineHeight: 22,
    marginTop: hp('.8%'),
    letterSpacing: -0.41,
  },
  selectedTopic: {
    color: COLORS.GRAY_5,
    alignSelf: 'center',
    fontSize: getFontSize(15),
  },
  topicselectContainer:{
    marginTop: hp('2%'),
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    justifyContent: 'center',
  },
  topicContainer: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  selectTopicView: {
    width: '100%',
    height: 50,
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: COLORS.GRAY0_25,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: wp('2%'),
    marginTop: hp('2%'),
  },
  descriptionInputView: {
    height: 120,
    marginTop: hp('1.5%'),
    borderWidth: 1,
    borderRadius: wp('2%'),
    borderColor: COLORS.GRAY0_25,
  },
  descriptionInput: {
    height: 85,
    opacity: 6,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    textAlignVertical: 'top',
    color:COLORS.BLACK
  },
  rightArrowImage: {
    width: 10,
    height: 15,
    alignSelf: 'center',
    marginRight: wp('4%'),
  },
  topicItem: {
    paddingVertical: hp('1.5%'),
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
  topicText: {
    marginStart: wp('1.5%'),
    fontSize: Platform.OS === 'ios' ? 17 : 15,
  },
  separator: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    width: '100%',
    alignSelf: 'center',
  },
  callText: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'SFProDisplay-Regular',
    lineHeight: 20,
    letterSpacing: -0.15,
    textAlign: 'center',
    color: COLORS.GRAY_6,
    marginTop: hp('1%'),
  },
  contactNumber: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    letterSpacing: -0.2,
    textAlign: 'center',
    color: COLORS.BLACK,
    lineHeight: 20,
    fontFamily: 'SFProDisplay-Medium',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  storeContactNumber: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: -0.15,
    textAlign: 'center',
    color: COLORS.GRAY_6,
  },
  contactNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  customerCareContact: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    letterSpacing: -0.2,
    textAlign: 'center',
    color: COLORS.BLACK,
    lineHeight: 20,
    fontFamily: 'SFProDisplay-Medium',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
    marginTop: hp('1%'),
  },
  counterText: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    lineHeight: 20,
    height: 35,
    letterSpacing: -0.15,
    color: COLORS.CHARCOAL_GREY_60,
    textAlign: 'right',
    paddingHorizontal: 20,
    fontFamily: 'SFProDisplay-Regular',
  },
  personalInfoContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
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
  input: {
    height: 50,
    opacity: 6,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    paddingLeft: 10,
    color: COLORS.BLACK,
    borderRadius: wp('2%'),
  },
  guestInfo: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
  errorStyle: {
    width: wp('90%'),
    marginTop: Platform.OS === 'ios' ? 6 : 3,
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.29,
  },
});
