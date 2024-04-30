import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

export const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },
  headerBackImageStyle: {tintColor: COLORS.WHITE, height: 24, width: 24},
  headingText: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(18),
    color: '#000000',
  },
  orderListTopHeader: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
  },
  orderListHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  emptyParentView: {
    flex: 1,
    height: hp('70%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListPlaceholderImage: {
    width: 100,
    height: 100,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  emptyListDescriptionText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    marginTop: hp('1%'),
  },
});
