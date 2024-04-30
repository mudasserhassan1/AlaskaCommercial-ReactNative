import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../../theme';

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  textFieldWrapper: {
    borderWidth: 1,
    borderRadius: wp('2%'),
    borderColor: COLORS.GRAY_2,
    marginStart: wp('5.5%'),
    marginRight: wp('6%'),
    justifyContent: 'center',
    marginVertical: 5,
    height: 52,
    paddingHorizontal: wp('3%'),
  },
});

export default styles;
