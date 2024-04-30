import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {screenOption, TransitionScreenOptions} from '../utils';
import AuthStackNavigator from './navigators/AuthStackNavigator';
import BottomTabsNavigator from './navigators/BottomTabsNavigator';
import SettingStackNavigator from './navigators/SettingStackNavigator';
import OrderConfirmation from '../screens/OrderConfirmed/OrderConfirmed';
import {displayToConsole, logToConsole} from '../configs/ReactotronConfig';
import ShoppingCartStack from './navigators/ShoppingCartStack';
import RefundConfirmation from '../screens/RefundConfirmation';
import {getDeviceTimeFormat} from '../utils/transformUtils';
import {setTimeFormatAction} from '../redux/actions/general';
import {navigationRef} from '../utils/navigationUtils';
import * as Qualtrics from '../components/QualtricsComponent';
import EmailVerification from '../screens/EmailVerification/EmailVerification';
import Analytics from '../utils/analyticsUtils';
import {ANALYTICS_EVENTS} from '../screens/ShoppingCartPickup/Constants';
import useIsGuest from '../hooks/useIsGuest';
import UnderMaintenancScreen from '../screens/UnderMaintenanceScreen/UnderMaintenancScreen';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const routeNameRef = useRef();

  const dispatch = useDispatch();
  const isGuest = useIsGuest();

  // const {userToken, userId, isEmailVerified, isOnboarded, isUnderMaintenance} =
  //   useSelector(
  //     ({
  //       config: {isOnboarded} = {},
  //       general: {
  //         loginInfo: {
  //           userToken = null,
  //           userId = null,
  //           userInfo: {isEmailVerified} = {},
  //         } = {},
  //         isUnderMaintenance = false,
  //       } = {},
  //     }) => ({
  //       userToken,
  //       userId,
  //       isEmailVerified,
  //       isOnboarded,
  //       isUnderMaintenance,
  //     }),
  //   );
  const userTokenSelector = useMemo(
    () => state => state.general.loginInfo?.userToken ?? null,
    [],
  );
  const userIdSelector = useMemo(
    () => state => state.general.loginInfo?.userId ?? null,
    [],
  );
  const isEmailVerifiedSelector = useMemo(
    () => state => state.general.loginInfo?.userInfo?.isEmailVerified,
    [],
  );
  const isOnboardedSelector = useMemo(
    () => state => state.config?.isOnboarded ?? false,
    [],
  );
  const isUnderMaintenanceSelector = useMemo(
    () => state => state.general?.isUnderMaintenance ?? false,
    [],
  );

  // Retrieve values using useSelector
  const userToken = useSelector(userTokenSelector);
  const userId = useSelector(userIdSelector);
  const isEmailVerified = useSelector(isEmailVerifiedSelector);
  const isOnboarded = useSelector(isOnboardedSelector);
  const isUnderMaintenance = useSelector(isUnderMaintenanceSelector);

  // logToConsole({
  //   userToken,
  //   userId,
  //   isEmailVerified,
  //   isOnboarded,
  //   isUnderMaintenance,
  // });

  useEffect(() => {
    const is24HourFormat = getDeviceTimeFormat();
    dispatch(setTimeFormatAction(is24HourFormat));
  }, []);

  const getAppropriateStacks = () => {
    if (isUnderMaintenance) {
      return (
        <>
          <Stack.Screen
            name="UnderMaintenance"
            component={UnderMaintenancScreen}
          />
        </>
      );
    }
    global.isAuthStack =
      userToken == null ||
      userId == null ||
      !isOnboarded ||
      (!isEmailVerified && !isGuest && !global.isConvertingGuestUser);
    if (global.isAuthStack) {
      return <Stack.Screen name="AuthStack" component={AuthStackNavigator} />;
    }
    return (
      <>
        <Stack.Screen name="BottomTabs" component={BottomTabsNavigator} />
        <Stack.Screen name="SettingsStack" component={SettingStackNavigator} />
        {/*<Stack.Screen name="Cart" component={ShoppingCartStack} options={screenOption} />*/}
        <Stack.Screen
          name="Cart"
          component={ShoppingCartStack}
          options={{...screenOption, gestureEnabled: false}}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmation}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={'RefundConfirmation'}
          component={RefundConfirmation}
          options={{gestureEnabled: false}}
        />
      </>
    );
  };

  const onReady = () => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute().name;
  };

  const onStateChange = async state => {
    const PreviousScreen = routeNameRef.current;
    const {name: CurrentScreen, params} =
      navigationRef?.current?.getCurrentRoute?.() ?? {};
    if (CurrentScreen && PreviousScreen !== CurrentScreen) {
      Qualtrics.registerViewVisit(CurrentScreen);
      Analytics.logEvent(ANALYTICS_EVENTS.NAVIGATION, {
        CurrentScreen,
        PreviousScreen,
      });
      displayToConsole(
        {
          PreviousScreen,
          CurrentScreen,
          params,
          state,
        },
        'NAVIGATION',
        {important: true, name: 'NAVIGATION'},
      );
    }
    routeNameRef.current = CurrentScreen;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}>
      <Stack.Navigator screenOptions={TransitionScreenOptions}>
        {getAppropriateStacks()}
        <Stack.Screen name="AuthStackForGuest" component={AuthStackNavigator} />
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="EmailVerificationForGuest"
          component={EmailVerification}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
