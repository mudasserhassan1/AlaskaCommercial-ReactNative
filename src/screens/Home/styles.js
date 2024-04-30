import {StatusBar, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';
import {SCREEN_HEIGHT} from '../../constants/Common';
import {isiPhone7or8} from '../../utils/DeviceModal';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  parentView: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  featuredProductsWrapper: {
    backgroundColor: COLORS.WHITE,
    // paddingStart:wp('6%')
  },
  homeDepartmentsWrapper: {
    backgroundColor: COLORS.WHITE,
    paddingBottom: hp('9%'),
  },
  storeImage: {
    width: 15,
    height: 12,
  },
  searchView: {
    flexGrow: 1,
    backgroundColor: '#fff',
    // paddingLeft: wp('6%'),
  },
  walletIcon: {
    width: 12,
    height: 15,
  },
  scrollContentContainer: {
    paddingBottom: SCREEN_HEIGHT * 0.19,
    flexGrow: 1,
  },
  departmentImage: {
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: hp('1%'),
  },
  storeImageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(21),
    letterSpacing: -0.3,
    lineHeight: 25,
    color: COLORS.BLACK,
  },
  userNameWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('6%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  userName: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(20),
    color: COLORS.BLACK,
  },
  zipCodeText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    color: COLORS.WHITE,
    lineHeight: 20,
    // marginStart: wp('2%'),
  },
  changeLocationText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    color: COLORS.WHITE,
    lineHeight: 20,
    marginStart: wp('1.5%'),
  },
  zipCodeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('0.8%'),
    // marginTop: hp('2%'),
    marginHorizontal: wp('6%'),
    alignItems: 'center',
  },
  changeLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // // marginTop: hp('2%'),
    // marginHorizontal: wp('6%'),
    alignItems: 'center',
  },
  changeText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    color: COLORS.MAIN,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    width: '90%',
    alignSelf: 'center',
  },
  deptCardContainer: {
    // width: 95,
    paddingVertical: hp('1%'),
    // marginTop: hp('3%'),
    // marginHorizontal: wp('3%'),
    marginStart: wp('3%'),
    // borderWidth:2,
    // borderColor:"black"
  },
  searchComponentWrapper: {
    height: 75,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deptItemWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoWrapper: {
    // paddingVertical: hp('0.8%'),
    justifyContent: 'center',
    backgroundColor: COLORS.MAIN,
  },
  departmentContainer: {flexDirection: 'row'},
  departmentName: {
    flexShrink: 1,
    width: wp('30%'),
    marginTop: hp('1.5%'),
    fontSize: getFontSize(12),
    color: COLORS.BLACK,
    textAlign: 'center',
    fontFamily: FONTS.SEMI_BOLD,
  },
  listContentContainer: {
    paddingRight: wp('8%'),
    paddingStart: wp('3.2%'),
  },
  searchLoadingStyle: {
    right: wp('1%'),
  },
});
export {styles};
