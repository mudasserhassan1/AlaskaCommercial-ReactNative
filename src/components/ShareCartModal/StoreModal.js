import {Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import CheckBox from '../CheckBox';
import React, {memo, useState} from 'react';
import {Button} from '../Button';
import InputField from './InputField';

const StoreModal = ({storeName, onShare}) => {
  const [message, setMessage] = useState('');
  const [isSNAPChecked, setIsSNAPChecked] = useState(false);

  return (
    <>
      <Text allowFontScaling={false} style={styles.modalTextII}>
        {`${APP_CONSTANTS.SHARE_ITEMS_WITH_STORE_CONFIRM_TEXT_I} ${storeName}. `}
        <Text allowFontScaling={false}>{APP_CONSTANTS.SHARE_ITEMS_WITH_STORE_CONFIRM_TEXT_II}</Text>
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.snapCheck}
        onPress={() => setIsSNAPChecked(prevState => !prevState)}>
        <CheckBox isSelected={isSNAPChecked} disabled />
        <Text allowFontScaling={false} style={[styles.modalTextII, {marginLeft: 10}]}>{APP_CONSTANTS.SNAP_ORDER}</Text>
      </TouchableOpacity>
      <InputField
        value={message}
        multiline
        maxLength={500}
        placeholder={APP_CONSTANTS.ADD_MESSAGE_TO_STORE}
        onChangeText={setMessage}
      />
      <Button
        label={APP_CONSTANTS.CONFIRM}
        buttonStyle={styles.buttonBottom}
        onPress={() => onShare({message, isSNAPChecked})}
      />
    </>
  );
};

export default memo(StoreModal);
