import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {FONTS, COLORS, getFontSize, getFontWeight} from '../../theme';
import {SCREEN_WIDTH} from '../../constants/Common';

export const styles = StyleSheet.create({
  mainContainer: {
    height: hp('22%'),
    flex: 1,
    // maxHeight: hp('25%'),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingHorizontal: widthPercentageToDP('2%'),
  },
  header: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(21),
    paddingHorizontal: wp(10),
    lineHeight: 23,
    letterSpacing: -0.38,
    color: COLORS.WHITE,
    textAlign: 'center',
    fontWeight: '900',
  },
  description: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(16),
    lineHeight: 16,
    paddingTop: 6,
    paddingHorizontal: wp(8),
    color: COLORS.WHITE,
    letterSpacing: -0.38,
    textAlign: 'center',
  },
  blackTransparencySize: {
    height: '100%',
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: hp(1.6),
    alignSelf: 'center',
  },
  skip: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(17),
    lineHeight: 22,
    color: COLORS.BLACK,
  },
  blackTransparencyContainer: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
  },

  arrowImageStyle: {
    width: 12,
    height: 21,
  },
  arrowRightImageStyle: {
    width: 12,
    height: 21,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  arrowText: {
    fontSize: 24,
    color: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText1: {
    fontSize: 20,
    color: 'white',
  },
  centerText2: {
    fontSize: 20,
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  shopNowWrapper: {
    position: 'absolute',
    bottom: hp('3%'),
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: heightPercentageToDP(10),
  },
  shopNowText: {
    fontSize: Platform.OS === 'ios' ? getFontSize(12) : getFontSize(14),
    fontFamily: FONTS.SEMI_BOLD,
    fontStyle: 'normal',
    letterSpacing: -0.04,
    color: COLORS.BLACK,
  },
});
