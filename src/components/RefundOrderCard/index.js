import {Card} from '../Card';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS, IMAGES} from '../../theme';
import React, {useMemo} from 'react';
import {FONTS, getFontSize} from '../../theme';
import {shallowEqual, useSelector} from 'react-redux';
import {formatDateForRefundCard} from '../../utils/timeUtils';
import ImageComponent from '../ImageComponent';
import {formatAmountValue} from '../../utils/calculationUtils';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';

const RefundOrderCard = ({item, onItemPress, isRefundSubmitted = false}) => {
  const {
    createdDate = '',
    invoice: {TOTAL_AMOUNT, totalAmount} = {},
    orderItems,
    refundItems,
    orderType = '',
    orderId = '',
    status = '',
    refundId,
  } = item ?? {};
  const is24HourSelector = useMemo(
    () => state => state.general?.is24Hour ?? false,
    [],
  );

  const is24Hour = useSelector(is24HourSelector, shallowEqual);
  const formattedDate = formatDateForRefundCard(is24Hour, createdDate);

  const itemsList = refundItems ?? orderItems ?? [];
  const idStatus = refundId ? `Request #${refundId}` : `Order #${orderId}`;

  const renderDeliveryIcon = () => {
    let imageSource;
    if (orderType === APP_CONSTANTS.HOME_DELIVERY) {
      imageSource = IMAGES.ICON_HOME_FOR_DELIVERY;
    } else if (orderType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      imageSource = IMAGES.CURBSIDE_PICKUP;
    } else {
      imageSource = IMAGES.ICON_SHIP;
    }
    return (
      <ImageComponent
        resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
        source={imageSource}
        style={{width: 13, height: 15}}
      />
    );
  };
  return (
    <TouchableOpacity
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
      style={styles.orderItemParentView}>
      <Card style={styles.itemContainer}>
        <View style={styles.dateWrapper}>
          <Text allowFontScaling={false} style={styles.dateStyle}>{formattedDate}</Text>
          <Text allowFontScaling={false} style={styles.reOrderTextStyle}>
            {isRefundSubmitted ? status : APP_CONSTANTS.VIEW_ORDER}
          </Text>
        </View>
        <Text allowFontScaling={false} style={styles.priceTextStyle}>{`${
          isRefundSubmitted ? '-' : ''
        } $ ${formatAmountValue(totalAmount ?? TOTAL_AMOUNT)} total`}</Text>
        <Text allowFontScaling={false} style={[styles.priceTextStyle, {marginTop: hp('1.5%')}]}>
          {itemsList.length} {itemsList.length === 1 ? 'Item' : 'Items'}
        </Text>
        <View style={styles.divider} />
        <View style={styles.dateWrapper}>
          <View style={styles.deliveryWrapper}>
            {renderDeliveryIcon()}
            <Text allowFontScaling={false} style={styles.orderTypeText}>{orderType}</Text>
          </View>
          <View>
            <Text allowFontScaling={false} style={styles.orderIdText}>{idStatus}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  orderItemParentView: {
    backgroundColor: COLORS.WHITE,
    marginTop: hp('1.7%'),
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
  },
  orderTypeText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('2%'),
    color: COLORS.BLACK_40,
  },
  orderIdText: {
    fontSize: getFontSize(13),
    fontFamily: 'SFProDisplay-Regular',
  },
  dateStyle: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.BOLD,
  },
  dateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('3%'),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  reOrderTextStyle: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.MAIN,
  },
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
    width: '94%',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginStart: wp('6%'),
  },
  priceTextStyle: {
    fontSize: getFontSize(13),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    marginTop: hp('1%'),
    color: COLORS.BLACK,
  },
  deliveryWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default RefundOrderCard;
