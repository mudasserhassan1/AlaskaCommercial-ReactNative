import {StyleSheet, Platform} from 'react-native';
import {COLORS} from '../../theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  divider: {
    height: 2,
    width: '94%',
    backgroundColor: COLORS.GRAY0_5,
    marginTop: hp('2%'),
    alignSelf: 'center',
    marginStart: wp('6%'),
  },
  userPreferenceWrapper: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('2%'),
    // paddingBottom: hp('2%'),
  },
  switch: {
    transform: [{scaleX: 0.9}, {scaleY: 0.9}],
    marginEnd: widthPercentageToDP('6%'),
  },
  userPreferenceWrapperII: {
    marginTop: hp('1%'),
  },
  textWrapper: {
    marginStart: wp('6%'),
    marginTop: hp('3%'),
  },
  textHeader: {
    fontFamily: Platform.OS === 'ios' ? 'SFProDisplay-Regular' : 'SFProDisplay-Semibold',
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
    marginStart: wp('6%'),
    marginTop: hp('3%'),
  },
  bandwidthWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: hp('2.5%'),
  },
  bandwidthText: {
    fontSize: Platform.OS === 'ios' ? 20 : 18,
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-Regular',
    marginStart: wp('6%'),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.28,
  },
  marigTop: {
    marginTop: hp('1%'),
  },
  extraInformationText: {
    marginTop: hp('1%'),
    width: '70%',
    marginStart: wp('6%'),
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: -0.15,
    color: COLORS.CHARCOAL_GREY_60,
  },
});
