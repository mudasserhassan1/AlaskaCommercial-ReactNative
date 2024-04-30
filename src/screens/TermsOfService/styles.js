import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  contentView: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
  },
  contentHeader: {height: 20, backgroundColor: COLORS.WHITE},
});
