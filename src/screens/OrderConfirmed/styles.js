import {Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },
  headerBackImage: {
    tintColor: COLORS.WHITE,
    height: 24,
    width: 24,
  },
  scrollContainer: {paddingBottom: 50},
  topHeaderInfoContainer: {
    marginVertical: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfoText: {
    fontSize: getFontSize(34),
    fontFamily: FONTS.BOLD,
    lineHeight: 41,
    letterSpacing: 0.37,
    textAlign: 'center',
    color: COLORS.BLACK,
  },
  headerDescriptionText: {
    fontSize: getFontSize(16),
    fontFamily: FONTS.REGULAR,
    color: COLORS.CHARCOAL_GREY_60,
    textAlign: 'center',
    width: '70%',
    marginTop: hp('1.5%'),
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  ordernumber: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
    width: '95%',
    marginStart: wp('6%'),
    alignSelf: 'center',
  },
  listWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    paddingTop: hp('1.2%'),
    paddingBottom: hp('0.2%'),
  },
  billingAmountWrapper: {
    marginTop: hp('1%'),
    paddingBottom: hp('1%'),
  },
  billingTextWrapper: {
    flexDirection: 'row',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    alignItems: 'center',
  },
  billingTextStyle: {
    color: COLORS.GRAY_TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 24,
    letterSpacing: -0.36,
  },
  orderStatusWrapper: {
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: 'SFProDisplay-Semibold',
  },
  itemStatusWrapper: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.WHITE,
    paddingVertical: hp('1.2%'),
  },
  itemStatusInnerWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
  },
  orderTextStyle: {
    color: COLORS.MAIN,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: FONTS.REGULAR,
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('1%'),
  },
  disclaimerWrapper: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  disclaimerText: {
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.GRAY_TEXT,
    marginTop: hp('.7%'),
    fontFamily: FONTS.REGULAR,
  },
  textWrapper: {
    marginTop: hp('2%'),
  },
  infoWrapper: {
    marginTop: hp('1.2%'),
    justifyContent: 'center',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  labelText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
  },
  labelInfo: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    letterSpacing: -0.25,
    lineHeight: 22,
    color: COLORS.BLACK,
    marginTop: hp('.5%'),
  },
  rowDivider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    marginTop: hp('1.2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  infoButton: {
    paddingRight: 5,
    marginStart: 5,
  },
  infoIcon: {
    width: 15,
    height: 15,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  modalText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
    marginHorizontal: wp('6%'),
    fontSize: getFontSize(15),
    lineHeight: 24,
  },
});
export {styles};
