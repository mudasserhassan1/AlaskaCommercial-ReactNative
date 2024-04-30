import React, {useEffect, useRef, useState} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {COLORS} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import BottomSheetModal from '../BottomSheetModal';
import {logToConsole} from "../../configs/ReactotronConfig";

const InstructionsModal = ({visible, onRequestClose, onSave, previousData}) => {
  const [specialInstructions, setSpecialInstructions] = useState(previousData);
  const [btnDisable, setBtnDisable] = useState(true);
  const commentInput = useRef(null);


  useEffect(() => {
    if (previousData) {
      setSpecialInstructions(previousData);
    }
  }, [visible]);


  useEffect(() => {
    if (String(specialInstructions.trim()) === String(previousData.trim())) {
      return setBtnDisable(true);
    }
    return setBtnDisable(false);
  }, [visible, specialInstructions]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        commentInput.current.focus();
      }, 900);
    }
  }, [visible]);

  const save = () => {
    onRequestClose();
    onSave(specialInstructions);
  };

  return (
    <BottomSheetModal
      visible={visible}
      title={APP_CONSTANTS.SPECIAL_INSTRUCTIONS}
      onCrossPress={onRequestClose}
      buttonTitle={APP_CONSTANTS.CONTINUE}
      isButtonDisabled={btnDisable}
      onBottomPress={save}>
      <View style={styles.textFieldWrapper}>
        <TextInput
            allowFontScaling={false}
          multiline={true}
          ref={commentInput}
          placeholder={APP_CONSTANTS.ADD_INSTRUCTION_HERE}
          placeholderTextColor={COLORS.GRAY_5}
          value={specialInstructions}
          returnKeyType={'done'}
          fontSize={Platform.OS === 'ios' ? 17 : 15}
          onChangeText={setSpecialInstructions}
          onSubmitEditing={save}
          style={{
            borderRadius: 20,
            height: 114,
            opacity: 6,
            paddingLeft: 15,
            textAlignVertical: 'top',
            color:COLORS.BLACK
          }}
        />
      </View>
    </BottomSheetModal>
  );
};

export default InstructionsModal;
