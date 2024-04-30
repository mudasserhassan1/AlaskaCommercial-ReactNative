import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {navOptions, TransitionScreenOptions} from '../../utils';
import Settings from '../../screens/Settings';
import Profile from '../../screens/Profile';
import userPreference from '../../screens/UserPreference';
import ContactUs from '../../screens/ContactUs';
import ResetPassword from '../../screens/ResetPassword';
import AboutStackNavigator from './AboutStackNavigator';
import NotificationSettings from '../../screens/NotificationSettings';
import ReturnStackNavigator from './ReturnStackNavigator';
import ListStackNavigator from './ListStackNavigator';
import WebView from '../../screens/WebView/WebView';
import PaymentSettings from '../../screens/PaymentSettings';
import GuestContactUs from '../../screens/GuestContactUs/GuestContactUs';

const Stack = createStackNavigator();
const SettingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions} options={() => navOptions}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="UserPreference" component={userPreference} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="About" component={AboutStackNavigator} />
      <Stack.Screen name="Return" component={ReturnStackNavigator} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="GuestContactUs" component={GuestContactUs} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ListStack" component={ListStackNavigator} />
      <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
      <Stack.Screen name="WebView" component={WebView} />
    </Stack.Navigator>
  );
};

export default SettingStackNavigator;
