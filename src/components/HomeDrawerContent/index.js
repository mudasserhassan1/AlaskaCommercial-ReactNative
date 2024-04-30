import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {navigationRef} from '../../utils/navigationUtils';
import useIsGuest from '../../hooks/useIsGuest';
import {useDispatch, useSelector} from 'react-redux';
import VirtualWalletModal from '../VirtualWalletModal';
import {COLORS, FONTS, IMAGES} from '../../theme';
import ImageComponent from '../ImageComponent';
import {Button} from '../Button';
import DialogBox from '../DialogBox';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SubstitutionModal from '../SubstitutionModal';
import {logoutApiCall} from '../../services/ApiCaller';
import {logout} from '../../utils/userUtils';
import Spinner from 'react-native-loading-spinner-overlay';
import {logToConsole} from '../../configs/ReactotronConfig';

const HomeDrawerContent = ({state, navigation}) => {
  const [visibleVirtualWalletModal, setIsVisibleVirtualWalletModal] =
    useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSubstitutionModal, setIsVisibleSubstitutionModal] =
    useState(false);

  const isGuest = useIsGuest();
  const dispatch = useDispatch();
  const loginInfo = useSelector(state => state?.general?.loginInfo ?? {});
  const {userInfo = {}} = loginInfo ?? {};
  const {FirstName, LastName} = userInfo || {};

  // useEffect(() => {
  //   return navigation.addListener('tabPress', e => {
  //     const {name: currentScreen} =
  //       navigationRef?.current?.getCurrentRoute?.() ?? {};
  //     const isFocused = navigation.isFocused();
  //     logToConsole({isFocused,currentScreen});
  //     if (isFocused) {
  //       navigation.closeDrawer();
  //       e.preventDefault();
  //     }
  //   });
  // }, [navigation]);

  const handleItemPress = id => {
    // Add a delay of 300ms before navigating to the new page
    setTimeout(() => {
      switch (id) {
        case 1:
          navigation.closeDrawer();
          navigation.navigate('Profile');
          break;
        case 2:
          toggleModal();
          break;
        case 3:
          navigation.closeDrawer();
          navigation.navigate('UserPreference');
          break;
        case 4:
          navigation.closeDrawer();
          navigation.navigate('NotificationSettings');
          break;
        case 5:
          navigation.closeDrawer();
          navigation.navigate('Return');
          break;
        case 6:
          navigation.closeDrawer();
          navigation.navigate('ContactUs');
          break;
        case 7:
          toggleDialog();
          break;
        case 8:
          navigation.navigate('AuthStackForGuest', {
            screen: 'Login',
            initial: true,
            params: {showHeader: true, fromCart: true},
          });
          break;
        case 9:
          navigation.navigate('AuthStackForGuest', {
            screen: 'CreateAccount',
            initial: true,
            params: {showHeader: true, fromCart: true},
          });
          break;
        case 10:
          toggleSubstituionModal();
          break;
        case 11:
          navigation.closeDrawer();
          navigation.navigate('GuestContactUs');
          break;
        case 12:
          navigation.closeDrawer();
          navigation.navigate('About');
          break;
        default:
          break;
      }
    }, 200);
  };

  const menuItems = isGuest
    ? [
        {
          text: APP_CONSTANTS.MY_ACCOUNT,
          style: styles.subHeaderText,
        },
        {
          text: APP_CONSTANTS.LOCATION_AND_BANDWIDTH,
          image: IMAGES.LOCATION_N_BANDWIDTH_ICON,
          onPress: () => handleItemPress(3),
        },
        {
          text: APP_CONSTANTS.CONTACT_US,
          image: IMAGES.CONTACT_ICON,
          onPress: () => handleItemPress(11),
        },
        {
          text: APP_CONSTANTS.SUBSTITUTION_SETTINGS,
          image: IMAGES.SUBSITUTION_ICON,
          onPress: () => handleItemPress(10),
        },
        {
          text: APP_CONSTANTS.ABOUT,
          image: IMAGES.ABOUT,
          onPress: () => handleItemPress(12),
        },
      ]
    : [
        {
          text: APP_CONSTANTS.MY_ACCOUNT,
          style: styles.subHeaderText,
        },
        {
          text: APP_CONSTANTS.MY_PROFILE,
          image: IMAGES.MY_PROFILE_ICON,
          onPress: () => handleItemPress(1),
        },
        {
          text: APP_CONSTANTS.VIRTUAL_WALLET,
          image: IMAGES.VIRTUAL_WALLET_ICON,
          onPress: () => handleItemPress(2),
        },
        {
          text: APP_CONSTANTS.LOCATION_AND_BANDWIDTH,
          image: IMAGES.LOCATION_N_BANDWIDTH_ICON,
          onPress: () => handleItemPress(3),
        },
        {
          text: APP_CONSTANTS.COMMUNICATION_SETTINGS,
          image: IMAGES.SETTINGS_ICON,
          onPress: () => handleItemPress(4),
        },
        {
          text: APP_CONSTANTS.REFUND_REQUEST_S,
          image: IMAGES.REFUND_ICON,
          onPress: () => handleItemPress(5),
        },
        {
          text: APP_CONSTANTS.CONTACT_US,
          image: IMAGES.CONTACT_ICON,
          onPress: () => handleItemPress(6),
        },
        {
          text: APP_CONSTANTS.SUBSTITUTION_SETTINGS,
          image: IMAGES.SUBSITUTION_ICON,
          onPress: () => handleItemPress(10),
        },
        {
          text: APP_CONSTANTS.ABOUT,
          image: IMAGES.ABOUT,
          onPress: () => handleItemPress(12),
        },
      ];

  const toggleModal = () =>
    setIsVisibleVirtualWalletModal(prevState => !prevState);
  const renderVirtualWalletModal = () => (
    <VirtualWalletModal
      visible={visibleVirtualWalletModal}
      closeModal={toggleModal}
    />
  );
  const toggleDialog = () => setIsDialogVisible(prevState => !prevState);

  const handleLogout = () => {
    toggleDialog();
    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(true);
      await logoutApiCall();
      logout(dispatch).then(() => {});
    }, 300);
  };

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
  const renderMenuItem = item => (
    <TouchableOpacity
      key={item.text}
      onPress={item.onPress}
      disabled={isLoading}
      activeOpacity={1}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: global?.isiPhone7or8 ? 52 : 56,
        alignItems: 'center',
      }}>
      {item.image && (
        <ImageComponent
          source={item.image}
          style={styles.iconimages}
          resizeMode={'contain'}
        />
      )}
      <Text allowFontScaling={false} style={[styles.header, item.style]}>{item.text}</Text>
    </TouchableOpacity>
  );

  const renderLogoutButton = () => {
    return !isGuest ? (
      <Button
        onPress={() => handleItemPress(7)}
        label={APP_CONSTANTS.LOGOUT}
        labelStyle={styles.logoutbuttontext}
        buttonStyle={styles.logoutbutton}
        disabled={isLoading}
        isLoading={isLoading}
        activeOpacity={0.9}
      />
    ) : null;
  };

  const renderSignInButton = () => {
    return isGuest ? (
      <Button
        onPress={() => handleItemPress(8)}
        label={APP_CONSTANTS.SIGN_IN}
        labelStyle={styles.signInButtonText}
        buttonStyle={styles.signInButton}
        disabled={isLoading}
        isLoading={isLoading}
        activeOpacity={0.9}
      />
    ) : null;
  };

  const renderSignUpButton = () => {
    return isGuest ? (
      <Button
        onPress={() => handleItemPress(9)}
        label={APP_CONSTANTS.CREATE_ACCOUNT}
        labelStyle={{color: COLORS.MAIN, fontFamily: FONTS.REGULAR}}
        buttonStyle={styles.createAccountbutton}
        isLoading={isLoading}
      />
    ) : null;
  };

  const renderLogInAndCreateAccountButton = () => {
    return (
      <View>
        <Button
          onPress={() => handleItemPress(8)}
          label="Log in"
          buttonStyle={styles.loginbutton}
        />
        <Button
          onPress={() => handleItemPress(9)}
          label={APP_CONSTANTS.CREATE_ACCOUNT}
          labelStyle={{color: COLORS.MAIN, fontFamily: FONTS.REGULAR}}
          buttonStyle={styles.createAccountbutton}
          isLoading={isLoading}
        />
      </View>
    );
  };

  const renderUserNameforUser = () => {
    return (
      <View style={styles.headerwrapper}>
        <Text
            allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={styles.usernameheader}>
          {isGuest
            ? APP_CONSTANTS.GUEST_NAME
            : `${FirstName} ${LastName?.charAt(0)}.`}
        </Text>
        <ImageComponent
          style={styles.profileicon}
          source={IMAGES.PROFILE_ICON}
        />
      </View>
    );
  };

  const renderSubstitutionModal = () => (
    <SubstitutionModal
      visible={visibleSubstitutionModal}
      closeModal={toggleSubstituionModal}
    />
  );

  const toggleSubstituionModal = () => {
    setIsVisibleSubstitutionModal(prevState => !prevState);
  };

  const renderLoadingOverlay = () => {
    return isLoading ? (
      <View style={styles.loadingOverlay}>
        <Spinner
          visible={isLoading}
          size={'large'}
          color={COLORS.TRANSPARENT}
        />
      </View>
    ) : null;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.sliderwrapper}>
        {renderUserNameforUser()}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}>
          <View style={{flex: 1, paddingTop: !isGuest ? 15 : 5}}>
            {menuItems.map(item => renderMenuItem(item))}
          </View>
        </ScrollView>
        <View style={styles.logoutButtonView}>{renderLogoutButton()}</View>
        <View
          style={{
            position: 'absolute',
            bottom: global?.isiPhone7or8 ? hp('11%') : hp('8%'),
            width: '100%',
          }}>
          {renderSignInButton()}
        </View>
        <View style={styles.SignUpButtonView}>{renderSignUpButton()}</View>
      </View>
      {renderVirtualWalletModal()}
      {renderSubstitutionModal()}
      {renderLogoutDialog()}
      {renderLoadingOverlay()}
    </SafeAreaView>
  );
};

export default HomeDrawerContent;
