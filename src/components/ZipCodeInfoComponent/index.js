import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

import {COLORS, IMAGES} from '../../theme';
import {getFontSize} from '../../theme';

const ZipCodeInfoComponent = () => {
  const {
    loginInfo: {userInfo = {}},
  } = useSelector(({general}) => general);
  const {Store = '', ZipCode = ''} = userInfo ?? {};
  return (
    <View style={[styles.infoWrapper, {marginTop: hp('1.7%')}]}>
      <View style={styles.zipCodeInnerWrapper}>
        <View style={styles.storeImageWrapper}>
          <FastImage source={IMAGES.STORE_ICON} resizeMode={FastImage.resizeMode.contain} style={styles.storeImage} />
          <Text allowFontScaling={false} style={styles.zipCodeText}>
            Zip Code: {ZipCode} - {Store}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>

      <View style={styles.sectionSeparator} />
    </View>
  );
};

const styles = StyleSheet.create({
  infoWrapper: {
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
    marginEnd: wp('6%'),
  },
  zipCodeInnerWrapper: {
    marginTop: hp('1%'),
    justifyContent: 'center',
    paddingBottom: hp('1.5%'),
    marginStart: wp('6%'),
  },
  storeImageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  storeImage: {width: 15, height: 12},
  zipCodeText: {
    fontSize: getFontSize(13),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.26,
    color: COLORS.BLACK,
    marginStart: wp('3%'),
  },
  sectionSeparator: {height: hp('1.5%'), backgroundColor: '#f4f4f4'},
});

export default ZipCodeInfoComponent;
