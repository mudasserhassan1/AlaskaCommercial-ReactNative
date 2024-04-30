
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const useDeviceInfo = () => {
  const value = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
  let modal = DeviceInfo.getModel();
  let OsVersion = DeviceInfo.getSystemVersion();
  return `${value}, ${modal}, ${OsVersion}`;
};

export default useDeviceInfo;
