import React, {useEffect, useState} from 'react';
import {RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import {Button, List} from '../../components';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import {APP_CONSTANTS} from '../../constants/Strings';
import BillingInformationView from '../../components/BillingInformationView';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import RefundRowComponent from '../../components/RefundRowComponent';
import RefundCustomerInfoComponent from '../../components/RefundCustomerInfoComponent';
import RefundOrderInfoComponent from '../../components/RefunOrderInfoComponent';
import PaymentInfoComponent from '../../components/PaymentInfoComponent';
import {getRefundDetails} from '../../services/ApiCaller';
import {logToConsole} from '../../configs/ReactotronConfig';
import DialogBox from '../../components/DialogBox';

const SubmittedRefundDetails = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRetryModalHidden, setIsRetryModalHidden] = useState(true);
  const [isRetryModal, setIsRetryModal] = useState(false);
  const [refundedOrderInfo, setRefundOrderInfo] = useState({});
  const {
    refundId = '',
    orderId = '',
    reason = '',
    zipCode = '',
    storeName = '',
    contactInformation = {},
    status = '',
    invoice = {},
    transactions = [],
    createdDate = '',
    orderType = '',
    refundItems = [],
  } = refundedOrderInfo ?? {};

  const getRefundRequestDetails = async () => {
    try {
      setLoading(true);
      setIsRetryModal(false);
      const {response} = await getRefundDetails({refundId: route?.params?.refundedOrderInfo?._id});
      const {data: {response: info, transactions: trans = []} = {}} = response || {};
      if (!response.ok || !info) {
        throw response;
      }
      setRefundOrderInfo({...(info || {}), transactions: trans});
    } catch (e) {
      const {isUnderMaintenance} = e;
      if (!isUnderMaintenance) {
        setIsRetryModal(true);
        logToConsole({getRefundRequestDetailsError: e});
      }
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRefundRequestDetails();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getRefundRequestDetails();
  };

  const onCancelPress = () => {
    setIsRetryModal(false);
    navigation.pop();
  };

  const renderListHeader = () => {
    return (
      <View style={styles.listHeader}>
        {renderRefundInfo()}
        {renderSectionDivider()}
        <Text allowFontScaling={false} style={styles.itemsText}>Items</Text>
      </View>
    );
  };

  const renderListFooter = () => (
    <>
      {renderDivider()}
      <BillingInformationView invoice={invoice} isRefund withIconButtons={false} orderType={orderType} />
      {renderSectionDivider()}
      {renderReasonInfo()}
      {renderSectionDivider()}
      {renderContactInfo()}
      {renderSectionDivider()}
      <PaymentInfoComponent transactions={transactions} isRefund />
      {renderButton()}
    </>
  );
  const goBack = () => navigation.goBack();

  const ItemSeparatorView = () => {
    return <View style={styles.divider} />;
  };

  const renderListItems = ({item}) => {
    return <CartItemConfirmationCard item={item.item} isRefund />;
  };

  const renderHeaderLeft = () => (
    <TouchableOpacity onPress={goBack} style={styles.headerLeft}>
      <ImageComponent style={styles.headerLeftImage} source={IMAGES.CLOSE} />
    </TouchableOpacity>
  );

  const renderDivider = () => <View style={styles.refundConfirmationDivider} />;

  const renderSectionDivider = () => <View style={styles.sectionDivider} />;

  const renderRefundInfo = () => (
    <RefundOrderInfoComponent orderInfo={{refundId, status, createdDate, orderType, orderId, storeName}} />
  );

  const renderList = () => (
    <List
      data={refundItems}
      contentContainerStyle={styles.contentContainerStyle}
      style={styles.listWrapper}
      ListHeaderComponent={renderListHeader}
      ListFooterComponent={renderListFooter}
      ItemSeparatorComponent={ItemSeparatorView}
      renderItem={renderListItems}
    />
  );

  const renderReasonInfo = () => <RefundRowComponent title={APP_CONSTANTS.REASONS} description={reason} />;

  const renderContactInfo = () => <RefundCustomerInfoComponent info={{zipCode, ...contactInformation}} />;

  const renderButton = () => (
    <View style={styles.buttonWrapper}>
      <View style={styles.btnWrapper}>
        <Button label={APP_CONSTANTS.DONE} color={COLORS.WHITE} width="100%" onPress={goBack} />
      </View>
    </View>
  );

  return (
    <ScreenWrapperComponent
      headerTitle={`REQUEST #${refundId}`}
      containerStyle={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      isLoading={loading && !refreshing && isRetryModalHidden}
      customHeaderLeft={renderHeaderLeft}>
      {renderList()}
      <DialogBox
        onModalHide={() => setIsRetryModalHidden(true)}
        onModalWillShow={() => setIsRetryModalHidden(false)}
        visible={isRetryModal}
        closeModal={() => setIsRetryModal(false)}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={getRefundRequestDetails}
        onCancelPress={onCancelPress}
      />
    </ScreenWrapperComponent>
  );
};

export default SubmittedRefundDetails;
