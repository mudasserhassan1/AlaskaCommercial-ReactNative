import {StyleSheet, Platform} from 'react-native';
import {COLORS, getFontSize} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('2%'),
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
    fontSize: Platform.OS === 'ios' ? 19 : 18,
    paddingVertical: hp('1%'),
    color:COLORS.BLACK
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
  topicselectContainer: {
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
    paddingHorizontal: 10,
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
    marginStart: wp('23%'),
    color: COLORS.GRAY_6,
    marginTop: hp('1%'),
  },
  contactNumber: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    letterSpacing: -0.2,
    textAlign: 'center',
    color: COLORS.BLACK,
    lineHeight: 20,
    // marginTop: hp('1%'),
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
    // marginStart: wp('23%'),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal:hp('10.7%'),
    color: COLORS.GRAY_6,
  },
  contactNumberWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
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
    height: 35,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    lineHeight: 20,
    letterSpacing: -0.15,
    color: COLORS.CHARCOAL_GREY_60,
    paddingHorizontal: 20,
    textAlign: 'right',
    fontFamily: 'SFProDisplay-Regular',
  },
});