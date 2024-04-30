import React from 'react';
import {Pressable} from 'react-native';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../../theme';

export default function CheckBox({size = 20, onPress, isSelected, disabled}) {
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.container,
        {
          height: size,
          width: size,
          borderRadius: size / 4,
        },
        !isSelected && {
          backgroundColor: COLORS.GRAY0_5,
          borderColor: COLORS.GRAY_5,
        },
      ]}
      hitSlop={10}
      onPress={() => onPress?.()}>
      {!!isSelected && <FontAwesome5 name={'check'} color={COLORS.MAIN} size={size * 0.6} />}
    </Pressable>
  );
}
