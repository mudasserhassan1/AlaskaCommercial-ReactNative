import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {COLORS, FONTS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES, SCREEN_HEIGHT} from '../../constants/Common';

export const styles = StyleSheet.create({
  shopContainer: {
    flex: 1,
  },
  scrollContainerStyle: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  emptyParentView: {
    flex: 1,
    height: hp('70%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListPlaceholderImage: {
    width: 100,
    height: 100,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  emptyListDescriptionText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    marginTop: hp('1%'),
  },
  listStyle: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  listFooterView: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  listContentContainer: {
    paddingBottom: SCREEN_HEIGHT * 0.05,
    flexGrow: 1,
  },
});
