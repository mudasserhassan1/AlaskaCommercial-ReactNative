import {APP_CONSTANTS} from '../../constants/Strings';
import React, {memo, useState} from 'react';
import {styles} from './styles';
import {COLORS} from '../../theme';
import {Button} from '../Button';
import LabelRadioItem from '../LabelRadioItem';
import {MODAL_KEYS} from './constants';

const ShareOptionsModal = ({onBottomPress}) => {
  const [isShareStore, setIsShareStore] = useState(false);
  const [isShareExternalEmail, setIsShareExternalEmail] = useState(false);

  const isButtonDisabled = !isShareExternalEmail && !isShareStore;

  const onSelectOption = withExternal => {
    setIsShareExternalEmail(withExternal);
    setIsShareStore(!withExternal);
  };

  return (
    <>
      <LabelRadioItem
        isSelected={isShareStore}
        label={APP_CONSTANTS.SHARE_ITEMS_WITH_STORE}
        containerStyle={styles.radioStyle}
        textStyle={styles.radioText}
        radioBoxStyle={styles.radioBox}
        description={APP_CONSTANTS.SHARE_ITEMS_WITH_STORE_DESCRIPTION}
        onItemPress={() => onSelectOption(false)}
      />
      <LabelRadioItem
        isSelected={isShareExternalEmail}
        label={APP_CONSTANTS.SHARE_ITEMS_WITH_EXTERNAL_EMAIL}
        containerStyle={[styles.radioStyle, styles.radioStyleII]}
        textStyle={styles.radioText}
        radioBoxStyle={styles.radioBox}
        description={APP_CONSTANTS.SHARE_ITEMS_EXTERNAL_EMAIL_DESCRIPTION}
        onItemPress={() => onSelectOption(true)}
      />
      <Button
        width={'90%'}
        label={APP_CONSTANTS.CONTINUE}
        disabled={isButtonDisabled}
        buttonStyle={[
          styles.buttonBottom,
          styles.buttonBottomII,
          isButtonDisabled && {backgroundColor: COLORS.DISABLE_BUTTON_COLOR},
        ]}
        onPress={() => onBottomPress({shareWithKey: isShareStore ? MODAL_KEYS.STORE : MODAL_KEYS.EXTERNAL_EMAIL})}
      />
    </>
  );
};

export default memo(ShareOptionsModal);
