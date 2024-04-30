import React, {useEffect, useState} from 'react';
import {APP_CONSTANTS} from '../constants/Strings';
import DialogBox from '../components/DialogBox';
import {getAppLatestVersion} from '../services/ApiCaller';
import {Keyboard, Linking, Platform, StyleSheet} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {addForegroundHandler} from './AppStateHandler';
import {COLORS, FONTS, getFontSize} from '../theme';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import { setDisabledDates, toggleUnderMaintenance } from "../redux/actions/general";
import { logToConsole } from "../configs/ReactotronConfig";

const PLAY_STORE_URL = 'http://play.google.com/store/apps/details?id=com.northwest.alaskacommercial';
const APP_STORE_LINK = 'https://apps.apple.com/in/app/alaskaco/id1642934525';
const link = Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_URL;

const AppUpdateHandler = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const dispatch = useDispatch();
  const getVersion = async () => {
    const {response} = await getAppLatestVersion();
    const {iOS, Android, isUnderMaintenance: isMaintaining = false, holidayDates = []} = response?.data || {};
    const {mode, build} = (Platform.OS === 'ios' ? iOS : Android) || {};
    const currentAppBuildNumber = VersionCheck.getCurrentBuildNumber();
    dispatch(setDisabledDates(holidayDates));
    // VersionCheck.needUpdate({
    //   depth: 1,
    //   currentVersion: currentAppVersion,
    //   latestVersion: version,
    // }).then(res => {
    //   logToConsole({res});
    //   if (res?.isNeeded) {
    //     setTimeout(() => {
    //       setIsVisible(true);
    //     }, 3000);
    //     global.isForceUpdateModal = true;
    //   } else {
    //     global.isForceUpdateModal = false;
    //     setIsVisible(false);
    //   }
    // });
    // logToConsole({isMaintaining})

    if (isMaintaining) {
      // setIsUnderMaintenance(true);
      dispatch(toggleUnderMaintenance(true));
      Keyboard.dismiss();
      global.isUnderMaintenance = true;
    } else if (mode === 'force' && build && currentAppBuildNumber && build > currentAppBuildNumber) {
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      global.isForceUpdateModal = true;
      dispatch(toggleUnderMaintenance(false));
    } else {
      global.isUnderMaintenance = false;
      global.isForceUpdateModal = false;
      setIsVisible(false);
      setIsUnderMaintenance(false);
      dispatch(toggleUnderMaintenance(false));
    }
  };

  const foregroundListener = async () => {
    getVersion();
  };

  useEffect(() => {
    addForegroundHandler('APP_UPDATE_HANDLER', foregroundListener);
  }, []);
  //
  // useEffect(() => {
  //   getVersion();
  // }, []);

  const onOpenStore = () => {
    Linking.canOpenURL(link).then(
      supported => {
        supported && Linking.openURL(link);
      },
      err => console.log(err),
    );
  };
  const onOkayUnderMaintenanceButtonPressed = () => {};

  return (
    <DialogBox
      visible={isVisible}
      title={APP_CONSTANTS.APP_UPDATE_REQUIRED}
      message={APP_CONSTANTS.APP_UPDATE_AVAILABLE_MESSAGE_FORCE}
      confirmButtonLabel={APP_CONSTANTS.DOWNLOAD}
      isSingleButton
      onConfirmPress={onOpenStore}
    />
  );
};

export default AppUpdateHandler;

const styles = StyleSheet.create({
  underMaintenanceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    flex: 1,
    backgroundColor: COLORS.WHITE,
    zIndex: 999,
  },
  LogoView: {
    alignSelf: 'center',
    marginBottom: 100,
    alignItems: 'center',
    // marginTop: hp('3%'),
  },
  Logo: {
    width: 200,
    height: 200,
  },
  underMaintenanceTitle: {
    color: '#000',
    fontSize: getFontSize(20),
    marginTop: hp('5%'),
    fontStyle: 'normal',
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'SFProDisplay-Medium',
  },
  underMaintenanceMessage: {
    color: COLORS.GRAY_TEXT,
    fontSize: getFontSize(16),
    marginTop: hp('2%'),
    fontStyle: 'normal',
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
  },
  btnWrapper: {
    width: '90%',
    position: 'absolute',
    bottom: 50,
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('5%'),
  },
  guestButton: {
    backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
    marginTop: hp('4%'),
  },
});
