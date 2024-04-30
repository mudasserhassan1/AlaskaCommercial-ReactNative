import {StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {getFontSize} from '../../../theme';
import {COLORS} from '../../../theme';

const styles = StyleSheet.create({
  container: {},
  buttonBottom: {
    marginTop: heightPercentageToDP('2%'),
    alignSelf: 'center',
    backgroundColor: COLORS.MAIN,
  },
  singleUseText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    color: COLORS.MAIN,
  },
  singleUseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightPercentageToDP('2%'),
  },
});

export default styles;
