import React from 'react';
import {CommonActions} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';

export const navigationRef = React.createRef();

export function navigateTo(name, params = {}) {
  navigationRef.current.navigate(name, params);
}

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function push(name, params) {
  navigationRef.current?.push(name, params);
}

export function dispatch(params) {
  navigationRef.current?.dispatch(params);
}

export function goBack(params) {
  navigationRef.current?.goBack?.(params);
}

export const resetAndNavigate = (screenName, index = 0, params = {}) => {
  NavigationService.dispatch(
    CommonActions.reset({
      index: index,
      routes: [{name: screenName, params}],
    }),
  );
};

export const resetToHome = () => {
  navigationRef.current.reset({
    index: 0,
    routes: [{name: 'BottomTabs', params: {screen: 'Home', params: {screen: 'HomeScreen', params: {reset: true}}}}],
  });
};

export const goToOnSale = () =>
  NavigationService.navigate('OnSaleStack', {
    screen: 'Drawer',
    params: {screen: 'Products'},
    initial: false,
  });

export const navOptions = {
  headerShown: false,
  cardStyle: {backgroundColor: 'transparent'},
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};

export const screenOption = {
  headerShown: false,
  navigationOptions: {
    title: 'Pushed',
    stackAnimation: 'slide_from_right',
  },
};

export const TransitionScreenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
};

export const NavigationService = {
  goBack,
  navigate,
  push,
  dispatch,
  resetToHome,
  goToOnSale,
  resetAndNavigate,
  navigateOnAuthBasic: resetAndNavigate,
};
