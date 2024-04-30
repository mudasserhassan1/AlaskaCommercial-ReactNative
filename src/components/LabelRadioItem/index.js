import React from 'react';
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS, IMAGES} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

const RADIO_SIZE = 15;
const DOT_SIZE = 60;

const LabelRadioItem = ({
  onItemPress,
  onRadioPress,
  isSelected,
  label,
  description,
  size,
  onlyRadio,
  radioBoxStyle,
  isRadioTouchable,
  textStyle,
  descriptionStyle,
  isRightArrow,
  containerStyle,
}) => {
  const renderRadio = () => {
    return (
      <Pressable
        hitSlop={35}
        onPress={() => onRadioPress(label)}
        disabled={!isRadioTouchable}
        style={[styles.radioBox, radioBoxStyle, size && {width: size, height: size, borderRadius: size / 2}]}>
        <View
          style={[
            styles.radioDot,
            {
              borderRadius: ((size || RADIO_SIZE) * (DOT_SIZE / 100)) / 2,
              backgroundColor: isSelected ? COLORS.BLACK : COLORS.GRAY_01,
            },
          ]}
        />
      </Pressable>
    );
  };

  if (onlyRadio) {
    return renderRadio();
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onItemPress(label)} style={[styles.button, containerStyle]}>
      {renderRadio()}
      <View style={{marginLeft: wp('2.5%')}}>
        <Text allowFontScaling={false} style={[styles.text, textStyle]}>{label}</Text>
        {!!description && <Text allowFontScaling={false} style={[styles.description, descriptionStyle]}>{description}</Text>}
      </View>
      <View style={styles.arrowContainer}>
        {!!isRightArrow && <Image source={IMAGES.RIGHT_ARROW} style={styles.addIcon} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginStart: wp('6%'),
    paddingVertical: 10,
    minHeight: 63,
    alignItems: 'center',
  },
  radioBox: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: COLORS.BLACK,
    justifyContent: 'center',
  },
  radioDot: {
    width: `${DOT_SIZE}%`,
    height: `${DOT_SIZE}%`,
    borderRadius: (RADIO_SIZE * (DOT_SIZE / 100)) / 2,
  },
  text: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    lineHeight: 22,
  },
  description: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(12),
    color: COLORS.GRAY_67,
    marginTop: 5,
    lineHeight: 20,
  },
  arrowContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addIcon: {
    width: wp('10%'),
    height: hp('6%'),
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
});
export default LabelRadioItem;
