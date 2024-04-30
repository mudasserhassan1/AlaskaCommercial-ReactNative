import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {IMAGES_RESIZE_MODES, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';
import {FONTS, getFontSize, getFontWeight} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  modalTitle: {
    maxWidth: SCREEN_WIDTH - widthPercentageToDP('18%'),
  },
  modal_divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.TRANSPARENT,
    marginBottom:17,


  },
  verticalSeprator: {
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
  textWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('3%'),
  },
  textHeader: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    paddingBottom: hp('1%'),
  },
  editProfileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editText: {
    color: COLORS.MAIN,
    fontSize: Platform.OS === 'ios' ? 17 : 14,
    fontFamily: 'SFProDisplay-Medium',
  },
  labelText: {
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    fontFamily: 'SFProDisplay-Medium',
  },
  lebelInfo: {
    fontSize: Platform.OS === 'ios' ? 18 : 15,
    marginTop: hp('.8%'),
    fontFamily: 'SFProDisplay-Regular',
  },
  infoWrapper: {
    marginTop: hp('1.2%'),
    justifyContent: 'center',
  },
  bottomLabelText: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
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
    marginVertical: hp('3%'),
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
    fontSize: Platform.OS === 'ios' ? 14 : 13,
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
    fontSize: Platform.OS === 'ios' ? 17 : 15,
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
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: 'SFProDisplay-Medium',
    marginStart: wp('2.5%'),
  },
  descriptionText: {
    color: COLORS.GRAY_6,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
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
    color: COLORS.BLACK,
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    marginStart: wp('5%'),
  },
  selectCardText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginLeft: 10,
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  openModalLabelInfo: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
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
    marginVertical: hp('1.5%'),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedCardsContainer: {
    marginVertical: hp('1.5%'),
  },
  addedCards: {
    flex: 1,
  },
  cardHolderName: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(13),
    color: COLORS.BLACK,
    lineHeight: 25,
  },
  addedCardType: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.GRAY_67,
    lineHeight: 25,
    fontSize: getFontSize(15),
  },
  editButton: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.MAIN,
    lineHeight: 25,
    fontSize: getFontSize(15),
  },
  expired: {
    fontSize: getFontSize(11),
    marginHorizontal: 0,
  },
  zipcodeText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: Platform.OS === 'ios' ? 17 : 14,
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
    paddingBottom: hp('2%'),
    height: '95%',
  },
  safeAreaView: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  errorMessage: {
    color: COLORS.MAIN,
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    lineHeight: 18,
  },
  boldText: {
    fontFamily: FONTS.BOLD,
  },
  savedCardsText: {
    color: COLORS.BLACK,
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    marginHorizontal: wp('6%'),
    letterSpacing: -0.24,
  },
  savedCardText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    marginHorizontal: wp('6%'),
    letterSpacing: -0.24,
  },
  addedContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.WHITE,
    maxHeight: SCREEN_HEIGHT * 0.65,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileAddedContainer: {
    flexGrow: 0,
    marginBottom: 20,
    backgroundColor: COLORS.WHITE,
  },
  errorContainer: {
    marginHorizontal: wp('6%'),
    marginBottom: hp('2.5%'),
    backgroundColor: COLORS.MAIN_SHADE,
    paddingVertical: 10,
    paddingHorizontal: wp('5%'),
    borderRadius: 7,
  },
  errorTextContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: COLORS.MAIN,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    marginTop: 15,
    height: 40,
    marginLeft: 8,
  },
  cancelButtonLabel: {
    fontSize: getFontSize(17),
  },
  addPayment: {},
  modalButton: {
    marginTop: heightPercentageToDP('2%'),
  },
  headerTextStyle: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-SemiBold',
    fontWeight: getFontWeight('600'),
    letterSpacing: -0.24,
    fontStyle: 'normal',
    marginHorizontal: wp('6%'),
    marginVertical: 10,
  },
  selectedAmountContainer: {
    flexDirection: 'row',
    paddingLeft: 3,
    marginTop: 5,
  },
  selectLeftLine: {
    backgroundColor: COLORS.MAIN,
    borderRadius: 5,
    width: 5,
    marginRight: 10,
  },
  selectedAmountText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(13),
    color: COLORS.BLACK,
    lineHeight: 22,
    marginVertical: 1,
  },
  flashStyle: {
    marginBottom: 60,
    alignSelf: 'center',
    padding: 15,
  },
  flashTitle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    lineHeight: 16,
    textAlign: 'center',
  }, checkBoxContainer: {marginEnd: widthPercentageToDP('3'), marginTop: 5},
  freight: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: hp('1.7%'),
    alignSelf: 'stretch',
  },
  freightDivider: {
    marginLeft: wp('5%'),
    marginBottom: hp('1.7%'),
  },
  freightContent: {
    flexDirection: 'row',
    paddingHorizontal: hp('3%'),
  },
  freightText: {
    marginHorizontal: wp('3%'),
    fontSize: 15,
    color: COLORS.BLACK,
  },

});
