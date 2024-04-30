import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import OrderHistory from '../../screens/OrderHistory';
import OrderHistoryDetail from '../../screens/OrderHistoryDetail';
import {navOptions, TransitionScreenOptions} from '../../utils';

const Stack = createStackNavigator();
const OrderHistoryStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions} options={() => navOptions}>
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="OrderHistoryDetail" component={OrderHistoryDetail} />
    </Stack.Navigator>
  );
};

export default OrderHistoryStackNavigator;
