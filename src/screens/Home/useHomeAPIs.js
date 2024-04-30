import {
  getDepartments,
  getDepartmentsProducts,
  getNotificationsListing,
  getOnSaleProducts,
  getPopularItems,
  getPromos,
} from '../../services/ApiCaller';
import {pageLimits} from '../../constants/Common';
import {STATUSES} from '../../constants/Api';
import {
  setFirstVisit,
  setHomeDepartments,
  setHomePromos,
  setHomeSaleItems,
  setPopularItemsInYourArea,
} from '../../redux/actions/config';
import {itemRWQuantityHandler} from '../../utils/productUtils';
import allSettled from 'promise.allsettled';
import {updateNotificationBadge} from '../../utils/notificationsUtils';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';

const useHomeAPIs = ({StoreNumber, userId, isGuest}) => {
  const dispatch = useDispatch();

  const onDisplayBadge = count => {
    updateNotificationBadge(count);
  };

  const getNewNotifications = async () => {
    if (!isGuest) {
      getNotificationsListing({page: 1, limit: pageLimits.SMALL}).then(res => {
        const {newNotifications = []} = res?.response?.data || {};
        onDisplayBadge(newNotifications.length ?? 0);
      });
    }
  };
  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

  const unitInCart = useCallback(
    item => {
      const itemExists = cartItems?.find(obj => obj?.item === item?.SKU);
      if (itemExists && item) {
        item.CUSTOMER_UNIT_OF_MEASURE_SELECTION =
          itemExists.customerUnitOfMeasureSelection;
      }
      return item;
    },
    [cartItems],
  );

  const getPromoBarContent = async () => {
    const {response = {}} = await getPromos({storeNumber: StoreNumber});
    const {ok = false, status = 0} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: promoResponse = []} = {}} = response ?? {};
      const filteredPromoArrays = promoResponse.filter(
        (item, _) => item?.message?.length,
      );
      dispatch(setHomePromos(filteredPromoArrays));
    }
  };

  const getSaleItems = async () => {
    const {response = {}} = await getOnSaleProducts({
      store: StoreNumber,
      userId,
    });
    const {ok = false, status = 0} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: saleItems = []} = {}} = response ?? {};
      let modifiedSaleItems = [];
      for (const result of saleItems) {
        let modifiedItem = await itemRWQuantityHandler(result);
        modifiedItem = unitInCart(modifiedItem);
        modifiedSaleItems.push(modifiedItem);
      }
      dispatch(setHomeSaleItems(modifiedSaleItems));
    }
  };

  const fetchDepartments = async () => {
    const {data: response = {}, status = 0} = await getDepartments({
      limit: pageLimits.SMALL,
      page: 1,
    });
    if (status === STATUSES.OK) {
      const {data = []} = response || {};
      dispatch(setHomeDepartments(data));
    }
  };
  const getPopularItemsInYourArea = async () => {
    const {response = {}} = await getPopularItems({store: StoreNumber});
    const {ok = false, status = 0} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: popularItemsInYourArea = []} = {}} =
        response ?? {};
      let modifiedSaleItems = [];
      for (const result of popularItemsInYourArea) {
        let modifiedItem = await itemRWQuantityHandler(result);
        modifiedItem = unitInCart(modifiedItem);
        modifiedSaleItems.push(modifiedItem);
      }
      dispatch(setPopularItemsInYourArea(modifiedSaleItems));
    }
  };

  const onFetchHomeData = async () => {
    await allSettled([
      getPromoBarContent(),
      getSaleItems(),
      fetchDepartments(),
      // getItemsFromCart(dispatch),
      getNewNotifications(),
      getPopularItemsInYourArea(),
    ]);
    dispatch(setFirstVisit(false));
  };

  return {
    onFetchHomeData,
    onDisplayBadge,
  };
};

export default useHomeAPIs;
