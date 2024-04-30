import {StyleSheet} from 'react-native';
import {COLORS, FONTS, getFontSize} from '../../theme';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.WHITE,
  },
  listFooterView: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  departmentImageView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp('6%'),
  },
  headerText: {
    // marginStart: wp('5%'),
    fontSize: getFontSize(16),
    fontFamily: FONTS.REGULAR,
    letterSpacing: 0,
    flexShrink: 1,
    color: COLORS.BLACK,
  },
  separator: {
    height: 1.5,
    backgroundColor: COLORS.GRAY_1,
    width: '100%',
    marginLeft: wp('6%'),
    marginRight: wp('6%'),
  },
  wrapper: {
    backgroundColor: COLORS.WHITE,
    height: 70,
    justifyContent: 'center',
    marginStart: wp('2%'),
    width: '95%',
  },
});
