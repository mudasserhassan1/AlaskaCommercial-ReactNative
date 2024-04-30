/* eslint-disable react-native/no-inline-styles */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Platform,Text} from 'react-native';

import {COLORS, IMAGES} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import HomeStackNavigator from './HomeStackNavigator';
import OnSaleStackNavigator from './OnSaleStackNavigator';
import ShopStackNavigator from './ShopStackNavigator';
import ListStackNavigator from './ListStackNavigator';
import OrderHistoryStackNavigator from './OrderHistoryStackNavigator';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageComponent from '../../components/ImageComponent';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';
import {EventEmitter} from 'eventemitter3';
import {TAB_EVENTS} from '../../constants/Events';

export const emitter = new EventEmitter();

const Tab = createBottomTabNavigator();
const BottomTabsNavigator = () => {
  const insets = useSafeAreaInsets();
  const renderTabBarIcon = (focused, imageName) => {
    return (
      <ImageComponent
        source={imageName}
        resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
        style={{
          height: 25,
          width: 25,
          tintColor: focused ? COLORS.MAIN : COLORS.BLACK,
        }}
      />
    );
  };

  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName="HomeScreen"
      activeColor={COLORS.MAIN}
      inactiveColor={COLORS.BLACK}
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: COLORS.BLACK,
        tabBarActiveTintColor: COLORS.MAIN,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? hp('10%') : 64,
          backgroundColor: 'white',
          ...Platform.select({
            android: {
              paddingBottom: 5,
              shadowRadius: 20,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              elevation: 8,
              borderTopWidth: 2,
              top: 1,
              shadowOpacity: 1.0,
            },
            ios: {
              shadowColor: '#000000',
              shadowOpacity: 0.6,
              shadowRadius: 20,
              shadowOffset: {
                height: 15,
                width: 15,
              },
              paddingBottom: insets?.bottom > 0 ? 25 : 10,
            },
          }),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        listeners={() => ({
          tabPress: e => {
            emitter.emit(TAB_EVENTS.TAB_PRESS_HOME);
          },
        })}
        options={{
            tabBarLabel: ({focused, color}) => (
                <Text allowFontScaling={false} style={{color,fontSize:11}}>
                    {APP_CONSTANTS.HOME}
                </Text>
            ),
          tabBarIcon: ({focused}) =>
            renderTabBarIcon(focused, IMAGES.HOME_ICON),
        }}
      />

      <Tab.Screen
        name="ShopStack"
        component={ShopStackNavigator}
        listeners={() => ({
          tabPress: e => {
            emitter.emit(TAB_EVENTS.TAB_PRESS_SHOP, e);
          },
        })}
        options={{
            tabBarLabel: ({focused, color}) => (
                <Text allowFontScaling={false} style={{color,fontSize:11}}>
                    {APP_CONSTANTS.SHOP}
                </Text>
            ),
          tabBarIcon: ({focused}) =>
            renderTabBarIcon(focused, IMAGES.SHOP_ICON),
        }}
      />

      <Tab.Screen
        name="OnSaleStack"
        component={OnSaleStackNavigator}
        listeners={() => ({
          tabPress: e => {
            emitter.emit(TAB_EVENTS.TAB_PRESS_SALE, e);
          },
        })}
        options={{
          tabBarLabel: ({focused, color}) => (
              <Text allowFontScaling={false} style={{color,fontSize:11}}>
              {APP_CONSTANTS.DEALS}
            </Text>
          ),
          tabBarIcon: ({focused}) =>
            renderTabBarIcon(focused, IMAGES.SALE_ICON),
        }}
      />



      <Tab.Screen
        name="ListStack"
        component={ListStackNavigator}
        options={{
            tabBarLabel: ({focused, color}) => (
                <Text allowFontScaling={false} style={{color,fontSize:11}}>
                    {APP_CONSTANTS.LIST}
                </Text>
            ),
          tabBarIcon: ({focused}) =>
            renderTabBarIcon(focused, IMAGES.MENU_LIST_ICON),
        }}
      />
      <Tab.Screen
        name="History"
        component={OrderHistoryStackNavigator}
        options={{
            tabBarLabel: ({focused, color}) => (
                <Text allowFontScaling={false} style={{color,fontSize:11}}>
                    {APP_CONSTANTS.HISTORY}
                </Text>
            ),
          tabBarIcon: ({focused}) =>
            renderTabBarIcon(focused, IMAGES.HISTORY_ICON),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
