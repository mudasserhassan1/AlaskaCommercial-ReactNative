/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo, useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, View} from 'react-native';
import {useSelector} from 'react-redux';

import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {TextField} from '../TextField';
import {useFirstRender} from '../../hooks/useFirstRender';
import BottomSheetModal from '../BottomSheetModal';
import {KEYBOARD_FEATURES} from '../../constants/Common';

const resetToInitialState = (desVillageInfo, ZipCode, FirstName, LastName, StoreLocation) => {
  const {firstName = '', lastName = '', destinationVillage = '', zipCode = ''} = desVillageInfo ?? {};
  return {
    destinationVillage: destinationVillage ? destinationVillage : StoreLocation ?? '',
    state: 'AK',
    firstName: firstName ? firstName : FirstName ?? '',
    lastName: lastName ? lastName : LastName ?? '',
    zipCode: zipCode ? zipCode : ZipCode ?? '',
  };
};
const DestinationVillageModal = ({isVisible, closeModal, defaultData = {}, onDestinationVillageChange}) => {
  let {loginInfo} = useSelector(({general: {loginInfo = {}} = {}}) => ({
    loginInfo,
  }));

  const {userInfo: {ZipCode, FirstName, LastName, StoreLocation} = {}} = loginInfo || {};
  let loadingTimeout;

  const [state, setState] = useState(() =>
    resetToInitialState(defaultData, ZipCode, FirstName, LastName, StoreLocation),
  );
  const [btnDisable, setBtnDisable] = useState(false);

  const lastNameInput = useRef(null);
  const zipCodeInput = useRef(null);
  const stateInput = useRef(null);
  const destinationVillageInput = useRef(null);

  const {firstName = '', lastName = '', zipCode = '', destinationVillage = ''} = state ?? {};

  const {
    firstName: defaultFirstName = '',
    lastName: defaultLastName = '',
    destinationVillage: defaultDestinationVillage = '',
  } = defaultData ?? {};

  const isFirstRender = useFirstRender();

  useEffect(() => {
    setState(() => resetToInitialState(defaultData, ZipCode, FirstName, LastName, StoreLocation));
  }, [isVisible]);

  const isOldData = () =>
    String(firstName) === String(defaultFirstName) &&
    String(lastName) === String(defaultLastName) &&
    String(destinationVillage) === String(defaultDestinationVillage);

  const isUpdatedData = () =>
    String(firstName) !== String(defaultFirstName) ||
    String(lastName) !== String(defaultLastName) ||
    String(destinationVillage) !== String(defaultDestinationVillage);

  const isInputEmpty = () => !firstName || !lastName || !destinationVillage;
  //
  // useEffect(() => {
  //   if (!isFirstRender) {
  //     if (isOldData() || isInputEmpty()) {
  //       setBtnDisable(true);
  //     } else if (isUpdatedData()) {
  //       setBtnDisable(false);
  //     }
  //   }
  // }, [isVisible, firstName, lastName, zipCode, destinationVillage]);

  useEffect(() => {
    return () => clearTimeout(loadingTimeout);
  });

  function actionsOnChangeText(key, value) {
    setState({...state, [key]: value});
  }

  const save = async () => {
    onDestinationVillageChange(state);
    closeModal();
  };

  const getReturnKeyTypeForInputs = () => (Platform.OS === 'ios' ? 'done' : 'next');

  return (
    <BottomSheetModal
      visible={isVisible}
      title={APP_CONSTANTS.BUSH_DELIVERY_INFORMATION}
      subtitle={APP_CONSTANTS.DESTINATION_VILLAGE}
      onCrossPress={closeModal}
      buttonTitle={APP_CONSTANTS.CONTINUE}
      isButtonDisabled={btnDisable}
      statusBarTranslucent={false}
      onBottomPress={save}>
      <View>
        <View style={styles.inputsWrapper}>

          <View style={styles.modal_divider} />
          <View style={styles.inputFullRowItem}>
            <TextField
              autoComplete={'street-address'}
              textContentType={'fullStreetAddress'}
              placeholder={APP_CONSTANTS.DESTINATION_VILLAGE}
              inputRef={destinationVillageInput}
              keyboardType={KEYBOARD_FEATURES.keyboardTypes.default}
              maxLength={30}
              editable={false}
              blurOnSubmit={false}
              value={destinationVillage}
              returnKeyType={'done'}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
          <View style={styles.modal_divider} />
          <View style={styles.bushinformation}>

            <TextField
              autoComplete={'postal-code'}
              textContentType={'postalCode'}
              placeholder={APP_CONSTANTS.ZIP_CODE}
              inputRef={zipCodeInput}
              value={state.zipCode}
              editable={false}
              maxLength={5}
              blurOnSubmit={false}
              keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
              onChangeText={text => actionsOnChangeText('zipCode', text)}
              returnKeyType={getReturnKeyTypeForInputs()}
              // onSubmitEditing={() => cityInput.current?.focus()}
            />
            <View style={styles.stateInput}>
            <TextField
              autoComplete={'postal-address-region'}
              textContentType={'addressState'}
              placeholder={APP_CONSTANTS.STATE}
              inputRef={stateInput}
              value={state.state}
              maxLength={30}
              editable={false}
            />
            </View>

          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
};
function arePropsEqual(prevProps, nextProps) {
  return prevProps.isVisible === nextProps.isVisible && prevProps.defaultData === nextProps.defaultData;
}
export default memo(DestinationVillageModal, arePropsEqual);
