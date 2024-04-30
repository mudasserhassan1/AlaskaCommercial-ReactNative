import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS, IMAGES} from '../../theme';
import moment from 'moment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import {getCompleteAddress} from '../../utils/addressUtils';
import {DATE_TIME_FORMATS, IMAGES_RESIZE_MODES} from '../../constants/Common';
import {useSelector} from 'react-redux';
import ImageComponent from '../ImageComponent';
import {logToConsole} from '../../configs/ReactotronConfig';

const OrderDetailAddressAndTimeComponent = ({item, orderTypeFontSize,screen}) => {
  const {
    orderType = '',
    deliveryDate = '',
    pickUpTime = '',
    deliveryAddress = '',
    airCarrier = '',
    storeName = '',
  } = item ?? {};
  const {destinationVillage = ''} = deliveryAddress ?? {};

  const {is24Hour = false} = useSelector(
    ({general: {is24Hour = false} = {}}) => ({is24Hour}),
    (prevState, nextState) => prevState.is24Hour !== nextState.is24Hour,
  );

  const renderOrderType = () => {
    return `${orderType} Order`;
  };

  const renderLocationIcon = () => {
    if (orderType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      return (
        <ImageComponent
          source={IMAGES.ICON_LOCATION}
          style={styles.largeIcon}
        />
      );
    }
    if (orderType === APP_CONSTANTS.HOME_DELIVERY) {
      return (
        <ImageComponent
          source={IMAGES.ICON_HOME_THIN}
          style={[styles.smallIcon, {marginStart: 2}]}
        />
      );
    }
    return (
      <ImageComponent source={IMAGES.ICON_FLIGHT} style={styles.smallIcon} />
    );
  };

  const getFormattedPickupTime = () => {
    let startTime, endTime;
    let filteredTime = pickUpTime.replace(/-/g, ',').trim();
    startTime = filteredTime.split(',')[0].trim();
    endTime = filteredTime.split(',')[1].trim();

    if (is24Hour) {
      startTime = moment(startTime, 'h:mm A').format('H:mm');
      endTime = moment(endTime, 'h:mm A').format('H:mm');
      return `${startTime} to ${endTime}`;
    }
    startTime = moment(startTime, 'h:mm A').format('h A');
    endTime = moment(endTime, 'h:mm A').format('h A');
    return `${startTime} to ${endTime}`;
  };

  const renderTimeIcon = () => (
    <View style={styles.orderInfoIconView}>
      <ImageComponent
        source={IMAGES.ICON_TIME}
        style={{width: 25, height: 25, resizeMode: IMAGES_RESIZE_MODES.CONTAIN}}
      />
    </View>
  );

  const renderLocationText = () => {
    if (typeof deliveryAddress === 'object') {
      return getCompleteAddress(deliveryAddress, orderType, airCarrier, screen);
    }
    return `${deliveryAddress}`;
  };

  const renderTimeText = () => {
    if (orderType === APP_CONSTANTS.CURBSIDE_PICKUP) {
      return (
        <Text>
          Pickup on{' '}
          <Text allowFontScaling={false} style={styles.boldText}>
            {moment(deliveryDate).format(DATE_TIME_FORMATS.deliveryDate)}
          </Text>{' '}
          between{' '}
          <Text allowFontScaling={false} style={styles.boldText}>{getFormattedPickupTime()}</Text>
        </Text>
      );
    }

    if (orderType === APP_CONSTANTS.HOME_DELIVERY) {
      return (
        <Text allowFontScaling={false}>
          Delivery Arriving on{' '}
          <Text allowFontScaling={false} style={{fontFamily: FONTS.SEMI_BOLD}}>
            {moment(deliveryDate).format(DATE_TIME_FORMATS.deliveryDate)}
          </Text>
        </Text>
      );
    }

    return (
      <Text  allowFontScaling={false}>
        Delivery to{' '}
        <Text allowFontScaling={false} style={styles.boldText}>
          {storeName?.replace?.('AC ', '') || destinationVillage} Airport{' '}
        </Text>
        on{' '}
        <Text allowFontScaling={false} style={styles.boldText}>
          {moment(deliveryDate).format(DATE_TIME_FORMATS.deliveryDate)}
        </Text>
      </Text>
    );
  };

  return (
    <View style={styles.deliveryInfoView}>
      <Text
          allowFontScaling={false}
        style={[styles.deliveryInfoHeaderText, {fontSize: orderTypeFontSize}]}>
        {renderOrderType()}
      </Text>
      <View style={styles.orderInfoRow}>
        <View style={styles.orderInfoIconView}>{renderLocationIcon()}</View>
        <Text allowFontScaling={false} style={styles.destinationInfoText}>{renderLocationText()}</Text>
      </View>
      <View style={styles.orderInfoRow}>
        {renderTimeIcon()}
        <Text allowFontScaling={false} style={styles.deliveryTimeText}>{renderTimeText()}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  deliveryInfoView: {
    paddingVertical: hp('1.7%'),
    backgroundColor: 'white',
    marginTop: hp('1%'),
    paddingHorizontal: wp('6%'),
  },
  deliveryInfoHeaderText: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(18),
    color: COLORS.BLACK,
  },
  orderInfoRow: {
    marginTop: hp('1.7%'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  destinationInfoText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    marginStart: 10,
    lineHeight: 22,
    color:COLORS.BLACK
  },
  deliveryTimeText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(13),
    marginStart: 10,
    marginEnd: wp('6%'),
    color:COLORS.BLACK
  },
  orderInfoIconView: {
    width: 25,
    height: 25,
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  boldText: {
    fontFamily: FONTS.SEMI_BOLD,
  },
  largeIcon: {
    width: 25,
    height: 25,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  smallIcon: {
    width: 18,
    height: 18,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
});
export default OrderDetailAddressAndTimeComponent;
