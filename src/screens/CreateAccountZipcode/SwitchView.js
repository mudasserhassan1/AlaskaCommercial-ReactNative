import {Switch, Text, View} from 'react-native';
import {styles} from './styles';
import {COLORS} from '../../theme';
import React from 'react';

export const SwitchView = ({enabled, onPress, text}) => {
  return (
    <View style={styles.bandwidthWrapper}>
      <Text allowFontScaling={false} style={styles.bandwidthText}>{text}</Text>
      <Switch
        trackColor={{
          false: COLORS.SWITCH_COLOR,
          true: COLORS.SWITCH_ON_COLOR,
        }}
        thumbColor={COLORS.WHITE}
        ios_backgroundColor={COLORS.SWITCH_COLOR}
        onValueChange={onPress}
        value={enabled}
      />
    </View>
  );
};
