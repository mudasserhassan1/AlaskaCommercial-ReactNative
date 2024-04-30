import React from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {aboutData} from '../../constants/Common';
import {getFontSize, COLORS} from '../../theme';

const AboutItem = ({item, onItemPress, index, key}) => {
  const {id = '', name = ''} = item ?? {};

  const renderSeparator = () => {
    if (index === aboutData.length - 1) {
      return <View />;
    }
    return <View style={styles.divider} />;
  };

  return (
    <View key={key}>
      <TouchableOpacity onPress={() => onItemPress(id)}>
        <View style={styles.settingsTextWrapper}>
          <Text allowFontScaling={false} style={styles.settingTextStyle}>{name}</Text>
          <AntDesign name="right" size={18} color="#979797" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
      {renderSeparator()}
    </View>
  );
};

const styles = StyleSheet.create({
  settingsTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    justifyContent: 'space-between',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  settingTextStyle: {
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.BLACK,
    fontSize: getFontSize(17),
    letterSpacing: -0.28,
    fontWeight: Platform.OS === 'ios' ? '400' : null,
    fontStyle: 'normal',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.GRAY0_5,
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  arrowIcon: {alignSelf: 'flex-end'},
});
export default AboutItem;
