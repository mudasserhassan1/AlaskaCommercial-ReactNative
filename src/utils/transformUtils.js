import {
  camelCase,
  mapKeys,
  upperCase,
  cloneDeep,
  debounce,
  startCase,
} from 'lodash';
import {uses24HourClock} from 'react-native-localize';

export const snakeToCamelCase = obj => {
  return mapKeys(obj, (_, key) => camelCase(key));
};

export const camelToSnakeCase = obj => {
  return mapKeys(obj, (_, key) => upperCase(key).replace(/ /g, '_'));
};

export const stringToLowerCase = (string = '') =>
  string
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));

export const stringToTitleCase = (str = '') => {
  return startCase(str?.split('(')[0].trim()?.toLowerCase());
};

export const getDeviceTimeFormat = () => uses24HourClock();

export const lodashCloneDeep = obj => cloneDeep(obj);

export const lodashDebounce = (func = () => {}, delay = 1000, options = {}) =>
  debounce(func, delay, options);
