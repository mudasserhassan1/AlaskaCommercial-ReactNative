import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  stepperParentView: {width: wp('31%'), alignItems: 'flex-start'},
  stepperView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  disableStepper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BLACK,
    opacity: 0.05,
  },
  stepperCellView: {
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  stepperCellText: {
    fontSize: 18,
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  verticalSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: COLORS.BLACK_40,
  },
  stepperValueView: {
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueText: {
    fontSize: 18,
    width: 38,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorViewStyle: {
    marginTop: 5,
    height: 15,
    width: 250,
    position: 'absolute',
    top: 36,
  },
  errorText: {
    fontSize: getFontSize(10),
    fontFamily: FONTS.MEDIUM,
    fontStyle: 'normal',
    letterSpacing: 0,
    color: COLORS.MAIN,
  },
  quantitychangeicon: {
    width: 22,
    height: 22,
  },
});

export default styles;
