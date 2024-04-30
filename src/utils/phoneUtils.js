import {Alert, Linking, Platform} from 'react-native';

export const callNumber = phone => {
  let phoneNumber = formatNumberForBackend(phone);
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phoneNumber}`;
  } else {
    phoneNumber = `tel:${phoneNumber}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};

export const formatPhoneNumber = phoneNumberString => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
};

export const formatNumberForBackend = number => {
  let phoneNumber = '';
  if (String(number)?.charAt(0) === '(') {
    phoneNumber = number?.replace(/[^\d]/g, '');
    return `+1${phoneNumber}`;
  }
  return number;
};

