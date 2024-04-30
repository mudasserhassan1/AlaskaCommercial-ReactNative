import React, {useEffect, useState} from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import BottomSheetModal from '../BottomSheetModal';
import {COLORS} from '../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../../services/ApiCaller';
import {STATUSES} from '../../constants/Api';
import {saveLoginInfo} from '../../redux/actions/general';
import AuthenticationErrorDialog from '../AuthenticationErrorDialog';
import DialogBox from '../DialogBox';
import {logToConsole} from '../../configs/ReactotronConfig';
const SubstitutionModal = ({visible, closeModal, contentOnly}) => {
  const loginInfo = useSelector(state => state?.general?.loginInfo ?? {});
  const {userInfo = {}} = loginInfo ?? {};
  const {GlobalSubstitution = false} = userInfo ?? {};
  const [isEnabled, setIsEnabled] = useState(GlobalSubstitution);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);
  const [initialEnabledState, setInitialEnabledState] = useState(GlobalSubstitution);
  const dispatch = useDispatch();


  const updateSubstitution = async value => {
    setIsLoading(true);
    const params = {
      GlobalSubstitution: value,
    };
    const {response = {}} = await updateUser(params);
    const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(false);
    if (ok && status === STATUSES.OK) {
      const {data: {user = {}} = {}} = response ?? {};
      let updatedLoginInfo = {...loginInfo, userInfo: user};
      dispatch(saveLoginInfo(updatedLoginInfo));
    } else if (isUnderMaintenance) {
      setIsVisibleApiErrorDialog(false);
    } else if (!isNetworkError) {
      setIsVisibleApiErrorDialog(true);
    }
    return ok;
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const onDonePress = async () => {
    const updateSuccess = await updateSubstitution(isEnabled);
    if (updateSuccess) {
      setInitialEnabledState(isEnabled);
      setIsEnabled(isEnabled)
      closeModal();
    }
  };

  const isButtonDisabled = initialEnabledState === isEnabled;
  const renderSubstitutionAllowedToggle = () => {
    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.shopWrapper}>
        <Text allowFontScaling={false} style={styles.changePassword}>{APP_CONSTANTS.SUBSTITUTION_ALLOWED}</Text>
        <Switch
          trackColor={{
            false: COLORS.SWITCH_COLOR,
            true: COLORS.SWITCH_ON_COLOR,
          }}
          thumbColor={COLORS.WHITE}
          ios_backgroundColor={COLORS.SWITCH_COLOR}
          value={isEnabled}
          onValueChange={toggleSwitch}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <BottomSheetModal
        isLoading={isLoading}
        visible={visible}
        title={APP_CONSTANTS.SUBSTITUTION_SETTINGS}
        onCrossPress={closeModal}
        statusBarTranslucent
        buttonTitle={APP_CONSTANTS.DONE}
        onBottomPress={onDonePress}
        isButtonDisabled={isButtonDisabled}>
        <View>{renderSubstitutionAllowedToggle()}</View>
      </BottomSheetModal>
    </View>
  );
};

export default React.memo(SubstitutionModal);
