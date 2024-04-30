import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';

const styles = StyleSheet.create({
  modal: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH * 0.8,
  },
  wrapper: {
    // marginBottom: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
    paddingStart: wp('6%'),
  },
  filterTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  filterText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
    marginHorizontal: 8,

    height:20
  },
  clearWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingRight: wp('6%'),
  },
  clear: {
    color: COLORS.MAIN,
    fontSize: getFontSize(13),
    fontFamily: FONTS.REGULAR,
    alignSelf: 'flex-end',
    letterSpacing: -0.26,
    textAlign: 'right',
  },
  filterIcon: {width: 15, height: 15},
  filtersContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: COLORS.MAIN_SHADE_II,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filter: {
    color: COLORS.MAIN,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    lineHeight: 16,
    marginHorizontal: 8,
  },
  closeIcon: {width: 14, height: 14},
  loader: {
    marginBottom: 10,
  },
});

export default styles;
