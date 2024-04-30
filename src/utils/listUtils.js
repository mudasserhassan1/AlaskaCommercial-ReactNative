import {createList, deleteList, duplicateList, renameList} from '../services/ApiCaller';
import {addItemsToList, changeList, removeList} from '../redux/actions/general';
import moment from 'moment';
import {getItemPriceQuantity} from './productUtils';
import {isCustomCake} from './cakeUtils';
import {STATUSES} from '../constants/Api';

const createListForUser = async (name, dispatch) => {
  const {response = {}} = (await createList({Name: name})) ?? {};
  const {ok = false, status = '', isNetworkError, isUnderMaintenance} = response ?? {};
  if (ok && status === STATUSES.OK) {
    const {data = {}} = response ?? {};
    const {response: listItem = {}} = data ?? {};
    dispatch(addItemsToList(listItem));
  } else if (!isUnderMaintenance) {
    throw {status, isNetworkError};
  }
};

const renameListForUser = async (name, dispatch, listItems, index) => {
  let tempListItems = listItems;
  let item = tempListItems[index] ?? {};
  const {_id = ''} = item ?? {};
  const params = {
    id: _id,
    Name: name,
  };
  const {response = {}} = (await renameList(params)) ?? {};
  const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
  if (ok && status === STATUSES.OK) {
    item.Name = name;
    tempListItems[index] = item;
    return dispatch(changeList(tempListItems));
  } else if (!isUnderMaintenance) {
    throw {message: status, isNetworkError};
  }
};

const duplicateListForUser = async (list, dispatch, listItems) => {
  let tempListItems = listItems;
  const {_id = ''} = list ?? {};
  const {response = {}} = (await duplicateList({id: _id})) ?? {};
  const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
  if (ok && status === STATUSES.OK) {
    const {
      data: {response: newList},
    } = response ?? {};
    tempListItems.push(newList);
    dispatch(changeList([...tempListItems]));
  } else if (!isUnderMaintenance) {
    throw {message: status, isNetworkError};
  }
};

const deleteListForUser = async (list, dispatch, index) => {
  const {_id = ''} = list ?? {};
  const {response = {}} = (await deleteList(_id)) ?? {};
  const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
  if (ok && status === STATUSES.OK) {
    dispatch(removeList(index));
  } else if (!isUnderMaintenance) {
    throw {message: status, status, isNetworkError};
  }
};

const getListName = () => `My ${moment().format('MMM D, YYYY')} List`;

/**
 * Function that appends Quantity for all Products in array
 * cakeSelections will be appended if item is a custom cake
 * @param products
 * @returns {Promise<[]>}
 */
const mapListItemsForListApi = async products => {
  let newProducts = [];
  for (const item of products) {
    const {cakeSelections = {}} = item;
    const {quantity} = getItemPriceQuantity(item);
    let productObj = {
      ...item,
      Quantity: quantity,
      ...(isCustomCake(item) && {cakeSelections}),
    };
    newProducts = [...newProducts, productObj];
  }
  return newProducts;
};

export {
  createListForUser,
  renameListForUser,
  duplicateListForUser,
  deleteListForUser,
  getListName,
  mapListItemsForListApi,
};
