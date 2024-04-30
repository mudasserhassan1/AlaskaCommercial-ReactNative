import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SCREEN_WIDTH} from '../../constants/Common';
import {createStackNavigator} from '@react-navigation/stack';
import {navOptions, TransitionScreenOptions} from '../../utils';
import Home from '../../screens/Home';
import HomeDrawerContent from '../../components/HomeDrawerContent';

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={TransitionScreenOptions}
      options={() => navOptions}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};
const HomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: SCREEN_WIDTH * 0.8,
        },
      }}
      drawerContent={HomeDrawerContent}>
      <Drawer.Screen name="Drawer" component={StackNavigator} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
