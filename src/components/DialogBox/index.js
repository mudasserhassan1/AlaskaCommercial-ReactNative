/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import styles from './styles';
import {DIALOG_IN_ANIMATION_TIME, DIALOG_OUT_ANIMATION_TIME} from '../../constants/Common';
import {logToConsole} from '../../configs/ReactotronConfig';

const DialogBox = ({
  closeModal = () => {},
  visible = false,
  title = '',
  titleStyle = {},
  messageContainerStyles = {},
  message = '',
  isMessageComponent = false,
  inputProps = {},
  errorMessage = '',
  setErrorMessage,
  messageStyle = {},
  confirmButtonLabel = '',
  cancelButtonLabel = '',
  onConfirmPress,
  onCancelPress,
  isVerticalButtons = false,
  withInput = false,
  animationOutTiming = false,
  listName,
  isSingleButton = false,
  hasBackdrop = true,
  onModalHide = () => {},
  onModalShow = () => {},
  closeDialog = () => {},
  onModalWillShow = () => {},
}) => {
  const [name, setName] = useState('');
  const [isEmptyName, setIsEmptyName] = useState(false);

  const textInputRef = useRef(null);

  const focusInput = () => {
    if (withInput) {
      textInputRef?.current?.focus();
    }
    if (typeof onModalShow === 'function') {
      onModalShow();
    }
  };

  const handleSingleButtonLabel = () => {
    if (cancelButtonLabel.length > 0) {
      return cancelButtonLabel;
    }
    if (confirmButtonLabel.length > 0) {
      return confirmButtonLabel;
    }
    return 'Ok';
  };

  const handleSingleButtonPress = () => {
    if (typeof onCancelPress === 'function') {
      return onCancelPress();
    }
    if (typeof onConfirmPress === 'function') {
      return onConfirmPress();
    }
    return closeModal();
  };

  const handleCancelPress = () => {
    if (typeof onCancelPress === 'function') {
      return onCancelPress();
    }
    return closeModal();
  };

  const handleConfirmPress = () => {
    if (withInput && !name?.trim?.().length) {
      setIsEmptyName(true);
    }
    if (withInput && name === listName) {
      closeDialog();
    }
    if (typeof onConfirmPress === 'function') {
      onConfirmPress(name);
    }
  };

  const handleModalHide = () => {
    if (typeof onModalHide === 'function') {
      onModalHide();
    }
    if (withInput) {
      setIsEmptyName(false);
      setErrorMessage?.('');
      setName(listName);
    }
    if (title !== APP_CONSTANTS.RENAME_LIST) {
      setName('');
    }
  };
  useEffect(() => {
    if (title === APP_CONSTANTS.RENAME_LIST) {
      setName(listName);
    }
  }, [title]);

  // logToConsole(message)
  const renderModalBody = () => (
    <View style={styles.parentView}>
      <View style={styles.content}>
        <Text allowFontScaling={false} style={[styles.title, titleStyle]}>{title}</Text>
        {isMessageComponent || (!isMessageComponent && message?.length > 0) ? (
          <View style={[styles.messageContainer, messageContainerStyles]}>
            <Text allowFontScaling={false} style={[styles.message, messageStyle]}>{message}</Text>
          </View>
        ) : null}
        {renderInput()}
        <View style={styles.horizontalSeparator} />
        {renderDialogButtons()}
      </View>
    </View>
  );
  const renderInput = () => {
    if (withInput) {
      return (
        <>
          <TextInput
              allowFontScaling={false}
            ref={textInputRef}
            placeholder={APP_CONSTANTS.LIST_NAME}
            // autoFocus
            style={[styles.input, (isEmptyName || errorMessage) && {borderColor: COLORS.MAIN}]}
            placeholderTextColor={COLORS.GRAY_4}
            value={name}
            onChangeText={value => {
              setName(value);
              setIsEmptyName(false);
              setErrorMessage?.('');
            }}
            {...inputProps}
          />
          <Text allowFontScaling={false} style={styles.error}>{errorMessage}</Text>
        </>
      );
    }

    return null;
  };

  const renderDialogButtons = () => {
    if (isSingleButton) {
      return renderSingleButton();
    }
    if (!isVerticalButtons) {
      return renderHorizontalButtons();
    }
    return renderVerticalButtons();
  };

  const renderVerticalButtons = () => (
    <View>
      <TouchableOpacity style={styles.verticalButton} opacity={0.7} onPress={() => onConfirmPress?.()}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{confirmButtonLabel}</Text>
      </TouchableOpacity>
      <View style={styles.horizontalButtonSeparator} />
      <TouchableOpacity style={styles.verticalButton} opacity={0.7} onPress={() => onCancelPress?.()}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{cancelButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalButtons = () => (
    <View style={styles.horizontalButtonsView}>
      <TouchableOpacity style={styles.horizontalButton} onPress={handleCancelPress}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{cancelButtonLabel}</Text>
      </TouchableOpacity>
      {renderHorizontalSeparator()}
      <TouchableOpacity style={styles.horizontalButton} onPress={handleConfirmPress}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{confirmButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSingleButton = () => (
    <TouchableOpacity style={styles.singleButtonView} onPress={handleSingleButtonPress}>
      <Text allowFontScaling={false} style={styles.buttonLabel}>{handleSingleButtonLabel()}</Text>
    </TouchableOpacity>
  );

  const renderHorizontalSeparator = () => <View style={styles.verticalSeparator} />;

  return (
    <Modal
      backdropColor={COLORS.BLACK_40}
      useNativeDriver={true}
      animationInTiming={DIALOG_IN_ANIMATION_TIME}
      animationOutTiming={animationOutTiming || DIALOG_OUT_ANIMATION_TIME}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onModalHide={handleModalHide}
      deviceHeight={Dimensions.get('screen').height}
      statusBarTranslucent={!withInput}
      avoidKeyboard={true}
      onModalShow={focusInput}
      onModalWillShow={onModalWillShow}
      hideModalContentWhileAnimating={true}
      useNativeDriverForBackdrop={true}
      hasBackdrop={hasBackdrop}
      isVisible={visible}>
      {renderModalBody()}
    </Modal>
  );
};

export default React.memo(DialogBox);
