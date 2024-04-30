import {createStackNavigator} from '@react-navigation/stack';
import React, {useMemo} from 'react';
import CreateAccount from '../../screens/CreateAccount';
import CreateAccountZipcode from '../../screens/CreateAccountZipcode';
import ForgotPassword from '../../screens/ForgotPassword';
import LoginScreen from '../../screens/Login';
import ResetPassword from '../../screens/ResetPassword';
import VerifyCode from '../../screens/VerifyCodeScreen';
import TermsOfService from '../../screens/TermsOfService';
import {navOptions, TransitionScreenOptions} from '../../utils';
import WebView from '../../screens/WebView/WebView';
import EmailVerification from '../../screens/EmailVerification/EmailVerification';
import {useSelector} from 'react-redux';
import OnBoardingScreen from '../../screens/OnBoardingScreen';
import useIsGuest from '../../hooks/useIsGuest';
import {logToConsole} from '../../configs/ReactotronConfig';

const Stack = createStackNavigator();
const AuthStackNavigator = () => {
  const isGuest = useIsGuest();
  // const {userToken, userId, isEmailVerified, isOnboarded} = useSelector(
  //   ({
  //     config: {isOnboarded} = {},
  //     general: {loginInfo: {userToken = null, userId = null, userInfo: {isEmailVerified} = {}} = {}} = {},
  //   }) => ({
  //     userToken,
  //     userId,
  //     isEmailVerified,
  //     isOnboarded,
  //   }),
  // );

  const userTokenSelector = useMemo(
    () => state => state.general?.loginInfo?.userToken ?? null,
    [],
  );

  const userIdSelector = useMemo(
    () => state => state.general?.loginInfo?.userId ?? null,
    [],
  );

  const isEmailVerifiedSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.isEmailVerified,
    [],
  );

  const isOnboardedSelector = useMemo(
    () => state => state.config?.isOnboarded ?? false,
    [],
  );

  const userToken = useSelector(userTokenSelector);
  const userId = useSelector(userIdSelector);
  const isEmailVerified = useSelector(isEmailVerifiedSelector);
  const isOnboarded = useSelector(isOnboardedSelector);

  // logToConsole({userToken, userId, isEmailVerified, isOnboarded});

  const getInitialRouteName = () => {
    if (userToken == null && userId == null) {
      return 'Login';
    } else if (userToken == null && userId !== null) {
      return 'CreateAccountZipcode';
    } else if (!isEmailVerified && !isGuest) {
      return 'EmailVerification';
    } else if (!isOnboarded) {
      return 'OnBoarding';
    }
  };

  return (
    <Stack.Navigator
      screenOptions={TransitionScreenOptions}
      options={() => navOptions}
      initialRouteName={getInitialRouteName()}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen
        name="CreateAccountZipcode"
        component={CreateAccountZipcode}
      />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="WebView" component={WebView} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
