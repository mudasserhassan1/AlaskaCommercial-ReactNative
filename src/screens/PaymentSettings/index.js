/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import AddPaymentModal from '../ShoppingCartPickup/AddPaymentModal';

const PaymentSettings = () => {
  const [loading, setLoading] = useState();
  return (
    <ScreenWrapperComponent
      isLoading={loading}
      isScrollView={false}
      containerStyle={{backgroundColor: COLORS.GREY_BACKGROUND, flexGrow: 1}}
      headerTitle={APP_CONSTANTS.PAYMENT_HEADER}
      withBackButton>
      <AddPaymentModal
        isProfileScreen
        isPaymentRemaining={false}
        onRequestClose={() => {}}
        onToggleLoading={setLoading}
      />
    </ScreenWrapperComponent>
  );
};

export default PaymentSettings;
