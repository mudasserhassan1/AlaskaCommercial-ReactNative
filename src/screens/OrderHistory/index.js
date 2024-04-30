import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {COLORS, IMAGES} from '../../theme';
import {Button} from '../../components';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {pageLimits} from '../../constants/Common';
import OrderHistoryCard from '../../components/OrderHistoryCard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getOrderHistory} from '../../services/ApiCaller';
import DialogBox from '../../components/DialogBox';
import {
  isUserOnSameStoreWhileReordering,
  updateZipCodeAndStoreForReorder,
} from '../../utils/reorderUtils';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import * as Qualtrics from '../../components/QualtricsComponent';
import {evaluateProject} from '../../components/QualtricsComponent';
import useIsGuest from '../../hooks/useIsGuest';
import {STATUSES} from '../../constants/Api';

const OrderHistory = ({navigation}) => {
  const isGuest = useIsGuest();
  const useLoginInfoSelector = () =>
    useMemo(() => state => state.general?.loginInfo ?? {}, []);
  const loginInfo = useSelector(useLoginInfoSelector());
  // const {loginInfo} = useSelector(({general: {loginInfo = {}} = {}}) => ({loginInfo}), shallowEqual);

  const {userInfo = {}} = loginInfo ?? {};
  const hasMoreRef = useRef(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState([]);
  const [visibleZipCodeConfirmationDialog, setVisibleZipCodeConfirmationDialog] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  const dispatch = useDispatch();

  const closeLoading = () => setIsLoading(false);
  const startLoading = () => setIsLoading(true);
  const openDialog = () => setVisibleZipCodeConfirmationDialog(true);
  const closeDialog = () => setVisibleZipCodeConfirmationDialog(false);

  const isFocused = useIsFocused() && !isLoading;
  const timerRef = useRef();

  useEffect(() => {
    if (isFocused) {
      timerRef.current = setTimeout(() => {
        evaluateProject();
      }, 2000);
    }

    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isGuest) {
        setIsLoading(true);
        getHistory().then(() => {});
      }
    }, [isGuest, pageNumber]),
  );

  useEffect(() => {
    Qualtrics.setString('ordersCompleted', 20);
  }, []);

  const getHistory = async () => {
    const {response = {}} = await getOrderHistory({
      limit: pageLimits.MEDIUM,
      page: pageNumber,
    });
    const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(false);
    setRefreshing(false);
    if (ok && status === STATUSES.OK) {
      const {
        data: {response: orderHistoryListing = []},
      } = response ?? {};

      if (pageNumber === 1) {
        hasMoreRef.current = true;
        setOrderHistoryData(orderHistoryListing);
      } else {
        setOrderHistoryData(prevState => [...prevState, ...orderHistoryListing]);
      }
      if (orderHistoryListing.length < pageLimits.MEDIUM) {
        hasMoreRef.current = false;
      }
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiErrors();
    }
  };

  const handleApiErrors = () => {
    return setIsApiErrorDialogVisible(true);
  };

  const goToDetailScreen = item => navigation.navigate('OrderHistoryDetail', {item: item});

  const goToCart = useCallback(() => navigation.navigate('Cart'), []);

  const onReOrderPress = async item => {
    setSelectedOrder(item);
    await isUserOnSameStoreWhileReordering(
      item,
      userInfo,
      dispatch,
      startLoading,
      closeLoading,
      goToCart,
      openDialog,
    ).catch(e => {
      const {isNetworkError} = e ?? {};
      if (!isNetworkError) {
        handleApiErrors();
      }
    });
  };

  const updateUserZipCodeAndStore = async () => {
    closeDialog();
    await updateZipCodeAndStoreForReorder(
      selectedOrder,
      loginInfo,
      dispatch,
      goToCart,
      closeLoading,
      startLoading,
    ).catch(e => {
      closeLoading();
      const {isNetworkError} = e ?? {};
      if (!isNetworkError) {
        handleApiErrors();
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPageNumber(1);
    getHistory();
  };

  const increasePageNumber = () => {
    if (!isLoading && hasMoreRef.current) {
      setPageNumber(prevState => prevState + 1);
    }
  };

  const renderListFooterComponent = () => {
    if (isLoading && pageNumber > 1) {
      return (
        <View style={styles.listFooterView}>
          <ActivityIndicator color={COLORS.MAIN} size="small" style={styles.loader} />
        </View>
      );
    }
    return <View />;
  };

  const renderOrderHistoryList = () => (
    <View style={styles.listContainer}>
      <FlatList
        data={orderHistoryData}
        refreshing={refreshing}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderListEmptyComponent}
        renderItem={renderItem}
        onRefresh={onRefresh}
        onEndReached={increasePageNumber}
        onEndReachedThreshold={0.5}
        windowSize={9}
        maxToRenderPerBatch={15}
        initialNumToRender={15}
        ListFooterComponent={renderListFooterComponent}
      />

      <DialogBox
        visible={visibleZipCodeConfirmationDialog}
        closeModal={() => setVisibleZipCodeConfirmationDialog(false)}
        title={APP_CONSTANTS.NEW_LOCATION}
        messageContainerStyles={styles.dialogBoxMessage}
        message={APP_CONSTANTS.ORDER_HISTORY_DIALOG_MESSAGE}
        confirmButtonLabel={APP_CONSTANTS.CONFIRM}
        cancelButtonLabel={APP_CONSTANTS.DECLINE}
        onConfirmPress={updateUserZipCodeAndStore}
        onCancelPress={closeDialog}
      />
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={() => setIsApiErrorDialogVisible(false)}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={() => setIsApiErrorDialogVisible(false)}
        onCancelPress={() => setIsApiErrorDialogVisible(false)}
      />
    </View>
  );

  const renderListEmptyComponent = () => {
    if (!isLoading) {
      return (
        <View style={styles.listEmptyComponent}>
          <ImageComponent source={IMAGES.PLACE_HOLDER_IMAGE} style={styles.placeHolderImage} />
          <Text allowFontScaling={false} style={styles.placeHolderText}>No orders yet</Text>
        </View>
      );
    }
    return null;
  };
  const renderItem = ({item}) => (
    <OrderHistoryCard
      item={item}
      onReOrderPress={() => onReOrderPress(item)}
      onItemPress={order => goToDetailScreen(order)}
    />
  );

  const createAccount = () => {
    navigation.navigate('AuthStackForGuest', {
      screen: 'Login',
      initial: true,
      params: {showHeader: true},
    });
  };
  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.ORDER_HISTORY}
      showCartButton
      isScrollView={false}
      containerStyle={{height: '100%'}}
      hasSpinner={pageNumber === 1}
      isLoading={isLoading && !refreshing && pageNumber === 1}>
      {isGuest ? (
        <View style={styles.parent}>
          <Text allowFontScaling={false} style={styles.guestRestrictionText}>{APP_CONSTANTS.GUEST_FEATURE_RESTRICTION_MESSAGE}</Text>
          <View style={styles.buttonWrapper}>
            <Button
              label={APP_CONSTANTS.SIGN_IN_CREATE_ACCOUNT}
              color={COLORS.WHITE}
              width={'100%'}
              onPress={createAccount}
            />
          </View>
        </View>
      ) : (
        renderOrderHistoryList()
      )}
    </ScreenWrapperComponent>
  );
};

export default OrderHistory;
