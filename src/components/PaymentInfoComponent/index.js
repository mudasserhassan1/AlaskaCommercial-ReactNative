import {Platform, StyleSheet, Text, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
import {
  BigNumber,
  formatAmountValue,
  getFormattedTransactions,
} from '../../utils/calculationUtils';
import {PAYMENT_METHODS} from '../../constants/Common';
import {paymentMethodTitle} from '../../screens/ShoppingCartPickup/PaymentsButtons';

const PaymentInfoComponent = ({
  transactions: trans = [],
  showRemainingSnapBalance = true,
  withAdjustedAmount,
  isRefund,
}) => {
  const [transactions, setTransactions] = useState(
    withAdjustedAmount ? [] : trans,
  );

  useEffect(() => {
    if (withAdjustedAmount) {
      setTransactions(getFormattedTransactions(trans).purchase);
    } else {
      setTransactions(trans);
    }
  }, [trans, withAdjustedAmount]);

  const getRemainingSnapBalances = useCallback(() => {
    let remainingSnapFood = 0.0;
    let remainingSnapCash = 0.0;
    transactions.forEach(transaction => {
      const {paymentMethodType = ''} = transaction ?? {};
      if (paymentMethodType === PAYMENT_METHODS.SNAP) {
        const {transactionSummary = {}} = transaction ?? {};
        const {EBTWICData = {}} =
          transactionSummary?.response || transactionSummary || {};
        const {FoodStampAvailableBAL = 0.0, CashBenefitsAvailBAL = 0.0} =
          EBTWICData;
        remainingSnapCash = CashBenefitsAvailBAL;
        remainingSnapFood = FoodStampAvailableBAL;
      }
    });
    return {remainingSnapFood, remainingSnapCash};
  }, [transactions]);

  const renderSnapBalance = useMemo(() => {
    if (
      showRemainingSnapBalance &&
      transactions?.some(tr => tr?.paymentMethodType === PAYMENT_METHODS.SNAP)
    ) {
      const {remainingSnapFood = 0.0, remainingSnapCash = 0.0} =
        getRemainingSnapBalances();
      return (
        <View style={styles.snapRemainingAmountView}>
          <View style={styles.amountRow}>
            <Text allowFontScaling={false} style={styles.snapTextAndAmount}>
              {APP_CONSTANTS.SNAP_REMAINING_BALANCE}
            </Text>
            <Text allowFontScaling={false} style={styles.snapTextAndAmount}>
              {' '}
              ${formatAmountValue(remainingSnapFood)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text allowFontScaling={false} style={styles.snapTextAndAmount}>
              {APP_CONSTANTS.CASH_REMAINING_BALANCE}
            </Text>
            <Text allowFontScaling={false} style={styles.snapTextAndAmount}>
              {' '}
              ${formatAmountValue(remainingSnapCash)}
            </Text>
          </View>
          <View style={styles.divider} />
        </View>
      );
    }
    return null;
  }, [getRemainingSnapBalances, showRemainingSnapBalance, transactions]);

  const renderPaymentCards = () => {
    return transactions?.map(item => {
      const {amount, adjustmentAmount = 0, overChargeAmount = 0} = item ?? {};
      const {header, subTitle, text} = paymentMethodTitle(item);
      return (
        <View style={styles.transactionRow}>
          <Text  allowFontScaling={false} style={styles.transactionTypeHeader}>{header}</Text>
          <View style={styles.transactionTypeCardInfoRow}>
            <Text allowFontScaling={false} style={styles.transactionTypeCardInfo}>
              {text || subTitle}
            </Text>
            <Text allowFontScaling={false} style={styles.transactionTypeCardInfo}>{`${
              isRefund ? '-' : ''
            }$${formatAmountValue(amount)}`}</Text>
          </View>
          {withAdjustedAmount && BigNumber(overChargeAmount).abs().gt(0) && (
            <View style={styles.transactionTypeCardInfoRow}>
              <Text allowFontScaling={false} style={[styles.transactionTypeCardInfo, styles.adjusted]}>
                {APP_CONSTANTS.ADJUSTMENT_AMOUNT}
              </Text>
              <Text allowFontScaling={false} style={[styles.transactionTypeCardInfo, styles.adjusted]}>
                {`+ $${formatAmountValue(Math.abs(overChargeAmount))}`}
              </Text>
            </View>
          )}
          {withAdjustedAmount && BigNumber(adjustmentAmount).abs().gt(0) && (
            <View style={styles.transactionTypeCardInfoRow}>
              <Text allowFontScaling={false} style={[styles.transactionTypeCardInfo, styles.adjusted]}>
                {APP_CONSTANTS.ADJUSTMENT_AMOUNT}
              </Text>
              <Text allowFontScaling={false} style={[styles.transactionTypeCardInfo, styles.adjusted]}>
                {`${
                  BigNumber(adjustmentAmount).gt(0) ? '+' : '-'
                } $${formatAmountValue(Math.abs(adjustmentAmount))}`}
              </Text>
            </View>
          )}
        </View>
      );
    });
  };

  if (transactions?.length > 0) {
    return (
      <View style={styles.itemStatusWrapper}>
        <View style={styles.itemStatusInnerWrapper}>
          <Text allowFontScaling={false} style={styles.disclaimerWrapper}>{APP_CONSTANTS.PAYMENT}</Text>
          {renderSnapBalance}
          {renderPaymentCards()}
        </View>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  itemStatusWrapper: {
    marginTop: hp('2%'),
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1.2%'),
  },
  itemStatusInnerWrapper: {
    marginStart: wp('6%'),
  },
  disclaimerWrapper: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.SEMI_BOLD,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  orderTextStyle: {
    color: COLORS.MAIN,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    fontFamily: FONTS.REGULAR,
  },
  snapRemainingAmountView: {
    marginTop: hp('1%'),
  },
  divider: {
    width: '100%',
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('0.3%'),
  },
  amountRow: {
    flexDirection: 'row',
    marginVertical: hp('0.7%'),
  },
  snapTextAndAmount: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    color: COLORS.CHARCOAL_GREY_60,
  },
  transactionRow: {
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY0_5,
  },
  transactionTypeHeader: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(15),
    lineHeight: 22,
    letterSpacing: -0.36,
    color: COLORS.BLACK,
  },
  transactionTypeCardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginEnd: wp('6%'),
    marginTop: 3,
  },
  transactionTypeCardInfo: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  adjusted: {
    color: COLORS.MAIN,
  },
});
export default PaymentInfoComponent;
