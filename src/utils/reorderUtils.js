import {updateUser} from '../services/ApiCaller';
import {saveLoginInfo} from '../redux/actions/general';
import {addMultipleItemsToCart} from './cartUtils';
import {STATUSES} from '../constants/Api';

export const isUserOnSameStoreWhileReordering = async (
  order,
  userInfo,
  dispatch,
  startLoading,
  closeLoading,
  goToCart,
  openDialog,
) => {
  const {zipCodeDetail = {}, orderItems = []} = order ?? {};
  const {HOME_STORE_NUMBER: storeNum = '', CITY: storeLocation = ''} = zipCodeDetail ?? {};
  const {StoreLocation = '', StoreNumber = ''} = userInfo ?? {};
  if (String(storeNum) === String(StoreNumber) && String(storeLocation) === String(StoreLocation)) {
    typeof startLoading === 'function' && startLoading();
    addMultipleItemsToCart(orderItems, dispatch, false, true)
      .then(() => {
        typeof closeLoading === 'function' && closeLoading();
        typeof goToCart === 'function' && goToCart();
      })
      .catch(e => {
        typeof closeLoading === 'function' && closeLoading();
        throw {...(e || {}), message: e?.status};
      });
  } else {
    typeof openDialog === 'function' && openDialog();
  }
};

export const updateZipCodeAndStoreForReorder = async (
  order,
  loginInfo,
  dispatch,
  goToCart,
  closeLoading,
  startLoading,
) => {
  const {orderItems = [], zipCodeDetail = {}} = order ?? {};
  const {
    CUSTOMER_ZIP_CODE: zipCode = '',
    HOME_STORE_NUMBER: storeNum = '',
    HOME_STORE_NAME: storeName = '',
    ORDER_TYPE: orderType = '',
    CITY: storeLocation = '',
  } = zipCodeDetail;
  const info = {
    ZipCode: zipCode,
    Store: storeName,
    StoreNumber: storeNum,
    StoreLocation: storeLocation,
    OrderType: orderType,
  };
  setTimeout(async () => {
    typeof startLoading === 'function' && startLoading();
    const {response = {}} = await updateUser(info);
    const {ok = false, status = 0, isNetworkError} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {
        data: {user: User = {}},
      } = response ?? {};
      let updatedInfo = {...loginInfo, userInfo: User};
      dispatch(saveLoginInfo(updatedInfo));
      await addMultipleItemsToCart(orderItems, dispatch, false, true)
        .then(() => {
          typeof closeLoading === 'function' && closeLoading();
          typeof goToCart === 'function' && goToCart();
        })
        .catch(e => {
          typeof closeLoading === 'function' && closeLoading();
          throw e;
        });
    } else {
      typeof closeLoading === 'function' && closeLoading();
      throw {status, message: status, isNetworkError};
    }
  }, 320);
};
