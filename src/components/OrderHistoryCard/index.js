import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';

import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {formatDateForOrderHistory} from '../../utils/timeUtils';
import ImageComponent from '../ImageComponent';
import {formatAmountValue} from '../../utils/calculationUtils';
import {FONTS} from '../../theme';

const OrderHistoryCard = ({item, onItemPress, onReOrderPress}) => {
  const {
    createdDate: date = '',
    orderType = '',
    orderId = '',
    status: orderStatus = '',
    orderItems = [],
    invoice = {},
  } = item ?? {};

  const renderIcon = () => {
    if (orderType === APP_CONSTANTS.HOME_DELIVERY) {
      return <ImageComponent source={IMAGES.ICON_HOME_FOR_DELIVERY} style={styles.iconStyle} />;
    }
    if (orderType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      return <ImageComponent source={IMAGES.CURBSIDE_PICKUP} style={styles.iconStyle} />;
    }
    if (orderType === APP_CONSTANTS.BUSH_DELIVERY) {
      return <ImageComponent source={IMAGES.ICON_SHIP} style={styles.iconStyle} />;
    }
  };

  return (
    <View style={styles.orderListCardParent}>
      <TouchableOpacity onPress={() => onItemPress(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.dateWrapper}>
            <Text allowFontScaling={false} style={styles.dateStyle}>{formatDateForOrderHistory(date)}</Text>
            <TouchableOpacity onPress={onReOrderPress}>
              <Text allowFontScaling={false} style={styles.reOrderTextStyle}>Reorder</Text>
            </TouchableOpacity>
          </View>
          <Text allowFontScaling={false} style={[styles.priceTextStyle, {fontFamily: FONTS.MEDIUM}]}>Order #{orderId}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('1.5%'),
              alignItems: 'center',
            }}>
            <Text allowFontScaling={false} style={[styles.priceTextStyle, {marginTop: 0, marginEnd: widthPercentageToDP('1.5%')}]}>
              {orderItems.length === 1 ? `${orderItems.length} Item` : `${orderItems.length} Items`}
            </Text>
            <View style={{width: 4, height: 4, borderRadius: 2, alignSelf: 'center', backgroundColor: COLORS.BLACK}} />
            <Text allowFontScaling={false} style={[styles.priceTextStyle, {marginTop: 0, marginStart: widthPercentageToDP('1.5%')}]}>
              $ {formatAmountValue(invoice?.totalAmount)} total
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={[styles.dateWrapper, {marginTop: hp('1%')}]}>
            <View style={styles.orderTypeView}>
              {renderIcon()}
              <Text allowFontScaling={false} style={styles.orderTypeText}>{orderType}</Text>
            </View>
            <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode={'tail'} style={styles.orderStatus}>
              {orderStatus}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderHistoryCard;
