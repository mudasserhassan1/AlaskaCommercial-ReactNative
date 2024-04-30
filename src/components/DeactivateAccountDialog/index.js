/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';

import styles from './styles';
import {deactivateAccount} from '../../services/ApiCaller';
import {logout} from '../../utils/userUtils';
import {STATUSES} from '../../constants/Api';

const DeactivateAccountDialog = ({closeModal, visible = false, toggleLoading, showApiErrorDialog}) => {
  const dispatch = useDispatch();

  async function deActivateAccount() {
    closeModal();
    setTimeout(() => {
      toggleLoading();
    }, 500);
    const {response = {}} = await deactivateAccount();
    let {status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    toggleLoading();
    if (status === STATUSES.OK) {
      return await logout(dispatch);
    } else if (isUnderMaintenance) {
    } else if (status === STATUSES.AUTH_ERROR) {
      const {
        data: {msg = ''},
      } = response ?? {};
      showApiErrorDialog(msg);
    } else if (!isNetworkError) {
      showApiErrorDialog('');
    }
  }
  const renderModalBody = () => (
    <View style={styles.parentView}>
      <View style={styles.content}>
        <Text allowFontScaling={false} style={styles.title}>{APP_CONSTANTS.DEACTIVATE_ACCOUNT}</Text>
        <View style={styles.messageContainer}>
          <Text allowFontScaling={false} style={styles.message}>{APP_CONSTANTS.DEACTIVATE_ACCOUNT_MESSAGE}</Text>
        </View>
        <View style={styles.horizontalSeparator} />
        {renderDialogButtons()}
      </View>
    </View>
  );

  const renderDialogButtons = () => {
    return renderHorizontalButtons();
  };

  const renderHorizontalButtons = () => (
    <View style={styles.horizontalButtonsView}>
      <TouchableOpacity style={styles.horizontalButton} onPress={closeModal}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{APP_CONSTANTS.NO}</Text>
      </TouchableOpacity>
      {renderHorizontalSeparator()}
      <TouchableOpacity style={styles.horizontalButton} onPress={deActivateAccount}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{APP_CONSTANTS.YES}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalSeparator = () => <View style={styles.verticalSeparator} />;

  return (
    <Modal
      backdropColor={COLORS.BLACK_40}
      useNativeDriver={true}
      animationInTiming={300}
      animationOutTiming={300}
      statusBarTranslucent={true}
      avoidKeyboard={true}
      hideModalContentWhileAnimating={true}
      useNativeDriverForBackdrop={true}
      isVisible={visible}>
      {renderModalBody()}
    </Modal>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return prevProps.visible === nextProps.visible;
}
export default memo(DeactivateAccountDialog, arePropsEqual);
