import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../theme';
import PropTypes from 'prop-types';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withTiming} from 'react-native-reanimated';

const PaginationDot = ({size, activeColor, inActiveColor, dotStyle, maxPage, curPage, containerStyle, onDotPress}) => {
  const mapper = useMemo(() => Array.from({length: maxPage}, (v, i) => i), [maxPage]);

  const Dot = props => {
    const {value} = props;

    const big = useSharedValue(size);
    const color = useSharedValue(inActiveColor);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        width: big.value,
        height: big.value,
        borderRadius: big.value / 2,
        backgroundColor: color.value,
      };
    });

    useEffect(() => {
      if (curPage === value) {
        big.value = withSequence(withTiming(size + 2), withTiming(size));
        color.value = withTiming(activeColor);
      }
    }, [curPage]);

    return (
      <Animated.View
        key={String(value)}
        onPress={() => onDotPress(value)}
        activeOpacity={1}
        style={[
          styles.dot,
          dotStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            left: (size + 10) * value,
          },
          animatedStyle,
        ]}
      />
    );
  };

  return (
    <View style={[styles.dotsContainer, {width: maxPage * (size + 10)}, containerStyle]}>
      {mapper.map(value => (
        <Dot value={value} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    marginHorizontal: wp('1%'),
    marginVertical: hp('1%'),
    position: 'absolute',
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

PaginationDot.propTypes = {
  curPage: PropTypes.number,
  size: PropTypes.number,
  activeColor: PropTypes.string,
  inActiveColor: PropTypes.string,
  containerStyle: PropTypes.object,
  onDotPress: PropTypes.func,
};

PaginationDot.defaultProps = {
  size: 12,
  curPage: 0,
  activeColor: COLORS.MAIN,
  inActiveColor: COLORS.GREY_40,
  onDotPress: () => {},
};

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.curPage === nextProps.curPage;
};
export default React.memo(PaginationDot, arePropsEqual);
