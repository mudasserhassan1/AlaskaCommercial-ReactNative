import {StyleSheet} from 'react-native';
import { COLORS, FONTS, getFontSize } from "../../theme";
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  header: {
    marginVertical: 20,
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    color: COLORS.BLACK,
  },
  categoriesTitle: {
    marginHorizontal: wp('6%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(14),
    color: COLORS.MAIN,
  },
});

export default styles;
