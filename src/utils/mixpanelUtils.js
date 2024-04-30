import {Mixpanel} from 'mixpanel-react-native';
import {BILLING_KEYS} from '../constants/Common';
import {navigationRef} from './navigationUtils';
import {roundedOffAmount} from './calculationUtils';
import {camelToSnakeCase, stringToTitleCase} from './transformUtils';
import Config from 'react-native-config';
import VersionCheck from 'react-native-version-check';
import {
  MIX_PANEL_EVENTS,
  MIX_PANEL_PAYMENTS,
  MIX_PANEL_PROPS,
} from '../constants/Mixpanel';

const getCartItemsInfo = (cart = []) => {
  const initialState = {
    [MIX_PANEL_PROPS.CART_ITEM_DEPARTMENTS]: [],
    [MIX_PANEL_PROPS.CART_ITEM_SUB_DEPARTMENTS]: [],
    [MIX_PANEL_PROPS.CART_ITEM_NAMES]: [],
    [MIX_PANEL_PROPS.CART_ITEM_UPCS]: [],
    [MIX_PANEL_PROPS.CART_DETAILS_ALL]: [],
  };
  return cart?.reduce((previousValue, product) => {
    let {
      E_COMM_DESCRIPTION_AND_SIZE: productName = '',
      PRIMARY_UPC: primaryUpc = '',
      DEPT_ID: departmentId = '',
      CLASS_ID: subDepartmentId = '',
    } = product?.itemObj?.item?.[0] ?? {};
    previousValue[MIX_PANEL_PROPS.CART_ITEM_DEPARTMENTS].push(departmentId);
    previousValue[MIX_PANEL_PROPS.CART_ITEM_SUB_DEPARTMENTS].push(
      subDepartmentId,
    );
    previousValue[MIX_PANEL_PROPS.CART_ITEM_NAMES].push(productName);
    previousValue[MIX_PANEL_PROPS.CART_DETAILS_ALL].push(productName);
    previousValue[MIX_PANEL_PROPS.CART_ITEM_UPCS].push(primaryUpc);
    return previousValue;
  }, initialState);
};

const version = VersionCheck.getCurrentVersion();
const NA = 'N/A';
let mixpanel;
export const init = ({userId} = {}) => {
  mixpanel = new Mixpanel(Config.MIX_PANEL_KEY, true);
  mixpanel.init();
  if (userId) {
    mixpanel.identity(userId);
  }
  trackVisit();
};

const setMixPanelProfile = ({user} = {}) => {
  const {
    _id,
    isGuest,
    PhoneNumber,
    Email,
    ZipCode,
    StoreLocation,
    StoreNumber,
    Store,
    FullName,
    isLowBandwidth,
    GlobalSubstitution,
    isSMSOptIn,
    isEmailOptIn,
    token,
  } = user || {};
  mixpanel.identify(_id);
  Email && mixpanel.alias(Email, _id);
  mixpanel.registerSuperProperties({
    [MIX_PANEL_PROPS.IS_GUEST]: isGuest || false,
  });
  mixpanel.getPeople().set({
    $email: Email || NA,
    $name: FullName || (isGuest && 'Guest') || NA,
    [MIX_PANEL_PROPS.STORE]: Store || '',
    [MIX_PANEL_PROPS.STORE_NUMBER]: StoreNumber || NA,
    [MIX_PANEL_PROPS.PHONE_NUMBER]: PhoneNumber || NA,
    [MIX_PANEL_PROPS.ZIP_CODE]: ZipCode || NA,
    [MIX_PANEL_PROPS.LOW_BANDWIDTH]: isLowBandwidth,
    [MIX_PANEL_PROPS.VILLAGE]: StoreLocation || NA,
    [MIX_PANEL_PROPS.IS_GUEST]: isGuest || false,
    [MIX_PANEL_PROPS.SMS_MARKETING]: isSMSOptIn ? 'Y' : 'N',
    [MIX_PANEL_PROPS.EMAIL_MARKETING]: isEmailOptIn ? 'Y' : 'N',
    [MIX_PANEL_PROPS.ALLOW_SUBSTITUTION]: GlobalSubstitution ? 'Y' : 'N',
    [MIX_PANEL_PROPS.USER_TOKEN]: token,
  });
};

