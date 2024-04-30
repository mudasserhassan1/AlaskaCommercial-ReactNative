import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {FONTS, COLORS, getFontSize} from '../../theme';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'space-between',
  },
  skiButton: {
    position: 'absolute',
    right: wp('6%'),
    alignSelf: 'flex-end',
    padding: 7,
    zIndex: 99999,
  },
  headerContainer: {
    justifyContent: 'flex-end',
    height: 65,
    marginBottom: 20,
  },
  buttonStyle: {
    backgroundColor: COLORS.MAIN,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.MEDIUM,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLORS.WHITE,
  },
  header: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(22),
    lineHeight: 28,
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(18),
    lineHeight: 24,
    color: COLORS.BLACK_40,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtext: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(14),
    lineHeight: 24,
    color: COLORS.BLACK_40,
    textAlign: 'center',
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.55,
    paddingBottom: 30,
    justifyContent: 'flex-end',
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
  itemContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  paginationContainer: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  skip: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(17),
    lineHeight: 22,
    color: COLORS.BLACK,
  },
});
