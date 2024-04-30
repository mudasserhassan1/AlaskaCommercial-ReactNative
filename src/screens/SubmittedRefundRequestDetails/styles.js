import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  screen: {flexGrow: 1},
  shopContainer: {
    flex: 1,
  },
  refundRow: {
    width: '85%',
  },
  confirmationTextContainer: {
    marginTop: Platform.OS === 'ios' ? hp('4%') : hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: getFontSize(34),
    fontFamily: FONTS.BOLD,
    lineHeight: 41,
    letterSpacing: 0.37,
    textAlign: 'center',
    color: COLORS.BLACK,
  },
  headerLeft: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerLeftImage: {
    tintColor: COLORS.WHITE,
    height: 24,
    width: 24,
  },
  sectionDivider: {
    height: heightPercentageToDP('1.7%'),
    backgroundColor: '#f4f4f4',
  },
  listHeader: {
    flex: 1,
  },
  itemsText: {
    marginStart: wp('6%'),
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    marginTop: hp('1%'),
  },
  confirmationTextDescription: {
    fontSize: getFontSize(16),
    fontFamily: FONTS.REGULAR,
    marginTop: heightPercentageToDP('1.5%'),
    lineHeight: 20,
    letterSpacing: -0.32,
    textAlign: 'center',
    width: '75%',
    color: COLORS.CHARCOAL_GREY_60,
  },
  refundOrderInfoContainer: {
    paddingVertical: heightPercentageToDP('1.7%'),
    backgroundColor: 'white',
    marginTop: heightPercentageToDP('1.7%'),
    paddingHorizontal: widthPercentageToDP('6%'),
  },
  refundOrderNumber: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(18),
    letterSpacing: -0.35,
    color: COLORS.BLACK,
  },
  refundOrderInfoText: {
    marginTop: heightPercentageToDP('1.7%'),
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    letterSpacing: -0.26,
    color: COLORS.BLACK,
  },
  invoiceInfoContainer: {
    marginTop: hp('.5%'),
    paddingBottom: hp('1%'),
  },
  totalAmountText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    letterSpacing: -0.36,
    color: COLORS.BLACK,
  },
  headerLabel: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: COLORS.BLACK,
  },
  headerDescriptionText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
    marginTop: heightPercentageToDP('.5%'),
  },
  headingText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  headingDescription: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: '#8a8a8e',
    marginTop: heightPercentageToDP('1%'),
  },
  customerInfoRow: {
    marginTop: heightPercentageToDP('1%'),
    justifyContent: 'center',
    marginStart: widthPercentageToDP('6%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
    width: '94%',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginStart: wp('6%'),
  },
  billingDivider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginTop: heightPercentageToDP('1%'),
    width: '100%',
    marginStart: widthPercentageToDP('6%'),
  },
  orderInfo: {
    // justifyContent: 'center',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  billingTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  billingTextRow: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'rgba(190, 30, 45, 0.6)',
  },
  billingTextStyle: {
    color: COLORS.GRAY_TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
  },
  itemStatusWrapper: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemStatusInnerWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    width: '78%',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  buttonWrapper: {
    backgroundColor: '#f4f4f4',
    width: '100%',
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('3%'),
  },
  refundConfirmationDivider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('1%'),
    marginStart: wp('6%'),
  },
});
