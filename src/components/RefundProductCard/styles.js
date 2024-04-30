import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    marginEnd: widthPercentageToDP('6%'),
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
    // backgroundColor:'red',
    alignItems: 'flex-start',
  },
  productCardParentView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: wp('9%'),
    alignSelf: 'flex-start',
  },
  productImageContainer: {
    height: 66,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 60,
    marginLeft: -8,
  },
  productInformationView: {
    width: '73%',
  },
  productDescriptionText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: 0,
  },
  qtyTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.8%'),
  },
  qtyLabel: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.CHARCOAL_GREY_60,
  },
  qtyText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    textAlign: 'right',
    color: COLORS.BLACK,
  },
  priceDifferenceTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceDifferenceText: {
    color: COLORS.BLACK_40,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: 'SFProDisplay-Medium',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    textAlign: 'right',
  },
  radioButtonWrapper: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  substituteMessage: {color: COLORS.MAIN, fontFamily: FONTS.REGULAR, marginTop: hp('1%')},
});

export default styles;
