import {APP_CONSTANTS} from '../constants/Strings';
import {bushDeliveryOrderTypes, curbsideOrderTypes} from '../constants/Common';
import {changeSelectedSegment, setDeliverySegments, setDeliveryType} from '../redux/actions/general';

export const getCompleteAddress = (params = {}, orderType, airCarrier,screen) => {
  const {
    firstName = '',
    lastName = '',
    Address: addressLine = '',
    destinationVillage = '',
    Suite = '',
    city = '',
    state = '',
    zipCode = '',
    storeAddress = '',
    storeName = '',
  } = params ?? {};
  let address = '';

  if (firstName) {
    address = `${address}${firstName} `;
  }
  if (lastName) {
    address = `${address}${lastName}\n`;
  }
  if (storeName) {
    address = `${address}${storeName}\n`;
  }
  if (addressLine && Suite) {
    address = `${address}${addressLine}, `;
  }
  if (addressLine && !Suite) {
    address = `${address}${addressLine}\n`;
  }
  if (storeAddress) {
    address = `${address}${storeAddress}\n`;
  }
  if (orderType === APP_CONSTANTS.BUSH_DELIVERY && destinationVillage) {
    address = `${address}${destinationVillage} Airport, `;
  }
  if (orderType !== APP_CONSTANTS.BUSH_DELIVERY && destinationVillage) {
    address = `${address}${destinationVillage} Airport\n`;
  }
  if (Suite) {
    address = `${address}Apt# ${Suite}\n`;
  }
  if (city) {
    address = `${address}${city}, `;
  }
  if (orderType !== APP_CONSTANTS.BUSH_DELIVERY && state) {
    address = `${address}${state} `;
  }
  if (zipCode) {
    address = `${address}${zipCode}`;
  }
  if (
      screen === 'orderHistoryDetail' &&
      orderType === APP_CONSTANTS.BUSH_DELIVERY
  ) {
    address = `${address} ${airCarrier && ','} ${airCarrier}`;
  }
  if (
      screen !== 'orderHistoryDetail' &&
      orderType === APP_CONSTANTS.BUSH_DELIVERY
  ) {
    address = `${address}`;
  }
  return address;
};

export const getCompleteDestinationVillage = (address, zipcodeDetails) => {
  let {destinationVillage = '', zipCode = ''} = address ?? {};
  const {defaultAirCarrier} = zipcodeDetails || {};
  let destinationAddress = '';

  if (destinationVillage) {
    destinationAddress = `${destinationAddress}${destinationVillage} Airport, `;
  }
  if (zipCode) {
    // destinationAddress = `${destinationAddress}${zipCode}, ${defaultAirCarrier}`;
    destinationAddress = `${destinationAddress}${zipCode}`;
  }

  return destinationAddress;
};

export const getOrderType = (dispatch, selectedOrderType, previousSegments = []) => {
  let deliveryTypes = bushDeliveryOrderTypes;
  if (selectedOrderType === APP_CONSTANTS.CURBSIDE_OR_HOME_DELIVERY) {
    deliveryTypes = curbsideOrderTypes;
  } else if (selectedOrderType === 'Curbside Pickup Only') {
    deliveryTypes = [curbsideOrderTypes[0]];
  }
  if (JSON.stringify(previousSegments) !== JSON.stringify(deliveryTypes)) {
    dispatch(setDeliverySegments(deliveryTypes));
    dispatch(changeSelectedSegment(0));
    dispatch(setDeliveryType(deliveryTypes[0]));
  }
};
