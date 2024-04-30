import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import {SETTINGS_SCREEN_SECTIONS} from '../../constants/Common';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import ImageComponent from '../ImageComponent';

const SettingsSectionCard = ({id, name, onItemPress, noSectionDivider = false, noDivider = false}) => {
  const renderSectionDivider = () => {
    if (
      String(id) === String(SETTINGS_SCREEN_SECTIONS.length - 1) ||
      String(id) === String(SETTINGS_SCREEN_SECTIONS.length)
    ) {
      return <View style={styles.sectionDivider} />;
    }
    return null;
  };

  const renderSeparator = () => {
    if (id === String(SETTINGS_SCREEN_SECTIONS.length - 1) || id === String(SETTINGS_SCREEN_SECTIONS.length)) {
      return <View />;
    }
    return <View style={styles.divider} />;
  };

  return (
    <View style={{backgroundColor: COLORS.WHITE}}>
      {!noSectionDivider && renderSectionDivider()}
      <TouchableOpacity key={id} activeOpacity={0.7} onPress={() => onItemPress(id)} style={styles.settingsCardWrapper}>
        <Text allowFontScaling={false} style={styles.settingTextStyle}>{name}</Text>
        <ImageComponent source={IMAGES.RIGHT_ARROW} style={styles.rightArrowStyle} />
      </TouchableOpacity>
      {!noDivider && renderSeparator()}
    </View>
  );
};
const styles = StyleSheet.create({
  settingsCardWrapper: {
    backgroundColor: COLORS.WHITE,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
  },
  singleBlockTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6%'),
  },
  settingsTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY0_5,
    marginStart: wp('6%'),
  },
  sectionDivider: {
    height: hp('1.7%'),
    backgroundColor: '#f4f4f4',
  },
  rightArrowStyle: {
    width: 8,
    height: 25,
    alignSelf: 'flex-end',
  },
  settingTextStyle: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.BLACK,
    fontSize: getFontSize(17),
    letterSpacing: -0.28,
    lineHeight: 22,
  },
});

export default SettingsSectionCard;
