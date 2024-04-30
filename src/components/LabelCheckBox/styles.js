import {StyleSheet} from 'react-native';
import {COLORS, FONTS, getFontSize} from '../../theme';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: wp('6%'),
  },
  marketingText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    color: COLORS.GRAY_6,
    marginLeft: 6,
  },
});
export default styles;
