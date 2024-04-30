import {APP_CONSTANTS} from '../../constants/Strings';
import React, {memo, useMemo, useState} from 'react';
import {KEYBOARD_FEATURES} from '../../constants/Common';
import InputField from './InputField';
import isEmail from 'validator/lib/isEmail';
import {styles} from './styles';
import {COLORS, getFontSize} from '../../theme';
import {Button} from '../Button';
import {Text} from 'react-native';
import {logToConsole} from '../../configs/ReactotronConfig';

const ExternalEmailModal = ({onShare}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');

  const isValidEmail = useMemo(() => isEmail(email), [email]);

  const onBlurEmail = () => {
    if (!isValidEmail) {
      setEmailError(APP_CONSTANTS.EMAIL_INPUT_ERROR);
    }
  };

  const onChangeEmail = value => {
    setEmail(value?.trim());
    setEmailError('');
  };

  return (
    <>
      <Text allowFontScaling={false} style={{color: COLORS.MAIN, fontSize: getFontSize(11)}}>{emailError}</Text>
      <InputField
        maxLength={100}
        placeholder={APP_CONSTANTS.EMAIL}
        value={email}
        onBlur={onBlurEmail}
        onChangeText={onChangeEmail}
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
        textContentType={'emailAddress'}
        autoComplete={'email'}
        containerStyle={
          emailError && {
            borderColor: COLORS.MAIN,
          }
        }
      />
      <InputField
        multiline
        maxLength={500}
        placeholder={APP_CONSTANTS.ADD_MESSAGE_OPTIONAL}
        value={message}
        onChangeText={setMessage}
      />
      <Button
        label={APP_CONSTANTS.CONFIRM}
        disabled={!isValidEmail}
        buttonStyle={[styles.buttonBottom, !isValidEmail && {backgroundColor: COLORS.DISABLE_BUTTON_COLOR}]}
        onPress={() => onShare({externalEmail: email?.toLowerCase(), message})}
      />
    </>
  );
};

export default memo(ExternalEmailModal);
