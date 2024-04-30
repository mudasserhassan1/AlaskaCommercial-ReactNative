import React, {useEffect} from 'react';
import AppStateHandler from './AppStateHandler';
import DeepLinkHandler from './DeepLinkHandler';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  changePromoVisibility,
  toggleNetworkErrorDialog,
} from '../redux/actions/general';
import FlashMessage from 'react-native-flash-message';
import {setFirstEverVisit} from '../redux/actions/config';
import {updateNotificationBadge} from '../utils/notificationsUtils';
import {MixPanelInstance} from '../utils/mixpanelUtils';
import {getItemsFromCart} from '../utils/cartUtils';

export const dispatchRef = React.createRef();

global.isNetConnected = true;
global.isQualtricsInitialized = false;
global.isConvertingGuestUser = false;
global.isAuthStack = true;

function RootContainer() {
  const dispatch = useDispatch();
  const {userId, isFirstEverVisit} = useSelector(
    ({config: {isFirstEverVisit} = {}, loginInfo: {userId} = {}}) => ({
      userId,
      isFirstEverVisit,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatchRef.current = dispatch;
    getItemsFromCart(dispatch).then(r => {});
    if (isFirstEverVisit) {
      updateNotificationBadge(0);
      dispatch(setFirstEverVisit(false));
    }
    dispatch(toggleNetworkErrorDialog({visible: false, error: {}}));
    dispatch(changePromoVisibility(true));
    MixPanelInstance.init({userId});
  }, []);

  return (
    <>
      <AppStateHandler />
      <DeepLinkHandler />
      <FlashMessage position={'top'} />
    </>
  );
}

export default RootContainer;
