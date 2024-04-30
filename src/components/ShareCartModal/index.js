import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import BottomSheetModal from '../BottomSheetModal';
import {sendListToExternalEmail, shareCartToStore} from '../../services/ApiCaller';
import Spinner from 'react-native-loading-spinner-overlay';
import {useSelector} from 'react-redux';
import {styles as screenStyle} from '../../screens/ShoppingCartPickup/styles';
import DialogBox from '../DialogBox';
import {resetToHome} from '../../utils/navigationUtils';
import {styles} from './styles';
import {MODAL_KEYS, MODAL_TITLES} from './constants';
import StoreModal from './StoreModal';
import ExternalEmailModal from './ExternalEmailModal';
import ShareOptionsModal from './ShareOptionsModal';

const ShareCartModal = ({visible, onClose, listId}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [isDialogBox, setIsDialogBox] = useState(false);
  const [modalKey, setModalKey] = useState('');
  const [dialogBoxMessage, setDialogBoxMessage] = useState('');

  const {
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    PhoneNumber: phoneNumber,
    storeName,
  } = useSelector(
    ({
      general: {
        storeDetail: {storeName = ''} = {},
        loginInfo: {userInfo: {FirstName, LastName, PhoneNumber, Email} = {}} = {},
      } = {},
    }) => ({
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      storeName,
    }),
  );

  useEffect(() => {
    if (visible) {
      setModalKey(listId ? MODAL_KEYS.SHARE : MODAL_KEYS.STORE);
    } else {
      setModalKey('');
    }
  }, [listId, visible]);

  const onSelectOption = ({shareWithKey}) => {
    setModalKey(shareWithKey);
  };

  const onShareToStore = async ({message, isSNAPChecked, externalEmail}) => {
    const apiFunc = listId ? sendListToExternalEmail : shareCartToStore;
    setIsLoading(true);
    const {response} = await apiFunc({
      message,
      snap: isSNAPChecked,
      firstName,
      lastName,
      email,
      phoneNumber,
      listId,
      externalEmail,
    });
    setIsLoading(false);
    if (response.ok) {
      const dialogBoxMsg = externalEmail
        ? `${APP_CONSTANTS.LIST_SHARED_WITH_EMAIL} ${externalEmail}`
        : APP_CONSTANTS.SHARE_ITEMS_WITH_STORE_CONFIRMED.replaceAll('STORE', storeName);
      setDialogBoxMessage(dialogBoxMsg);
      setIsDialogBox(true);
    }
    onClose();
  };

  const closeDialogBox = () => {
    setIsDialogBox(false);
  };

  const onOkPress = () => {
    closeDialogBox();
    resetToHome();
  };

  const renderStoreModal = () => {
    if (modalKey === MODAL_KEYS.STORE) {
      return <StoreModal storeName={storeName} onShare={onShareToStore} onClose={onClose} />;
    }
  };

  const renderExternalModal = () => {
    if (modalKey === MODAL_KEYS.EXTERNAL_EMAIL) {
      return <ExternalEmailModal onClose={onClose} onShare={onShareToStore} />;
    }
  };

  const renderOptionsModal = () => {
    if (modalKey === MODAL_KEYS.SHARE) {
      return <ShareOptionsModal onClose={onClose} onBottomPress={onSelectOption} />;
    }
  };

  return (
    <>
      <DialogBox
        visible={isDialogBox && isModalHidden}
        closeModal={closeDialogBox}
        title={APP_CONSTANTS.SUCCESS}
        message={dialogBoxMessage}
        messageContainerStyles={screenStyle.dialogBoxMessage}
        cancelButtonLabel={APP_CONSTANTS.OK}
        isSingleButton
        onConfirmPress={onOkPress}
      />
      <BottomSheetModal
        onModalHide={() => setIsModalHidden(true)}
        onModalWillShow={() => setIsModalHidden(false)}
        visible={visible}
        title={MODAL_TITLES[modalKey]}
        showButton={false}
        onCrossPress={onClose}>
        <View style={styles.modalContentII}>
          {renderStoreModal()}
          {renderExternalModal()}
        </View>
        {renderOptionsModal()}
        <Spinner visible={isLoading && !isModalHidden} color={COLORS.MAIN} />
      </BottomSheetModal>
    </>
  );
};

export default ShareCartModal;
