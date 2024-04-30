import {SCREEN_WIDTH} from '../../constants/Common';
import DrawerContent from '../../components/DrawerContent';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Products from '../../screens/Products';
import {useRoute} from '@react-navigation/native';
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
      drawerContent={DrawerContent}>
      <Drawer.Screen
        name="Drawer"
        component={Products}
        initialParams={{onSaleTag: route?.params?.onSaleTag}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
