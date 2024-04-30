import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {getFontSize, getFontWeight, COLORS, IMAGES} from '../theme';
import ImageComponent from './ImageComponent';

const ModalHeader = ({style, backgroundColor, title, titleStyle, closeModal, children}) => {
  const closeModalHelper = () => {
    if (typeof closeModal === 'function') {
      return closeModal?.();
    }
    return console.warn('Invalid Prop Type for closeModal, expected a function');
  };
  return (
    <SafeAreaView style={[styles.parentView, {backgroundColor, ...style}]}>
      <View style={styles.titleView}>
        <Text allowFontScaling={false} style={[styles.titleText, titleStyle]}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>
        {children}
        <TouchableOpacity style={styles.crossButtonView} onPress={closeModalHelper}>
          <ImageComponent style={styles.crossIcon} source={IMAGES.ICON_CLOSE} resizeMode={'contain'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  parentView: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 56 : 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingStart: wp('6%'),
    paddingEnd: wp('6%'),
    marginTop: heightPercentageToDP('1%'),
  },
  titleView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  titleText: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-SemiBold',
    fontWeight: getFontWeight('600'),
    letterSpacing: -0.24,
    fontStyle: 'normal',
  },
  crossButtonView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingVertical: 5,
  },
  crossIcon: {
    width: 28,
    height: 28,
  },
  rightContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
export {ModalHeader};
