/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {Keyboard, Platform, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {TextField} from '../TextField';
import {useFirstRender} from '../../hooks/useFirstRender';
import BottomSheetModal from '../BottomSheetModal';
import {KEYBOARD_FEATURES, pickupTimes} from '../../constants/Common';
import isAlphanumeric from 'validator/es/lib/isAlphanumeric';
import {setCheckoutInfo} from "../../redux/actions/checkoutinfo";
import {logToConsole} from "../../configs/ReactotronConfig";
const resetToInitialState = (defaultData, userInfo) => {
  const {
    firstName: defaultFirstName = '',
    lastName: defaultLastName = '',
    Address: defaultAddress = '',
    Suite: defaultSuite = '',
    ZipCode: defaultZipCode = '',
    city: defaultCity,
  } = defaultData ?? {};
  const {ZipCode, StoreLocation, FirstName, LastName} = userInfo ?? {};
  return {
    Address: defaultAddress ?? '',
    state: 'AK',
    firstName: defaultFirstName ? defaultFirstName : FirstName ?? '',
    lastName: defaultLastName ? defaultLastName : LastName ?? '',
    zipCode: defaultZipCode ? defaultZipCode : ZipCode ?? '',
    city: defaultCity ? defaultCity : StoreLocation ?? '',
    Suite: defaultSuite,
  };
};
const DeliveryAddressModal = ({isVisible, closeModal, defaultData = {}, onAddressChange,previousData}) => {
  // let {loginInfo = {}} = useSelector(({general: {loginInfo = {}} = {}}) => ({loginInfo}));
  const useLoginInfoSelector = () =>
    useMemo(() => state => state.general?.loginInfo ?? {}, []);
  const loginInfo = useSelector(useLoginInfoSelector());
  let {userInfo = {}} = loginInfo ?? {};

  const [state, setState] = useState({});
  const [btnDisable, setBtnDisable] = useState(true);
  const lastNameInput = useRef(null);
  const zipCodeInput = useRef(null);
  const stateInput = useRef(null);
  const cityInput = useRef(null);
  const addressInput = useRef(null);
  const suiteInput = useRef(null);
  const {firstName = '', lastName = '', city: userCity = '', Address = '', Suite = ''} = state ?? {};

  const dispatch=useDispatch()
  const {
    firstName: defaultFirstName = '',
    lastName: defaultLastName = '',
    Address: defaultAddress = '',
    city: defaultCity = '',
    Suite: defaultSuite = '',
  } = defaultData ?? {};



  useEffect(() => {
    setState(() => resetToInitialState(defaultData, userInfo));
  }, [isVisible]);


  useEffect(() => {
    if (!isFirstRender) {
      if ((isOldData() || isInputEmpty())  ) {
        setBtnDisable(true);
      } else if (isUpdatedData()) {
        setBtnDisable(false);
      }
    }
  }, [isVisible, firstName, lastName, Address, userCity, Suite]);


  // useEffect(() => {
  //   const isFirstCharacterWhitespace = /^\s/.test(Address);
  //   setBtnDisable(isFirstCharacterWhitespace);
  // }, [isVisible, Address]);



  const isFirstRender = useFirstRender();
  const isOldData = () =>
    String(firstName) === String(defaultFirstName) &&
    String(lastName) === String(defaultLastName) &&
    String(Suite) === String(defaultSuite) &&
    String(Address) === String(defaultAddress) &&
    String(userCity) === String(defaultCity);

  const isUpdatedData = () =>
    String(firstName) !== String(defaultFirstName) ||
    String(lastName) !== String(defaultLastName) ||
    String(Suite) !== String(defaultSuite) ||
    String(Address) !== String(defaultAddress) ||
    String(userCity) !== String(defaultCity);

  const isFirstCharacterWhitespace = /^\s/.test(Address);


  const isInputEmpty = () => !Address || isFirstCharacterWhitespace;

  function actionsOnChangeText(key, value) {
    if (key === 'Suite' && value && !isAlphanumeric(value)) {
      return;
    }
    setState({...state, [key]: value});
  }

  const save = async () => {
    onAddressChange(state);
    dispatch(setCheckoutInfo({address: { addressData:state}}))
    closeModal();
  };

  const getReturnKeyTypeForInputs = () => (Platform.OS === 'ios' ? 'done' : 'next');

  return (
    <BottomSheetModal
      visible={isVisible}
      onCrossPress={closeModal}
      title={'Delivery Information'}
      subtitle={'Delivery Address'}
      buttonTitle={APP_CONSTANTS.SAVE_AND_CONTINUE}
      isButtonDisabled={btnDisable}
      onBottomPress={save}>
      <View>
        <View style={styles.inputsWrapper}>

          <View style={styles.modal_divider} />
          <View style={styles.inputFullRowItem}>
            <TextField
              autoComplete={'street-address'}
              textContentType={'fullStreetAddress'}
              placeholder={'Address (required)'}
              inputRef={addressInput}
              keyboardType={KEYBOARD_FEATURES.keyboardTypes.default}
              maxLength={30}
              blurOnSubmit={false}
              value={Address}
              onChangeText={text => actionsOnChangeText('Address', text)}
              returnKeyType={'next'}
              onSubmitEditing={() => suiteInput.current?.focus()}
            />
          </View>
          <View style={styles.modal_divider} />
          <View style={styles.inputRow}>
            <View style={styles.rowItem}>
              <TextField
                placeholder={APP_CONSTANTS.APT_SUITE}
                inputRef={suiteInput}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.default}
                maxLength={30}
                blurOnSubmit={false}
                value={Suite}
                onChangeText={text => actionsOnChangeText('Suite', text)}
                returnKeyType={getReturnKeyTypeForInputs()}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'postal-code'}
                textContentType={'postalCode'}
                placeholder={APP_CONSTANTS.ZIP_CODE}
                inputRef={zipCodeInput}
                value={state.zipCode}
                editable={false}
                maxLength={5}
                blurOnSubmit={false}
                inputStyle={styles.uneditableinputfields}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
                onChangeText={text => actionsOnChangeText('zipCode', text)}
                returnKeyType={getReturnKeyTypeForInputs()}
              />
            </View>
          </View>
          <View style={styles.modal_divider} />
          <View style={styles.inputRow}>
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'postal-address-locality'}
                textContentType={'addressCity'}
                placeholder={APP_CONSTANTS.CITY}
                inputRef={cityInput}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.default}
                maxLength={30}
                blurOnSubmit={false}
                value={userCity}
                editable={false}
                inputStyle={styles.uneditableinputfields}
                returnKeyType={'done'}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'postal-address-region'}
                textContentType={'addressState'}
                placeholder={APP_CONSTANTS.STATE}
                inputRef={stateInput}
                value={state.state}
                inputStyle={styles.uneditableinputfields}
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
  return prevProps.isVisible === nextProps.isVisible;
}
export default memo(DeliveryAddressModal, arePropsEqual);
