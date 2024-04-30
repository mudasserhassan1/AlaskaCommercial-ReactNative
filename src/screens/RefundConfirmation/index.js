import React, {useEffect} from 'react';
import {BackHandler, Text, TouchableOpacity, View} from 'react-native';
import {Button, List} from '../../components';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import {APP_CONSTANTS} from '../../constants/Strings';
import BillingInformationView from '../../components/BillingInformationView';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import RefundCustomerInfoComponent from '../../components/RefundCustomerInfoComponent';
import RefundRowComponent from '../../components/RefundRowComponent';
import RefundOrderInfoComponent from '../../components/RefunOrderInfoComponent';
import ConfirmationMessageComponent from '../../components/ConfirmationMessageComponent';

const RefundConfirmation = ({navigation, route}) => {
  const {refundedOrderInfo = {}} = route.params ?? {};
  const {
    refundId = '',
    orderId = '',
    reason = '',
    zipCode = '',
    storeName = '',
    contactInformation = {},
    status = '',
    invoice = {},
    createdDate = '',
    orderType = '',
    refundItems = [],
  } = refundedOrderInfo ?? {};

  useEffect(() => {
    const backAction = () => {
      navigation.replace('BottomTabs', {screen: 'Home'});
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const navigateToHome = () => navigation.replace('BottomTabs', {screen: 'Home'});

  const renderHeaderLeft = () => (
    <TouchableOpacity onPress={navigateToHome} style={styles.headerLeft}>
      <ImageComponent style={styles.headerLeftImage} source={IMAGES.CLOSE} />
    </TouchableOpacity>
  );

  const ItemSeparatorView = () => {
    return <View style={styles.divider} />;
  };

  const renderListItems = ({item}) => {
    return <CartItemConfirmationCard item={item.item} isRefund />;
  };

  const renderConfirmationMessage = () => (
    <ConfirmationMessageComponent
      message={APP_CONSTANTS.REQUEST_CONFIRMED}
      description={APP_CONSTANTS.REQUEST_CONFIRMED_MESSAGE}
      date={createdDate}
      storeName={storeName}
    />
  );

  const renderListHeader = () => {
    return (
      <View>
        {renderOrderInfo()}
        {renderSectionDivider()}
        <Text allowFontScaling={false} style={styles.itemsText}>{APP_CONSTANTS.ITEMS}</Text>
      </View>
    );
  };

  const renderListFooter = () => (
    <>
      <View style={styles.divider} />
      <BillingInformationView invoice={invoice} isRefund withIconButtons={false} orderType={orderType} />
      {renderSectionDivider()}
      {renderReasonInfo()}
      {renderSectionDivider()}
      {renderContactInformationView()}
      {renderButton()}
    </>
  );

  const renderOrderInfo = () => (
    <RefundOrderInfoComponent
      containerStyle={styles.refundOrderCom}
      orderInfo={{refundId, status, createdDate, orderId, orderType, storeName}}
    />
  );

  const renderSectionDivider = () => {
    return <View style={styles.sectionDivider} />;
  };

  const renderList = () => (
    <View style={styles.listWrapper}>
      <List
        data={refundItems}
        ListHeaderComponent={renderListHeader}
        ItemSeparatorComponent={ItemSeparatorView}
        ListFooterComponent={renderListFooter}
        renderItem={renderListItems}
      />
    </View>
  );

  const renderReasonInfo = () => <RefundRowComponent title={APP_CONSTANTS.REASONS} description={reason} />;

  const renderContactInformationView = () => <RefundCustomerInfoComponent info={{zipCode, ...contactInformation}} />;

  const renderButton = () => (
    <View style={styles.buttonWrapper}>
      <Button
        label={APP_CONSTANTS.DONE}
        buttonStyle={styles.btnWrapper}
        color={COLORS.WHITE}
        width="100%"
        onPress={navigateToHome}
      />
    </View>
  );

  return (
    <ScreenWrapperComponent headerTitle={APP_CONSTANTS.CONFIRMATION} customHeaderLeft={renderHeaderLeft}>
      <View>
        {renderConfirmationMessage()}
        {renderList()}
      </View>
    </ScreenWrapperComponent>
  );
};

export default RefundConfirmation;
