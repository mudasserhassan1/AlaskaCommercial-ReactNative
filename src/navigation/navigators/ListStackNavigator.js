import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {navOptions, TransitionScreenOptions} from '../../utils';
import List from '../../screens/List';
import ListDetail from '../../screens/List/ListDetail';
import ProductDetails from '../../screens/ProductDetails';
import CakeDetailsScreen from '../../screens/CakeDetailsScreen';

const Stack = createStackNavigator();
const ListStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions} options={() => navOptions}>
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="ListDetail" component={ListDetail} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CakesDetailsScreen" component={CakeDetailsScreen} />
    </Stack.Navigator>
  );
};

export default ListStackNavigator;
