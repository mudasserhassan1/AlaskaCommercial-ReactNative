import React, {useMemo, useState} from 'react';
import {View} from 'react-native';

import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import BottomSheetModal from '../BottomSheetModal';
import {updateUser} from '../../services/ApiCaller';
import {logToConsole} from '../../configs/ReactotronConfig';
import LabelCheckBox from '../LabelCheckBox';
import {saveLoginInfo} from '../../redux/actions/general';
import {useDispatch, useSelector} from 'react-redux';
import {MixPanelInstance} from '../../utils/mixpanelUtils';

const MarketingOptInModal = ({visible, closeModal}) => {
  const [isSMSCheckBox, setIsSMSCheckBox] = useState(true);
  const [isEmailCheckBox, setIsEmailCheckBox] = useState(true);

  const dispatch = useDispatch();

  const loginInfoSelector = useMemo(
    () => state => state.general.loginInfo ?? {},
    [],
  );
  const loginInfo = useSelector(loginInfoSelector);
  const {isSMSOptIn, isEmailOptIn} = loginInfo?.userInfo || {};

  const onUpdateOptIn = async () => {
    try {
      closeModal();
      const {response} = await updateUser({
        isSMSOptIn: isSMSCheckBox,
        isEmailOptIn: isEmailCheckBox,
      });
      if (response.ok) {
        const {data: {user: User = {}} = {}} = response ?? {};
        dispatch(saveLoginInfo({...loginInfo, userInfo: User}));
      }
    } catch (e) {
      logToConsole({onUpdateOptInError: e});
    }
  };

  const renderMarketingOptions = () => {
    return (
      <>
        <LabelCheckBox
          label={APP_CONSTANTS.SIGN_UP_FOR_SMS_MARKETING}
          containerStyle={styles.checkBox1}
          isSelected={isSMSCheckBox}
          onPress={() => setIsSMSCheckBox(prevState => !prevState)}
        />
        <LabelCheckBox
          label={APP_CONSTANTS.SIGN_UP_FOR_EMAIL_MARKETING}
          containerStyle={styles.checkBox}
          isSelected={isEmailCheckBox}
          onPress={() => setIsEmailCheckBox(prevState => !prevState)}
        />
      </>
    );
  };
  // const isButtonDisabled =
  //   isSMSCheckBox === !!isSMSOptIn && isEmailCheckBox === !!isEmailOptIn;

  const isButtonDisabled = useMemo(() => {
    return !(isSMSCheckBox || isEmailCheckBox);
  }, [isSMSCheckBox, isEmailCheckBox]);
  return (
    <View>
      <BottomSheetModal
        closeOnBackdrop={false}
        visible={visible}
        buttonTitle={APP_CONSTANTS.SAVE}
        isButtonDisabled={isButtonDisabled}
        statusBarTranslucent
        title={APP_CONSTANTS.SELECT_MARKETING_OPTIONS}
        onCrossPress={onUpdateOptIn}
        onBottomPress={onUpdateOptIn}>
        {renderMarketingOptions()}
      </BottomSheetModal>
    </View>
  );
};

export default React.memo(MarketingOptInModal);
