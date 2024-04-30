import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS, getFontSize, IMAGES} from '../../theme';
import ImageComponent from '../ImageComponent';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {SCREEN_WIDTH} from '../../constants/Common';
import AntDesign from "react-native-vector-icons/AntDesign";

const CarItemHiddenItem = props => {
  const {
    leftActionActivated,
    rightActionActivated,
    rowActionAnimatedValue,
    rowLeftActionAnimatedValue,
    onClose,
    onDelete,
  } = props;

  if (rightActionActivated) {
    Animated.spring(rowActionAnimatedValue, {
      toValue: SCREEN_WIDTH,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 102,
      useNativeDriver: false,
    }).start();
  }

  if (leftActionActivated) {
    Animated.spring(rowLeftActionAnimatedValue, {
      toValue: SCREEN_WIDTH,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.spring(rowLeftActionAnimatedValue, {
      toValue: 102,
      useNativeDriver: false,
    }).start();
  }
  return (
    <Animated.View style={styles.rowBack}>
      {!rightActionActivated && (
        <Animated.View
          style={[
            styles.hiddenItemButton,
            styles.hiddenItemLeftButtonWithoutColor,
            {
              flex: 1,
              width: rowLeftActionAnimatedValue,
            },
          ]}>
          <Pressable onPress={onClose} style={[styles.hiddenItemButton, styles.hiddenItemLeftButton]}>
            <Text allowFontScaling={false} style={[{fontSize: getFontSize(40)}, styles.hiddenItemLeftText]}>+</Text>
            <Text allowFontScaling={false} style={[styles.hiddenItemText, styles.hiddenItemLeftText]}>{APP_CONSTANTS.ADD_TO_UNDER_LIST}</Text>
          </Pressable>
        </Animated.View>
      )}
      {!leftActionActivated && (
        <Animated.View
          style={[
            styles.hiddenItemButton,
            styles.hiddenItemRightButtonWithoutColor,
            {
              flex: 1,
              width: rowActionAnimatedValue,
            },
          ]}>
          <Pressable onPress={onDelete} style={[styles.hiddenItemButton, styles.hiddenItemRightButton]}>
            {/*<ImageComponent resizeMode={'contain'} source={IMAGES.ICON_DELETE} style={styles.deleteIcon} />*/}
            <AntDesign size={27} color={COLORS.WHITE} name={'delete'} />
            <Text allowFontScaling={false} style={[styles.hiddenItemText, styles.hiddenItemRightText]}>{APP_CONSTANTS.DELETE}</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default CarItemHiddenItem;
export const styles = StyleSheet.create({
  swipeRowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.GRAY0_5,
  },

  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hiddenItemButton: {
    width: 102,
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenItemRightButton: {
    position: 'absolute',
    backgroundColor: COLORS.MAIN,
    right: 0,
  },
  hiddenItemRightButtonWithoutColor: {
    position: 'absolute',
    right: 0,
  },
  hiddenItemLeftButton: {
    position: 'absolute',
    backgroundColor: COLORS.MAIN_LIGHT_2,
    left: 0,
  },
  hiddenItemLeftButtonWithoutColor: {
    position: 'absolute',
    left: 0,
  },
  hiddenItemText: {
    textAlign: 'center',
    fontSize: getFontSize(17),
    fontWeight: '600',
  },
  hiddenItemLeftText: {
    color: COLORS.MAIN,
  },
  hiddenItemRightText: {
    marginTop: heightPercentageToDP('1%'),
    color: COLORS.WHITE,
  },

  deleteIcon: {
    resizeMode: 'contain',
    height: 27,
    width: 25,
  },
});
