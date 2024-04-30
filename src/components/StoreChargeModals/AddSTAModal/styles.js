import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../../theme';
import {FONTS, getFontSize} from '../../../theme';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(6),
  },
  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.GRAY_1,
    paddingHorizontal: 10,
    marginHorizontal: wp(6),
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
  firstNameInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
    marginHorizontal: 0,
    flex: 1,
  },
  lastNameInput: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginHorizontal: 0,
    flex: 1,
  },
  accountInput: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
  },
  planText: {
    fontSize: getFontSize(15),
    color: COLORS.GRAY_4,
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: COLORS.BLACK,
    fontSize: getFontSize(13),
    fontFamily: FONTS.SEMI_BOLD,
  },
  divider: {marginVertical: 24},
});

export default styles;
