// /* eslint-disable react-hooks/exhaustive-deps */
// import React, {useCallback, useState} from 'react';
// import {Switch, Text, TouchableOpacity, View} from 'react-native';
// import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import {useDispatch, useSelector} from 'react-redux';
// import {COLORS, IMAGES, getFontSize} from '../../theme';
// import {styles} from './styles';
// import {APP_CONSTANTS} from '../../constants/Strings';
// import {deactivateAccount, toggleSnapEligibilityFlag, updateUser} from '../../services/ApiCaller';
// import {formatPhoneNumber} from '../../utils';
// import AuthenticationErrorDialog from '../../components/AuthenticationErrorDialog';
// import DeactivateAccountDialog from '../../components/DeactivateAccountDialog';
// import {logout} from '../../utils/userUtils';
// import DialogBox from '../../components/DialogBox';
// import EditProfileModal from '../../components/EditProfileModal';
// import ProfileSectionCard from '../../components/ProfileSectionCard';
// import {saveLoginInfo} from '../../redux/actions/general';
// import ImageComponent from '../../components/ImageComponent';
// import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
// import {logToConsole} from '../../configs/ReactotronConfig';
// import {STATUSES} from '../../constants/Api';
//
// const Profile = ({navigation}) => {
//   const globalState = useSelector(state => state);
//   const {general: {loginInfo = {}} = {}} = globalState ?? {};
//   const {userInfo = {}} = loginInfo ?? {};
//   const {GlobalSubstitution = false, showSnapEligibility, _id: userId} = userInfo ?? {};
//
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [visibleDialog, setVisibleDialog] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState('');
//   const [snapSwitchEnabled, setSnapSwitchEnabled] = useState(showSnapEligibility);
//   const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);
//   const [isVisibleSuccessDialog, setIsVisibleSuccessDialog] = useState(false);
//
//   const [isEnabled, setIsEnabled] = useState(GlobalSubstitution);
//
//   const dispatch = useDispatch();
//
//   const toggleModal = useCallback(() => {
//     setModalVisible(prevState => !prevState);
//   }, []);
//
//   const toggleDeActivateAccountDialog = useCallback(() => {
//     setVisibleDialog(prevState => !prevState);
//   }, []);
//
//   const toggleApiErrorDialog = () => {
//     setIsVisibleApiErrorDialog(prevState => !prevState);
//   };
//
//   const toggleSuccessDialog = () => {
//     setIsVisibleSuccessDialog(prevState => !prevState);
//   };
//
//   const updateSubstitution = async value => {
//     setIsLoading(true);
//     const params = {
//       GlobalSubstitution: value,
//     };
//     const {response = {}} = await updateUser(params);
//     const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
//     setIsLoading(false);
//     if (ok && status === STATUSES.OK) {
//       const {data: {user = {}} = {}} = response ?? {};
//       let updatedLoginInfo = {...loginInfo, userInfo: user};
//       dispatch(saveLoginInfo(updatedLoginInfo));
//     } else if (isUnderMaintenance) {
//       setIsVisibleApiErrorDialog(false);
//     } else if (!isNetworkError) {
//       setIsVisibleApiErrorDialog(true);
//     }
//     return ok;
//   };
//
//   const deActivateAccount = async () => {
//     toggleApiErrorDialog();
//     setTimeout(() => {
//       setIsLoading(true);
//     }, 110);
//     const {response = {}} = await deactivateAccount();
//     let {status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
//     setIsLoading(true);
//     if (status === STATUSES.OK) {
//       return await logout(dispatch, globalState);
//     }else if (isUnderMaintenance) {
//       setIsVisibleApiErrorDialog(false);
//     }  else if (!isNetworkError) {
//       setDialogMessage('');
//       toggleApiErrorDialog();
//     }
//   };
//
//   const showZipCodeChangedConfirmationAlert = store => {
//     setDialogMessage(APP_CONSTANTS.ZIP_CODE_CHANGED + store);
//     toggleSuccessDialog();
//   };
//
//   const navigateToPayment = useCallback(() => navigation.navigate('PaymentSettings'), []);
//
//   const goToChangePassword = useCallback(() => navigation.navigate('ResetPassword', {comingFrom: 'Profile'}), []);
//
//   const goToListScreen = useCallback(
//     () =>
//       navigation.navigate('ListStack', {
//         screen: 'List',
//         params: {comingFrom: 'Profile'},
//       }),
//     [],
//   );
//
//   const navigateToPreference = useCallback(() => navigation.navigate('UserPreference', {comingFrom: 'Profile'}), []);
//
//   const toggleSnapSwitch = async () => {
//     try {
//       setIsLoading(true);
//       setSnapSwitchEnabled(!showSnapEligibility);
//       const {response = {}} = await toggleSnapEligibilityFlag({showSnapEligibility: !showSnapEligibility, userId});
//       const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
//       if (ok && status === STATUSES.OK) {
//         setSnapSwitchEnabled(!showSnapEligibility);
//         let updatedLoginInfo = {...loginInfo, userInfo: {...userInfo, showSnapEligibility: !showSnapEligibility}};
//         dispatch(saveLoginInfo(updatedLoginInfo));
//       } else if (isUnderMaintenance) {
//         setIsVisibleApiErrorDialog(false);
//       } else if (!isNetworkError) {
//         throw response;
//       }
//       return ok;
//     } catch (e) {
//       setSnapSwitchEnabled(showSnapEligibility);
//       setIsVisibleApiErrorDialog(true);
//       logToConsole({ErrorSnapEligibilityFlag: e});
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const toggleSwitch = () => {
//     setIsEnabled(previousState => {
//       updateSubstitution(!previousState);
//       return !previousState;
//     });
//   };
//
//   const renderProfileSection = () => {
//     return (
//       <View style={styles.mainWrapper}>
//         <View style={styles.textWrapper}>
//           <View style={styles.editProfileWrapper}>
//             <Text style={styles.textHeader}>{APP_CONSTANTS.PROFILE}</Text>
//             <TouchableOpacity style={styles.editTextWrapper} onPress={toggleModal}>
//               <Text style={styles.editText}>{APP_CONSTANTS.EDIT}</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.infoWrapper}>
//             <Text style={styles.labelText}>{APP_CONSTANTS.NAME}</Text>
//             <Text style={styles.labelInfo}>
//               {userInfo.FirstName} {userInfo.LastName}
//             </Text>
//           </View>
//           {renderDivider()}
//           <View style={styles.infoWrapper}>
//             <Text style={styles.labelText}>{APP_CONSTANTS.EMAIL}</Text>
//             <Text style={styles.labelInfo}>{userInfo.Email}</Text>
//           </View>
//           {renderDivider()}
//           <View style={styles.infoWrapper}>
//             <Text style={styles.labelText}>{APP_CONSTANTS.PHONE_NUM}</Text>
//             <Text style={styles.labelInfo}>{formatPhoneNumber(userInfo.PhoneNumber)}</Text>
//           </View>
//           {renderDivider()}
//           <View style={styles.infoWrapper}>
//             <Text style={styles.labelText}>{APP_CONSTANTS.ZIP_CODE}</Text>
//             <Text style={styles.labelInfo}>{userInfo.ZipCode}</Text>
//           </View>
//           {renderDivider()}
//           <View style={styles.infoWrapper}>
//             <Text style={styles.labelText}>{APP_CONSTANTS.CITY}</Text>
//             <Text style={styles.labelInfo}>{userInfo.StoreLocation}</Text>
//           </View>
//         </View>
//       </View>
//     );
//   };
//
//   const renderStoreSection = () => (
//     <TouchableOpacity activeOpacity={0.8} onPress={navigateToPreference} style={styles.storeWrapper}>
//       <View style={styles.storeInnerWrapper}>
//         <Text style={styles.bottomLabelText}>{APP_CONSTANTS.STORE}</Text>
//         <View style={styles.storeTextWrapper}>
//           <Text style={[styles.labelInfo, {fontSize: getFontSize(17)}]}>{userInfo.Store}</Text>
//           <View style={styles.rightArrowWrapper}>
//             <ImageComponent source={IMAGES.RIGHT_ARROW} style={styles.rightArrow} />
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
//
//   const renderShopSection = () => (
//     <View style={styles.mainWrapper}>
//       <View style={styles.textWrapper}>
//         <View style={styles.editProfileWrapper}>
//           <Text style={styles.textHeader}>{APP_CONSTANTS.SHOP}</Text>
//         </View>
//         <TouchableOpacity style={styles.shopWrapper} activeOpacity={0.8} onPress={navigateToPayment}>
//           <Text style={styles.changePassword}>{APP_CONSTANTS.PAYMENT}</Text>
//           <ImageComponent source={IMAGES.RIGHT_ARROW} style={styles.rightArrow} />
//         </TouchableOpacity>
//         <View style={[styles.divider, {marginTop: hp('2%')}]} />
//
//         <TouchableOpacity activeOpacity={0.8} onPress={goToListScreen} style={styles.shopWrapper}>
//           <Text style={styles.changePassword}>{APP_CONSTANTS.MY_LIST}</Text>
//           <ImageComponent source={IMAGES.RIGHT_ARROW} style={styles.rightArrow} />
//         </TouchableOpacity>
//         <View style={[styles.divider, {marginTop: hp('2%')}]} />
//         <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitch} style={styles.shopWrapper}>
//           <Text style={styles.changePassword}>{APP_CONSTANTS.SUBSTITUTION_ALLOWED}</Text>
//           <Switch
//             trackColor={{
//               false: COLORS.SWITCH_COLOR,
//               true: COLORS.SWITCH_ON_COLOR,
//             }}
//             thumbColor={COLORS.WHITE}
//             ios_backgroundColor={COLORS.SWITCH_COLOR}
//             onValueChange={toggleSwitch}
//             value={isEnabled}
//           />
//         </TouchableOpacity>
//         <View style={[styles.divider, {marginTop: hp('2%')}]} />
//         <TouchableOpacity activeOpacity={0.8} onPress={toggleSnapSwitch} style={styles.shopWrapper}>
//           <Text style={styles.changePassword}>{APP_CONSTANTS.SNAP_ELIGIBILITY}</Text>
//           <Switch
//             trackColor={{
//               false: COLORS.SWITCH_COLOR,
//               true: COLORS.SWITCH_ON_COLOR,
//             }}
//             thumbColor={COLORS.WHITE}
//             ios_backgroundColor={COLORS.SWITCH_COLOR}
//             onValueChange={toggleSnapSwitch}
//             value={snapSwitchEnabled}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
//
//   const renderEditProfileModal = () => {
//     return (
//       <EditProfileModal
//         isVisible={isModalVisible}
//         closeModal={toggleModal}
//         showZipCodeChangedAlert={showZipCodeChangedConfirmationAlert}
//       />
//     );
//   };
//
//   const renderApiSuccessDialog = () => {
//     return (
//       <DialogBox
//         visible={isVisibleSuccessDialog}
//         closeModal={toggleSuccessDialog}
//         title={dialogMessage}
//         titleStyle={styles.dialogTitleWrapper}
//         message=""
//         isSingleButton={true}
//         cancelButtonLabel={APP_CONSTANTS.OK}
//       />
//     );
//   };
//
//   const renderDivider = () => <View style={styles.divider} />;
//
//   const renderDeactivateAccountDialog = () => (
//     <DeactivateAccountDialog
//       visible={visibleDialog}
//       closeModal={toggleDeActivateAccountDialog}
//       toggleLoading={() => setIsLoading(prevState => !prevState)}
//       showApiErrorDialog={msg => {
//         setDialogMessage(msg);
//         setIsVisibleApiErrorDialog(true);
//       }}
//     />
//   );
//
//   const renderAuthErrorDialog = () => (
//     <AuthenticationErrorDialog
//       visible={isVisibleApiErrorDialog}
//       closeDialog={toggleApiErrorDialog}
//       closeModal={toggleModal}
//       message={dialogMessage}
//       retry={deActivateAccount}
//     />
//   );
//
//   const renderApiErrorDialog = () => (
//     <DialogBox
//       visible={isVisibleApiErrorDialog}
//       closeModal={() => setIsVisibleApiErrorDialog(false)}
//       title={APP_CONSTANTS.ALASKA_COMMERCIAL}
//       message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
//       confirmButtonLabel={APP_CONSTANTS.RETRY}
//       cancelButtonLabel={APP_CONSTANTS.CANCEL}
//       onCancelPress={() => setIsVisibleApiErrorDialog(false)}
//       onConfirmPress={() => setIsVisibleApiErrorDialog(false)}
//     />
//   );
//   return (
//     <ScreenWrapperComponent headerTitle={APP_CONSTANTS.PROFILE_HEADER} withBackButton isLoading={isLoading}>
//       {renderProfileSection()}
//       <View style={styles.storeInfoSeparator} />
//       {renderStoreSection()}
//       {renderShopSection()}
//       <ProfileSectionCard textContent={APP_CONSTANTS.CHANGE_PASS} onPress={goToChangePassword} />
//       <ProfileSectionCard textContent={APP_CONSTANTS.DEACTIVATE_ACCOUNT} onPress={toggleDeActivateAccountDialog} />
//       {renderApiSuccessDialog()}
//       {renderDeactivateAccountDialog()}
//       {renderAuthErrorDialog()}
//       {renderEditProfileModal()}
//       {renderApiErrorDialog()}
//     </ScreenWrapperComponent>
//   );
// };
//
// export default Profile;

/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, IMAGES, getFontSize} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  deactivateAccount,
  toggleSnapEligibilityFlag,
  updateUser,
} from '../../services/ApiCaller';
import {formatPhoneNumber} from '../../utils';
import AuthenticationErrorDialog from '../../components/AuthenticationErrorDialog';
import DeactivateAccountDialog from '../../components/DeactivateAccountDialog';
import {logout} from '../../utils/userUtils';
import DialogBox from '../../components/DialogBox';
import EditProfileModal from '../../components/EditProfileModal';
import ProfileSectionCard from '../../components/ProfileSectionCard';
import {saveLoginInfo} from '../../redux/actions/general';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {logToConsole} from '../../configs/ReactotronConfig';
import {STATUSES} from '../../constants/Api';
import {getItemsFromCart} from '../../utils/cartUtils';

