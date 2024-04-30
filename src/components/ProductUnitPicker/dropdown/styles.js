import {StyleSheet} from 'react-native';
import {getFontSize} from '../../../theme';

export default StyleSheet.create({
  accessory: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  triangle: {
    width: 8,
    height: 8,
    transform: [
      {
        translateY: -4,
      },
      {
        rotate: '45deg',
      },
    ],
  },

  triangleContainer: {
    width: 12,
    height: 6,
    overflow: 'hidden',
    alignItems: 'center',

    backgroundColor: 'transparent' /* XXX: Required */,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  picker: {
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderRadius: 6,
    borderColor: '#979797',
    borderWidth: 1,
    position: 'absolute',
  },

  item: {
    textAlign: 'left',
    // paddingHorizontal:10,
    fontSize: getFontSize(16),

  },

  scroll: {
    flex: 1,
    borderRadius: 2,
  },

  scrollContainer: {
    paddingVertical: 0,
  },
});
