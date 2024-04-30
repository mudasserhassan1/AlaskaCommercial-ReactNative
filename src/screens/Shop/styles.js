import {StyleSheet, Dimensions, Platform} from 'react-native';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
let {height, width} = Dimensions.get('window');
const itemHeight = height / 2 - 8 * 2;
const itemWidth = width * 0.85;
export const shopStyles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
  },
  separator: {
    height: 0.5,
    backgroundColor: COLORS.GRAY_1,
    width: '100%',
    marginLeft: wp('6%'),
    marginRight: wp('6%'),
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    backgroundColor: '#fff',
  },
  headerStyleWrapper: {
    height: Platform.OS === 'ios' ? 56 : 60,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
  },
  headerStyle: {
    width: wp('60%'),
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginStart: wp('6%'),
  },
  headerText: {
    marginStart: wp('5%'),
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-Regular',
  },
  headerTextWrapper: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  headerButtonWrapper: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  searchComponentWrapper: {
    height: 75,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deptText: {
    marginStart: wp('6%'),
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    marginTop: hp('2%'),
    fontFamily: 'SFProDisplay-Regular',
  },
  shopContainer: {
    flex: 1,
  },
  zipCodeText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: Platform.OS === 'ios' ? 15 : 13,
    color: COLORS.BLACK,
    marginStart: wp('2%'),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.26,
  },
  zipCodeWrapper: {
    marginTop: hp('1%'),
    justifyContent: 'center',
    paddingBottom: hp('1.5%'),
  },

  infoWrapper: {
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },

  container: {
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.5%'),
    flex: 1,
  },
  item: {
    fontSize: 18,
    height: 44,
  },
  buttonsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.BLACK_40,
    borderWidth: 1.5,
    width: 120,
    height: 38,
    borderRadius: 6,
    marginTop: hp('2%'),
  },

  addToCartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.MAIN,
    width: 90,
    height: 38,
    borderRadius: 6,
    marginTop: hp('2%'),
    marginStart: wp('4%'),
  },

  verticalSeprator: {
    height: 38,
    width: 1.5,
    backgroundColor: COLORS.BLACK_40,
  },
  divider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    // marginStart: wp('6%'),
    // marginEnd: wp('6%'),
    marginTop: hp('1.5%'),
  },
  notAvailableProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: hp('4%'),
    marginTop: hp('2%'),
  },

  emptyItem: {
    overflow: 'hidden',
    height: itemHeight,
    alignItems: 'center',
    justifyContent: 'center',
    width: itemWidth,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 22,
    fontWeight: '300',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textWrapper: {
    marginStart: wp('6%'),
    marginTop: hp('3%'),
  },
  eligibleText: {
    marginTop: hp('1%'),
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: 'SFProDisplay-Regular',
  },
  featureText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: Platform.OS === 'ios' ? 19 : 16,
    color: COLORS.BLACK,
  },
  userNameWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    alignItems: 'center',
  },
  changeText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: Platform.OS === 'ios' ? 17 : 14,
    color: COLORS.MAIN,
  },
  cardContainer: {
    width: wp('35%'),
    marginTop: hp('3%'),
    // backgroundColor:'red',
    marginStart: wp('6%'),
  },
  featuredProductImage: {
    height: hp('12%'),
    width: wp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  onSaleText: {
    marginTop: hp('2%'),
    fontSize: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.MAIN,
    fontFamily: 'SFProDisplay-Medium',
  },
  itemPriceText: {
    marginTop: hp('0.5%'),
    fontSize: 16,
    color: COLORS.MAIN,
    fontFamily: 'SFProDisplay-Bold',
  },
  itemDescriptionText: {
    marginTop: hp('1%'),
    fontSize: Platform.OS === 'ios' ? 16 : 13,
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-Regular',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
});
