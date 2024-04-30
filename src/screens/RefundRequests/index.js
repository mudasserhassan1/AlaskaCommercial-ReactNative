import {View} from 'react-native';
import React from 'react';
import {APP_CONSTANTS} from '../../constants/Strings';
import styles from './styles';
import SettingsSectionCard from '../../components/SettingsSectionCard';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';

const RefundRequests = ({navigation}) => {
  return (
    <ScreenWrapperComponent headerTitle={APP_CONSTANTS.REFUND_REQUEST} withBackButton>
      <View style={styles.parentContainer}>
        <SettingsSectionCard
          name={APP_CONSTANTS.ORDERS_ELIGIBLE_FOR_REFUND}
          onItemPress={() => navigation.navigate('RefundEligibleOrders')}
          noSectionDivider={true}
        />
        <SettingsSectionCard
          name={APP_CONSTANTS.SUBMITTED_REFUND_REQUESTS}
          onItemPress={() => navigation.navigate('RefundHistory')}
          noSectionDivider={true}
        />
      </View>
    </ScreenWrapperComponent>
  );
};

export default RefundRequests;
