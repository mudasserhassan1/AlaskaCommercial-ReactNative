import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {COLORS, FONTS} from '../../theme';
import {getFontSize} from '../../theme';

export default StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.WHITE},

  departmentNameList: {
    flexDirection: 'row',
    paddingHorizontal: hp('1.7%'),
    height: 50,
  },
  productdetailheader: {
    // paddingStart: hp('1.6%'),
  },
  departmentsName: {
    fontSize: getFontSize(15),
    letterSpacing: -0.24,
    marginHorizontal: hp('0.9%'),
    fontFamily: FONTS.BOLD,
  },
  sectionHeaderStyle: {
    fontSize: getFontSize(21),
    lineHeight: 25,
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    width: 250,
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  screenWrapper: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.WHITE,
    paddingBottom: 0,
  },
  headerwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3.5%'),
    paddingBottom: hp('2%'),
    paddingTop: hp('0.6%'),
  },
  departmentNamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp('2.8%'),
    paddingTop: 25,
  },
  viewAll: {
    fontSize: getFontSize(15),
    lineHeight: 25,
    color: COLORS.MAIN,
    fontFamily: FONTS.SEMI_BOLD,
  },
  loader: {
    flex: 1,
  },
  searchtext: {
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: 21,
    lineHeight: 25,
    paddingHorizontal: hp('2.5%'),
    paddingVertical: hp('2%'),
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: COLORS.MAIN_SHADE_II,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filter: {
    color: COLORS.MAIN,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    lineHeight: 16,
    marginHorizontal: 8,
  },
  closeIcon: {width: 14, height: 14},
  listContainer: {
    paddingBottom: 40,
  },
});
