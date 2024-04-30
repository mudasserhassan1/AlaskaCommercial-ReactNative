import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

const styles = StyleSheet.create({
  dropDownParent: {
    width: '100%',

  },
  dropDownStyle: {
    width: '100%',
    // height: 33,
    borderColor: COLORS.BLACK_40,
    borderWidth: 1,
    borderRadius: 6,
    // borderTopLeftRadius:6,
    // borderTopRightRadius:6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dropDownArrowContainer: {
    borderLeftWidth: 1.5,
    borderColor: COLORS.BLACK_40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
  },
  dropDownArrow: {
    tintColor: COLORS.BLACK_40,
    marginStart: 8,
    height: 14,
    width: 14,
  },
  dropDownLabel: {
    fontFamily: 'SFProDisplay-Semibold',
    alignSelf: 'center',
    fontSize: getFontSize(15),
    textAlign: 'center',
  },
  dropDownContainer: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: '#f4f4f4',
  },
  arrowIconContainer: {
    // height: 33,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderLeftWidth: 1,
    // paddingRight: 5,
    borderColor: COLORS.BLACK_40,
  },
});

export default styles;
