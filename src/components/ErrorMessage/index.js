import React, {memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';
import Clipboard from '@react-native-community/clipboard';

const ErrorMessage = ({error, errorDetails = {}, textStyle}) => {
  const onCopyToClipboard = () => {
    if (Object.keys(errorDetails)?.length) {
      Clipboard?.setString?.(JSON.stringify(errorDetails));
    }
  };

  if (error && (typeof error === 'string' || typeof error === 'number')) {
    return (
      <Text allowFontScaling={false} onLongPress={onCopyToClipboard} style={[styles.errorMessage, textStyle]}>
        {error}
      </Text>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  errorMessage: {
    color: COLORS.MAIN_II,
    fontSize: getFontSize(13),
    lineHeight: 18,
    marginHorizontal: wp('6%'),
  },
});
export default memo(ErrorMessage);
