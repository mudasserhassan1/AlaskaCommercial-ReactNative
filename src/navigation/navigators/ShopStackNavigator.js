import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

//local imports
import DepartmentsScreen from '../../screens/DepartmentsScreen';
import {navOptions, TransitionScreenOptions} from '../../utils';
import ProductDetails from '../../screens/ProductDetails';
import CakeDetailsScreen from '../../screens/CakeDetailsScreen';
import WebView from '../../screens/WebView/WebView';
import ProductDrawerNavigator from './ProductDrawerNavigator';
import SubDepartmentScreen from '../../screens/SubDepartmentScreen';
import DepartmentProductDrawerNavigator from './DepartmentProductDrawerNavigator';
import SubDepartmentsProducts from '../../screens/SubDepartmentProductsScreen';
import SubDepartmentProductsDrawerNavigator from "./SubDepartmentProductsDrawerNavigator";

const Stack = createStackNavigator();
const ShopStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Departments'}
      screenOptions={TransitionScreenOptions}
      options={() => navOptions}>
      <Stack.Screen name="Departments" component={DepartmentsScreen} />
      <Stack.Screen
        name="Products"
        component={ProductDrawerNavigator}
        initialParams={{onSaleTag: false}}
      />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CakesDetailsScreen" component={CakeDetailsScreen} />
      <Stack.Screen name="WebView" component={WebView} />
      <Stack.Screen name="SubDepartments" component={SubDepartmentScreen} />
      <Stack.Screen
        name="DepartmentsProductsScreen"
        component={DepartmentProductDrawerNavigator}
      />
      <Stack.Screen
        name="SubDepartmentsProducts"
        component={SubDepartmentProductsDrawerNavigator}
      />
    </Stack.Navigator>
  );
};

export default ShopStackNavigator;
