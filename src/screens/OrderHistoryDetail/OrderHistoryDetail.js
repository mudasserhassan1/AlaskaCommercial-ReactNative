import React, {useEffect, useMemo, useState} from 'react';
import {RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {APP_CONSTANTS} from '../../constants/Strings';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import OrderDetailAddressAndTimeComponent from '../../components/OrderDetailAddressAndTimeComponent';
import BillingInformationView from '../../components/BillingInformationView';
import OrderStatusComponent from '../../components/OrderStatusComponent';
import {camelToSnakeCase} from '../../utils/transformUtils';
import {useDispatch, useSelector} from 'react-redux';
import DialogBox from '../../components/DialogBox';
import {getOrderDetails} from '../../services/ApiCaller';
import {formatDateForOrderHistory} from '../../utils/timeUtils';
import {
  isUserOnSameStoreWhileReordering,
  updateZipCodeAndStoreForReorder,
} from '../../utils/reorderUtils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {
  estimatedTotalAmountInclusions,
  IMAGES_RESIZE_MODES,
} from '../../constants/Common';
import {IMAGES, getFontSize} from '../../theme';
import ImageComponent from '../../components/ImageComponent';
import PaymentInfoComponent from '../../components/PaymentInfoComponent';
import {showDialogWithTimeout} from '../../utils/helperUtils';
import {logToConsole} from '../../configs/ReactotronConfig';

