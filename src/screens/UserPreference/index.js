/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard, Switch, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

import {COLORS, IMAGES} from '../../theme';
import Input from '../../components/Input';
import {Button} from '../../components';
import {styles} from './styles';
import {saveLoginInfo, saveZipCodes} from '../../redux/actions/general';
import {APP_CONSTANTS} from '../../constants/Strings';
import {getZipCodes, updateUser} from '../../services/ApiCaller';
import StoreModal from '../../components/StoreModal';
import DialogBox from '../../components/DialogBox';
import {getItemsFromCart} from '../../utils/cartUtils';
import {KEYBOARD_FEATURES} from '../../constants/Common';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {STATUSES} from '../../constants/Api';
import {logToConsole} from '../../configs/ReactotronConfig';

const UserPreference = ({navigation}) => {
  // let {loginInfo = {}, zipCodes = []} = useSelector(({general}) => general);

  const loginInfoSelector = useMemo(
    () => state => state.general?.loginInfo,
    [],
  );

  const zipCodesSelector = useMemo(() => state => state.general?.zipCodes, []);

  let loginInfo = useSelector(loginInfoSelector);
  const zipCodes = useSelector(zipCodesSelector);

  // logToConsole({loginInfo, zipCodes});
  let {userInfo = {}} = loginInfo ?? {};

  const {
    Store = '',
    StoreNumber = '',
    ZipCode = '',
    StoreLocation = '',
    isLowBandwidth = false,
    OrderType = '',
  } = userInfo ?? {};

  const [state, setState] = useState({zipCode: ZipCode});
  const [isEnabled, setIsEnabled] = useState(isLowBandwidth);
  const [btnDisable, setBtnDisable] = useState(true);
  const [visibleStoreModal, setVisibleStoreModal] = useState(false);
  const [isVisibleLocationChangedDialog, setIsVisibleLocationChangedDialog] =
    useState(false);
  const [stores, setStores] = useState(() => zipCodes);
  const [selectedStoreKey, setSelectedStoreKey] = useState(
    () => StoreNumber + StoreLocation,
  );
  const [selectedStoreNumber, setSelectedStoreNumber] = useState(StoreNumber);
  const [selectedStoreName, setSelectedStoreName] = useState(Store);
  const [selectedStoreLocation, setSelectedStoreLocation] =
    useState(StoreLocation);
  const [selectedOrderType, setSelectedOrderType] = useState(OrderType);
  const [errorAlertText, setErrorAlertText] = useState('');
  const [isLoading, setIsLoading] = useState();
  const [borderColor, setBorderColor] = useState(COLORS.GRAY0_15);
  const [isVisibleDialog, setIsVisibleDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogConfirmButtonLabel, setDialogConfirmButtonLabel] = useState('');
  const [dialogCancelButtonLabel, setDialogCancelButtonLabel] = useState('');
  const [isSingleButtonDialog, setIsSingleButtonDialog] = useState(false);
  const [isDialogBoxHidden, setIsDialogBoxHidden] = useState(false);

  const {zipCode = ''} = state ?? {};
  const dispatch = useDispatch();

  const zipCodeInput = useRef(null);
  const dialogConfirmPressRef = useRef(null);
  const dialogCancelPressRef = useRef(null);
  const retryActionRef = useRef(null);
  const zipCodeValueRef = useRef(null);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const toggleDialog = () => setIsVisibleDialog(prevState => !prevState);

  const toggleLocationChangesDialog = () =>
    setIsVisibleLocationChangedDialog(prevState => !prevState);

  //restricting user to save unless every information is provided
  useEffect(() => {
    if (zipCode.length === 5 && selectedStoreName !== '') {
      setBtnDisable(false);
    } else if (zipCode.length < 5) {
      setBtnDisable(true);
      setSelectedStoreKey(null);
    }
  }, [zipCode, selectedStoreNumber]);

  //  continuous validating zip code on input
  useEffect(() => {
    validateZipCode();
  }, [zipCode]);

  useEffect(() => {
    if (zipCode.length === 5) {
      getZipCodeOnFirstRender().then(() => {});
    }
  }, []);

  useEffect(() => {
    checkIfUserHasUpdatedData();
  }, [zipCode, isEnabled, selectedStoreKey]);

  const getZipCodeOnFirstRender = async () => {
    setIsLoading(true);
    const {response = {}} = await getZipCodes({zipCode}, dispatch);
    const {ok = false, isNetworkError, isUnderMaintenance} = response ?? {};
    const {data: {Zipcode = []} = {}, status} = response ?? {};
    setIsLoading(false);
    if (ok && status === STATUSES.OK) {
      if (Zipcode.length > 0) {
        setStores(Zipcode);
        dispatch(saveZipCodes(Zipcode));
      } else {
        setErrorAlertText(APP_CONSTANTS.NO_STORE_FOUND);
        setBorderColor(COLORS.MAIN);
      }
    } else if (isUnderMaintenance) {
      setIsVisibleDialog(false);
    } else if (!isNetworkError) {
      retryActionRef.current = getZipCodeOnFirstRender;
      displayAlert(
        APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY,
        APP_CONSTANTS.SOME_THING_WENT_WRONG,
        APP_CONSTANTS.RETRY,
        APP_CONSTANTS.CANCEL,
        false,
        handleRetryAction,
        toggleDialog,
      );
    }
  };

  const checkIfUserHasUpdatedData = () => {
    if (
      String(zipCode) === String(ZipCode) &&
      String(selectedStoreKey) === String(StoreNumber + StoreLocation) &&
      isEnabled === isLowBandwidth
    ) {
      return setBtnDisable(true);
    }
    if (
      zipCode.trim().length <= 4 ||
      selectedStoreName.length === 0 ||
      errorAlertText.length > 0 ||
      selectedStoreKey === null
    ) {
      return setBtnDisable(true);
    }
    return setBtnDisable(false);
  };

  const getStoresFromZipCodes = async value => {
    setIsLoading(true);
    const {response = {}} = await getZipCodes(
      {zipCode: value ?? zipCodeValueRef?.current},
      dispatch,
    );
    const {
      ok = false,
      isNetworkError,
      status,
      isUnderMaintenance,
    } = response ?? {};
    setIsLoading(false);
    const {data: {Zipcode = []} = {}} = response ?? {};
    if (ok && status === STATUSES.OK) {
      if (Zipcode.length === 0) {
        setErrorAlertText(APP_CONSTANTS.NO_STORE_FOUND);
        setBorderColor(COLORS.MAIN);
      } else {
        setStores(Zipcode);
        dispatch(saveZipCodes(Zipcode));
        populateStores(Zipcode);
      }
    } else if (isUnderMaintenance) {
      setIsVisibleDialog(false);
    } else if (!isNetworkError) {
      retryActionRef.current = getStoresFromZipCodes;
      displayAlert(
        APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY,
        APP_CONSTANTS.SOME_THING_WENT_WRONG,
        APP_CONSTANTS.RETRY,
        APP_CONSTANTS.CANCEL,
        false,
        handleRetryAction,
        toggleDialog,
      );
    }
  };

  const populateStores = storesArray => {
    if (storesArray.length === 1) {
      const {
        HOME_STORE_NUMBER: storeNumber = '',
        HOME_STORE_NAME: storeName = '',
        CITY: storeLocation = '',
        ORDER_TYPE: orderType = '',
      } = storesArray[0] ?? {};
      selectStore(storeNumber, storeName, storeLocation, orderType);
    } else {
      toggleModal();
    }
  };

  //handling input states
  function actionsOnChangeText(key, value) {
    if (key === 'zipCode' && (value.includes('.') || value.includes('-'))) {
      value = value.replace('.', '').replace('-', '');
    }
    setState({...state, [key]: value});
    setStores([]);
    setErrorAlertText('');
    setBorderColor(COLORS.GRAY0_15);
    if (value.length === 5) {
      zipCodeValueRef.current = value; //saving value for retry action in case of api fail
      Keyboard.dismiss();
      getStoresFromZipCodes(value).then(() => {});
    } else {
      setSelectedStoreName?.('');
      setSelectedStoreKey?.(null);
    }
  }

  //validate zipCodes and restricting user to navigate on false input
  const validateZipCode = () => {
    if (zipCode.trim().length === 5 && selectedStoreName !== '') {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  // open/close modal
  const toggleModal = () => {
    setVisibleStoreModal(!visibleStoreModal);
  };

  const openModal = () => {
    if (zipCode.length < 5) {
      return null;
    } else {
      stores.length > 1 && toggleModal();
    }
  };

  const navigateBack = () => {
    toggleDialog();
    navigation.goBack();
  };

  const handleRetryAction = () => {
    toggleDialog();
    retryActionRef?.current?.();
  };

  //updating user's zip code and store
  const updateUserZipCode = async () => {
    const userInfo = {
      ZipCode: zipCode,
      Store: selectedStoreName,
      isLowBandwidth: isEnabled,
      StoreNumber: selectedStoreNumber,
      StoreLocation: selectedStoreLocation,
      OrderType: selectedOrderType,
    };
    setIsLoading(true);
    const {response = {}} = await updateUser(userInfo);
    const {status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(false);
    if (status === STATUSES.OK) {
      const {data: {user: User = {}} = {}} = response ?? {};
      loginInfo = {...loginInfo, userInfo: User};
      dispatch(saveLoginInfo(loginInfo));
      checkIfZipCodeChanged(); //check whether to display alert
    } else if (isUnderMaintenance) {
      setDialogMessage('');
      setIsVisibleDialog(false);
    } else if (!isNetworkError) {
      setDialogMessage('');
      retryActionRef.current = updateUserZipCode;
      setTimeout(() => {
        displayAlert(
          APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY,
          APP_CONSTANTS.SOME_THING_WENT_WRONG,
          APP_CONSTANTS.RETRY,
          APP_CONSTANTS.CANCEL,
          false,
          handleRetryAction,
          toggleDialog,
        );
      }, 100);
    }
  };

  // saving user's info and navigating next
  const save = async () => {
    setIsVisibleLocationChangedDialog(false);
    updateUserZipCode();
  };

  const declineChanges = () => {
    setIsVisibleLocationChangedDialog(false);
    navigation.goBack();
  };

  const checkIfZipCodeChanged = () => {
    if (
      zipCode !== ZipCode ||
      selectedStoreName !== Store ||
      String(selectedStoreKey) !== String(StoreNumber + StoreLocation)
    ) {
      //Display Alert only if zipCode has changed
      return displayAlert(
        `Default store location has been updated to ${selectedStoreName}`,
        '',
        '',
        'Ok',
        true,
        () => {},
        getCart,
      );
    }
    return navigation.goBack(); //if only bandwidth preference changed
  };

  const getCart = async () => {
    navigateBack();
    await getItemsFromCart(dispatch).then(() => {});
  };

  const displayAlert = (
    title,
    message,
    confirmButtonLabel,
    cancelButtonLabel,
    singleButton,
    confirmPress,
    cancelPress,
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogCancelButtonLabel(cancelButtonLabel);
    setIsSingleButtonDialog(singleButton);
    setDialogConfirmButtonLabel(confirmButtonLabel);
    dialogConfirmPressRef.current = confirmPress;
    dialogCancelPressRef.current = cancelPress;
    toggleDialog();
  };

  const checkIfLocationConfirmationDialogWillDisplay = () => {
    if (
      String(zipCode) !== String(ZipCode) ||
      String(selectedStoreName) !== String(Store) ||
      String(selectedStoreKey) !== String(StoreNumber + StoreLocation)
    ) {
      toggleLocationChangesDialog();
    } else {
      save().then(() => {});
    }
  };

  const selectStore = (storeNumber, name, location, orderType) => {
    setSelectedStoreName?.(name);
    setSelectedStoreNumber?.(storeNumber);
    setSelectedStoreLocation(location);
    setSelectedStoreKey(storeNumber + location);
    setSelectedOrderType(orderType);
  };

  const renderZipCodeConfirmationAlert = () => {
    return (
      <DialogBox
        onModalHide={() => setIsDialogBoxHidden(true)}
        onModalWillShow={() => setIsDialogBoxHidden(false)}
        visible={isVisibleLocationChangedDialog}
        closeModal={toggleLocationChangesDialog}
        title={APP_CONSTANTS.NEW_LOCATION}
        messageContainerStyles={styles.dialogMessageContainer}
        message={APP_CONSTANTS.NEW_LOCATION_CART_DIALOG_MESSAGE}
        confirmButtonLabel={APP_CONSTANTS.CONFIRM}
        cancelButtonLabel={APP_CONSTANTS.DECLINE}
        onConfirmPress={save}
        onCancelPress={declineChanges}
      />
    );
  };

  const renderLocationInstructionsView = () => {
    return (
      <View style={styles.textWrapper}>
        <Text allowFontScaling={false} style={styles.textHeader}>
          {APP_CONSTANTS.LOCATION_N_BANDWIDTH}
        </Text>
        <Text allowFontScaling={false} style={styles.locationText}>{APP_CONSTANTS.LOCATION}</Text>
        <Text allowFontScaling={false} style={styles.nearByText}>
          {APP_CONSTANTS.LOCATION_INSTRUCTIONS}
        </Text>
      </View>
    );
  };

  const renderInputsContainer = () => (
    <View style={styles.inputContainer}>
      {renderErrorAlertText()}
      <Input
        autoComplete={'postal-code'}
        textContentType={'postalCode'}
        placeholder={APP_CONSTANTS.ZIP_CODE}
        inputRef={zipCodeInput}
        onChangeText={text => actionsOnChangeText('zipCode', text)}
        value={zipCode}
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.numeric}
        borderColor={borderColor}
        maxLength={5}
        borderWidth={1}
        showEye={false}
        rightImageSrc={IMAGES.ICON_LOCATION}
        // onRightIconPress={permissionsHandler}
        rightImageStyles={{width: 24, height: 24}}
        inPutWidth={wp('90%')}
      />
      <TouchableOpacity
        disabled={zipCode.length < 5 || stores.length === 1}
        activeOpacity={0.6}
        style={styles.storeNameView}
        onPress={openModal}>
        <Text allowFontScaling={false} style={[
            styles.storeNameText,
            {color: selectedStoreName ? COLORS.BLACK : COLORS.GRAY_4},
          ]}>
          {selectedStoreName !== '' ? selectedStoreName : 'Store'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorAlertText = () => {
    if (errorAlertText) {
      return (
        <View style={styles.errorStyle}>
          <Text allowFontScaling={false} style={styles.errorText}>{errorAlertText}</Text>
        </View>
      );
    }
    return null;
  };

  const renderLocationAndBandwidthView = () => (
    <View style={styles.bandwidthWrapper}>
      <Text allowFontScaling={false} style={styles.bandwidthText}>{APP_CONSTANTS.LOW_BANDWIDTH}</Text>
      <Switch
        trackColor={{
          false: COLORS.SWITCH_COLOR,
          true: COLORS.SWITCH_ON_COLOR,
        }}
        thumbColor={COLORS.WHITE}
        ios_backgroundColor={COLORS.SWITCH_COLOR}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );

  const renderStoreModal = () => (
    <StoreModal
      visibleModal={visibleStoreModal}
      data={stores}
      closeModal={toggleModal}
      selectedStore={selectedStoreKey}
      isZipCodeChanged={zipCode.length < 5}
      onItemPress={selectStore}
    />
  );

  const renderSaveButton = () => (
    <View style={styles.buttonWrapperContainer}>
      <View
        style={[
          styles.btnWrapper,
          {
            backgroundColor: btnDisable
              ? COLORS.DISABLE_BUTTON_COLOR
              : COLORS.ACTIVE_BUTTON_COLOR,
          },
        ]}>
        <Button
          label={APP_CONSTANTS.SAVE}
          color="white"
          width="90%"
          disabled={btnDisable}
          onPress={checkIfLocationConfirmationDialogWillDisplay}
        />
      </View>
    </View>
  );

  const renderDialog = () => (
    <DialogBox
      onModalHide={() => setIsDialogBoxHidden(true)}
      onModalWillShow={() => setIsDialogBoxHidden(false)}
      visible={isVisibleDialog}
      title={dialogTitle}
      message={dialogMessage}
      cancelButtonLabel={dialogCancelButtonLabel}
      confirmButtonLabel={dialogConfirmButtonLabel}
      isSingleButton={isSingleButtonDialog}
      onConfirmPress={dialogConfirmPressRef.current}
      onCancelPress={dialogCancelPressRef.current}
      closeModal={toggleDialog}
    />
  );

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.PREFERENCE_HEADER}
      isLoading={isDialogBoxHidden && isLoading}
      withBackButton>
      <View style={styles.scrollContainer}>
        <View style={styles.userPreferenceWrapper}>
          {renderLocationInstructionsView()}
          {renderInputsContainer()}
          {renderLocationAndBandwidthView()}
        </View>
        {renderStoreModal()}
        {renderSaveButton()}
      </View>
      {renderDialog()}
      {renderZipCodeConfirmationAlert()}
    </ScreenWrapperComponent>
  );
};
export default UserPreference;
