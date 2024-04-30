import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS, FONTS} from '../../theme';
import {getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';
export default StyleSheet.create({
  header: {
    backgroundColor: COLORS.WHITE,
    height: 70,
    justifyContent: 'center',
  },
  separator: {
    height: 1.5,
    backgroundColor: COLORS.GRAY_1,
    width: '100%',
    marginLeft: wp('6%'),
    marginRight: wp('6%'),
  },
  headerText: {
    // marginStart: wp('5%'),
    fontSize: getFontSize(16),
    fontFamily: FONTS.REGULAR,
    letterSpacing: 0,
    flexShrink: 1,
    color: COLORS.BLACK,
  },
  departmentImageView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp('6%'),
  },
  departmentImage: {
    width: 35,
    height: 35,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  subDepartmentView: {
    overflow: 'hidden',
  },
});
