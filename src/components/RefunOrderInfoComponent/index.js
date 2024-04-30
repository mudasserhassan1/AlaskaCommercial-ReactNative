import {StyleSheet, Text, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import {formatTimeForRefund} from '../../utils/timeUtils';
import React, { useMemo } from "react";
import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import { shallowEqual, useSelector } from "react-redux";

const RefundOrderInfoComponent = ({orderInfo, containerStyle}) => {
  const {refundId, status, createdDate, orderId, storeName, orderType} = orderInfo;

  // const {is24Hour} = useSelector(({general: {is24Hour} = {}}) => ({is24Hour}));
  const is24HourSelector = useMemo(
    () => state => state.general.is24Hour ?? false,
    [],
  );

  const is24Hour = useSelector(is24HourSelector, shallowEqual);
  return (
    <View style={[styles.refundOrderInfoContainer, containerStyle]}>
      <Text allowFontScaling={false} style={styles.refundOrderNumber}>
        {APP_CONSTANTS.REFUND_REQUEST_NO}
        {refundId}
      </Text>
      <Text allowFontScaling={false} style={styles.refundOrderInfoText}>
        {APP_CONSTANTS.STATUS} {status}
      </Text>
      <Text allowFontScaling={false} style={styles.refundOrderInfoText}>
        {APP_CONSTANTS.REQUEST_SENT} {formatTimeForRefund(is24Hour, createdDate)}
      </Text>
      <Text allowFontScaling={false} style={styles.refundOrderInfoText}>
        {APP_CONSTANTS.ORDER_REFERENCE}
        {orderId}
      </Text>
      <Text allowFontScaling={false} style={styles.refundOrderInfoText}>
        {APP_CONSTANTS.ORDER_STORE} {storeName}
      </Text>
      <Text allowFontScaling={false} style={styles.refundOrderInfoText}>
        {APP_CONSTANTS.ORDER_TYPE} {orderType}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  refundOrderInfoContainer: {
    paddingVertical: heightPercentageToDP('1.7%'),
    backgroundColor: 'white',
    marginTop: heightPercentageToDP('1.7%'),
    paddingHorizontal: widthPercentageToDP('6%'),
  },
  refundOrderNumber: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(18),
    letterSpacing: -0.35,
    color: COLORS.BLACK,
  },
  refundOrderInfoText: {
    marginTop: heightPercentageToDP('1.7%'),
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    letterSpacing: -0.26,
    color: COLORS.BLACK,
  },
});
export default RefundOrderInfoComponent;
