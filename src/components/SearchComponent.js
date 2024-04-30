import React, {useMemo} from 'react';
import {ActivityIndicator, Platform, Pressable, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {getFontSize, COLORS, IMAGES} from '../theme';
import {IMAGES_RESIZE_MODES} from '../constants/Common';
import ImageComponent from './ImageComponent';

const SearchComponent = ({
  leftImageSrc,
  rightImageSrc,
  placeholder,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  onFocus,
  onBlur,
  onRightIconPress,
  onLeftIconPress,
  onTouchStart,
  editable,
  autoCapitalize,
  inputRef,
  onSubmitEditing,
  maxLength,
  returnKeyType = 'done',
  returnKeyLabel = 'Done',
  autoCorrect,
  textContentType,
  isLoading,
  loaderStyle,
  crossStyle,
  withCrossButton = false,
}) => {
  const onCrossPress = () => {
    onChangeText('', true);
  };

  const renderLoadingComponent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={[styles.loaderView, loaderStyle]}>
          <ActivityIndicator color={COLORS.MAIN} size="small" />
        </View>
      );
    }
    return <View />;
  }, [isLoading]);

  const renderCrossButton = useMemo(() => {
    if (withCrossButton && !isLoading && value) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCrossPress}
          style={[styles.loaderView, styles.crossView, crossStyle]}>
          <ImageComponent source={IMAGES.CIRCLED_CROSS} style={styles.crossIcon} />
        </TouchableOpacity>
      );
    }
    return null;
  }, [withCrossButton, isLoading, value]);

  return (
    <View style={styles.inputParent}>
      <Pressable hitSlop={30} style={styles.leftImageContainer} onPress={onLeftIconPress} activeOpacity={0.6}>
        <ImageComponent source={leftImageSrc} style={styles.leftImage} />
      </Pressable>
      <View style={styles.inputView}>
        <TextInput
            allowFontScaling={false}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={COLORS.GRAY_4}
          selectionColor={COLORS.MAIN}
          style={styles.input}
          importantForAutofill={'yes'}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
          editable={editable}
          onChangeText={onChangeText}
          value={value}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onTouchStart={onTouchStart}
          autoCapitalize={autoCapitalize}
          ref={inputRef}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          returnKeyLabel={returnKeyLabel}
          isLoading={isLoading}
        />
      </View>
      {renderLoadingComponent}
      {renderCrossButton}
      <TouchableOpacity style={styles.eyeButtonView} onPress={onRightIconPress}>
        <ImageComponent source={rightImageSrc} style={styles.rightImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputParent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '88.5%',
    borderRadius: wp('2%'),
    backgroundColor: COLORS.WHITE,
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  inputView: {width: '81%'},
  input: {
    width: '100%',
    height: '100%',
    paddingEnd: wp('3%'),
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: COLORS.BLACK,
  },
  eyeButtonView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    right: Platform.OS === 'ios' ? null : wp('4%'),
    zIndex: 1,
  },
  leftImageContainer: {
    paddingRight: wp('4%'),
  },
  leftImage: {
    width: 20,
    height: 20,
    left: wp('2.5%'),
    tintColor: '#616060',
  },
  rightImage: {
    width: 15,
    height: 15,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
    right: Platform.OS === 'ios' ? wp('4%') : wp('1%'),
  },
  loaderView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    right: wp('7%'),
  },
  crossView: {
    backgroundColor: COLORS.GRAY0_25,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    right: wp('4.5%'),
    zIndex: 999,
  },
  crossIcon: {
    width: '100%',
    height: '100%',
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
});
export default SearchComponent;
