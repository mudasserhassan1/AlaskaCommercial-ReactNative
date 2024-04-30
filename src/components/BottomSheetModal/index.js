import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import {Button, ModalHeader} from '../../components';
import {COLORS} from '../../theme';
import {styles} from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {APP_CONSTANTS} from '../../constants/Strings';

export const ModalLoader = props => {
  const {visible, containerStyle} = props;
  if (visible) {
    return (
      <View style={[styles.loaderStyle, containerStyle]}>
        <ActivityIndicator color={COLORS.MAIN} size={'large'} />
      </View>
    );
  }
  return null;
};

const BottomSheetModal = ({
  visible,
  onCrossPress,
  title,
  children,
  animationInTiming,
  animationOutTiming,
  animationIn,
  animationOut,
  renderCustomHeader,
  headerContainerStyle,
  headerTitleStyle,
  containerStyle,
  loaderStyle,
  subtitle,
  modalStyle,
  onBottomPress,
  onSkipButtonPress,
  avoidKeyboard = true,
  hasBackdrop = true,
  buttonTitle = 'Close',
  isButtonDisabled,
  statusBarTranslucent = true,
  isLoading = false,
  isCustomLoading = false,
  backdropColor,
  onModalWillShow,
  showButton = true,
  closeOnBackdrop = true,
  showSkipButton = false,
  skipButtonTitle = APP_CONSTANTS.SKIP,
  isSkipDisabled = APP_CONSTANTS.SKIP,
  buttonStyles,
  onModalHide = () => {},
  onModalShow = () => {},
}) => {
  const enabled = Platform.OS === 'android' && avoidKeyboard;

  containerStyle = [styles.modalContentContainer, containerStyle];

  const renderHeader = () => {
    if (typeof renderCustomHeader === 'function') {
      return renderCustomHeader();
    }
    return (
      <ModalHeader
        title={title}
        style={[styles.header, headerContainerStyle]}
        backgroundColor={'transparent'}
        titleStyle={headerTitleStyle}
        imageStyle={styles.headerImageStyle}
        closeModal={onCrossPress}
      />
    );
  };

  const renderSubHeader = () => {
    if (subtitle) {
      return <Text allowFontScaling={false} style={styles.subtitleText}>{subtitle}</Text>;
    } else {
      return null;
    }
  };
  const renderBottomButton = () => {
    if (showButton) {
      return (
        <Button
          label={buttonTitle}
          width="90%"
          disabled={!!isButtonDisabled}
          buttonStyle={[
            styles.bottomButton,
            {
              backgroundColor: isButtonDisabled
                ? COLORS.DISABLE_BUTTON_COLOR
                : COLORS.ACTIVE_BUTTON_COLOR,
            },
            buttonStyles,
          ]}
          onPress={onBottomPress}
        />
      );
    }
    return null;
  };
  const renderSkipButton = () => {
    if (showSkipButton) {
      return (
        <TouchableOpacity
          disabled={!!isSkipDisabled}
          onPress={onSkipButtonPress}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: heightPercentageToDP('2%'),
            }}>
            <Text
                allowFontScaling={false}
              style={[
                styles.skipText,
                isSkipDisabled && {color: COLORS.DISABLE_BUTTON_COLOR},
              ]}>
              {skipButtonTitle}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <Modal
      testID={'modal'}
      useNativeDriver
      isVisible={visible}
      hideModalContentWhileAnimating
      useNativeDriverForBackdrop
      avoidKeyboard={avoidKeyboard}
      hasBackdrop={hasBackdrop}
      animationIn={animationIn}
      animationOut={animationOut}
      onModalWillShow={onModalWillShow}
      onModalHide={onModalHide}
      animationInTiming={animationInTiming || 600}
      animationOutTiming={animationOutTiming || 600}
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={0}
      onBackdropPress={closeOnBackdrop ? onCrossPress : () => {}}
      onRequestClose={onCrossPress}
      onModalShow={onModalShow}
      backdropColor={backdropColor}
      statusBarTranslucent={statusBarTranslucent}
      style={[styles.view, modalStyle]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          enabled={enabled}
          behavior={'position'}
          contentContainerStyle={enabled && containerStyle}
          style={!enabled && containerStyle}>
          {renderHeader()}
          {renderSubHeader()}
          {children}
          {renderBottomButton()}
          {renderSkipButton()}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <ModalLoader visible={isCustomLoading} containerStyle={loaderStyle} />
      <Spinner visible={isLoading} color={COLORS.MAIN} />
    </Modal>
  );
};

export default BottomSheetModal;
