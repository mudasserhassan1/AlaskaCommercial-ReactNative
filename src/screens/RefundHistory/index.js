import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {getRefundHistory} from '../../services/ApiCaller';
import RefundOrderCard from '../../components/RefundOrderCard';
import DialogBox from '../../components/DialogBox';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {useFocusEffect} from '@react-navigation/native';
import {STATUSES} from '../../constants/Api';
import {pageLimits} from '../../constants/Common';

const RefundHistory = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refundHistory, setRefundHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const hasMoreRef = useRef(true);

  const goToDetailScreen = item => {
    navigation.navigate('SubmittedRefundDetails', {refundedOrderInfo: item});
  };
  //
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getRefundHistoryListing().then(() => {});
  //   }, []),
  // );

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

  const getRefundHistoryListing = async () => {
    const {response = {}} = await getRefundHistory({
      limit: pageLimits.MEDIUM,
      page: pageNumber,
    });
    const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    setIsLoading(false);
    setRefreshing(false);
    if (ok && status === STATUSES.OK) {
      const {
        data: {response: refundListing = []},
      } = response ?? {};

      if (pageNumber === 1) {
        hasMoreRef.current = true;
        setRefundHistory(refundListing);
      } else {
        setRefundHistory(prevState => [...prevState, ...refundListing]);
      }
      if (refundListing.length < pageLimits.MEDIUM) {
        hasMoreRef.current = false;
      }
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiError();
    }
  };

  const handleApiError = () => {
    return setIsApiErrorDialogVisible(true);
  };

  useEffect(() => {
    setIsLoading(true);
    getRefundHistoryListing().then(() => {});
  }, [pageNumber]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPageNumber(1);
    setIsLoading(false);
    await getRefundHistoryListing();
  };

  const increasePageNumber = () => {
    if (!isLoading && hasMoreRef.current) {
      setPageNumber(prevState => prevState + 1);
    }
  };

  const renderList = () => (
    // <>
    <FlatList
      data={refundHistory}
      refreshing={refreshing}
      style={styles.listStyle}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderListEmptyComponent}
      renderItem={renderOrders}
      onRefresh={onRefresh}
      onEndReached={increasePageNumber}
      onEndReachedThreshold={0.5}
      windowSize={9}
      maxToRenderPerBatch={15}
      initialNumToRender={15}
      ListFooterComponent={renderListFooterComponent}
    />
    // <List
    //   data={refundHistory}
    //   style={styles.listStyle}
    //   refreshing={refreshing}
    //   onRefresh={onRefresh}
    //   contentContainerStyle={styles.scrollContainerStyle}
    //   showsVerticalScrollIndicator={false}
    //   ListEmptyComponent={renderListEmptyComponent}
    //   renderItem={renderOrders}
    // />
    // </>
  );

  const renderOrders = ({item}) => {
    return <RefundOrderCard item={item} isRefundSubmitted={true} onItemPress={goToDetailScreen} />;
  };

  const renderListEmptyComponent = () => {
    if (!isLoading) {
      return (
        <View style={styles.emptyParentView}>
          <ImageComponent source={IMAGES.PLACE_HOLDER_IMAGE} style={styles.emptyListPlaceholderImage} />
          <Text allowFontScaling={false} style={styles.emptyListDescriptionText}>No submitted requests</Text>
        </View>
      );
    }
    return null;
  };

  const renderApiErrorDialog = () => (
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
      headerTitle={APP_CONSTANTS.SUBMITTED_REQUESTS}
      withBackButton
      isScrollView={false}
      containerStyle={{flex: 1}}
      isLoading={isLoading && !refreshing && pageNumber === 1}>
      {renderList()}
      {renderApiErrorDialog()}
    </ScreenWrapperComponent>
  );
};

export default RefundHistory;
