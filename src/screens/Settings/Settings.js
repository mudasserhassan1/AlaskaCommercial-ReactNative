import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import VirtualWalletModal from '../../components/VirtualWalletModal';
import DialogBox from '../../components/DialogBox';
import {logout} from '../../utils/userUtils';
import {SETTINGS_SCREEN_SECTIONS} from '../../constants/Common';
import SettingsSectionCard from '../../components/SettingsSectionCard';
import {logoutApiCall} from '../../services/ApiCaller';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import useIsGuest from '../../hooks/useIsGuest';

const Settings = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [visibleVirtualWalletModal, setIsVisibleVirtualWalletModal] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const toggleModal = () => setIsVisibleVirtualWalletModal(prevState => !prevState);

  const toggleDialog = () => setIsDialogVisible(prevState => !prevState);
  const dispatch = useDispatch();

  const isGuest = useIsGuest();

  const handleLogout = () => {
    toggleDialog();
    setTimeout(async () => {
      setIsLoading(true);
      await logoutApiCall();
      logout(dispatch).then(() => {});
    }, 300);
  };

  const navigate = (screen, params = {}) => navigation.navigate(screen, {params});

  const handleClick = id => {
    switch (id) {
      case '1':
        return handleClickOnFirstItem();
      case '2':
        return navigate('UserPreference');
      case '3':
        return navigate('NotificationSettings');
      case '4':
        return toggleModal();
      case '5':
        return navigate('Return');
      case '6':
        return isGuest ? navigate('GuestContactUs') : navigate('ContactUs');
      case '7':
        return navigate('About');
      case '8':
        return toggleDialog();
    }
  };

  const createAccount = () => {
    navigation.navigate('AuthStackForGuest', {
      screen: 'Login',
      initial: true,
      params: {showHeader: true},
    });
  };

  const handleClickOnFirstItem = () => {
    if (isGuest) {
      // logout(dispatch, globalState).then(() => {});
      createAccount();
    } else {
      navigate('Profile');
    }
  };

  const renderSettingsSections = item => {
    if (isGuest) {
      return renderGuestSettingsSections(item);
    }
    return renderUserSettingsSections(item);
  };

  const renderGuestSettingsSections = item => {
    const {id = '', guestName = '', forGuest = false} = item ?? {};
    if (forGuest) {
      return <SettingsSectionCard key={String(id)} id={id} name={guestName} onItemPress={handleClick} />;
    } else {
      return null;
    }
  };

  const renderUserSettingsSections = item => {
    const {id = '', name = ''} = item ?? {};
    return <SettingsSectionCard key={String(id)} id={id} name={name} onItemPress={handleClick} />;
  };

  const renderVirtualWalletModal = () => (
    <VirtualWalletModal visible={visibleVirtualWalletModal} closeModal={toggleModal} />
  );

  const renderLogoutDialog = () => (
    <DialogBox
      visible={isDialogVisible}
      title={APP_CONSTANTS.LOGOUT}
      message={APP_CONSTANTS.LOGOUT_MESSAGE}
      confirmButtonLabel={APP_CONSTANTS.YES}
      cancelButtonLabel={APP_CONSTANTS.NO}
      onCancelPress={toggleDialog}
      onConfirmPress={handleLogout}
      messageContainerStyles={{marginTop: heightPercentageToDP('0.5%')}}
    />
  );

  return (
    <ScreenWrapperComponent headerTitle={APP_CONSTANTS.SETTINGS_HEADER} withBackButton isLoading={isLoading}>
      <View style={styles.settingsWrapper}>
        <View style={styles.textWrapper}>
          <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.ACCOUNT}</Text>
          {SETTINGS_SCREEN_SECTIONS.map(renderSettingsSections)}
        </View>
      </View>
      {renderVirtualWalletModal()}
      {renderLogoutDialog()}
    </ScreenWrapperComponent>
  );
};

export default Settings;
