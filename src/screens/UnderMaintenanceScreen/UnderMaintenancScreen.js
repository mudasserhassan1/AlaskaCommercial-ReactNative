import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import ImageComponent from '../../components/ImageComponent';
import {COLORS, FONTS, getFontSize, IMAGES} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import React from 'react';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const UnderMaintenancScreen = () => {
  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.underMaintenanceContainer}>
      <View style={styles.LogoView}>
        <ImageComponent source={IMAGES.LOGO} style={styles.Logo} />
      </View>
      <Text allowFontScaling={false} style={styles.underMaintenanceTitle}>{APP_CONSTANTS.APP_UNDER_MAITENANCE}</Text>
      <Text allowFontScaling={false} style={styles.underMaintenanceMessage}>{APP_CONSTANTS.APP_UNDER_MAITENANCE_MESSAGE}</Text>
    </Pressable>
  );
};
export default UnderMaintenancScreen;

const styles = StyleSheet.create({
  underMaintenanceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    flex: 1,
    backgroundColor: COLORS.WHITE,
    zIndex: 999,
  },
  LogoView: {
    alignSelf: 'center',
    marginBottom: 100,
    alignItems: 'center',
    // marginTop: hp('3%'),
  },
  Logo: {
    width: 200,
    height: 200,
  },
  underMaintenanceTitle: {
    color: '#000',
    fontSize: getFontSize(20),
    marginTop: hp('5%'),
    fontStyle: 'normal',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Medium',
  },
  underMaintenanceMessage: {
    color: COLORS.GRAY_TEXT,
    fontSize: getFontSize(16),
    marginTop: hp('2%'),
    fontStyle: 'normal',
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
  },
  btnWrapper: {
    width: '90%',
    position: 'absolute',
    bottom: 50,
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('5%'),
  },
  guestButton: {
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    marginTop: hp('4%'),
  },
});
