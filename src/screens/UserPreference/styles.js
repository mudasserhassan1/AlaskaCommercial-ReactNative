import {Platform, StatusBar, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackImage: {
    tintColor: COLORS.WHITE,
    height: 24,
    width: 24,
  },
  divider: {
    height: 2,
    width: '90%',
    backgroundColor: COLORS.GRAY0_5,
    marginTop: hp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {justifyContent: 'center', alignItems: 'center'},
  buttonWrapperContainer: {marginTop: hp('2%')},
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginBottom: 20,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  userPreferenceWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    paddingBottom: hp('1.7%'),
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
    ...Platform.select({
      android: {
        bottom: 0,
        width: '100%',
        position: 'absolute',
      },
    }),
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
    borderColor: COLORS.GRAY0_15,
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
    marginTop: hp('1%'),
  },
  textHeader: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    marginTop: hp('1.5%'),
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
  locationText: {
    fontFamily: FONTS.REGULAR,
    fontSize: Platform.OS === 'ios' ? 19 : 17,
    marginTop: hp('1.5%'),
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.28,
    color: COLORS.BLACK,
    fontWeight: 'normal',
  },
  nearByText: {
    fontFamily: FONTS.REGULAR,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    marginTop: hp('.8%'),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
  fieldWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  bandwidthWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('2%'),
  },
  bandwidthText: {
    fontSize: Platform.OS === 'ios' ? 22 : 17,
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
    maxHeight: hp('70%'),
  },
  listRow: {
    width: '92%',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('3%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
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
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('2.5%'),
  },
  descriptionText: {
    color: COLORS.GRAY_6,
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionView: {
    flexDirection: 'row',
    marginStart: wp('6.5%'),
    marginTop: hp('0.8%'),
  },
  itemNamesView: {
    flexDirection: 'row',
    marginStart: wp('2%'),
  },
  separator: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
  addIcon: {
    width: 9,
    height: 9,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  createListText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('2%'),
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
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
  errorStyle: {
    width: wp('90%'),
    justifyContent: 'center',
    marginTop: hp('.5%'),
    marginBottom: -6,
    height: hp('2%'),
  },
  errorText: {
    color: COLORS.MAIN,
    fontSize: hp('1.7%'),
  },
  dialogMessageContainer: {
    marginTop: hp('0.5%'),
    paddingHorizontal: wp('3%'),
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
