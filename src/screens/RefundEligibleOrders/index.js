import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {getRefundEligibleOrders} from '../../services/ApiCaller';
import DialogBox from '../../components/DialogBox';
import RefundOrderCard from '../../components/RefundOrderCard';
import {useDispatch} from 'react-redux';
import {setEligibleRefundOrders} from '../../redux/actions/general';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {STATUSES} from '../../constants/Api';
import {pageLimits} from '../../constants/Common';
import {useIsFocused} from '@react-navigation/native';

const RefundEligibleOrders = ({navigation}) => {
  const [refundAbleOrders, setRefundableOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const hasMoreRef = useRef(true);

  const dispatch = useDispatch();
  const isFocued = useIsFocused();

  useEffect(() => {
    setIsLoading(true);
    getRefundableOrders().then(() => {});
  }, [pageNumber]);

  useEffect(() => {
    if (isFocued) {
      if(pageNumber === 1){
        setIsLoading(true);
        getRefundableOrders().then(() => {});
      }
      else {
        setPageNumber(1);
      }
    }
  }, [isFocued]);

  // useEffect(() => {
  //   dispatch(setEligibleRefundOrders({orders: refundAbleOrders, length: refundAbleOrders?.length ?? 0}));
  // }, [refundAbleOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPageNumber(1);
    setIsLoading(false);
    await getRefundableOrders();
  };

  const getRefundableOrders = async () => {
    const {response = {}} = await getRefundEligibleOrders({
      limit: pageLimits.MEDIUM,
      page: pageNumber,
    });
    const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(false);
    setRefreshing(false);
    if (ok && status === STATUSES.OK) {
      const {
        data: {response: orders = []},
      } = response ?? {};

      if (pageNumber === 1) {
        hasMoreRef.current = true;
        setRefundableOrder(orders);
      } else {
        setRefundableOrder(prevState => [...prevState, ...orders]);
      }
      if (orders.length < pageLimits.MEDIUM) {
        hasMoreRef.current = false;
      }
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiError();
    }
  };
  // const getRefundableOrders = async () => {
  //   setIsLoading(true);
  //   const {response = {}} = (await getRefundEligibleOrders()) ?? {};
  //   const {ok = false, status = 0, isNetworkError} = response ?? {};
  //   setIsLoading(false);
  //   if (ok && status === STATUSES.OK) {
  //     const {
  //       data: {response: orders = []},
  //     } = response ?? {};
  //     setRefundableOrder(orders);
  //     dispatch(setEligibleRefundOrders({orders, length: orders?.length ?? 0}));
  //   } else if (!isNetworkError) {
  //     //handle api errors
  //     handleApiError();
  //   }
  // };

  const handleApiError = () => {
    return setIsApiErrorDialogVisible(true);
  };
  //
  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   await getRefundableOrders();
  //   setRefreshing(false);
  // };

  const increasePageNumber = () => {
    if (!isLoading && hasMoreRef.current) {
      setPageNumber(prevState => prevState + 1);
    }
  };

  const goToDetailScreen = item => {
    navigation.navigate('RefundItemSelection', {item});
  };

  const navigateToHistory = () => {
    navigation.navigate('ReturnHistory');
  };

  const renderOrders = ({item}) => {
    return <RefundOrderCard item={item} onItemPress={goToDetailScreen} />;
  };

  const renderHeaderComponent = () => {
    return (
      <View style={styles.orderListTopHeader} onPress={navigateToHistory}>
        <View style={styles.orderListHeaderWrapper}>
          <Text allowFontScaling={false} style={styles.headingText}>{APP_CONSTANTS.ELIGIBLE_FOR_REFUND}</Text>
        </View>
      </View>
    );
  };
  const renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyParentView}>
        <ImageComponent source={IMAGES.PLACE_HOLDER_IMAGE} style={styles.emptyListPlaceholderImage} />
        <Text allowFontScaling={false} style={styles.emptyListDescriptionText}>No orders to refund</Text>
      </View>
    );
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
  const renderList = () => (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      data={refundAbleOrders}
      contentContainerStyle={{paddingBottom: 30, flexGrow: 1}}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderListFooterComponent}
      ListEmptyComponent={!isLoading && renderListEmptyComponent}
      showsVerticalScrollIndicator={false}
      renderItem={renderOrders}
      onEndReached={increasePageNumber}
      onEndReachedThreshold={0.5}
      windowSize={9}
      maxToRenderPerBatch={15}
      initialNumToRender={15}
    />
  );

  const renderDialog = () => (
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
  );

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.REFUND_REQUEST}
      withBackButton
      containerStyle={{flex: 1}}
      isLoading={isLoading && !refreshing && pageNumber === 1}
      isScrollView={false}>
      {renderList()}
      {renderDialog()}
    </ScreenWrapperComponent>
  );
};

export default RefundEligibleOrders;