const OrderHistoryDetail = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReorderLoading, setIsReorderLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [
    visibleZipCodeConfirmationDialog,
    setVisibleZipCodeConfirmationDialog,
  ] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);

  // const {loginInfo} = useSelector(({general: {loginInfo = {}} = {}}) => ({loginInfo}));
  const useLoginInfoSelector = () =>
    useMemo(() => state => state.general?.loginInfo ?? {}, []);
  const loginInfo = useSelector(useLoginInfoSelector());
  const {userInfo = {}} = loginInfo ?? {};

  const {item: paramsItem = {}, orderId: orderToFetchId} = route.params ?? {};

  const [item, setOrderDetails] = useState(paramsItem);
  const [invalidDetail, setInvalidDetail] = useState(false);

  const startLoading = () => setIsLoading(true);
  const closeLoading = () => setIsLoading(false);

  const startReorderLoading = () => setIsReorderLoading(true);
  const closeReorderLoading = () => setIsReorderLoading(false);

  const openDialog = () => setVisibleZipCodeConfirmationDialog(true);
  const closeDialog = () => setVisibleZipCodeConfirmationDialog(false);

  let {
    createdDate = '',
    orderId = '',
    orderItems = [],
    invoice,
    orderType,
    transactions,
    _id,
    status: orderStatus = '',
  } = item || {};

  const getOrderDetailsCall = () => {
    getOrderDetails(orderToFetchId || _id || orderId)
      .then(order => {
        closeLoading();
        const {
          response = {},
          zipCodeDetail: zipCodeData = {},
          message = '',
          transactions,
        } = order ?? {};
        if (message === 'success') {
          setInvalidDetail(false);
          setOrderDetails({
            ...response,
            zipCodeDetail: zipCodeData,
            transactions,
          });
        } else {
          setInvalidDetail(true);
        }
      })
      .catch(() => {
        closeLoading();
        handleApiErrors();
      })
      .finally(() => {
        closeLoading();
        setRefreshing(false);
      });
  };

  useEffect(() => {
    startLoading();
    getOrderDetailsCall();
  }, []);

  const dispatch = useDispatch();

  const headerComponent = () => {
    return <Text allowFontScaling={false} style={styles.orderNumber}>Order #{orderId}</Text>;
  };

  const renderProducts = (item = {}, index) => {
    const {itemStatus, item: product} = item ?? {};
    return (
      <View key={String(index)}>
        <CartItemConfirmationCard
          item={product}
          status={itemStatus}
          orderStatus={orderStatus}
        />
        {index !== orderItems?.length - 1 && ItemSeparatorView()}
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return <View style={styles.separator} />;
  };

  const renderListFooterComponent = () => (
    <>
      <View style={[styles.divider, {marginStart: wp('6%')}]} />
      <BillingInformationView
        orderType={orderType}
        invoice={camelToSnakeCase(invoice)}
        withIconButtons={estimatedTotalAmountInclusions.includes(orderStatus)}
      />
    </>
  );

  const goToCart = () => navigation.navigate('Cart');

  const onReOrderPress = async () => {
    await checkIfZipCodeAndStoreAreSame();
  };

  const checkIfZipCodeAndStoreAreSame = () => {
    isUserOnSameStoreWhileReordering(
      item,
      userInfo,
      dispatch,
      startReorderLoading,
      closeReorderLoading,
      goToCart,
      openDialog,
    )
      .then(() => {})
      .catch(e => {
        const {isNetworkError} = e ?? {};
        if (!isNetworkError) {
          handleApiErrors();
        }
      });
  };

  const updateUserZipCodeAndStore = async () => {
    closeDialog();
    await updateZipCodeAndStoreForReorder(
      item,
      loginInfo,
      dispatch,
      goToCart,
      closeReorderLoading,
      startReorderLoading,
    )
      .then(() => {})
      .catch(e => {
        closeReorderLoading();
        const {isNetworkError} = e ?? {};
        if (!isNetworkError) {
          handleApiErrors();
        }
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getOrderDetailsCall();
  };

  const handleApiErrors = () => {
    return showDialogWithTimeout(() => setIsApiErrorDialogVisible(true));
  };

  const renderZipCodeConfirmationDialog = () => (
    <DialogBox
      visible={visibleZipCodeConfirmationDialog}
      closeDialog={closeDialog}
      title={APP_CONSTANTS.NEW_LOCATION}
      messageContainerStyles={styles.dialogBoxMessage}
      message={APP_CONSTANTS.ORDER_HISTORY_DIALOG_MESSAGE}
      confirmButtonLabel={APP_CONSTANTS.CONFIRM}
      cancelButtonLabel={APP_CONSTANTS.DECLINE}
      onConfirmPress={updateUserZipCodeAndStore}
      onCancelPress={closeDialog}
    />
  );

  const renderDataView = () => {
    if (!isLoading && !invalidDetail) {
      return (
        <View>
          <View style={styles.dateOuterWrapper}>
            <View style={styles.dateWrapper}>
              <Text allowFontScaling={false} style={styles.dateStyle}>
                {formatDateForOrderHistory(createdDate)} Receipt
              </Text>
              <TouchableOpacity onPress={onReOrderPress}>
                <Text allowFontScaling={false} style={styles.reOrderTextStyle}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
          <OrderDetailAddressAndTimeComponent
            item={item}
            orderTypeFontSize={getFontSize(15)}
            screen={'orderHistoryDetail'}
          />
          <View style={styles.listWrapper}>
            {headerComponent()}
            {orderItems?.map(renderProducts)}
            {renderListFooterComponent()}
          </View>
          <OrderStatusComponent item={item} />
          {renderZipCodeConfirmationDialog()}
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
          <PaymentInfoComponent
            transactions={transactions}
            showRemainingSnapBalance={false}
            withAdjustedAmount
          />
        </View>
      );
    }
    if (invalidDetail && !isLoading) {
      return renderInvalidDataView();
    }
    return <View />;
  };

  const renderInvalidDataView = () => {
    return (
      <View style={styles.errorContainer}>
        <ImageComponent
          resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
          style={styles.errorImage}
          source={IMAGES.PLACE_HOLDER_IMAGE}
        />
        <Text allowFontScaling={false} style={styles.errorText}>Unable to fetch details right now!</Text>
      </View>
    );
  };
  return (
    <ScreenWrapperComponent
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      headerTitle={APP_CONSTANTS.ORDER_HISTORY}
      showCartButton
      withBackButton
      isLoading={isLoading || isReorderLoading}>
      {renderDataView()}
    </ScreenWrapperComponent>
  );
};

export default OrderHistoryDetail;
