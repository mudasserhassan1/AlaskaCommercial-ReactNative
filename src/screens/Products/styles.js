import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {FONTS, COLORS, getFontSize} from '../../theme';

export default StyleSheet.create({
  parentContainer: {flex: 1},
  headerBackIcon: {tintColor: COLORS.WHITE, height: 24, width: 24},
  content: {
    backgroundColor: '#fff',
  },
  listContentContainer: {
    paddingBottom: hp('3%'),
    paddingTop: hp('1%'),
    backgroundColor: COLORS.WHITE,
    flexGrow: 1,
  },
  searchComponentWrapper: {
    height: 75,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zipCodeText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(13),
    color: COLORS.BLACK,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.26,
    marginTop: hp('2%'),
  },
  infoWrapper: {
    justifyContent: 'center',
    marginBottom: hp('1.7%'),
    paddingTop: hp('1%'),
    backgroundColor: COLORS.WHITE,
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
  divider: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginEnd: wp('6%'),
    marginTop: hp('.5%'),
  },
  notAvailableProducts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: hp('4%'),
    marginTop: hp('2%'),
  },
  departmentNameText: {
    fontSize: getFontSize(18),
    fontFamily: FONTS.SEMI_BOLD,
    letterSpacing: -0.36,
    lineHeight: 25,
    color: COLORS.BLACK,
  },
  subDepartmentName: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Regular',
    marginTop: hp('1%'),
    lineHeight: 25,
    letterSpacing: -0.3,
    color: COLORS.BLACK,
  },
  infoWrapperMain: {
    marginTop: hp('1%'),
    justifyContent: 'center',
    paddingBottom: hp('1.5%'),
    marginHorizontal: wp(6),
  },
  sectionDividerView: {height: hp('1.5%'), backgroundColor: '#f4f4f4'},
  emptyListParentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListNoRecordText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(20),
    color: COLORS.BLACK,
  },
  emptyListNoRecordDescription: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
  itemSeparatorView: {height: 0.5, width: '100%', backgroundColor: '#C8C8C8'},
  dividerLine: {
    borderBottomColor: COLORS.GRAY_1,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
  },
  ItemSeparaterLine: {
    height: 0.5,
    width: '94%',
    backgroundColor: '#C8C8C8',
    marginStart: wp('6%'),
  },
  listFooterView: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  productlisting: {
    alignItems: 'center',
    marginStart: wp('7%'),
    marginEnd: wp('1%'),
  },
  searchtext: {
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 21,
    lineHeight: 25,
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('1.7%'),
  },
  safeArea: {flex: 1, backgroundColor: COLORS.WHITE},

});
