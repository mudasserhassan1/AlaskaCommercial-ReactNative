import {Platform, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackImage: {
    tintColor: COLORS.WHITE,
    height: 24,
    width: 24,
  },
  settingsWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
  },
  textWrapper: {
    marginTop: hp('3%'),
  },
  textHeader: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    paddingBottom: hp('1%'),
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 22,
    color: '#000000',
    marginStart: wp('6%'),
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
