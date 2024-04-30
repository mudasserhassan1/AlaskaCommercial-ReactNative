import {PaymentOptionButton} from './PaymentsButtons';
import {APP_CONSTANTS} from '../../constants/Strings';
import {Text, View} from 'react-native';
import React, {memo} from 'react';
import {COLORS} from '../../theme';
import {styles} from './modalStyles';
import {logToConsole} from '../../configs/ReactotronConfig';

const PaymentOptionsModal = ({
  isProfileScreen,
  toggleAddCreditCardModal,
  toggleAddSNAPCardModal,
  openGiftCardModal,
  openStoreChargeModal,
  isSnapDisabled,
}) => {
  return (
    <View style={{backgroundColor: COLORS.WHITE, marginTop: 2}}>
      {!isProfileScreen && (
        <Text allowFontScaling={false} style={styles.savedCardsText}>
          {APP_CONSTANTS.ADD_PAYMENT_METHOD}
        </Text>
      )}

      <PaymentOptionButton
        key={APP_CONSTANTS.ADD_CREDIT_OR_DEBIT_CARD}
        text={APP_CONSTANTS.ADD_CREDIT_OR_DEBIT_CARD}
        onPress={() => toggleAddCreditCardModal({show: true})}
      />
      <PaymentOptionButton
        disabled={!!isSnapDisabled}
        text={APP_CONSTANTS.ADD_SNAP_CARD}
        key={APP_CONSTANTS.ADD_SNAP_CARD}
        onPress={() => toggleAddSNAPCardModal(true)}
      />
      <PaymentOptionButton
        text={APP_CONSTANTS.ADD_AC_GIFT_CARD}
        key={APP_CONSTANTS.ADD_AC_GIFT_CARD}
        onPress={openGiftCardModal}
      />
      <PaymentOptionButton
        key={APP_CONSTANTS.ADD_STORE_CHARGE_ACCOUNT}
        text={APP_CONSTANTS.ADD_STORE_CHARGE_ACCOUNT}
        onPress={openStoreChargeModal}
      />
    </View>
  );
};

export default memo(PaymentOptionsModal);
