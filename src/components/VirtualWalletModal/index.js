import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Dimensions, Text, View} from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';

import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import BottomSheetModal from '../BottomSheetModal';
import {getVwBalance} from '../../services/ApiCaller';
import {logToConsole} from '../../configs/ReactotronConfig';
import DialogBox from '../DialogBox';
import {COLORS} from '../../theme';
import {formatAmountValue} from '../../utils/calculationUtils';
import {shallowEqual, useSelector} from 'react-redux';
import {VW_PREFIX} from '../../constants/Common';

const VirtualWalletModal = ({visible, closeModal, contentOnly}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isRetryModalHidden, setIsRetryModalHidden] = useState(true);

  const vwNumberSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.vwNumber ?? '',
    [],
  );

  const phoneNumberSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.PhoneNumber ?? '',
    [],
  );

  const vwNumber = useSelector(vwNumberSelector, shallowEqual);

  const PhoneNumber = useSelector(phoneNumberSelector, shallowEqual);
  const onFetchVWBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const {response} = await getVwBalance();
      if (response.ok) {
        const {data: {response: details = {}} = {}} = response || {};
        setBalance(details?.amount || 0);
      } else {
        if (!response.isUnderMaintenance) {
          throw response;
        }
      }
    } catch (e) {
      logToConsole({onFetchVWBalanceError: e});
      setIsErrorModal(true);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (visible) {
      onFetchVWBalance();
    }
  }, [visible]);

  const onConfirmPress = () => {
    setIsErrorModal(false);
    onFetchVWBalance();
  };

  const onCancelRetry = () => {
    setIsErrorModal(false);
    setTimeout(() => {
      closeModal?.();
    }, 500);
  };

  const renderScreenContent = () => {
    if (vwNumber) {
      return (
        <>
          {renderAccountNumberView()}
          {renderAccountBalanceText()}
          {renderBarCode()}
        </>
      );
    }
    return null;
  };

  const renderModalContent = () => (
    <>
      <View style={styles.modalView}>{renderScreenContent()}</View>
      <DialogBox
        visible={isErrorModal}
        onModalHide={() => setIsRetryModalHidden(true)}
        onModalWillShow={() => setIsRetryModalHidden(false)}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        onConfirmPress={onConfirmPress}
        onCancelPress={onCancelRetry}
      />
    </>
  );

  const renderAccountNumberView = () => (
    <View style={styles.modalContainer}>
      <Text allowFontScaling={false} style={styles.subHeaderText}>{APP_CONSTANTS.ACCOUNT_NUMBER}</Text>
      <Text allowFontScaling={false} style={styles.accountNumber}>{vwNumber}</Text>
    </View>
  );

  const renderAccountBalanceText = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        {isLoading && (
          <ActivityIndicator
            color={COLORS.MAIN}
            size={'small'}
            style={styles.loader}
          />
        )}
        {!isLoading && (
          <Text allowFontScaling={false} style={styles.availableBalanceText}>
            ${formatAmountValue(balance || 0)}
          </Text>
        )}
        <Text allowFontScaling={false} style={styles.availableBalanceText}>
          {' '}
          {APP_CONSTANTS.AVAILABLE}
        </Text>
      </View>
    );
  };

  const renderBarCode = () => {
    const barCodeNumber = `${VW_PREFIX}${vwNumber}${PhoneNumber?.replace(
      /\D+/g,
      '',
    )}`;
    return (
      <View style={styles.barCodeView}>
        <Barcode
          format="CODE128"
          value={barCodeNumber}
          textStyle={styles.barCodeText}
          maxWidth={(Dimensions.get('window').width * 2) / 3}
          height={80}
        />
      </View>
    );
  };

  if (!visible) {
    return null;
  }

  if (contentOnly) {
    return renderModalContent();
  }

  return (
    <View>
      <BottomSheetModal
        visible={visible}
        title={APP_CONSTANTS.VIRTUAL_WALLET}
        onCrossPress={closeModal}
        statusBarTranslucent
        buttonTitle={APP_CONSTANTS.DONE}
        onBottomPress={closeModal}>
        <View>{renderModalContent()}</View>
      </BottomSheetModal>
    </View>
  );
};

export default React.memo(VirtualWalletModal);
