import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {debounce} from 'lodash';
import {FONTS, getFontSize, COLORS} from '../theme';
import {logToConsole} from '../configs/ReactotronConfig';

const Button = ({
  width,
  onPress,
  disabled,
  label,
  buttonStyle,
  labelStyle,
  isLoading,
                  activeOpacity,
}) => {
  const onPressButton = React.useMemo(() => {
    if (typeof onPress === 'function') {
      return debounce(onPress, 500, {leading: true, trailing: false});
    }
    return () => {};
  }, [onPress]);

  // logToConsole({disabled});
  return (
    <>
      <TouchableOpacity
        onPress={onPressButton}
        disabled={!!disabled}
        activeOpacity={activeOpacity}
        style={[styles.buttonParentView, {width}, buttonStyle]}>
        {isLoading ? (
          <View
            style={{
              height: 52,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator
              size={'small'}
              color={COLORS.MAIN}
              style={{alignSelf: 'center'}}
            />
          </View>
        ) : (
          <Text allowFontScaling={false} style={[styles.buttonLabel, labelStyle]}>{label}</Text>
        )}
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  buttonParentView: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.MEDIUM,
    letterSpacing: 0,
    textAlign: 'center',
    color: COLORS.WHITE,
  },
});
export {Button};
