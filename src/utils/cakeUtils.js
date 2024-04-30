import {CUSTOM_CAKES_TYPES} from '../constants/Common';
import {snakeToCamelCase} from './transformUtils';
import {CAKE_TYPES} from '../constants/Common';

export const getCakeType = item => {
  const {item: innerItem = []} = item ?? {};
  const {FORM_REQUIRED: formRequired = ''} = innerItem[0] || {};
  return formRequired;
};

/**
 * @param item
 * @returns {boolean} for custom cake
 */

export const isCustomCake = item => {
  const cakeType = getCakeType(item);
  return CUSTOM_CAKES_TYPES.includes(cakeType);
};

export const checkIfCakeSelectionsAreComplete = ({cakeSelections, isProductACustomCake, cakeType}) => {
  if (isProductACustomCake) {
    const camelCasedSelections = snakeToCamelCase(cakeSelections);
    const {cakeFlavor, frostingFlavor, filling, decorationType} = camelCasedSelections;
    return (
      !cakeFlavor ||
      !frostingFlavor ||
      (cakeType === CAKE_TYPES.FILLED_SHEET_CAKE && !filling) ||
      (cakeType === CAKE_TYPES.DECORATED_CAKE && !decorationType)
    );
  }
  return false;
};
