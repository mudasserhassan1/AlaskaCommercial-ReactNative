import {StyleSheet} from 'react-native';
import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  headerTitleText: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    letterSpacing: -0.24,
    fontStyle: 'normal',
  },
  headerTitleView: {
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginStart: wp('6%'),
    paddingVertical: hp('1.5%'),
  },
  notificationCardContainer: {
    backgroundColor: 'white',
    // height: 110,
    paddingVertical: 10,
    justifyContent: 'center',
    marginStart: wp('6%'),
    paddingEnd: wp('6%'),
  },
  storeInnerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  bottomLabelText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('3%'),
    letterSpacing: -0.36,
    flexShrink: 1,
  },
  labelInfo: {
    fontSize: 14,
    marginTop: hp('.2%'),
    fontFamily: FONTS.REGULAR,
    color: COLORS.GRAY_67,
    marginStart: wp('3%'),
  },
  actionButton: {
    backgroundColor: COLORS.MAIN,
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: '100%',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100%',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  notificationImageView: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    // paddingTop: hp('1%'),
    flex: 1,
  },
  notificationImage: {
    height: 20,
    width: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  notificationDescriptionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexShrink: 1,
  },
  notificationTimeText: {
    color: COLORS.CHARCOAL_GREY_60,
    fontSize: getFontSize(15),
    letterSpacing: -0.24,
    fontFamily: FONTS.REGULAR,
    flexShrink: 1,
  },
  separator: {
    width: '94%',
    alignSelf: 'flex-end',
    height: 1,
    backgroundColor: COLORS.GRAY0_5,
  },
  redDot: {
    marginRight: wp('3%'),
    marginLeft: wp('0.3%'),
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.MAIN,
    alignSelf: 'center',
  },
  deleteIcon: {
    height: 20,
    width: 20,
  },
  listFooterView: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  loader: {
    marginVertical: 20,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export default styles;
