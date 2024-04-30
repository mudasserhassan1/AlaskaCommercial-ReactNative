import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import styles from './styles';
import {api} from '../../../services/Apis';
import {PAYMENT_METHODS} from '../../../constants/Common';
import PropTypes from 'prop-types';
import SnapWebView from '../SnapWebView';

const baseUrl = api.getBaseURL();

const SnapPinModal = props => {
  const {visible, onSubmitPin, pinType} = props;

  const {savedSnapCard} = useSelector(
    ({payment: {payments: {[PAYMENT_METHODS.SNAP]: savedSnapCard = []} = {}} = {}}) => ({
      savedSnapCard,
    }),
  );

  const {_id: cardId} = savedSnapCard?.[savedSnapCard?.length - 1] ?? {};

  const pinUri = `${baseUrl}payment/tokenizesnappin?paymentMethodId=${cardId}&pinType=${pinType}`;

  const onPinResponse = (data = {}) => {
    const {status, response} = data ?? {};
    if (status === 'success' && response) {
      if (typeof onSubmitPin === 'function') {
        onSubmitPin();
      }
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SnapWebView uri={pinUri} onMessage={onPinResponse} />
    </View>
  );
};

SnapPinModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  pinType: PropTypes.string.isRequired,
};

export default SnapPinModal;