const Profile = ({navigation}) => {
  const loginInfo = useSelector(state => state?.general?.loginInfo ?? {});
  const {userInfo = {}} = loginInfo ?? {};
  const {
    GlobalSubstitution = false,
    showSnapEligibility,
    _id: userId,
  } = userInfo ?? {};

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [snapSwitchEnabled, setSnapSwitchEnabled] =
    useState(showSnapEligibility);
  const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] = useState(false);
  const [isVisibleSuccessDialog, setIsVisibleSuccessDialog] = useState(false);

  const [isEnabled, setIsEnabled] = useState(GlobalSubstitution);

  const dispatch = useDispatch();

  const toggleModal = useCallback(() => {
    setModalVisible(prevState => !prevState);
  }, []);

  const toggleDeActivateAccountDialog = useCallback(() => {
    setVisibleDialog(prevState => !prevState);
  }, []);

  const toggleApiErrorDialog = () => {
    setIsVisibleApiErrorDialog(prevState => !prevState);
  };

  const toggleSuccessDialog = () => {
    setIsVisibleSuccessDialog(prevState => !prevState);
  };

  const updateSubstitution = async value => {
    setIsLoading(true);
    const params = {
      GlobalSubstitution: value,
    };
    const {response = {}} = await updateUser(params);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
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

  const deActivateAccount = async () => {
    toggleApiErrorDialog();
    setTimeout(() => {
      setIsLoading(true);
    }, 110);
    const {response = {}} = await deactivateAccount();
    let {status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(true);
    if (status === STATUSES.OK) {
      return await logout(dispatch);
    } else if (isUnderMaintenance) {
      setIsVisibleApiErrorDialog(false);
    } else if (!isNetworkError) {
      setDialogMessage('');
      toggleApiErrorDialog();
    }
  };

  const showZipCodeChangedConfirmationAlert = async store => {
    setDialogMessage(APP_CONSTANTS.ZIP_CODE_CHANGED + store);
    toggleSuccessDialog();
  };

  const navigateToPayment = useCallback(
    () => navigation.navigate('PaymentSettings'),
    [],
  );

  const goToChangePassword = useCallback(
    () => navigation.navigate('ResetPassword', {comingFrom: 'Profile'}),
    [],
  );

  const goToListScreen = useCallback(
    () =>
      navigation.navigate('ListStack', {
        screen: 'List',
        params: {comingFrom: 'Profile'},
      }),
    [],
  );

  const navigateToPreference = useCallback(
    () => navigation.navigate('UserPreference', {comingFrom: 'Profile'}),
    [],
  );

  const toggleSnapSwitch = async () => {
    try {
      setIsLoading(true);
      setSnapSwitchEnabled(!showSnapEligibility);
      const {response = {}} = await toggleSnapEligibilityFlag({
        showSnapEligibility: !showSnapEligibility,
        userId,
      });
      const {
        ok = false,
        status = 0,
        isNetworkError,
        isUnderMaintenance,
      } = response ?? {};
      if (ok && status === STATUSES.OK) {
        setSnapSwitchEnabled(!showSnapEligibility);
        let updatedLoginInfo = {
          ...loginInfo,
          userInfo: {...userInfo, showSnapEligibility: !showSnapEligibility},
        };
        dispatch(saveLoginInfo(updatedLoginInfo));
      } else if (isUnderMaintenance) {
        setIsVisibleApiErrorDialog(false);
      } else if (!isNetworkError) {
        throw response;
      }
      return ok;
    } catch (e) {
      setSnapSwitchEnabled(showSnapEligibility);
      setIsVisibleApiErrorDialog(true);
      logToConsole({ErrorSnapEligibilityFlag: e});
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => {
      updateSubstitution(!previousState);
      return !previousState;
    });
  };

  const renderProfileSection = () => {
    return (
      <View style={styles.ProfilemainWrapper}>
        {/*<View style={styles.profileInnerWrapper}>*/}
        <View style={styles.profileHeadingStyle}>
          <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.PROFILE}</Text>
          <TouchableOpacity
            style={styles.editTextWrapper}
            onPress={toggleModal}>
            <Text allowFontScaling={false} style={styles.editText}>{APP_CONSTANTS.EDIT}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoWrapper}>
          <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.NAME}</Text>
          <Text allowFontScaling={false} style={styles.labelInfo}>
            {userInfo.FirstName} {userInfo.LastName}
          </Text>
        </View>
        {renderDivider()}
        <View style={styles.infoWrapper}>
          <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.EMAIL}</Text>
          <Text allowFontScaling={false} style={styles.labelInfo}>{userInfo.Email}</Text>
        </View>
        {renderDivider()}
        <View style={styles.infoWrapper}>
          <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.PHONE_NUM}</Text>
          <Text allowFontScaling={false} style={styles.labelInfo}>
            {formatPhoneNumber(userInfo.PhoneNumber)}
          </Text>
        </View>
        {renderDivider()}
        <View style={styles.infoWrapper}>
          <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.ZIP_CODE}</Text>
          <Text allowFontScaling={false} style={styles.labelInfo}>{userInfo.ZipCode}</Text>
        </View>
        {/*{renderDivider()}*/}
        {/*<View style={styles.infoWrapper}>*/}
        {/*  <Text style={styles.labelText}>{APP_CONSTANTS.CITY}</Text>*/}
        {/*  <Text style={styles.labelInfo}>{userInfo.StoreLocation}</Text>*/}
        {/*</View>*/}
        {/*</View>*/}
      </View>
    );
  };

  const renderStoreSection = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={navigateToPreference}
      style={styles.storeWrapper}>
      <View style={styles.storeInnerWrapper}>
        <Text allowFontScaling={false} style={styles.bottomLabelText}>{APP_CONSTANTS.STORE}</Text>
        <View style={styles.storeTextWrapper}>
          <Text allowFontScaling={false} style={[styles.labelInfoForStore, {fontSize: getFontSize(15)}]}>
            {userInfo.Store}
          </Text>
          <View style={styles.rightArrowWrapper}>
            <ImageComponent
              source={IMAGES.RIGHT_ARROW}
              style={styles.rightArrow}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShopSection = () => (
    <View style={styles.shopmainWrapper}>
      <View style={styles.textWrapper}>
        <View style={styles.editProfileWrapper}>
          <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.SHOP}</Text>
        </View>
        <TouchableOpacity
          style={styles.shopWrapper}
          activeOpacity={0.8}
          onPress={navigateToPayment}>
          <Text allowFontScaling={false} style={styles.changePassword}>{APP_CONSTANTS.PAYMENT}</Text>
          <ImageComponent
            source={IMAGES.RIGHT_ARROW}
            style={styles.rightArrow}
          />
        </TouchableOpacity>
        <View style={styles.shopsectiondivider} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goToListScreen}
          style={styles.shopWrapper}>
          <Text allowFontScaling={false} style={styles.changePassword}>{APP_CONSTANTS.MY_LIST}</Text>
          <ImageComponent
            source={IMAGES.RIGHT_ARROW}
            style={styles.rightArrow}
          />
        </TouchableOpacity>
        {/*<View style={[styles.divider, {marginTop: hp('2%')}]} />*/}
        {/*<TouchableOpacity activeOpacity={0.8} onPress={toggleSwitch} style={styles.shopWrapper}>*/}
        {/*  <Text style={styles.changePassword}>{APP_CONSTANTS.SUBSTITUTION_ALLOWED}</Text>*/}
        {/*  <Switch*/}
        {/*    trackColor={{*/}
        {/*      false: COLORS.SWITCH_COLOR,*/}
        {/*      true: COLORS.SWITCH_ON_COLOR,*/}
        {/*    }}*/}
        {/*    thumbColor={COLORS.WHITE}*/}
        {/*    ios_backgroundColor={COLORS.SWITCH_COLOR}*/}
        {/*    onValueChange={toggleSwitch}*/}
        {/*    value={isEnabled}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}
        {/*<View style={[styles.divider, {marginTop: hp('2%')}]} />*/}
        {/*<TouchableOpacity activeOpacity={0.8} onPress={toggleSnapSwitch} style={styles.shopWrapper}>*/}
        {/*  <Text style={styles.changePassword}>{APP_CONSTANTS.SNAP_ELIGIBILITY}</Text>*/}
        {/*  <Switch*/}
        {/*    trackColor={{*/}
        {/*      false: COLORS.SWITCH_COLOR,*/}
        {/*      true: COLORS.SWITCH_ON_COLOR,*/}
        {/*    }}*/}
        {/*    thumbColor={COLORS.WHITE}*/}
        {/*    ios_backgroundColor={COLORS.SWITCH_COLOR}*/}
        {/*    onValueChange={toggleSnapSwitch}*/}
        {/*    value={snapSwitchEnabled}*/}
        {/*  />*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  );

  const renderSnapEligibilitySection = () => (
    <View style={styles.mainWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleSnapSwitch}
        style={styles.snapEligibiltyWrapper}>
        <Text allowFontScaling={false} style={styles.changePassword}>
          {APP_CONSTANTS.SNAP_ELIGIBILITY}
        </Text>
        <Switch
          trackColor={{
            false: COLORS.SWITCH_COLOR,
            true: COLORS.SWITCH_ON_COLOR,
          }}
          thumbColor={COLORS.WHITE}
          ios_backgroundColor={COLORS.SWITCH_COLOR}
          onValueChange={toggleSnapSwitch}
          value={snapSwitchEnabled}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEditProfileModal = () => {
    return (
      <EditProfileModal
        isVisible={isModalVisible}
        closeModal={toggleModal}
        showZipCodeChangedAlert={showZipCodeChangedConfirmationAlert}
      />
    );
  };

  const renderApiSuccessDialog = () => {
    return (
      <DialogBox
        visible={isVisibleSuccessDialog}
        closeModal={toggleSuccessDialog}
        title={dialogMessage}
        titleStyle={styles.dialogTitleWrapper}
        message=""
        isSingleButton={true}
        cancelButtonLabel={APP_CONSTANTS.OK}
        onCancelPress={removeCart}
      />
    );
  };
  const removeCart = async () => {
    toggleSuccessDialog();
    await getItemsFromCart(dispatch).then(() => {});
  };
  const renderDivider = () => <View style={styles.divider} />;

  const renderDeactivateAccountDialog = () => (
    <DeactivateAccountDialog
      visible={visibleDialog}
      closeModal={toggleDeActivateAccountDialog}
      toggleLoading={() => setIsLoading(prevState => !prevState)}
      showApiErrorDialog={msg => {
        setDialogMessage(msg);
        setIsVisibleApiErrorDialog(true);
      }}
    />
  );

  const renderAuthErrorDialog = () => (
    <AuthenticationErrorDialog
      visible={isVisibleApiErrorDialog}
      closeDialog={toggleApiErrorDialog}
      closeModal={toggleModal}
      message={dialogMessage}
      retry={deActivateAccount}
    />
  );

  const renderApiErrorDialog = () => (
    <DialogBox
      visible={isVisibleApiErrorDialog}
      closeModal={() => setIsVisibleApiErrorDialog(false)}
      title={APP_CONSTANTS.ALASKA_COMMERCIAL}
      message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
      confirmButtonLabel={APP_CONSTANTS.RETRY}
      cancelButtonLabel={APP_CONSTANTS.CANCEL}
      onCancelPress={() => setIsVisibleApiErrorDialog(false)}
      onConfirmPress={() => setIsVisibleApiErrorDialog(false)}
    />
  );
  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.PROFILE_HEADER}
      withBackButton
      isLoading={isLoading}>
      {renderProfileSection()}
      {/*<View style={styles.storeInfoSeparator} />*/}
      {renderStoreSection()}
      {renderShopSection()}
      <ProfileSectionCard
        textContent={APP_CONSTANTS.CHANGE_PASS}
        onPress={goToChangePassword}
      />
      <ProfileSectionCard
        textContent={APP_CONSTANTS.DEACTIVATE_ACCOUNT}
        onPress={toggleDeActivateAccountDialog}
      />
      {renderSnapEligibilitySection()}
      {renderApiSuccessDialog()}
      {renderDeactivateAccountDialog()}
      {renderAuthErrorDialog()}
      {renderEditProfileModal()}
      {renderApiErrorDialog()}
    </ScreenWrapperComponent>
  );
};

export default Profile;
