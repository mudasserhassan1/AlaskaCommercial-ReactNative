import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {getFontSize, COLORS} from '../theme';

function TextField({
  onSubmitEditing,
  placeholder,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  onBlur,
  borderColor,
  editable,
  autoCapitalize,
  inputRef,
  maxLength,
  returnKeyType,
  borderWidth,
  borderRadius,
  blurOnSubmit,
  color,
  inputStyle,
  onFocus,
  selectTextOnFocus,
  autoComplete,
  textContentType,
}) {
  return (
    <View>
      <TextInput
        allowFontScaling={false}
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        numberOfLines={1}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
        onFocus={onFocus}
        autoComplete={autoComplete}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        editable={editable}
        selectTextOnFocus={selectTextOnFocus || false}
        returnKeyType={returnKeyType}
        placeholderTextColor={COLORS.GRAY_5}
        maxLength={maxLength}
        onBlur={onBlur}
        blurOnSubmit={blurOnSubmit}
        selectionColor={COLORS.MAIN}
        borderRadius={borderRadius}
        style={[styles.input, {borderColor, borderWidth, color: color || 'black'}, inputStyle]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 50,
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    paddingLeft: 10,
    borderRadius: wp('2%'),
    lineHeight: 22,
    letterSpacing: -0.36,
  },
});
export {TextField};
