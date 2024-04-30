import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS, FONTS, getFontSize} from '../../theme';

const styles = StyleSheet.create({
  filtersWrapper: {
    flexDirection: 'row',
  },
  wrapper: {
    marginBottom: hp('1.7%'),
    paddingVertical: 10,
    backgroundColor: COLORS.WHITE,
  },
  filterTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginRight: wp('6%'),
  },
  filterText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  clearWrapper: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  clear: {
    color: COLORS.MAIN,
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    alignSelf: 'flex-end',
    letterSpacing: -0.26,
    textAlign: 'right',
  },
  sortByWrapper: {
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    marginStart: wp('6%'),
  },
  priceText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 22,
    letterSpacing: -0.36,
    color: COLORS.BLACK,
  },
  priceSortText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 22,
    color: COLORS.BLACK,
    marginRight: 15,
  },
  priceFilterText: {
    justifyContent: 'center',
  },
  priceFilterIcon: {
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
  },
  modalDivider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    marginStart: wp('6%'),
  },
  buttonWrapper: {
    borderColor: COLORS.GREY_5,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  loader: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default styles;
