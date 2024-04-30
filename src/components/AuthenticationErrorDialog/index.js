/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';

import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';

import styles from './styles';
import {logout} from '../../utils/userUtils';

const AuthenticationErrorDialog = ({closeModal, closeDialog, retry, visible = false, message = ''}) => {

  const dispatch = useDispatch();

  const handleClick = () => {
    closeDialog();
    closeModal();
    return logout?.(dispatch);
  };

  const renderModalBody = () => (
    <View style={styles.parentView}>
      <View style={styles.content}>
        <Text allowFontScaling={false} style={styles.title}>
          {message.length > 0 ? APP_CONSTANTS.AUTHENTICATION_ERROR : APP_CONSTANTS.ALASKA_COMMERCIAL}
        </Text>
        {message.length > 0 ? (
          <View style={styles.messageContainer}>
            <Text allowFontScaling={false} style={styles.message}>{message}</Text>
          </View>
        ) : (
          <View style={styles.messageContainer}>
            <Text allowFontScaling={false} style={styles.message}>{APP_CONSTANTS.SOME_THING_WENT_WRONG}</Text>
          </View>
        )}
        <View style={styles.horizontalSeparator} />
        {message.length > 0 ? renderDialogButtons?.() : renderHorizontalButtons?.()}
      </View>
    </View>
  );

  const renderDialogButtons = () => {
    return renderSingleButton();
  };

  const renderHorizontalButtons = () => (
    <View style={styles.horizontalButtonsView}>
      <TouchableOpacity style={styles.horizontalButton} onPress={closeDialog}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{APP_CONSTANTS.CANCEL}</Text>
      </TouchableOpacity>
      {renderHorizontalSeparator()}
      <TouchableOpacity style={styles.horizontalButton} onPress={retry}>
        <Text allowFontScaling={false} style={styles.buttonLabel}>{APP_CONSTANTS.RETRY}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalSeparator = () => <View style={styles.verticalSeparator} />;

  const renderSingleButton = () => (
    <TouchableOpacity style={styles.singleButtonView} onPress={handleClick}>
      <Text allowFontScaling={false} style={styles.buttonLabel}>{APP_CONSTANTS.OK}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      backdropColor={COLORS.BLACK_40}
      useNativeDriver={true}
      animationInTiming={200}
      animationOutTiming={100}
      avoidKeyboard={true}
      statusBarTranslucent={true}
      hideModalContentWhileAnimating={true}
      useNativeDriverForBackdrop={true}
      isVisible={visible}>
      {renderModalBody?.()}
    </Modal>
  );
};
function arePropsEqual(prevProps, nextProps) {
  return prevProps.visible === nextProps.visible;
}
export default React.memo(AuthenticationErrorDialog, arePropsEqual);
