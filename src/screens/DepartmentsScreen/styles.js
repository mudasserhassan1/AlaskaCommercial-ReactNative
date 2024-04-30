import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {getFontSize} from '../../theme';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';

export default StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f4f4f4'},
  content: {
    backgroundColor: '#fff',
  },
  screenWrapper: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.WHITE,
    paddingBottom: 0,
  },
  listContainer: {
    paddingBottom: 40,
    backgroundColor: COLORS.WHITE,
  },
  productItem: {
    width: SCREEN_WIDTH,
    paddingBottom: 10,
  },
  searchComponentWrapper: {
    height: 75,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopContainer: {
    flex: 1,
  },
  infoWrapper: {
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  item: {
    fontSize: 18,
    height: 44,
  },
  divider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginTop: hp('1.5%'),
  },
  headerBackImage: {tintColor: COLORS.WHITE, height: 24, width: 24},
  listHeaderView: {
    marginStart: wp('6%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
  },
  listHeaderText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Semibold',
    letterSpacing: -0.03,
    lineHeight: 25,
  },
  listFooterView: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  line: {
    borderBottomColor: COLORS.MAIN,
    borderBottomWidth: 2,
    width: '100%',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingStart: wp('6%'),
    paddingEnd: wp('7.5%'),
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingTop: 30,
    paddingBottom: 16,
  },
  featureText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(21),
    color: COLORS.BLACK,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  changeText: {
    color: COLORS.MAIN,
    lineHeight: 17.9,
    letterSpacing: -0.31,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(14),
  },
  searchtext: {
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 21,
    lineHeight: 25,
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('2%'),
  },
});
