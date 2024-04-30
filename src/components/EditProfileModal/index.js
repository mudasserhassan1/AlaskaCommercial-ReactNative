/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Keyboard, Platform, View} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import {useDispatch, useSelector} from 'react-redux';

import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {TextField} from '../TextField';
import StoreModal from '../StoreModal';
import InvalidZipCodeDialog from '../DialogBox';
import ZipCodeChangeConfirmationAlert from '../DialogBox';
import DialogBox from '../DialogBox';
import {formatPhoneNumber, formatNumberForBackend} from '../../utils';
import {useFirstRender} from '../../hooks/useFirstRender';
import {getZipCodes, updateUser} from '../../services/ApiCaller';
import {saveLoginInfo, saveZipCodes} from '../../redux/actions/general';
import BottomSheetModal from '../BottomSheetModal';
import {KEYBOARD_FEATURES, SCREEN_HEIGHT} from '../../constants/Common';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useKeyboard} from '@react-native-community/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {STATUSES} from '../../constants/Api';
import {logToConsole} from '../../configs/ReactotronConfig';

const resetToInitialState = userInfo => {
  const {
    FirstName = '',
    LastName = '',
    Email = '',
    PhoneNumber = '',
    ZipCode = '',
    address = '',
    Store = '',
    city = '',
  } = userInfo ?? {};
  return {
    address: address ?? '',
    store: Store ?? '',
    firstName: FirstName ?? '',
    lastName: LastName ?? '',
    email: Email ?? '',
    contactNumber: formatPhoneNumber(PhoneNumber) ?? '',
    zipCode: ZipCode ?? '',
    city: city ?? '',
  };
};
function arePropsEqual(prevProps, nextProps) {
  return prevProps.isVisible === nextProps.isVisible;
}
const EditProfileModal = ({isVisible, closeModal, showZipCodeChangedAlert}) => {
  // const {loginInfo = {}, zipCodes = []} = useSelector(({general}) => general);
  const useLoginInfoSelector = () =>
    useMemo(() => state => state.general.loginInfo ?? {}, []);

  const useZipCodesSelector = () =>
    useMemo(() => state => state.general.zipCodes ?? [], []);

  const loginInfo = useSelector(useLoginInfoSelector());
  const zipCodes = useSelector(useZipCodesSelector());
  let {userInfo = {}} = loginInfo ?? {};
  let loadingTimeout;
  const {
    FirstName = '',
    LastName = '',
    PhoneNumber = '',
    ZipCode = '',
    city = '',
    StoreLocation = '',
    StoreNumber = '',
    Store = '',
    OrderType = '',
  } = userInfo ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleLocationChangedDialog, setIsVisibleLocationChangedDialog] =
    useState(false);
  const [state, setState] = useState(() => resetToInitialState(userInfo));
  const [dialogMessage, setDialogMessage] = useState('');
  const [store, setStore] = useState(Store);
  const [stores, setStores] = useState(zipCodes);
  const [selectedStoreNumber, setSelectedStoreNumber] = useState(StoreNumber);
  const [selectedStoreLocation, setSelectedStoreLocation] =
    useState(StoreLocation);
  const [selectedOrderType, setSelectedOrderType] = useState(() => OrderType);
  const [btnDisable, setBtnDisable] = useState(true);
  const [isVisibleInvalidZipCodeDialog, setIsVisibleInvalidZipCodeDialog] =
    useState(false);
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);
  const [visibleStoreModal, setVisibleStoreModal] = useState(false);
  const [isInvalidZipCode, setIsInvalidZipCode] = useState(false);
  const [selectedStoreKey, setSelectedStoreKey] = useState(
    StoreNumber + StoreLocation,
  );
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const zipCodeInput = useRef(null);
  const stateInput = useRef(null);
  const cityInput = useRef(null);
  const contactInputRef = useRef(null);
  const {
    firstName = '',
    lastName = '',
    city: userCity = '',
    contactNumber = '',
    zipCode = '',
    store: userStore,
  } = state ?? {};

  const isFirstRender = useFirstRender();
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const {top = 0, bottom = 0} = useSafeAreaInsets();

  const keyboardHeight = keyboard?.keyboardShown
    ? keyboard?.keyboardHeight + (Platform.OS === 'android' ? 60 : 40)
    : widthPercentageToDP('10%') + bottom;

  useEffect(() => {
    setState(() => resetToInitialState(userInfo));
    selectStore(StoreNumber, Store, StoreLocation, OrderType, ZipCode);
  }, [isVisible, closeModal]);

  const toggleInvalidZipCodeDialog = () => {
    setTimeout(() => setIsVisibleInvalidZipCodeDialog(!visibleStoreModal), 700);
  };

  const closeInvalidZipCodeDialog = () => {
    setIsVisibleInvalidZipCodeDialog(prevState => !prevState);
  };

  const toggleStoresModal = () => {
    setTimeout(() => setVisibleStoreModal(!visibleStoreModal), 700);
  };
  const toggleLocationChangesDialog = () =>
    setIsVisibleLocationChangedDialog(prevState => !prevState);

  const isOldData = () =>
    String(firstName) === String(FirstName) &&
    String(lastName) === String(LastName) &&
    String(contactNumber) === String(formatPhoneNumber(PhoneNumber)) &&
    String(ZipCode) === String(zipCode) &&
    String(userCity) === String(city) &&
    String(store) === String(Store) &&
    String(selectedStoreKey) === String(StoreNumber + StoreLocation);

  const isUpdatedData = () =>
    String(firstName) !== String(FirstName) ||
    String(lastName) !== String(LastName) ||
    String(contactNumber) !== String(formatPhoneNumber(PhoneNumber)) ||
    String(ZipCode) !== String(zipCode) ||
    String(userCity) !== String(city) ||
    String(store) !== String(Store) ||
    String(selectedStoreKey) !== String(StoreNumber + StoreLocation);

  const isInputEmpty = () =>
    !firstName ||
    !lastName ||
    contactNumber.length < 14 ||
    zipCode.length < 5 ||
    !selectedStoreKey ||
    !StoreNumber ||
    !zipCode ||
    !store;

  useEffect(() => {
    if (!isFirstRender) {
      if (isOldData() || isInputEmpty() || isInvalidZipCode) {
        setBtnDisable(true);
      } else if (isUpdatedData()) {
        setBtnDisable(false);
      }
    }
  }, [
    isVisible,
    firstName,
    lastName,
    zipCode,
    contactNumber,
    userCity,
    store,
    selectedStoreKey,
    isInvalidZipCode,
  ]);

  useEffect(() => {
    return () => clearTimeout(loadingTimeout);
  });

  const getStoresFromZipCodes = useCallback(
    async value => {
      setIsInvalidZipCode(false);
      Keyboard.dismiss();
      setIsLoading(true);
      const {response = {}} = await getZipCodes({zipCode: value}, dispatch);
      const {ok = false, isNetworkError, isUnderMaintenance} = response ?? {};
      const {data: {Zipcode = []} = {}} = response ?? {};
      if (ok && Zipcode.length > 0) {
        setStores(Zipcode);
        dispatch(saveZipCodes(Zipcode));
        populateStores(Zipcode, value);
      } else if (isUnderMaintenance) {
        setIsVisibleApiErrorDialog(false);
        setIsVisibleInvalidZipCodeDialog(false);
      } else if (!isNetworkError) {
        showErrorAlert();
      }
      setIsLoading(false);
    },
    [zipCode],
  );

  const populateStores = (storesArray, zipCodeValue) => {
    if (storesArray.length === 1) {
      const {
        HOME_STORE_NUMBER: storeNumber = '',
        HOME_STORE_NAME: storeName = '',
        CITY: storeLocation = '',
        ORDER_TYPE: orderType = '',
      } = storesArray[0] ?? {};
      selectStore(
        storeNumber,
        storeName,
        storeLocation,
        orderType,
        zipCodeValue,
      );
    } else {
      toggleStoresModal();
    }
  };

  const selectStore = (number, name, location, orderType, zipCodeValue) => {
    setSelectedStoreNumber(number);
    setStore(name);
    setSelectedStoreLocation(location);
    setSelectedStoreKey(number + location);
    setSelectedOrderType(orderType);
    setState({...state, store: name, zipCode: zipCodeValue});
  };
  const onStoreSelected = (number, name, location, orderType) => {
    selectStore(number, name, location, orderType, zipCode);
  };
  const onStoreCrossPressed = () => {
    selectStore(StoreNumber, Store, StoreLocation, OrderType, ZipCode);
  };

  const showErrorAlert = () => {
    setIsInvalidZipCode(true);
    setDialogMessage(APP_CONSTANTS.INVALID_ZIP_CODE);
    toggleInvalidZipCodeDialog();
  };

  const updateUserInfo = async () => {
    Keyboard.dismiss();
    setIsVisibleApiErrorDialog(false);
    if (isVisibleLocationChangedDialog) {
      setIsVisibleLocationChangedDialog(false);
      return setTimeout(() => updateUserInfoWithTimeout(), 330);
    }
    return updateUserInfoWithTimeout();
  };

  const updateUserInfoWithTimeout = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const updatedUserInfo = {
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: formatNumberForBackend(state.contactNumber),
      city: state.city,
      Store: store,
      ZipCode: state.zipCode,
      StoreNumber: selectedStoreNumber,
      StoreLocation: selectedStoreLocation,
      OrderType: selectedOrderType,
    };

    const {response = {}} = await updateUser(updatedUserInfo);
    const {status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(false);
    if (status === STATUSES.OK) {
      const {
        data: {user: User = {}},
      } = response ?? {};
      let updatedLoginInfo = {...loginInfo, userInfo: User};
      dispatch(saveLoginInfo(updatedLoginInfo));
      closeModal();
      checkIfStoreChanged();
    } else if (status === STATUSES.BAD_REQUEST) {
      const {data: {msg = ''} = {}} = response ?? {};
      setDialogMessage(msg);
      toggleApiErrorDialog();
    } else if (isUnderMaintenance) {
      setDialogMessage('');
      setIsVisibleApiErrorDialog(false);
      closeModal();
    } else if (!isNetworkError) {
      setDialogMessage('');
      toggleApiErrorDialog();
    }
  };

  const checkIfStoreChanged = () => {
    if (
      String(ZipCode) !== String(zipCode) ||
      String(store) !== String(Store) ||
      String(selectedStoreKey) !== String(StoreNumber + StoreLocation)
    ) {
      setTimeout(() => showZipCodeChangedAlert(store), 700);
    }
  };
  const toggleApiErrorDialog = () => {
    setTimeout(() => setIsVisibleApiErrorDialog(prevState => !prevState), 700);
  };

  const closeApiErrorDialog = () => {
    setIsVisibleApiErrorDialog(prevState => !prevState);
  };

  function actionsOnChangeText(key, value) {
    let processedValue = value;
    if (key === 'zipCode' && (value.includes('.') || value.includes('-'))) {
      processedValue = value.replace('.', '').replace('-', '');
    }
    setState({...state, [key]: processedValue});
    if (key === 'zipCode' && processedValue.length === 5) {
      return getStoresFromZipCodes(processedValue);
    }
  }

  const declineChanges = () => {
    setIsVisibleLocationChangedDialog(false);
    closeModal();
  };

  const checkIfLocationConfirmationDialogWillDisplay = () => {
    if (
      String(zipCode) !== String(ZipCode) ||
      String(store) !== String(Store) ||
      String(selectedStoreKey) !== String(StoreNumber + StoreLocation)
    ) {
      toggleLocationChangesDialog();
    } else {
      updateUserInfo().then(() => {});
    }
  };

  const renderZipCodeConfirmationAlert = () => {
    return (
      <ZipCodeChangeConfirmationAlert
        visible={isVisibleLocationChangedDialog}
        closeModal={toggleLocationChangesDialog}
        title={APP_CONSTANTS.NEW_LOCATION}
        messageContainerStyles={styles.dialogMessageContainer}
        message={APP_CONSTANTS.NEW_LOCATION_CART_DIALOG_MESSAGE}
        confirmButtonLabel={APP_CONSTANTS.CONFIRM}
        cancelButtonLabel={APP_CONSTANTS.DECLINE}
        onConfirmPress={updateUserInfo}
        onCancelPress={declineChanges}
      />
    );
  };

  const getReturnKeyTypeForInputs = () =>
    Platform.OS === 'ios' ? 'done' : 'next';

  const closeParentModal = () => {
    setState(() => resetToInitialState(userInfo));
    closeModal();
  };
  return (
    <BottomSheetModal
      visible={isVisible}
      avoidKeyboard={false}
      onCrossPress={closeParentModal}
      title={APP_CONSTANTS.PROFILE}
      isLoading={isLoading}
      buttonTitle={APP_CONSTANTS.SAVE}
      isButtonDisabled={btnDisable}
      containerStyle={{
        maxHeight: SCREEN_HEIGHT - top,
        paddingBottom: keyboardHeight - 20,
      }}
      onBottomPress={checkIfLocationConfirmationDialogWillDisplay}>
      <View>
        <View style={styles.inputsWrapper}>
          <View style={styles.inputRow}>
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'name-given'}
                textContentType={'givenName'}
                placeholder={APP_CONSTANTS.F_NAME}
                value={firstName}
                maxLength={30}
                onChangeText={text => actionsOnChangeText('firstName', text)}
                returnKeyType={'next'}
                blurOnSubmit={false}
                onSubmitEditing={() => lastNameInput.current.focus()}
              />
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'name-family'}
                textContentType={'familyName'}
                placeholder={APP_CONSTANTS.L_NAME}
                inputRef={lastNameInput}
                value={lastName}
                maxLength={30}
                blurOnSubmit={false}
                onChangeText={text => actionsOnChangeText('lastName', text)}
                returnKeyType={'next'}
                onSubmitEditing={() => cityInput.current.focus()}
              />
            </View>
          </View>
          <View style={styles.modal_divider} />
          <View style={styles.inputFullRowItem}>
            <TextField
              autoComplete={'postal-address-locality'}
              textContentType={'addressCity'}
              placeholder={APP_CONSTANTS.CITY}
              inputRef={cityInput}
              keyboardType={KEYBOARD_FEATURES.keyboardTypes.default}
              maxLength={30}
              blurOnSubmit={false}
              value={StoreLocation}
              editable={false}
              // onChangeText={(text) => actionsOnChangeText('city', text)}
              returnKeyType={'next'}
              onSubmitEditing={() => zipCodeInput.current?.focus()}
            />
          </View>
          <View style={styles.modal_divider} />
          <View style={styles.inputRow}>
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'postal-address-region'}
                textContentType={'addressState'}
                placeholder={APP_CONSTANTS.STATE}
                inputRef={stateInput}
                value={userStore}
                maxLength={30}
                editable={false}
              />
            </View>
            <View style={styles.verticalSeparator} />
            <View style={styles.rowItem}>
              <TextField
                autoComplete={'postal-code'}
                textContentType={'postalCode'}
                placeholder={APP_CONSTANTS.ZIP_CODE}
                inputRef={zipCodeInput}
                value={zipCode}
                maxLength={5}
                blurOnSubmit={false}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
                onChangeText={text => actionsOnChangeText('zipCode', text)}
                returnKeyType={getReturnKeyTypeForInputs()}
                onSubmitEditing={() =>
                  contactInputRef.current?._inputElement.focus()
                }
              />
            </View>
          </View>
          <View style={styles.modal_divider} />

          <View style={styles.inputFullRowItem}>
            <TextField
              autoComplete={'email'}
              textContentType={'emailAddress'}
              placeholder={APP_CONSTANTS.EMAIL}
              autoCapitalize="none"
              inputRef={emailInput}
              keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
              value={state.email}
              editable={false}
              maxLength={30}
            />
          </View>
          <View style={styles.modal_divider} />
          <View style={styles.inputFullRowItem}>
            <TextInputMask
              allowFontScaling={false}
              autoComplete={'tel-national'}
              textContentType={'none'}
              ref={contactInputRef}
              keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
              maxLength={14}
              type={'custom'}
              options={{
                mask: KEYBOARD_FEATURES.maskTypes.usPhoneFormat,
              }}
              value={state.contactNumber}
              onChangeText={text => actionsOnChangeText('contactNumber', text)}
              returnKeyType={'done'}
              placeholder={APP_CONSTANTS.PHONE_NUM}
              style={styles.input}
            />
          </View>
        </View>
        <StoreModal
          visibleModal={visibleStoreModal}
          data={stores}
          // focusZipCode={() => setTimeout(() => zipCodeInput.current?.focus(), 300)}
          backdropColor="rgba(0,0,0,0.1)"
          closeModal={toggleStoresModal}
          selectedStore={selectedStoreKey}
          onItemPress={onStoreSelected}
          onCrossPressed={onStoreCrossPressed}
        />
      </View>
      <InvalidZipCodeDialog
        visible={isVisibleInvalidZipCodeDialog}
        closeModal={closeInvalidZipCodeDialog}
        title={dialogMessage}
        titleStyle={styles.invalidZipCodeAlertTitle}
        message=""
        isSingleButton={true}
        cancelButtonLabel={APP_CONSTANTS.OK}
      />
      <DialogBox
        visible={isVisibleApiErrorDialog}
        closeModal={closeApiErrorDialog}
        message={dialogMessage}
        title={APP_CONSTANTS.ERROR}
        isSingleButton
      />
      {renderZipCodeConfirmationAlert()}
    </BottomSheetModal>
  );
};
export default memo(EditProfileModal, arePropsEqual);
