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
    paddingHorizontal: hp('2%'),
  },
  productdetailheader: {
    paddingStart: hp('1.6%'),
  },
  departmentsName: {
    color: '#616060',
    fontSize: getFontSize(15),
    lineHeight: 20,
    paddingVertical: 25,
    fontFamily: FONTS.REGULAR,
    marginHorizontal: hp('0.9%'),
  },
  sectionHeaderStyle: {
    fontSize: getFontSize(21),
    lineHeight: 25,
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    width: '80%',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
  screenWrapper: {
    flex: 1,
  },
  departmentNameWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp('2.8%'),
    paddingVertical: hp('2%'),
    fontSize: getFontSize(21),
    lineHeight: 25,
    color: COLORS.BLACK,
    fontFamily: FONTS.BOLD,
  },
  headerwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp('2.8%'),
    paddingVertical: hp('2%'),
  },
  headertext: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(21),
    color: COLORS.BLACK,
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
    fontFamily: FONTS.MEDIUM,
  },
  loader: {
    flex: 1,
  },
  productlisting: {
    // backgroundColor: 'yellow',
  },
  listContainer: {
    paddingBottom: 40,
    flexGrow: 1,
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
