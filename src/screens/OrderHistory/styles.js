import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, COLORS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES, SCREEN_HEIGHT} from '../../constants/Common';

export const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },
  itemContainer: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  dateStyle: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
  },
  listContainer: {
    flexGrow: 1,
  },
  listContentContainer: {
    paddingBottom: SCREEN_HEIGHT * 0.13,
    flexGrow: 1,
  },
  orderListCardParent: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
  },
  dateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reOrderTextStyle: {
    fontSize: getFontSize(13),
    fontWeight: '500',
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.MAIN,
  },
  priceTextStyle: {
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Regular',
    marginTop: hp('1%'),
  },
  divider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
  },
  shipStatus: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Semibold',
    marginStart: wp('3%'),
  },
  shippedType: {
    fontSize: getFontSize(13),
    fontWeight: '500',
    fontFamily: 'SFProDisplay-Regular',
    marginStart: wp('1%'),
    color: COLORS.BLACK_40,
  },
  orderStatus: {
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Regular',
  },
  authHeaderImage: {
    tintColor: COLORS.WHITE,
    height: 24,
    width: 24,
  },
  listEmptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderImage: {
    width: 100,
    height: 100,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  placeHolderText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    marginTop: hp('1%'),
  },
  listFooterView: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  parent: {
    height: SCREEN_HEIGHT - 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP('6%'),
  },
  guestRestrictionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(18),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: -0.35,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: heightPercentageToDP('4%'),
    backgroundColor: COLORS.MAIN,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: widthPercentageToDP('2%'),
    marginBottom: 10,
    marginStart: widthPercentageToDP('6%'),
    marginRight: widthPercentageToDP('6%'),
  },
  dialogBoxMessage: {
    paddingHorizontal: 15,
    marginTop: 5,
  },
});
