import React from 'react';
import ProductDetails from '../../screens/ProductDetails';
import CakeDetailsScreen from '../../screens/CakeDetailsScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {navOptions, TransitionScreenOptions} from '../../utils';
import ProductDrawerNavigator from './ProductDrawerNavigator';
import DepartmentProductDrawerNavigator from './DepartmentProductDrawerNavigator';
import SubDepartmentProductsDrawerNavigator from './SubDepartmentProductsDrawerNavigator';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={TransitionScreenOptions}
      options={() => navOptions}>
      <Stack.Screen
        name="DepartmentsProductsScreen"
        component={DepartmentProductDrawerNavigator}
        initialParams={{comingFromHome: true}}
      />
      <Stack.Screen
        name="Products"
        component={ProductDrawerNavigator}
        // initialParams={{onSaleTag: true}}
      />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CakesDetailsScreen" component={CakeDetailsScreen} />
      <Stack.Screen
        name="SubDepartmentsProducts"
        component={SubDepartmentProductsDrawerNavigator}
        initialParams={{comingFromHome: true}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
