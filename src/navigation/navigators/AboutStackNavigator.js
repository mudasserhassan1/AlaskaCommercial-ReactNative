import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import About from '../../screens/About';
import {navOptions, TransitionScreenOptions} from '../../utils';

const Stack = createStackNavigator();
const AboutStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions} options={() => navOptions}>
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};

export default AboutStackNavigator;
