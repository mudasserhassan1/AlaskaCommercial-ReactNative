import {APP_CONSTANTS} from '../../constants/Strings';

export const MODAL_KEYS = {
  STORE: 'STORE',
  EXTERNAL_EMAIL: 'EXTERNAL_EMAIL',
  SHARE: 'SHARE',
};

export const MODAL_TITLES = {
  [MODAL_KEYS.STORE]: APP_CONSTANTS.SHARE_ITEMS_WITH_STORE,
  [MODAL_KEYS.EXTERNAL_EMAIL]: APP_CONSTANTS.SHARE_ITEMS_WITH_EXTERNAL_EMAIL,
  [MODAL_KEYS.SHARE]: APP_CONSTANTS.SHARE_ITEMS,
};