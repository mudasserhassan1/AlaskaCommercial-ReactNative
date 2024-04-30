import {Platform, StyleSheet} from 'react-native';
import {COLORS, FONTS, getFontSize} from '../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  logoutbutton: {
    borderWidth: 1,
    borderColor: COLORS.MAIN,
    width: '100%',
    backgroundColor: COLORS.WHITE,
  },
  signInButton: {
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    width: '100%',
    backgroundColor: COLORS.MAIN,
  },
  signInButtonText: {
    color: COLORS.WHITE,
    fontSize: getFontSize(17),
    lineHeight: 21,
  },
  logoutbuttontext: {
    color: COLORS.MAIN,
    fontSize: getFontSize(17),
    lineHeight: 21,
  },
  loginbutton: {
    backgroundColor: COLORS.MAIN,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 7 : 80,
  },
  createAccountbutton: {
    width: '100%',
    fontSize: getFontSize(17),
    lineHeight: 20,
    textAlign: 'center',
    // fontFamily: FONTS.REGULAR,
    marginTop: 5,
  },

  sliderwrapper: {
    height: '100%',
    marginHorizontal: wp('6%'),
  },
  subHeaderText: {
    fontSize: getFontSize(21),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 25,
    // paddingTop: 5,
    letterSpacing: -0.28,
  },
  header: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.REGULAR,
    lineHeight: 22,
    color: COLORS.BLACK,
    letterSpacing: -0.34,
  },
  usernameheader: {
    fontSize: getFontSize(32),
    fontFamily: FONTS.BOLD,
    lineHeight: 33,
    width: 200,
    color: COLORS.BLACK,
  },

  iconimages: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  drawerlist: {
    display: 'flex',
    flexDirection: 'row',
    height: global?.isiPhone7or8 ? 10 : 56,
    alignItems: 'center',
  },
  headerwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : 80,
  },
  profileicon: {
    width: 36,
    height: 36,
    marginRight: 10,
  },
  logoutButtonView: {
    position: 'absolute',
    bottom: hp('3%'),
    width: '100%',
  },
  SignUpButtonView:{
    position: 'absolute',
    bottom: hp('2%'),
    width: '100%',
  },
  SignInButtonView:{
    position: 'absolute',
    bottom: global?.isiPhone7or8 ? hp('14%') : hp('8%'),
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
