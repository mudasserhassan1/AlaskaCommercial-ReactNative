import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {navOptions, screenOption, TransitionScreenOptions} from '../../utils';
import Home from '../../screens/Home';
import DepartmentsScreen from '../../screens/DepartmentsScreen';
import ProductDetails from '../../screens/ProductDetails';
import CakeDetailsScreen from '../../screens/CakeDetailsScreen';
import OrderHistoryDetail from '../../screens/OrderHistoryDetail';
import userPreference from '../../screens/UserPreference';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import PopularItemsScreen from "../../screens/PopularItemsScreen";
import NotificationSettings from "../../screens/NotificationSettings";
import AboutStackNavigator from "./AboutStackNavigator";
import ReturnStackNavigator from "./ReturnStackNavigator";
import ContactUs from "../../screens/ContactUs";
import GuestContactUs from "../../screens/GuestContactUs/GuestContactUs";
import ResetPassword from "../../screens/ResetPassword";
import ListStackNavigator from "./ListStackNavigator";
import PaymentSettings from "../../screens/PaymentSettings";
import WebView from "../../screens/WebView/WebView";
import LoginScreen from "../../screens/Login";
import CreateAccount from "../../screens/CreateAccount";
import Profile from "../../screens/Profile";

const Stack = createStackNavigator();
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={TransitionScreenOptions}
      options={() => navOptions}
   >

      {/*<Stack.Screen name="HomeScreen" component={Home} options={screenOption} />*/}
      <Stack.Screen
        name="HomeScreen"
        component={HomeDrawerNavigator}
        options={screenOption}
      />
      <Stack.Screen name="UserPreference" component={userPreference} />
      <Stack.Screen name="Departments" component={DepartmentsScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CakesDetailsScreen" component={CakeDetailsScreen} />
      <Stack.Screen name="OrderHistoryDetail" component={OrderHistoryDetail} />
        <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PopularItemsScreen" component={PopularItemsScreen} />
        <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettings}
        />
        <Stack.Screen name="About" component={AboutStackNavigator} />
        <Stack.Screen name="Return" component={ReturnStackNavigator} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="GuestContactUs" component={GuestContactUs} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ListStack" component={ListStackNavigator} />
        <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
        <Stack.Screen name="WebView" component={WebView} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
