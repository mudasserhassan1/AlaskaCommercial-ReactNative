import {Platform, StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../theme';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    marginTop: hp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_divider: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImageStyle: {tintColor: '#000'},
  verticalSeparator: {
    height: 50,
    width: '.5%',
    backgroundColor: COLORS.GRAY0_5,
  },
  mainWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    paddingBottom: hp('2%'),
    justifyContent: 'center',
  },
  singleFieldWrapper: {width: '100%'},
  doubleFieldsWrapper: {flexDirection: 'row'},
  halfWidthField: {width: '49.5%'},
  textWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('3%'),
  },
  textHeader: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: getFontSize(15),
    paddingBottom: hp('1%'),
  },
  editProfileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
  },
  labelText: {
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Medium',
  },
  infoWrapper: {
    marginTop: hp('1.2%'),
    justifyContent: 'center',
  },
  bottomLabelText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
  },

  storeWrapper: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    height: 60,
  },
  storeInnerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  shopWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
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
    marginTop: hp('2%'),
  },
  errorStyle: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp('6%'),
    height: hp('2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(12),
  },
  editTextWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deptItemWrapper: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  deptText: {
    marginStart: 30,
    marginEnd: 30,
    marginTop: 12,
    fontSize: getFontSize(15),
    color: COLORS.GRAY_TEXT,
    fontFamily: 'SFProDisplay-Semibold',
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
  listInfoView: {
    marginStart: wp('1%'),
    alignItems: 'center',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: wp('2.5%'),
  },
  descriptionText: {
    color: COLORS.GRAY_6,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Regular',
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  descriptionView: {
    flexDirection: 'row',
    marginStart: wp('6.5%'),
    marginTop: hp('1%'),
  },
  itemNamesView: {
    flexDirection: 'row',
    marginStart: wp('2%'),
  },
  separator: {
    backgroundColor: COLORS.GRAY_5,
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: hp('1%'),
    marginStart: wp('6%'),
  },
  addIcon: {
    width: 9,
    height: 9,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  createListText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: wp('2%'),
    fontWeight: '500',
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  openModalLabelInfo: {
    fontSize: getFontSize(15),
    marginTop: hp('.8%'),
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.GRAY_TEXT,
  },
  rightArrowStyle: {
    width: 10,
    height: 15,
    alignSelf: 'flex-end',
  },
  listRow: {
    width: '90%',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('2%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  zipCodeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    alignItems: 'center',
  },
  zipcodeText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    marginStart: wp('2%'),
  },
  secondContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
  textFieldWrapper: {
    borderWidth: 1,
    borderRadius: wp('2%'),
    borderColor: COLORS.GRAY_2,
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    justifyContent: 'center',
  },
  giftCardModal: {
    height: hp('40%'),
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
  textInputContainer: {
    flex: 1,
    margin: 40,
    alignItems: 'center',
  },
  modalContentContainer: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: wp('10%'),
    // paddingStart: wp('6%'),
    // paddingEnd: wp('6%'),
  },
  safeAreaView: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  billingAddressParent: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 56 : 60,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  billingAddressHeaderWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  billingAddressHeader: {
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-SemiBold',
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: -0.21,
  },
  maskedInputField: {
    height: 50,
    opacity: 6,
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    paddingLeft: 10,
    borderRadius: wp('2%'),
    lineHeight: 22,
    letterSpacing: -0.36,
  },
  header: {
    marginStart: 0,
    marginEnd: 0,
    paddingHorizontal: wp('6%'),
  },
  subtitleText:{
    marginStart:28,
    marginBottom:20,
    fontFamily:FONTS.REGULAR,
    lineHeight:22

  },
  bottomButton: {
    backgroundColor: COLORS.MAIN,
    marginTop: heightPercentageToDP('3%'),
    alignSelf: 'center',
  },
  skipText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    color: COLORS.MAIN,
  },
  loaderStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BLACK_40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  skipButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightPercentageToDP('2%'),
  },
});
