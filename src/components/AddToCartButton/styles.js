import {Platform, StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../theme';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  addToCartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.MAIN,
    width: '30%',
    height: 38,
    borderRadius: 8,
    shadowOffset: {width: -2, height: 4},
    shadowColor: 'gray',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6,
  },
  addToCartCardItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.MAIN,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  addToCartTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: COLORS.WHITE,
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: FONTS.SEMI_BOLD,
    letterSpacing: 0,
  },
  cartImageWrapper: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartImage: {
    width: 17,
    height: 17,
  },
  customizableText: {
    fontSize: 15,
    fontFamily: FONTS.SEMI_BOLD,
    color: COLORS.WHITE,
  },
  customcakeaddtocart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.MAIN,
    width: '100%',
    height: 38,
    borderRadius: 20,
  },
  quantitychange: {
    position: 'absolute',
    right: 0,
    zIndex: 9999,
    // alignSelf: 'flex-end',
    width: widthPercentageToDP('25%'),
    height: 34,
    alignItems: 'center',
    backgroundColor: COLORS.MAIN,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantitychangeicon: {
    width: 22,
    height: 22,
  },
  box: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
