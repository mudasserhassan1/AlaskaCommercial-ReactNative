import {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {logToConsole} from '../configs/ReactotronConfig';
import {MixPanelInstance} from '../utils/mixpanelUtils';

function NetInfoHandler() {
  useEffect(() => {
    return NetInfo.addEventListener(state => {
      global.isNetConnected = state?.isConnected;
      const ipAddress = state?.details?.ipAddress;
      MixPanelInstance.trackIpAddress(ipAddress);
    });
  }, []);

  return null;
}

export default NetInfoHandler;
