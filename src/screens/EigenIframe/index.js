import React, {useMemo} from 'react';
import SnapIframesComponent from '../../components/SnapModals/SnapIframesModal';
import {SafeAreaView} from 'react-native';
import {COLORS} from '../../theme';
import {AuthHeader} from '../../components';
import {useSelector} from 'react-redux';

const EigenIframe = () => {
  const cartItemsSelector = useMemo(
    () => state => state?.general?.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.MAIN}}>
      <AuthHeader title={`CHECKOUT (${cartItems?.length})`} backButton />
      <SnapIframesComponent />
    </SafeAreaView>
  );
};

export default EigenIframe;
