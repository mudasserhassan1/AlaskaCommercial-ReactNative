/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {openInbox} from 'react-native-email-link';

import {COLORS} from '../../theme';
import {Button} from '../../components';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {logoutApiCall, sendEmail} from '../../services/ApiCaller';
import {logout} from '../../utils/userUtils';
import {useDispatch, useSelector} from 'react-redux';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {resetAndNavigate} from '../../utils/navigationUtils';
import {useBackHandler} from '@react-native-community/hooks';
import {saveLoginInfo} from '../../redux/actions/general';
import BackgroundTimer from 'react-native-background-timer';
import {logToConsole} from '../../configs/ReactotronConfig';

const VerifyEmail = ({navigation}) => {
  const [timerCount, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const email = useRef();

  // const {isOnboarded, loginInfo} = useSelector(({config: {isOnboarded} = {}, general: {loginInfo = {}} = {}}) => ({
  //   isOnboarded,
  //   loginInfo,
  // }));
  // const {userInfo: {Email: currentUserEmail, isEmailVerified} = {}} =
  // loginInfo || {};

  const isOnboardedSelector = useMemo(
    () => state => state.config?.isOnboarded ?? false,
    [],
  );

  const loginInfoSelector = useMemo(
    () => state => state.general?.loginInfo ?? {},
    [],
  );

  const currentUserEmailSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.Email ?? '',
    [],
  );

  const isEmailVerifiedSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.isEmailVerified ?? false,
    [],
  );

  const isOnboarded = useSelector(isOnboardedSelector);
  const loginInfo = useSelector(loginInfoSelector);
  const currentUserEmail = useSelector(currentUserEmailSelector);
  const isEmailVerified = useSelector(isEmailVerifiedSelector);

  useBackHandler(() => true);

  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    if (!isOnboarded && isEmailVerified) {
      resetAndNavigate('OnBoarding');
    } else if (isEmailVerified && global.isConvertingGuestUser) {
      navigation.pop(1);
      navigation.navigate('CheckoutOrderDetail');
    } else if (isEmailVerified && isOnboarded) {
      resetAndNavigate('BottomTabs');
    }
  }, [isEmailVerified, isOnboarded]);

  useEffect(() => {
    if (currentUserEmail) {
      email.current = currentUserEmail;
    }
  }, [currentUserEmail]);

  const dispatch = useDispatch();

  const startTimer = () => {
    let interval = BackgroundTimer.setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && BackgroundTimer.clearInterval(interval);
        return +lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => BackgroundTimer.clearInterval(interval);
  };

  const submit = async () => {
    try {
      await openInbox();
    } catch (e) {}
  };

  const resendLink = async () => {
    try {
      setLoading(true);
      const {response} = await sendEmail();
      if (response?.data?.isEmailVerified) {
        dispatch(
          saveLoginInfo({
            ...loginInfo,
            userInfo: {...(loginInfo?.userInfo || {}), isEmailVerified: true},
          }),
        );
      }
      setTimer(45);
      startTimer();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      logout(dispatch);
      await logoutApiCall();
    } catch (e) {
    } finally {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'AuthStack', params: {screen: 'Login'}}],
      });
    }
  };

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.EMAIL_VERIFICATION}
      isAuthHeader
      isLoading={loading}>
      <View>
        <View style={styles.wrapper}>
          <Text allowFontScaling={false} style={styles.subtitle}>{APP_CONSTANTS.VERIFY_Email}</Text>
          <View style={styles.marginTop}>
            <Text allowFontScaling={false} style={styles.instructionText}>
              {APP_CONSTANTS.VERIFICATION_LINK_SENT}
              <Text allowFontScaling={false} style={{color: COLORS.BLACK}}>{` '${
                currentUserEmail || email.current || ''
              }'. `}</Text>
              {APP_CONSTANTS.CLICK_VERIFICATION_LINK}
            </Text>
          </View>

          <View style={styles.btnWrapper}>
            <Button
              label={APP_CONSTANTS.OPEN_EMAIL_TO_VERIFY}
              color="white"
              width="90%"
              onPress={submit}
            />
          </View>

          <TouchableOpacity disabled={timerCount > 0} onPress={resendLink}>
            {timerCount > 0 ? (
              <Text allowFontScaling={false} style={[styles.resendCodeText, {color: COLORS.GRAY_4}]}>
                Resend Link in 00:
                {timerCount < 10 ? '0' + timerCount : timerCount}
              </Text>
            ) : (
              <Text allowFontScaling={false} style={[styles.resendCodeText, {color: COLORS.BLACK}]}>
                {APP_CONSTANTS.RESEND_VERIFICATION_LINK}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity onPress={handleLogout}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text allowFontScaling={false} style={styles.verifyLater}>{APP_CONSTANTS.VERIFY_LATER}</Text>
        </View>
      </TouchableOpacity>
      <ToastComponent toastRef={toast => (this.toast = toast)} />
    </ScreenWrapperComponent>
  );
};
export default VerifyEmail;
