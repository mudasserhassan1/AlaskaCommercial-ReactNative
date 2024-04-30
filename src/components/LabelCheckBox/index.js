import React from 'react';
import {Pressable, Text} from 'react-native';
import styles from './styles';
import CheckBox from '../CheckBox';

export default function LabelCheckBox({onPress, label = '', isSelected, size = 15, containerStyle, labelStyle}) {
  return (
    <Pressable style={[styles.container, containerStyle]} onPress={onPress}>
      <CheckBox size={size} isSelected={isSelected} disabled />
      <Text allowFontScaling={false} style={[styles.marketingText, labelStyle]}>{label}</Text>
    </Pressable>
  );
}
