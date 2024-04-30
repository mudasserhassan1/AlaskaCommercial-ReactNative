import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {APP_CONSTANTS} from '../../../constants/Strings';

export const PaymentTextComponent = ({text, amount}) => {
  return (
    <View style={styles.textContainer}>
      <Text allowFontScaling={false} style={styles.boldText}>{`${text}:`}</Text>
      <Text allowFontScaling={false} style={styles.amountText}>${String(amount)}</Text>
    </View>
  );
};

const SnapBalanceModal = props => {
  const {snapCard} = props;

  const {cashBenefitsBalance, foodStampBalance} = snapCard ?? {};

  return (
    <>
      <PaymentTextComponent text={APP_CONSTANTS.FOOD_BENEFIT} amount={foodStampBalance ?? 0.0} />
      <PaymentTextComponent text={APP_CONSTANTS.CASH_BENEFIT} amount={cashBenefitsBalance ?? 0.0} />
    </>
  );
};

export default React.memo(SnapBalanceModal);
