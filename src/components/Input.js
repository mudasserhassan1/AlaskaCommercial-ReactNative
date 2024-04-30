import React from 'react';
import {Platform, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS, IMAGES} from '../theme';
import {IMAGES_RESIZE_MODES, KEYBOARD_FEATURES} from '../constants/Common';
import ImageComponent from './ImageComponent';

function Input({
  rightImageSrc,
  onRightIconPress,
  leftImage,
  leftImageSrc,
  placeholder,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  onFocus,
  onBlur,
  onTouchStart,
  borderColor = COLORS.GRAY_4,
  editable,
  autoCapitalize,
  inputRef,
  onSubmitEditing,
  maxLength = 30,
  returnKeyType = KEYBOARD_FEATURES.returnKeyTypes.next,
  autoComplete,
  autoCorrect,
  textContentType,
  inPutWidth = wp('90%'),
  borderWidth = 1,
  borderRightWidth,
  blurOnSubmit = false,
  onEyeButtonPress,
  showEye,
  rightImageStyles,
}) {
  const renderEyeButton = () => {
    if (secureTextEntry) {
      return <ImageComponent source={IMAGES.ICON_HIDE_EYE} style={[styles.rightImage, rightImageStyles]} />;
    }
    return <ImageComponent source={IMAGES.ICON_SHOW_EYE} style={[styles.rightImage, rightImageStyles]} />;
  };

  const renderCustomRightImage = () => {
    if (rightImageSrc) {
      return (
        <TouchableOpacity style={styles.eyeButtonView} onPress={onRightIconPress}>
          <ImageComponent source={rightImageSrc} style={[styles.rightImage, rightImageStyles]} />
        </TouchableOpacity>
      );
    }
    return <View style={styles.eyeButtonView} />;
  };

  const renderRightImage = () => {
    if (showEye) {
      return (
        <TouchableOpacity style={styles.eyeButtonView} onPress={onEyeButtonPress}>
          {renderEyeButton()}
        </TouchableOpacity>
      );
    }
    return renderCustomRightImage();
  };

  return (
    <View
      style={[
        styles.InputView,
        {
          width: inPutWidth,
          borderWidth,
          borderColor: borderColor,
        },
      ]}>
      {leftImage ? <ImageComponent source={leftImageSrc} style={styles.leftImage} /> : null}
      <View style={styles.inputContainer}>
        <TextInput
          allowFontScaling={false}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.GRAY_4}
          selectionColor={COLORS.MAIN_LIGHT}
          style={styles.input}
          importantForAutofill={'yes'}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          textContentType={textContentType}
          editable={editable}
          onChangeText={onChangeText}
          value={value}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onTouchStart={onTouchStart}
          autoCapitalize={autoCapitalize}
          autoFocus={false}
          ref={inputRef}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          borderRightWidth={borderRightWidth}
          blurOnSubmit={blurOnSubmit}
        />
        {renderRightImage()}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  InputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    marginTop: hp('1.2%'),
    borderRadius: wp('2%'),
    backgroundColor: COLORS.WHITE,
  },
  inputContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: '100%',
    color: 'black',
    paddingLeft: wp('2.5%'),
    fontFamily: 'SFProDisplay-Regular',
    fontStyle: 'normal',
    fontSize: Platform.OS === 'ios' ? 18 : 15,
  },
  eyeButtonView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    right: wp('4%'),
    zIndex: 1,
  },
  leftImage: {
    width: 30,
    height: 30,
    left: wp('2%'),
  },
  rightImage: {
    width: 22,
    height: 18,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
    right: wp('2%'),
  },
});
export default Input;
