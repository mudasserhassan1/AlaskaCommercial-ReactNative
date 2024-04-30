import DialogBox from '../DialogBox';
import {APP_CONSTANTS} from '../../constants/Strings';
import React, {useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toggleTestPayments} from '../../redux/actions/config';
import {COLORS} from '../../theme';
import {styles} from '../../screens/ShoppingCartPickup/modalStyles';
import FlashMessage from 'react-native-flash-message';

const PASSWORD = 'accsnap';
export const TestPaymentsModal = ({isVisible, closeDialog}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  // const {isTestPaymentsEnabled} = useSelector(
  //   ({config: {isTestPaymentsEnabled} = {}}) => ({isTestPaymentsEnabled}),
  // );

  const isTestPaymentsEnabledSelector = useMemo(
    () => state => state.config.isTestPaymentsEnabled ?? false,
    [],
  );
  const {isTestPaymentsEnabled} = useSelector(isTestPaymentsEnabledSelector);
  const flashRef = useRef(null);

  const showToast = ({message, backgroundColor}) => {
    setTimeout(() => {
      flashRef.current?.showMessage?.({
        message,
        backgroundColor,
      });
    }, 300);
  };

  const onConfirmPress = password => {
    if (!isTestPaymentsEnabled) {
      const isPasswordCorrect = password === PASSWORD;
      if (isPasswordCorrect) {
        dispatch(toggleTestPayments(true));
        closeDialog();
        showToast({
          message: 'Payment with EBT Card is Enabled',
          backgroundColor: COLORS.BLACK,
        });
      } else {
        setErrorMessage('Please enter a valid password');
      }
    } else {
      dispatch(toggleTestPayments(false));
      closeDialog();
      showToast({
        message: 'Payment with EBT Card is Disabled',
        backgroundColor: COLORS.BLACK,
      });
    }
  };

  return (
    <>
      <DialogBox
        animationOutTiming={50}
        visible={isVisible}
        inputProps={{
          placeholder: 'Password',
          secureTextEntry: true,
        }}
        withInput={!isTestPaymentsEnabled}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        closeModal={closeDialog}
        title={`${isTestPaymentsEnabled ? 'Disable' : 'Enable'} EBT Card`}
        message={`Do you want to ${
          isTestPaymentsEnabled ? 'disable' : 'enable'
        } EBT Card?${
          isTestPaymentsEnabled
            ? ''
            : 'Please enter the password to enable EBT Card'
        }`}
        messageStyle={{color: COLORS.BLACK}}
        titleStyle={{color: COLORS.BLACK}}
        messageContainerStyles={{marginTop: 5}}
        onCancelPress={closeDialog}
        confirmButtonLabel={
          isTestPaymentsEnabled ? APP_CONSTANTS.DISABLE : APP_CONSTANTS.ENABLE
        }
        onConfirmPress={onConfirmPress}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
      />
      <FlashMessage
        floating
        ref={flashRef}
        position={'bottom'}
        backgroundColor={COLORS.GRAY_TEXT_0_9}
        color={COLORS.WHITE}
        style={styles.flashStyle}
        titleStyle={styles.flashTitle}
        textStyle={styles.flashTitle}
        duration={4000}
      />
    </>
  );
};
