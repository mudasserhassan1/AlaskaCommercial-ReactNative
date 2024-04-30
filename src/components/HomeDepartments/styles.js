import {StyleSheet} from 'react-native';
import {COLORS, FONTS, getFontSize} from '../../theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {PROMO_CROSS_ICON_WIDTH, SCREEN_WIDTH} from '../../constants/Common';

const styles = StyleSheet.create({
  promoParentView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTicker: {
    color: COLORS.WHITE,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    lineHeight: 25,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  promoContainer: {
    height: hp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
  },
  promoTextView: {
    width: SCREEN_WIDTH - PROMO_CROSS_ICON_WIDTH,
    alignItems: 'center',
  },
  promoActionIconView: {
    width: PROMO_CROSS_ICON_WIDTH,
    alignItems: 'flex-start',
  },
  featuredDeptWrapper: {
    backgroundColor: COLORS.LIGHT_RED,
    height: hp(16),
    width: hp(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(8),
  },
});

export default styles;
