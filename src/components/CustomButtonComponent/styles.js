import {StyleSheet} from 'react-native';

import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';

export default StyleSheet.create({
  buttonText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    color: COLORS.WHITE,
    marginStart:10
  },
});
