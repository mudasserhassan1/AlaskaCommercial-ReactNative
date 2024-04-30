/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import styles from './styles';
import BottomSheetModal from '../BottomSheetModal';

const StoreModal = ({
  visibleModal = false,
  closeModal = false,
  data = [],
  selectedStore = null,
  storeLocation = '',
  isZipCodeChanged = false,
  onItemPress,
  focusZipCode,
  onCrossPressed = false,
}) => {
  const [selectedStoreNumber, setSelectedStoreNumber] = useState(null);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [selectedStoreLocation, setSelectedStoreLocation] =
    useState(storeLocation);
  const [storeSelectionKey, setStoreSelectionKey] = useState(selectedStore);
  const [selectedOrderType, setSelectedOrderType] = useState('');

  useEffect(() => {
    clearSelection();
  }, [isZipCodeChanged]);

  const selectStore = () => {
    onItemPress(
      selectedStoreNumber,
      selectedStoreName,
      selectedStoreLocation,
      selectedOrderType,
    );
    closeModal?.();
  };

  const isDisabled = () =>
    Boolean(storeSelectionKey === selectedStore || storeSelectionKey === null);

  const clearSelection = () => {
    if (isZipCodeChanged) {
      setStoreSelectionKey(null);
      setSelectedStoreNumber(null);
      setSelectedStoreName('');
      setSelectedStoreLocation('');
    }
  };

  const selectZipCodeStore = item => {
    const {
      HOME_STORE_NUMBER: storeNumber = '',
      HOME_STORE_NAME: storeName = '',
      CITY: city = '',
      ORDER_TYPE: orderType = '',
    } = item ?? {};

    setSelectedStoreNumber?.(storeNumber);
    setSelectedStoreName?.(storeName);
    setSelectedStoreLocation?.(city);
    setStoreSelectionKey(getKey(storeNumber, city));
    setSelectedOrderType?.(orderType);
  };
  const renderModalContent = () => (
    <>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderList}
        ItemSeparatorComponent={renderSeparator}
      />
    </>
  );

  const getKey = (storeNumber, storeLocation) => storeNumber + storeLocation;

  const renderList = ({item}) => {
    const {
      HOME_STORE_NUMBER: storeNumber = '',
      HOME_STORE_NAME: storeName = '',
      CITY: city = '',
    } = item ?? {};
    return (
      <TouchableOpacity
        style={styles.listRow}
        activeOpacity={0.6}
        onPress={() => selectZipCodeStore(item)}>
        <View style={styles.radioButtonView}>
          <View style={styles.radioUnchecked}>
            {storeSelectionKey === getKey(storeNumber, city) ? (
              <View style={styles.checkedCircle} />
            ) : null}
          </View>
          <Text allowFontScaling={false} style={styles.itemName}>Store: {storeName}</Text>
        </View>
        <View style={styles.descriptionView}>
          <Text allowFontScaling={false} style={styles.descriptionText}>Village: {city}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View>
      <BottomSheetModal
        visible={visibleModal}
        avoidKeyboard={false}
        title={APP_CONSTANTS.SELECT_STORE}
        onModalHide={focusZipCode}
        buttonTitle={APP_CONSTANTS.CONFIRM}
        isButtonDisabled={isDisabled()}
        onBottomPress={selectStore}
        onCrossPress={() => {
          closeModal?.();
          if (onCrossPressed && typeof onCrossPressed === 'function') {
            onCrossPressed?.();
          }
        }}>
        <View>{renderModalContent()}</View>
      </BottomSheetModal>
    </View>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.visibleModal === nextProps.visibleModal &&
    prevProps.selectedStore === nextProps.selectedStore
  );
}

export default React.memo(StoreModal, arePropsEqual);
