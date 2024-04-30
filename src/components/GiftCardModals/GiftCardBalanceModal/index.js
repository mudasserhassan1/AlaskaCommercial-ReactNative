import React, {memo} from 'react';
import {PaymentTextComponent} from '../../SnapModals/SnapBalanceModal';
import {APP_CONSTANTS} from '../../../constants/Strings';

const GiftCardBalanceModal = props => {
  const {availableBalance} = props;

  return <PaymentTextComponent text={APP_CONSTANTS.GC_BALANCE} amount={availableBalance} />;
};

GiftCardBalanceModal.propTypes = {};

export default memo(GiftCardBalanceModal);
