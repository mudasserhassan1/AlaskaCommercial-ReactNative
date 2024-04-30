import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {COLORS, FONTS} from '../../theme';
import {getFontSize} from '../../theme';
import {SCREEN_WIDTH} from '../../constants/Common';
export default StyleSheet.create({
  header: {
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
  departmentNametext: {
    paddingStart: hp('3%'),
    fontSize: getFontSize(21),
    fontFamily: FONTS.BOLD,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('3.2%'),
    paddingBottom: 16,
  },
  featureText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(21),
    color: COLORS.BLACK,
    lineHeight: 25,
    letterSpacing: -0.3,
    width: wp('70%'),
  },
  changeText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    lineHeight: 17.9,
    letterSpacing: -0.31,
    color: COLORS.MAIN,
  },
  headerwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    paddingEnd: hp('3.5%'),
  },
  ViewAllText: {
    color: COLORS.MAIN,
  },
  separator: {
    height: hp('0.1%'),
    backgroundColor: COLORS.GRAY_1,
    width: '94%',
    marginStart: '6%',
  },
  subdepartmentView: {
    justifyContent: 'center',
    height: 70,
    backgroundColor: COLORS.WHITE,
  },
  headerText: {
    fontSize: getFontSize(16),
    fontFamily: FONTS.REGULAR,
    letterSpacing: 0,
    lineHeight: 17.9,
    flexShrink: 1,
    marginStart: wp('6%'),
    color: COLORS.BLACK,
  },
  rightarrow: {
    width: 28,
    height: 28,
    position: 'absolute',
    right: 0,
    marginRight: wp('6%'),
  },
  emptyListParentView: {
    flex: 1,
    paddingTop: hp('25%'),
    alignItems: 'center',
  },
  emptyListNoRecordText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(20),
  },
  emptyListNoRecordDescription: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
  },
  listContainer: {
    paddingBottom: 40,
    backgroundColor: COLORS.WHITE,
  },
  productItem: {
    width: SCREEN_WIDTH,
    paddingBottom: 10,
  },
  screenWrapper: {
    flex: 1,
  },
  safeArea: {flex: 1},
  listFooterView: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
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
