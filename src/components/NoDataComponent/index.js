import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getFontSize} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS} from '../../theme';

const NoDataComponent = ({
  headerStyle,
  messageStyle,
  containerStyle,
  header,
  message,
} = {}) => {
  return (
    <View style={[styles.emptyListComponent, containerStyle]}>
      <Text allowFontScaling={false} style={[styles.noRecordText, headerStyle]}>
        {header ?? APP_CONSTANTS.NO_RECORD}
      </Text>
      <Text allowFontScaling={false} style={[styles.noRecordMessage, messageStyle]}>
        {message ?? APP_CONSTANTS.NO_RECORD_MESSAGE}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyListComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  noRecordText: {
    fontSize: getFontSize(20),
    color: COLORS.BLACK,
  },
  noRecordMessage: {
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
});
export default NoDataComponent;
