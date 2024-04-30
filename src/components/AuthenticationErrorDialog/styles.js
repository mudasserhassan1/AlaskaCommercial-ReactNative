import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS, getFontSize} from '../../theme';

export default StyleSheet.create({
  parentView: {
    width: '80%',
    alignSelf: 'center',
  },
  content: {
    backgroundColor: COLORS.DIALOG_BACKGROUND_COLOR,
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    paddingTop: 22,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: getFontSize(17),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: -0.41,
    textAlign: 'center',
    color: '#030303',
  },
  messageContainer: {
    paddingHorizontal: wp('7%'),
    marginTop: hp('.5%'),
  },
  message: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: 0.2,
    textAlign: 'center',
    color: '#030303',
  },
  verticalButton: {alignItems: 'center', justifyContent: 'center', height: 45},
  buttonLabel: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: Platform.OS === 'ios' ? 19 : 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.41,
    textAlign: 'center',
    color: '#007aff',
  },
  horizontalSeparator: {
    backgroundColor: COLORS.GRAY_1,
    height: 1,
    marginTop: hp('2%'),
    width: '100%',
  },
  horizontalButtonSeparator: {
    backgroundColor: COLORS.GRAY_1,
    height: 1,
    width: '100%',
  },
  horizontalButtonsView: {
    height: 45,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleButtonView: {
    height: 45,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalButton: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    alignSelf: 'center',
  },
  verticalSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: COLORS.GRAY_1,
  },
  input: {
    height: 35,
    paddingStart: wp('1%'),
    width: '85%',
    fontSize: 13,
    alignSelf: 'center',
    backgroundColor: COLORS.WHITE,
    borderWidth: 0.5,
    borderColor: 'rgba(77,77,77,0.78)',
    marginTop: hp('2%'),
  },
});