const trackSignUp = user => {
  const {ZipCode, StoreLocation, Store, isLowBandwidth} = user || {};
  trackEvent({
    name: MIX_PANEL_EVENTS.COMPLETE_REGISTRATION,
    params: {
      [MIX_PANEL_PROPS.STORE]: Store || NA,
      [MIX_PANEL_PROPS.ZIP_CODE]: ZipCode || NA,
      [MIX_PANEL_PROPS.LOW_BANDWIDTH]: !!isLowBandwidth,
      [MIX_PANEL_PROPS.VILLAGE]: StoreLocation || NA,
    },
  });
  mixpanel.getPeople().setOnce({
    [MIX_PANEL_PROPS.OF_SEARCHES]: 0,
    [MIX_PANEL_PROPS.LIFETIME_VALUE]: 0,
    [MIX_PANEL_PROPS.REGISTRATION_DATE]: new Date(),
  });
};

const trackScreen = ({variant = 'A', screen} = {}) => {
  if (screen) {
    screen = stringToTitleCase(screen);
    mixpanel?.registerSuperProperties({
      [MIX_PANEL_PROPS.PAGE_NAME]: screen || NA,
      [MIX_PANEL_PROPS.PAGE_VARIANT]: variant || NA,
      [MIX_PANEL_PROPS.PLATFORM]: MIX_PANEL_PROPS.MOBILE,
      [MIX_PANEL_PROPS.APP_VERSION]: version || NA,
    });
  }
};

const trackSignIn = user => {
  // logout();
  trackEvent({
    name: MIX_PANEL_EVENTS.LOGIN,
    params: {[MIX_PANEL_PROPS.LOGIN_METHOD]: 'E-mail'},
  });
};

const trackIpAddress = address => {
  mixpanel.registerSuperProperties({
    [MIX_PANEL_PROPS.IP_ADDRESS]: address || NA,
  });
};

const logout = () => {
  mixpanel.reset();
};

const trackEvent = ({name, params}) => {
  mixpanel.track(name, params);
};

const trackSearch = ({term, results}) => {
  if (term) {
    mixpanel.track(MIX_PANEL_EVENTS.SEARCH, {
      [MIX_PANEL_PROPS.SEARCH_TERM]: term,
      [MIX_PANEL_PROPS.SEARCH_CHARACTER_LENGTH]: term?.length,
      [MIX_PANEL_PROPS.OF_RESULTS_RETURNED]: results?.length,
    });
    mixpanel.getPeople().increment(MIX_PANEL_PROPS.OF_SEARCHES, 1);
  }
};

const trackPurchase = ({
  cart,
  invoice,
  deliveryType,
  address,
  payments,
} = {}) => {
  const {city, storeName, zipCode} = address || {};
  invoice = camelToSnakeCase({...invoice});
  payments = Object.keys(payments).map(
    type => MIX_PANEL_PAYMENTS[type] || type,
  );
  const cartInfo = getCartItemsInfo(cart);
  trackEvent({
    name: MIX_PANEL_EVENTS.COMPLETE_PURCHASE,
    params: {
      [MIX_PANEL_PROPS.CART_SIZE]: cart?.length,
      [MIX_PANEL_PROPS.ZIP_CODE]: zipCode || NA,
      [MIX_PANEL_PROPS.STORE]: storeName || NA,
      [MIX_PANEL_PROPS.VILLAGE]: city || NA,
      [MIX_PANEL_PROPS.DELIVERY_METHOD]: deliveryType?.split(' ')[0] || NA,
      [MIX_PANEL_PROPS.CART_VALUE]: roundedOffAmount(
        invoice?.[BILLING_KEYS.SUBTOTAL] || 0,
      ),
      [MIX_PANEL_PROPS.TAX_AMOUNT]: roundedOffAmount(
        invoice?.[BILLING_KEYS.TAX],
      ),
      [MIX_PANEL_PROPS.TOTAL_AMOUNT]: roundedOffAmount(
        invoice?.[BILLING_KEYS.TOTAL_AMOUNT] || 0,
      ),
      [MIX_PANEL_PROPS.DELIVERY_AMOUNT]: roundedOffAmount(
        invoice?.[BILLING_KEYS.FREIGHT_CHARGE] || 0,
      ),
      [MIX_PANEL_PROPS.PAYMENT_TYPE]: payments,
      ...cartInfo,
    },
  });
  mixpanel
    .getPeople()
    .increment(
      MIX_PANEL_PROPS.LIFETIME_VALUE,
      roundedOffAmount(invoice?.[BILLING_KEYS.TOTAL_AMOUNT] || 0),
    );
};

