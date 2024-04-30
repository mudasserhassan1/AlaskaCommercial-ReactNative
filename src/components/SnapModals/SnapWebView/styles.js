import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerLoader: {
    justifyContent: 'center',
    paddingTop: 10,
  },
});

export default styles;
