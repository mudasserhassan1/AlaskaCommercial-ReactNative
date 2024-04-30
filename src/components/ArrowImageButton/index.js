import {Image, Pressable} from 'react-native';
import React from 'react';
import {COLORS} from '../../theme';

const ArrowButton = props => {
  const {disabled, height, image, onPress, containerStyle} = props;
  return (
    <Pressable
      hitSlop={50}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          position: 'absolute',
          top: global?.isiPhone7or8
            ? parseFloat(height) / 2
            : parseFloat(height) / 2.4,
        },
        containerStyle,
      ]}>
      <Image source={image} style={{height: 21, width: 12}} />
    </Pressable>
  );
};

export default ArrowButton;
