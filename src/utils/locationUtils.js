import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {logToConsole} from '../configs/ReactotronConfig';
import {PermissionsAndroid, Platform} from 'react-native';

let permissionsResponse;

export const getCurrentLocation = () => {
  let location;
  Geolocation.getCurrentPosition(
    position => {
      Geocoder.from(position.coords.latitude, position.coords.longitude)
        .then(json => {
          location = json;
          let results = json.results;
          // logToConsole({json, position});
          for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < results[i].address_components.length; j++) {
              for (let k = 0; k < results[i].address_components[j].types.length; k++) {
                if (results[i].address_components[j].types[k] === 'postal_code') {
                  logToConsole({
                    type: results[i].address_components[j].types[k],
                    short_name: results[i].address_components[j].short_name,
                  });
                }
              }
            }
          }
        })
        .catch(error => logToConsole({error}));
    },

    error => {
      // See error code charts below.
      logToConsole({code: error.code});
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
  return location;
};

export const getLocationPermissions = async () => {
  if (Platform.OS === 'ios') {
    await getIosPermissions();
  } else {
    await getAndroidPermission();
  }
  return permissionsResponse;
};

const getIosPermissions = async () => {
  await Geolocation.requestAuthorization('always')
    .then(resp => {
      permissionsResponse = resp;
    })
    .catch(error => {
      logToConsole('requestAuthorization Error: ', error);
      permissionsResponse = error;
    });
};

const getAndroidPermission = async () => {
  try {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Device current location permission',
      message: 'Allow app to get your current location',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }).then(response => {
      permissionsResponse = response;
    });
  } catch (err) {
    logToConsole(err);
    permissionsResponse = err;
  }
};

