import React, {useMemo} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './modalStyles';
import ImageComponent from '../../components/ImageComponent';
import {COLORS, IMAGES} from '../../theme';
import {
  IMAGES_RESIZE_MODES,
  PAYMENT_METHOD_STATUS,
  PAYMENT_METHODS,
} from '../../constants/Common';
import {APP_CONSTANTS} from '../../constants/Strings';
import LabelRadioItem from '../../components/LabelRadioItem';
import ErrorMessage from '../../components/ErrorMessage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '../../components/CheckBox';
import {formatAmountValue} from '../../utils/calculationUtils';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export const getPaymentErrorTitle = method => {
  const {type} = method || {};
  switch (type) {
    case PAYMENT_METHODS.SNAP_FOOD:
      return {
        title: 'SNAP Food',
      };
    case PAYMENT_METHODS.SNAP_CASH:
      return {
        title: 'EBT Cash',
      };
    default:
      return {
        title: paymentMethodTitle({type})?.header,
      };
  }
};

export const paymentMethodTitle = method => {
  let {
    type = '',
    lastFour = '',
    cardType = '',
    transactionType,
    paymentMethodType,
    firstName = '',
    lastName = '',
    organization = '',
  } = method ?? {};
  type = type || paymentMethodType;

  switch (type) {
    case PAYMENT_METHODS.SNAP:
      return {
        header: transactionType === 'FOOD' ? 'SNAP Food' : 'EBT Cash',
        title: `XXXXXXXXXXX${lastFour}`,
        subTitle: `EBT Card ending in ${lastFour}`,
        text: `EBT ${APP_CONSTANTS.CARD_ENDING_IN} ${lastFour}`,
      };
    case PAYMENT_METHODS.EIGEN:
      return {
        header: APP_CONSTANTS.CREDIT_OR_DEBIT_CARD,
        title: `XXXXXXXXXXX${lastFour}`,
        subTitle: `${cardType || 'Card'} ending in ${lastFour}`,
      };
    case PAYMENT_METHODS.GIFT_CARD:
      return {
        header: APP_CONSTANTS.GIFT_CARD,
        title: `XXXXXXXXXXX${lastFour}`,
        subTitle: `${APP_CONSTANTS.GIFT_CARD_ENDING_IN} ${lastFour}`,
        text: `${APP_CONSTANTS.CARD_ENDING_IN} ${lastFour}`,
      };
    case PAYMENT_METHODS.STORE_CHARGE:
      return {
        header: APP_CONSTANTS.STORE_CHARGE_ACCOUNT,
        title: `${
          firstName && lastName ? firstName + ' ' + lastName : organization
        }`,
        subTitle: `${APP_CONSTANTS.STA_ENDING_IN} ${lastFour}`,
        text: `${APP_CONSTANTS.ACCOUNT_ENDING_IN} ${lastFour}`,
      };
    case PAYMENT_METHODS.VIRTUAL_WALLET:
      return {
        header: APP_CONSTANTS.VIRTUAL_WALLET,
        title: `${firstName} ${lastName}`,
        subTitle: APP_CONSTANTS.VIRTUAL_WALLET,
        text: `${APP_CONSTANTS.CARD_ENDING_IN} ${lastFour}`,
      };
    default:
      return {
        title: '',
        subTitle: '',
        header: '',
      };
  }
};

export const getExpiryDate = date => {
  if (date) {
    date = date?.padStart(4, 0);
    const month = date.substring(0, 2);
    const year = date.substring(2, 4);
    return `${month}/${year}`;
  }
  return '';
};

export const Divider = ({divider = true, style}) => {
  if (divider) {
    return <View style={[styles.divider, style]} />;
  }
  return null;
};

