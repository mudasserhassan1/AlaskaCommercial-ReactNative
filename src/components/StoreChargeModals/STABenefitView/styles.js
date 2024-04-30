import {StyleSheet} from 'react-native';
import {COLORS} from '../../../theme';
import {getFontSize} from '../../../theme';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.GRAY_1,
    paddingHorizontal: 10,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
  firstNameInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderRightWidth: 0,
    marginHorizontal: 0,
    flex: 1,
  },
  lastNameInput: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginHorizontal: 0,
    flex: 1,
  },
  purchaseInput: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 0,
    marginBottom: 10,
  },
  accountInput: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  divider: {marginVertical: 24},
});

export default styles;
