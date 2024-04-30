import React from 'react';
import {Pressable} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../../theme';

const ArrowButton = props => {
  const {disabled, height, icon, onPress, containerStyle} = props;
  return (
    <Pressable
      hitSlop={30}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          position: 'absolute',
          top: parseFloat(height) / 2 - 25 / 2,
        },
        containerStyle,
      ]}>
      <Entypo name={icon} size={25} color={disabled ? COLORS.DISABLE_BUTTON_COLOR : COLORS.MAIN} />
    </Pressable>
  );
};

export default ArrowButton;
