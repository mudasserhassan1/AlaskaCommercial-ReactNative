import DeviceInfo from 'react-native-device-info';
import {logToConsole} from '../configs/ReactotronConfig';

export let isiPhone7or8 = async () => {
  let model = DeviceInfo.getModel();
  const isiPhone7or8_ =
    model === 'iPhone 7' ||
    model === 'iPhone 7 Plus' ||
    model === 'iPhone 8' ||
    model === 'iPhone 8 Plus';

  if (isiPhone7or8_) {
    global.isiPhone7or8 = true;
  } else {
    global.isiPhone7or8 = false;
  }
};
