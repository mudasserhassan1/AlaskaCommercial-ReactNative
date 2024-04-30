import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {navOptions, TransitionScreenOptions} from '../../utils';
import ShoppingCart from '../../screens/ShoppingCart';
import ShoppingCartGuestLogin from '../../screens/ShoppingCartGuestLogin';
import ShoppingCartPickup from '../../screens/ShoppingCartPickup';
import AuthStackNavigator from './AuthStackNavigator';
import WebView from '../../screens/WebView/WebView';
import EigenIframe from '../../screens/EigenIframe';
import CheckoutPaymentOption from "../../screens/CheckoutPaymentOption";
import CheckoutOrderDetail from "../../screens/CheckoutOrderDetail";
import CheckoutReviewOrder from "../../screens/CheckoutReviewOrder";

const Stack = createStackNavigator();
const ShoppingCartStack = () => {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions} options={() => navOptions}>
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{gestureEnabled: false}} />
      <Stack.Screen name="ShoppingCartGuestLogin" component={ShoppingCartGuestLogin} options={{gestureEnabled: true}} />
      <Stack.Screen name="ShoppingCartPickup" component={ShoppingCartPickup} options={{gestureEnabled: true}} />
      <Stack.Screen name="CheckoutOrderDetail" component={CheckoutOrderDetail} options={{gestureEnabled: true}} />
      <Stack.Screen name="CheckoutPaymentOption" component={CheckoutPaymentOption} options={{gestureEnabled: true}} />
      <Stack.Screen name="CheckoutReviewOrder" component={CheckoutReviewOrder} options={{gestureEnabled: true}} />
      <Stack.Screen name="AuthStack" component={AuthStackNavigator} options={{gestureEnabled: true}} />
      <Stack.Screen name="WebView" component={WebView} options={{gestureEnabled: true}} />
      <Stack.Screen name={'EigenIframe'} component={EigenIframe} options={{gestureEnabled: true}} />
    </Stack.Navigator>
  );
};

export default ShoppingCartStack;