export const AddedCardsButton = ({
  method,
  onPress,
  onEditPressed,
  disabled,
  title,
  subTitle,
  isSelected,
  onPressRemove,
  isProfileScreen,
  divider = true,
  withRemove = true,
  amounts = [],
  methods,
  isOrderReviewScreen = false,
}) => {
  const {status, cardExpiry} = method ?? {};

  const error = useMemo(() => {
    return status === PAYMENT_METHOD_STATUS.EXPIRED
      ? APP_CONSTANTS.CARD_EXPIRED
      : status === PAYMENT_METHOD_STATUS.INACTIVE
      ? APP_CONSTANTS.CARD_INACTIVE
      : '';
  }, [status]);

  const {title: titleP, subTitle: subTitleP} = paymentMethodTitle(method);

  const renderExpiryDate = useMemo(() => {
    if (parseFloat(cardExpiry)) {
      return (
        <Text allowFontScaling={false} style={styles.addedCardType}>{`${
          APP_CONSTANTS.EXPIRY_DATE
        }: ${getExpiryDate(cardExpiry)}`}</Text>
      );
    }
    return null;
  }, [cardExpiry]);

  const renderSelectedAmount = useMemo(() => {
    if (!isProfileScreen && isSelected && amounts?.length) {
      return (
        <View style={styles.selectedAmountContainer}>
          <View style={styles.selectLeftLine} />
          <View>
            {amounts?.map(item => {
              const {text, amount = 0, showZero} = item || {};
              return text && (amount || showZero) ? (
                <Text
                    allowFontScaling={false}
                  style={
                    styles.selectedAmountText
                  }>{`${text}: $${formatAmountValue(amount)}`}</Text>
              ) : null;
            })}
          </View>
        </View>
      );
    }
    return null;
  }, [amounts, isSelected]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => onPress({...method, isSelected, methods})}
        style={[styles.zipCodeWrapper, styles.addedCardsContainer]}>
        {!isProfileScreen && !isOrderReviewScreen && (
          <View style={styles.checkBoxContainer}>
            <CheckBox
              size={15}
              disabled
              isSelected={isSelected}
              onPress={() => {}}
            />
          </View>
        )}
        <View style={styles.addedCards}>
          {isProfileScreen && (
            <Text allowFontScaling={false} style={styles.cardHolderName} numberOfLines={1}>
              {title || titleP}
            </Text>
          )}
          <Text allowFontScaling={false} style={styles.addedCardType} numberOfLines={1}>
            {subTitle || subTitleP}
          </Text>
          {renderExpiryDate}
          <ErrorMessage textStyle={styles.expired} error={error} />
          {renderSelectedAmount}
        </View>
        {!isProfileScreen &&
          isSelected &&
          !methods.includes(PAYMENT_METHODS.EIGEN) && (
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!!disabled}
              style={{paddingLeft: 20, paddingTop: 20, alignSelf: 'flex-end'}}
              onPress={() =>
                onEditPressed({...method, isSelected, methods, isEdit: true})
              }>
              <Text allowFontScaling={false} style={styles.editButton} numberOfLines={1}>
                {APP_CONSTANTS.EDIT}
              </Text>
            </TouchableOpacity>
          )}
        {isProfileScreen && withRemove && (
          <Pressable hitSlop={20} onPress={() => onPressRemove(method)}>
            <Ionicons name={'trash-outline'} size={22} />
          </Pressable>
        )}
      </TouchableOpacity>
      <Divider divider={divider} />
    </>
  );
};

export const PaymentOptionButton = ({
  onPress,
  disabled,
  text = '',
  textStyle,
  containerStyle,
  divider = true,
  icon = true,
  radio = false,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.zipCodeWrapper, containerStyle]}>
        <View style={styles.infoContainer}>
          {!!icon && (
            <ImageComponent
              source={IMAGES.ADD_ICON_NEW}
              style={[
                {width: 30, height: 30},
                disabled && {tintColor: COLORS.GRAY_67},
              ]}
              resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
            />
          )}
          {!!radio && <LabelRadioItem isSelected={false} onlyRadio />}
          <Text
              allowFontScaling={false}
            style={[
              styles.createListText,
              disabled && {color: COLORS.GRAY_67},
              textStyle,
            ]}>
            {text}
          </Text>
        </View>
        {/*<View style={{justifyContent: 'center'}}>*/}
        {/*  <ImageComponent*/}
        {/*    source={IMAGES.RIGHT_ARROW}*/}
        {/*    style={[styles.rightArrowStyle, disabled && {tintColor: COLORS.GRAY_67}]}*/}
        {/*  />*/}
        {/*</View>*/}
      </TouchableOpacity>
      {/*<Divider divider={divider} />*/}
    </>
  );
};
