import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS} from '../../theme';
import PropTypes from 'prop-types';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const PaginationDot = ({
  size,
  activeColor,
  inActiveColor,
  dotStyle,
  maxPage,
  curPage,
  containerStyle,
  onDotPress,
}) => {
  const mapper = useMemo(
    () => Array.from({length: maxPage}, (v, i) => i),
    [maxPage],
  );

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
          dotStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            // left: (size + 5) * value,
          },
          animatedStyle,
        ]}
      />
    );
  };

  return (
    <View
      style={[
        styles.dotsContainer,
        {width: maxPage * (size + 5)},
        containerStyle,
      ]}>
      {mapper.map(value => (
        <Dot value={value} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
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
  size: 6,
  curPage: 0,
  activeColor: COLORS.WHITE,
  inActiveColor: COLORS.GREY_II,
  onDotPress: () => {},
};

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.curPage === nextProps.curPage;
};
export default React.memo(PaginationDot, arePropsEqual);
