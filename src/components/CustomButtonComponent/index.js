import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';

import styles from './styles';
import {IMAGES} from '../../theme';

const CustomButtonComponent = props => {
  const {
    showCartIcon,
    onPress,
    containerStyle,
    buttonTitle,
    textStyle,
    disabled,
  } = props ?? {};

  const renderButtonBody = () => (
    <Text allowFontScaling={false} style={[styles.buttonText, textStyle]}>{buttonTitle}</Text>
  );

  return (
    <TouchableOpacity
      style={containerStyle ?? {}}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}>
      {showCartIcon && (
        <Image source={IMAGES.CART_ICON} style={{height: 22, width: 18}} />
      )}
      {renderButtonBody()}
    </TouchableOpacity>
  );
};

export default CustomButtonComponent;
