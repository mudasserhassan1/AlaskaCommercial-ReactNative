import Config from 'react-native-config';

export const generateUserToken = user => {
  const id = user._id.toString();
  if (user.isGuest) {
    return `GUEST-ALG${id.slice(4)}${Config.ENV.toUpperCase()}${id.slice(
      0,
      4,
    )}`;
  }
  return `ALG${id.slice(4)}${Config.ENV.toUpperCase()}${id.slice(0, 4)}`;
};
