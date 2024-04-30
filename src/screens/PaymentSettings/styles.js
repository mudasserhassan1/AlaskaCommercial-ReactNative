import {StyleSheet} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

export default StyleSheet.create({
  parent: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  contentContainer: {
    marginTop: heightPercentageToDP('1.7%'),
    backgroundColor: COLORS.WHITE,
  },
  listHeaderView: {
    width: '94%',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  listHeaderText: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: getFontSize(15),
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  paymentOptionsListView: {
    width: '94%',
    alignSelf: 'flex-end',
  },
  addCreditCardView: {
    height: 64,
    flexDirection: 'row',
    width: '94%',
    alignSelf: 'flex-end',
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
  },
  addCreditCardLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    marginStart: '1%',
  },
  addIcon: {
    width: 9,
    height: 9,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '7.5%',
  },
  rightArrowIcon: {
    width: 8,
    height: 25,
    alignSelf: 'flex-end',
  },
  addCreditCardText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: widthPercentageToDP('2%'),
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  virtualWalletText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: getFontSize(15),
    lineHeight: 22,
    letterSpacing: -0.25,
  },
});
