import {styles} from './styles';
import {TextInput, View} from 'react-native';
import {COLORS, getFontSize} from '../../theme';
import React, {memo} from 'react';

const InputField = ({
  value,
  placeholder,
  maxLength,
  onChangeText,
  autoComplete,
  keyboardType,
  textContentType,
  multiline,
  containerStyle,
  inputStyle,
  onBlur,
}) => {
  return (
    <View style={[styles.descriptionInputView, containerStyle]}>
      <TextInput
          allowFontScaling={false}
        multiline={multiline}
        selectionColor={COLORS.MAIN}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={COLORS.GRAY_5}
        value={value}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        textContentType={textContentType}
        fontSize={getFontSize(15)}
        onChangeText={onChangeText}
        onBlur={onBlur}
        style={[styles.descriptionInput, multiline && styles.multiline, inputStyle]}
      />
    </View>
  );
};

export default memo(InputField);
