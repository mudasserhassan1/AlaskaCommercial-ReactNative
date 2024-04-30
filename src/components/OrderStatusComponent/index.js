import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS} from '../../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';

const OrderStatusComponent = ({item}) => {
  const {status = '', orderType = '', trackingNumber = ''} = item ?? {};

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const getColor = () => {
    if (status !== APP_CONSTANTS.ORDER_COMPLETED) {
      return COLORS.MAIN;
    }
    return COLORS.BLACK;
  };

  const getFontFamily = () => {
    if (status !== APP_CONSTANTS.ORDER_COMPLETED) {
      return FONTS.SEMI_BOLD;
    }
    return FONTS.REGULAR;
  };

  const renderTrackingNumber = () => {
    return (
      <Text allowFontScaling={false} style={styles.trackingNumberText}>
        {APP_CONSTANTS.TRACKING_NUMBER} {trackingNumber.length > 0 ? trackingNumber : 'N/A'}
      </Text>
    );
  };
  return (
    <View style={styles.itemStatusWrapper}>
      <View style={styles.textWrapper}>
        <Text allowFontScaling={false} style={styles.orderStatusWrapper}>{APP_CONSTANTS.ORDER_STATUS}</Text>
        {renderDivider()}
        {orderType === APP_CONSTANTS.BUSH_DELIVERY &&
          status !== APP_CONSTANTS.ORDER_COMPLETED &&
          renderTrackingNumber()}
        <Text allowFontScaling={false} style={[styles.orderStatusTextStyle, {color: getColor(), fontFamily: getFontFamily()}]}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemStatusWrapper: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
  },
  textWrapper: {
    marginStart: wp('6%'),
  },
  orderStatusWrapper: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  orderStatusTextStyle: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
    marginTop: hp('0.7%'),
  },
  trackingNumberText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(14),
    lineHeight: 20,
    letterSpacing: -0.19,
    color: COLORS.CHARCOAL_GREY_60,
  },
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_1,
    marginBottom: hp('1%'),
    marginTop: hp('0.8%'),
  },
});
export default OrderStatusComponent;