const trackProduct = (
  name,
  {
    uom,
    upc,
    sku,
    cost,
    quantity,
    costType,
    entryPoint,
    productName,
    departmentName,
    subDepartmentName,
    isRandomWeightItem,
    ...rest
  } = {},
) => {
  mixpanel.track(name, {
    [MIX_PANEL_PROPS.SKU]: sku || NA,
    [MIX_PANEL_PROPS.ENTRY_POINT]: entryPoint || NA,
    [MIX_PANEL_PROPS.ITEM_NAME]: productName || NA,
    [MIX_PANEL_PROPS.ITEM_DEPARTMENT]: departmentName || NA,
    [MIX_PANEL_PROPS.ITEM_SUB_DEPARTMENT]: subDepartmentName || NA,
    [MIX_PANEL_PROPS.ITEM_COST]: cost || 0,
    [MIX_PANEL_PROPS.RW]: !!isRandomWeightItem,
    [MIX_PANEL_PROPS.UOM]: uom?.toUpperCase(),
    [MIX_PANEL_PROPS.ITEMS_YOU_MIGHT_LIKE]: NA,
    [MIX_PANEL_PROPS.SALE_ITEM]: costType,
    [MIX_PANEL_PROPS.UPC]: upc || NA,
    [MIX_PANEL_PROPS.ITEM_QUANTITY]: quantity || NA,
    ...rest,
  });
};

const trackViewCheckout = ({cart, deliveryType, invoice}) => {
  const cartInfo = getCartItemsInfo(cart);
  trackEvent({
    name: MIX_PANEL_EVENTS.VIEW_CHECKOUT_PAGE,
    params: {
      [MIX_PANEL_PROPS.CART_SIZE]: cart?.length,
      [MIX_PANEL_PROPS.DELIVERY_METHOD]: deliveryType?.split(' ')[0] || NA,
      [MIX_PANEL_PROPS.CART_VALUE]: roundedOffAmount(
        invoice?.[BILLING_KEYS.SUBTOTAL],
      ),
      [MIX_PANEL_PROPS.ESTIMATED_TOTAL_AMOUNT]: roundedOffAmount(
        invoice?.[BILLING_KEYS.TOTAL_AMOUNT],
      ),
      ...cartInfo,
    },
  });
};

const trackHeroBanner = ({
  promotionalName,
  slot,
  location,
  promotionalId,
  promotionalImage,
  promotionalLink,
}) =>
  trackEvent({
    name: MIX_PANEL_EVENTS.HERO_BANNER,
    params: {
      [MIX_PANEL_PROPS.SLOT]: slot,
      [MIX_PANEL_PROPS.LOCATION]: location,
      [MIX_PANEL_PROPS.PROMOTIONAL_ID]: promotionalId,
      [MIX_PANEL_PROPS.PROMOTIONAL_NAME]: promotionalName,
      [MIX_PANEL_PROPS.PROMOTIONAL_IMAGE]: promotionalImage,
      [MIX_PANEL_PROPS.PROMOTIONAL_LINK]: promotionalLink,
    },
  });

const trackPromoBar = ({
  slot,
  location,
  promotionalId,
  promotionalText,
  promotionalLink,
}) =>
  trackEvent({
    name: MIX_PANEL_EVENTS.HERO_BANNER,
    params: {
      [MIX_PANEL_PROPS.SLOT]: slot,
      [MIX_PANEL_PROPS.LOCATION]: location,
      [MIX_PANEL_PROPS.PROMOTIONAL_ID]: promotionalId,
      [MIX_PANEL_PROPS.PROMOTIONAL_TEXT]: promotionalText,
      [MIX_PANEL_PROPS.PROMOTIONAL_LINK]: promotionalLink,
    },
  });

const registerAppInfo = () => {
  const {name: currentScreen = ''} =
    navigationRef?.current?.getCurrentRoute?.() || {};
  const screen = currentScreen?.replace('Screen', '');
  trackScreen({screen});
  mixpanel.registerSuperProperties({
    [MIX_PANEL_PROPS.PLATFORM]: MIX_PANEL_PROPS.MOBILE,
    [MIX_PANEL_PROPS.APP_VERSION]: VersionCheck.getCurrentVersion() || NA,
  });
  return screen;
};

const trackVisit = () => {
  const screen = registerAppInfo();
  trackEvent({
    name: MIX_PANEL_EVENTS.VISIT,
    params: {
      [MIX_PANEL_PROPS.PAGE_NAME]: screen,
      [MIX_PANEL_PROPS.PAGE_VARIANT]: 'A',
    },
  });
};

export const MixPanelInstance = {
  init,
  logout,
  trackEvent,
  trackScreen,
  trackSignIn,
  trackSearch,
  trackSignUp,
  trackProduct,
  trackPurchase,
  trackIpAddress,
  trackViewCheckout,
  setMixPanelProfile,
  trackHeroBanner,
  trackPromoBar,
};
