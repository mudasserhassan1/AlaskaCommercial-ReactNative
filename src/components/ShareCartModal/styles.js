import {StyleSheet} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS, FONTS, getFontSize} from '../../theme';

export const styles = StyleSheet.create({
  modalContentII: {
    marginHorizontal: wp('6%'),
  },
  modalTextII: {
    color: COLORS.BLACK_II,
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    lineHeight: 18,
  },
  snapCheck: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  descriptionInputView: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.GREY_40,
    marginVertical: 7.5,
  },
  descriptionInput: {
    opacity: 6,
    marginVertical: 15,
    paddingHorizontal: 15,
    textAlignVertical: 'top',
  },
  multiline: {
    height: 90,
  },
  buttonBottom: {
    marginTop: wp(1.5),
    backgroundColor: COLORS.MAIN,
  },
  buttonBottomII: {
    marginHorizontal: wp(6),
  },
  radioBox: {
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  radioStyle: {
    paddingEnd: wp(6),
  },
  radioStyleII: {
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  radioText: {
    fontSize: getFontSize(13),
  },
});
