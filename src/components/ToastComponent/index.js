import {
  TOAST_FADE_IN_DURATION,
  TOAST_FADE_OUT_DURATION,
  TOAST_POSITION,
  TOAST_POSITION_KEYBOARD_OFFSET,
  TOAST_POSITIONS,
} from '../../constants/Common';
import Toast from 'react-native-easy-toast';
import React from 'react';
import {useKeyboard} from '@react-native-community/hooks';

const ToastComponent = ({
  toastRef,
  position = TOAST_POSITIONS.BOTTOM,
  positionValue,
  fadeInDuration = TOAST_FADE_IN_DURATION,
  fadeOutDuration = TOAST_FADE_OUT_DURATION,
}) => {
  const keyboard = useKeyboard();
  const keyboardHeight = keyboard.keyboardHeight;
  const isKeyboardOpen = keyboard.keyboardShown;

  const toastPositionValue = isKeyboardOpen ? keyboardHeight + TOAST_POSITION_KEYBOARD_OFFSET : TOAST_POSITION;
  return (
    <Toast
      ref={toastRef}
      position={position}
      positionValue={positionValue ?? toastPositionValue}
      fadeInDuration={fadeInDuration}
      fadeOutDuration={fadeOutDuration}
      opacity={1}
    />
  );
};

export default ToastComponent;
