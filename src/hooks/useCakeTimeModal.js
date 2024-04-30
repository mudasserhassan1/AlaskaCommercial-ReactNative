// import {APP_CONSTANTS} from '../constants/Strings';
// import DialogBox from '../components/DialogBox';
// import React, {useState} from 'react';
// import {tr} from 'date-fns/locale';
// import {logToConsole} from '../configs/ReactotronConfig';
//
// const useCakeTimeModal = ({onConfirmPress}) => {
//   const [isVisibleCakeTimeModal, setIsVisibleCakeTimeModal] = useState(false);
//   const [isPartyTrayTimeModal, setIsPartyTrayTimeModal] = useState(false);
//   const [isCakeOrPartyTrayTimeModal, setIsCakeOrPartyTrayTimeModal] = useState(false);
//
//   const closeModal = () => {
//     setIsVisibleCakeTimeModal(false);
//     setIsPartyTrayTimeModal(false);
//     setIsCakeOrPartyTrayTimeModal(false);
//   };
//
//   const onConfirm = () => {
//     if (isCakeOrPartyTrayTimeModal) {
//       onConfirmPress({isCakeOrPartyItemDisplayed: true});
//     } else if (isPartyTrayTimeModal) {
//       onConfirmPress({isPartyItemDisplayed: true});
//     } else if (isVisibleCakeTimeModal) {
//       onConfirmPress({isCakeModalDisplayed: true});
//     }
//
//     closeModal();
//   };
//
//   const renderCakeTimeModal = () => (
//     <DialogBox
//       title={
//         isVisibleCakeTimeModal
//           ? APP_CONSTANTS.CUSTOM_CAKE_LEAD_TIME
//           : isCakeOrPartyTrayTimeModal
//           ? APP_CONSTANTS.PARTY_TRAY_OR_CUSTOM_CAKE
//           : APP_CONSTANTS.PARTY_TRAY_LEAD_TIME
//       }
//       visible={isVisibleCakeTimeModal || isPartyTrayTimeModal || isCakeOrPartyTrayTimeModal}
//       message={
//         isVisibleCakeTimeModal
//           ? APP_CONSTANTS.CAKE_LEAD_TIME_MESSAGE
//           : isCakeOrPartyTrayTimeModal
//           ? APP_CONSTANTS.PARTY_TRAY_OR_CUSTOM_CAKE_MESSAGE
//           : APP_CONSTANTS.PARTY_TRAY_TIME_MESSAGE
//       }
//       isSingleButton={false}
//       cancelButtonLabel={APP_CONSTANTS.CANCEL}
//       confirmButtonLabel={APP_CONSTANTS.OKAY}
//       onConfirmPress={onConfirm}
//       closeModal={closeModal}
//       onCancelPress={closeModal}
//     />
//   );
//
//   return {
//     renderCakeTimeModal,
//     setIsVisibleCakeTimeModal,
//     setIsPartyTrayTimeModal,
//     setIsCakeOrPartyTrayTimeModal,
//   };
// };
//
// export default useCakeTimeModal;

import {APP_CONSTANTS} from '../constants/Strings';
import DialogBox from '../components/DialogBox';
import React, {useState} from 'react';
import {tr} from 'date-fns/locale';
import {logToConsole} from '../configs/ReactotronConfig';

const useCakeTimeModal = ({onConfirmPress}) => {
  const [isVisibleCakeTimeModal, setIsVisibleCakeTimeModal] = useState(false);
  const [isPartyTrayTimeModal, setIsPartyTrayTimeModal] = useState(false);
  const [isCakeOrPartyTrayTimeModal, setIsCakeOrPartyTrayTimeModal] = useState(false);

  const closeModal = () => {
    setIsVisibleCakeTimeModal(false);
    setIsPartyTrayTimeModal(false);
    setIsCakeOrPartyTrayTimeModal(false);
  };

  const onConfirm = () => {
    if (isCakeOrPartyTrayTimeModal) {
      onConfirmPress({isCakeOrPartyItemDisplayed: true});
    } else if (isPartyTrayTimeModal) {
      onConfirmPress({isPartyItemDisplayed: true});
    } else if (isVisibleCakeTimeModal) {
      onConfirmPress({isCakeModalDisplayed: true});
    }
    closeModal();
  };

  const renderCakeTimeModal = () => (
      <DialogBox
      title={
        isVisibleCakeTimeModal
          ? APP_CONSTANTS.CUSTOM_CAKE_LEAD_TIME
          : isCakeOrPartyTrayTimeModal
          ? APP_CONSTANTS.PARTY_TRAY_OR_CUSTOM_CAKE
          : APP_CONSTANTS.PARTY_TRAY_LEAD_TIME
      }
      visible={isVisibleCakeTimeModal || isPartyTrayTimeModal || isCakeOrPartyTrayTimeModal}
      message={
        isVisibleCakeTimeModal
          ? APP_CONSTANTS.CAKE_LEAD_TIME_MESSAGE
          : isCakeOrPartyTrayTimeModal
          ? APP_CONSTANTS.PARTY_TRAY_OR_CUSTOM_CAKE_MESSAGE
          : APP_CONSTANTS.PARTY_TRAY_TIME_MESSAGE
      }
      isSingleButton={false}
      cancelButtonLabel={APP_CONSTANTS.CANCEL}
      confirmButtonLabel={APP_CONSTANTS.OKAY}
      onConfirmPress={onConfirm}
      closeModal={closeModal}
      onCancelPress={closeModal}
    />
  );

  return {
    renderCakeTimeModal,
    setIsVisibleCakeTimeModal,
    setIsPartyTrayTimeModal,
    setIsCakeOrPartyTrayTimeModal,
  };
};

export default useCakeTimeModal;
