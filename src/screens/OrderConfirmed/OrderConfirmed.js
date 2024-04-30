import React, {useEffect, useMemo} from 'react';
import {BackHandler, Text, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {Button, List} from '../../components';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import {useSelector} from 'react-redux';
import {formatPhoneNumber} from '../../utils';
import {FONTS, COLORS, getFontSize} from '../../theme';
import OrderDetailAddressAndTimeComponent from '../../components/OrderDetailAddressAndTimeComponent';
import BillingInformationView from '../../components/BillingInformationView';
import {camelToSnakeCase} from '../../utils/transformUtils';
import {resetToHome} from '../../utils/navigationUtils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import PaymentInfoComponent from '../../components/PaymentInfoComponent';
import ConfirmationMessageComponent from '../../components/ConfirmationMessageComponent';

const OrderConfirmation = ({navigation, route}) => {
  const {loginInfo = {}, userInfo = {}} = useSelector(
    ({general: {loginInfo: {userInfo = {}} = {}} = {}} = {}) => ({
      loginInfo,
      userInfo,
    }),
  );

  const {orderDetail = {}, transactions = []} = route.params ?? {};
  const {
    orderId = '',
    orderItems = [],
    contactInformation = {},
    invoice,
    createdDate = '',
    storeName = '',
  } = orderDetail ?? {};

  const memoInvoice = useMemo(() => camelToSnakeCase(invoice), []);

  useEffect(() => {
    const backAction = () => {
      resetToHome();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const navigateToHome = () => resetToHome();

  const headerComponent = () => {
    return (
      <Text allowFontScaling={false} style={[styles.ordernumber, {fontFamily: FONTS.SEMI_BOLD}]}>
        Order #{orderId}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return <View style={styles.divider} />;
  };

  const renderCartItems = ({item, _}) => (
    <View style={{marginTop: heightPercentageToDP('1%')}}>
      <CartItemConfirmationCard item={item.item} />
    </View>
  );

  const renderDivider = () => <View style={styles.rowDivider} />;

  const renderConfirmationView = () => (
    <ConfirmationMessageComponent
      message={APP_CONSTANTS.ORDER_PLACED}
      description={APP_CONSTANTS.THANK_YOU_MESSAGE}
      date={createdDate}
      storeName={storeName}
    />
  );

  const renderOrderInfoComponent = () => (
    <OrderDetailAddressAndTimeComponent
      item={orderDetail}
      orderTypeFontSize={getFontSize(18)}
    />
  );

  const renderListContainer = () => (
    <View style={styles.listWrapper}>
      <List
        data={orderItems}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderCartItems}
      />
      <View style={styles.divider} />
      <BillingInformationView invoice={memoInvoice} />
    </View>
  );

  const renderDisclaimerView = () => (
    <View style={styles.itemStatusWrapper}>
      <View style={styles.itemStatusInnerWrapper}>
        <Text allowFontScaling={false} style={styles.disclaimerWrapper}>{APP_CONSTANTS.DISCLAIMER}</Text>
        <Text allowFontScaling={false} style={styles.disclaimerText}>
          {APP_CONSTANTS.ESTIMATED_TOTAL_DETAILS}
        </Text>
      </View>
    </View>
  );

  const renderProfileSection = () => {
    const {
      FirstName = '',
      LastName = '',
      Email = '',
      phoneNumber = '',
    } = contactInformation ?? {};
    return (
      <View style={styles.itemStatusWrapper}>
        <View style={styles.textWrapper}>
          <View style={styles.itemStatusInnerWrapper}>
            <Text allowFontScaling={false} style={styles.disclaimerWrapper}>
              {APP_CONSTANTS.CUSTOMER_INFO}
            </Text>
          </View>
          <View style={styles.infoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.NAME}</Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>
              {FirstName} {LastName}
            </Text>
          </View>
          {renderDivider()}
          <View style={styles.infoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.PHONE_NUM}</Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>
              {formatPhoneNumber(phoneNumber)}
            </Text>
          </View>
          {renderDivider()}
          <View style={styles.infoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.EMAIL}</Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>{Email}</Text>
          </View>
          {renderDivider()}
          <View style={styles.infoWrapper}>
            <Text allowFontScaling={false} style={styles.labelText}>{APP_CONSTANTS.ZIP_CODE}</Text>
            <Text allowFontScaling={false} style={styles.labelInfo}>{userInfo.ZipCode}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPaymentInfoView = () => (
    <PaymentInfoComponent transactions={transactions} />
  );

  const renderButton = () => (
    <View
      style={[
        styles.btnWrapper,
        {
          marginTop: heightPercentageToDP('3%'),
          backgroundColor: COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button
        label={APP_CONSTANTS.DONE}
        color={COLORS.WHITE}
        width="100%"
        onPress={navigateToHome}
      />
    </View>
  );
  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.CONFIRMATION}
      withBackButton
      onBackButtonPress={navigateToHome}>
      {renderConfirmationView()}
      {renderOrderInfoComponent()}
      {renderListContainer()}
      {renderDisclaimerView()}
      {renderProfileSection()}
      {renderPaymentInfoView()}
      {renderButton()}
    </ScreenWrapperComponent>
  );
};

export default OrderConfirmation;
