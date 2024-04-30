import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {COLORS, FONTS} from '../../theme';
import {getFontSize} from '../../theme';

const styles = StyleSheet.create({
  shopWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    paddingVertical:hp('1%')
  },
  changePassword: {
    fontSize: getFontSize(17),
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    color: COLORS.BLACK,
    // marginTop: hp('.5%'),
    // marginBottom: hp('2%'),
  },
});

export default styles;
