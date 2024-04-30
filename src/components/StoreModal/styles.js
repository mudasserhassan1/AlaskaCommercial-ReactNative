import {StyleSheet, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
    ...Platform.select({
      android: {
        bottom: 0,
        width: '100%',
        position: 'absolute',
      },
    }),
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
    maxHeight: hp('70%'),
  },
  modalHeaderCrossIcon: {tintColor: '#000'},
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginBottom: 20,
  },
  listRow: {
    width: '92%',
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('3%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  checkedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.BLACK,
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnchecked: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: COLORS.GRAY_TEXT_0_78,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: wp('2.5%'),
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
  descriptionView: {
    flexDirection: 'row',
    marginStart: wp('6.5%'),
    marginTop: hp('0.8%'),
    lineHeight: 20,
  },
  descriptionText: {
    color: COLORS.GRAY_6,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Regular',
  },
  separator: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
  modalImageStyle: {
    tintColor: '#000',
  },
});

export default styles;
