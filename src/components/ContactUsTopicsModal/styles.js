import {StyleSheet} from 'react-native';

import {COLORS} from '../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {getFontSize} from '../../theme';

export default StyleSheet.create({
  content: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
  headerCrossImage: {tintColor: COLORS.BLACK},
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('3%'),
  },
  topicItem: {
    paddingVertical: hp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnchecked: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.BLACK,
  },
  topicText: {
    marginStart: wp('1.5%'),
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
  },
  separator: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    width: '100%',
  },
  listView: {
    marginStart: wp('6%'),
    justifyContent: 'center',
  },
});
