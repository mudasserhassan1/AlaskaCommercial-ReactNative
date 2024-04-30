/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS, IMAGES} from '../../theme';
import {Button, List} from '../../components';
import {styles} from './styles';
import DialogBox from '../../components/DialogBox/index';
import RefundReasonsModal from '../../components/RefundReasonsModal';
import {createRefundRequest} from '../../services/ApiCaller';
import CartItemConfirmationCard from '../../components/CartItemConfirmationCard';
import {getBillingInfo} from '../../utils/calculationUtils';
import BillingInformationView from '../../components/BillingInformationView';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import ImageComponent from '../../components/ImageComponent';
import {camelToSnakeCase, snakeToCamelCase} from '../../utils/transformUtils';
import {STATUSES} from '../../constants/Api';
import useDeviceInfo from "../../hooks/useDeviceInfo";

const RefundDetails = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reasonModal, setReasonModal] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedReasonDescription, setSelectedReasonDescription] = useState('');
  const toggleReasonModal = () => {
    setReasonModal(!reasonModal);
  };

  const {refundItems = [], order = {}} = route.params ?? {};
  const {
    purchaseOrder = '',
    contactInformation = {},
    deliveryAddress = {},
    storeNum = '',
    storeName = '',
    zipCode = '',
    orderId = '',
    orderType = '',
    invoice = {},
    zipCodeDetail,
    storeDetail,
    snapTotal = 0,
  } = order || {};

  const camelCaseInvoice = useMemo(() => camelToSnakeCase(invoice), [invoice]);
  const snakeCaseStore = useMemo(() => snakeToCamelCase(storeDetail), [storeDetail]);
  const camelCaseZipCodeDetails = useMemo(() => snakeToCamelCase(zipCodeDetail), [zipCodeDetail]);

  const billingValue = getBillingInfo(refundItems, camelCaseZipCodeDetails, snakeCaseStore, true, camelCaseInvoice, {
    snapFoodAmount: snapTotal,
    orderType,
  });

  const headerComponent = () => {
    return <Text allowFontScaling={false} style={styles.itemsText}>Items</Text>;
  };

  const ItemSeparatorView = () => {
    return <View style={styles.divider} />;
  };

  const deviceInformation = useDeviceInfo();

  const postRefundRequest = async () => {
    setIsLoading(true);
    let params = {
      orderId,
      reason: selectedReasonDescription,
      storeNum,
      zipCode,
      storeName,
      contactInformation,
      deliveryAddress,
      refundItems,
      orderType,
      purchaseOrder,
      invoice: billingValue,
      deviceInfo:deviceInformation
    };
    const {response = {}} = await createRefundRequest(params);
    setIsLoading(false);
    const {ok = false, status = 0, isNetworkError, isUnderMaintenance} = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: refundedOrderInfo} = {}} = response ?? {};

      navigation.replace('RefundConfirmation', {
        refundedOrderInfo,
      });
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiError();
    }
  };

  const handleApiError = () => {
    return setIsApiErrorDialogVisible(true);
  };

  const renderListItems = ({item}) => {
    return <CartItemConfirmationCard item={item.item} isRefund />;
  };

  const renderList = () => (
    <View style={styles.listWrapper}>
      <List
        data={refundItems}
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderListItems}
      />
      <View style={styles.divider} />
      <BillingInformationView invoice={billingValue} isRefund withIconButtons={false} orderType={orderType} />
    </View>
  );

  const renderReasonSection = () => (
    <TouchableOpacity style={styles.reasonParentView} activeOpacity={0.6} onPress={toggleReasonModal}>
      <View style={styles.reasonInnerParent}>
        <Text allowFontScaling={false} style={styles.headingText}>{APP_CONSTANTS.REASONS}</Text>
        <Text
            allowFontScaling={false}
          style={[
            styles.orderTextStyle,
            {
              opacity: selectedReason == null ? 0.5 : 1,
              marginTop: hp('.5%'),
              color: selectedReason == null ? COLORS.MAIN : COLORS.BLACK,
            },
          ]}>
          {selectedReason == null ? APP_CONSTANTS.TELL_US_WHY : selectedReasonDescription}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <ImageComponent source={IMAGES.RIGHT_ARROW} resizeMode={'cover'} style={styles.rightArrowStyle} />
      </View>
    </TouchableOpacity>
  );

  const renderButton = () => (
    <View
      style={[
        styles.btnWrapper,
        {
          marginTop: hp('3%'),
          backgroundColor: selectedReason == null ? COLORS.DISABLE_BUTTON_COLOR : COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button
        label={APP_CONSTANTS.CONFIRM_REFUND_REQUEST}
        color="white"
        width="100%"
        disabled={selectedReason == null}
        onPress={postRefundRequest}
      />
    </View>
  );

  const renderReturnModal = () => (
    <RefundReasonsModal
      closeModal={toggleReasonModal}
      isVisible={reasonModal}
      orderId={orderId}
      defaultReasonIndex={selectedReason}
      onSavePress={(reasonIndex, reasonName) => {
        setSelectedReasonDescription(reasonName);
        setSelectedReason(reasonIndex);
      }}
    />
  );

  const renderApiErrorDialog = () => {
    return (
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
  };

  return (
    <ScreenWrapperComponent headerTitle={APP_CONSTANTS.REFUND_REQUEST} withBackButton isLoading={isLoading}>
      <View style={styles.scrollContainerStyle}>
        {renderList()}
        {renderReasonSection()}
        {renderButton()}
        {renderReturnModal()}
        {renderApiErrorDialog()}
      </View>
    </ScreenWrapperComponent>
  );
};

export default RefundDetails;
