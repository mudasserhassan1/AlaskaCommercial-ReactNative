import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import ContactUs from '../../screens/ContactUs';
import {navOptions, TransitionScreenOptions} from '../../utils';
import RefundRequests from '../../screens/RefundRequests';
import RefundEligibleOrders from '../../screens/RefundEligibleOrders';
import RefundItemsSelection from '../../screens/RefundItemsSelection';
import RefundDetails from '../../screens/RefundDetails';
import RefundHistory from '../../screens/RefundHistory';
import SubmittedRefundDetails from '../../screens/SubmittedRefundRequestDetails';

const Stack = createStackNavigator();
const ReturnStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions} options={() => navOptions}>
      <Stack.Screen name={'RefundRequest'} component={RefundRequests} />
      <Stack.Screen name={'RefundEligibleOrders'} component={RefundEligibleOrders} />
      <Stack.Screen name={'RefundItemSelection'} component={RefundItemsSelection} />
      <Stack.Screen name={'RefundDetails'} component={RefundDetails} />
      <Stack.Screen name={'SubmittedRefundDetails'} component={SubmittedRefundDetails} />
      <Stack.Screen name={'RefundHistory'} component={RefundHistory} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
    </Stack.Navigator>
  );
};

export default ReturnStackNavigator;
