import React, {useState} from 'react';
import {Alert, Linking} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import DialogBox from '../DialogBox';

const useNotificationPermissionModal = () => {
  const [isPermissionModal, setIsPermissionModal] = useState(false);

  const closeModal = () => {
    setIsPermissionModal(false);
  };

  const onOpenSettings = () => {
    closeModal();
    Linking.openSettings();
  };

  const onShowAlert = () => {
    Alert.alert(
      APP_CONSTANTS.OPEN_SETTINGS,
      APP_CONSTANTS.OPEN_SETTINGS_TEXT,
      [
        {
          text: APP_CONSTANTS.NO,
          onPress: closeModal,
        },
        {
          text: APP_CONSTANTS.YES,
          onPress: onOpenSettings,
        },
      ],
      {cancelable: false},
    );
  };

  const renderPermissionModalJSX = () => {
    return (
      <DialogBox
        visible={isPermissionModal}
        closeModal={closeModal}
        title={APP_CONSTANTS.OPEN_SETTINGS}
        message={APP_CONSTANTS.OPEN_SETTINGS_TEXT}
        messageContainerStyles={{marginTop: 5}}
        onCancelPress={closeModal}
        confirmButtonLabel={APP_CONSTANTS.YES}
        onConfirmPress={onOpenSettings}
        cancelButtonLabel={APP_CONSTANTS.NO}
      />
    );
  };

  return {
    renderPermissionModalJSX,
    onShowAlert,
  };
};

export default useNotificationPermissionModal;
