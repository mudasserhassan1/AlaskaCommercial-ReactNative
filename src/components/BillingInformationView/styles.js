import {Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';
import {FONTS, getFontSize} from '../../theme';

const styles = StyleSheet.create({
  billingTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    marginEnd: wp('6%'),
    alignItems: 'center',
  },
  modalContainer: {
    paddingStart: 0,
    paddingEnd: 0,
  },
  modalHeader: {
    paddingHorizontal: wp('6%'),
  },
  billingTextStyle: {
    color: COLORS.GRAY_TEXT,
    fontFamily: 'SFProDisplay-Regular',
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    lineHeight: 22,
  },
  billingAmountWrapper: {
    marginStart: wp('6%'),
    marginTop: hp('1%'),
    paddingBottom: hp('1.2%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    width: '100%',
    marginTop: hp('1.3%'),
    marginStart: 0,
  },
  infoButton: {
    paddingRight: 5,
    marginStart: 5,
    marginTop: 1,
    flexGrow: 1,
  },
  infoIcon: {
    width: 15,
    height: 15,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  modalText: {
    color: COLORS.BLACK,
    fontFamily: FONTS.REGULAR,
    marginHorizontal: wp('6%'),
    fontSize: getFontSize(15),
    lineHeight: 24,
  },
});

export default styles;
