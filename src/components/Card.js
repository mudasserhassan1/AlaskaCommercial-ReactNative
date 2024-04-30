import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../theme';
const Card = props => {
  return <View style={[styles.containerStyle, props.style]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 0,
    backgroundColor: COLORS.WHITE,
    borderRadius: 3,
  },
});

export {Card};
