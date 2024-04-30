import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    alignSelf: 'center',
  },
  headerBackImage: {
    height: 24,
    width: 24,
  },
  webView: {
    width: wp('100%'),
    flexGrow: 1,
  },
  divider: {
    height: 20,
    backgroundColor: COLORS.WHITE,
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
});
