import {Platform} from 'react-native';

export const getFontSize = fontSize =>
  Platform.OS === 'ios' ? fontSize + 2 : fontSize;
export const getFontWeight = fontWeight =>
  Platform.OS === 'ios' ? fontWeight : 'bold';

export const FONTS = {
  REGULAR: 'SFProDisplay-Regular',
  MEDIUM: 'SFProDisplay-Medium',
  SEMI_BOLD: 'SFProDisplay-Semibold',
  BOLD: 'SFProDisplay-Bold',
  HEADER: 'TradeGothicLT-Bold',
};
