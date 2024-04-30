import {SCREEN_WIDTH} from '../../constants/Common';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DepartmentsProductsScreen from '../../screens/DepartmentsProductsScreen';
import {useRoute} from '@react-navigation/native';
import DepartmentProductsDrawerContent from '../../components/DepartmentProductsDrawer';
const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  const route = useRoute();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: SCREEN_WIDTH * 0.8,
        },
      }}
      drawerContent={DepartmentProductsDrawerContent}>
      <Drawer.Screen
        name="Drawer"
        component={DepartmentsProductsScreen}
        initialParams={{comingFromHome: route?.params?.comingFromHome}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
