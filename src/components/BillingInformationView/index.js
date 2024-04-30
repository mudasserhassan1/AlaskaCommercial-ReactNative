import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {BILLING_CHARGES, BILLING_KEYS} from '../../constants/Common';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {COLORS} from '../../theme';
import {FONTS} from '../../theme';
import {
  formatAmountValue,
  getBillingInfo,
  BigNumber,
} from '../../utils/calculationUtils';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import BottomSheetModal from '../BottomSheetModal';
import {APP_CONSTANTS} from '../../constants/Strings';
import ImageComponent from '../ImageComponent';
import {saveCartInvoice} from '../../redux/actions/payment';
import {lodashCloneDeep} from '../../utils/transformUtils';
import styles from './styles';

const BillingInformationView = forwardRef(
  (
    {
      withIconButtons = true,
      isRefund = false,
      invoice,
      snapTaxForgiven,
      isFreightToAirline,
      containerStyle,
      orderType,
    },
    ref,
  ) => {
    const [invoiceModalData, setInvoiceModalData] = useState({});

    // const {
    //   cartItems = [],
    //   zipCodeDetail,
    //   storeDetail,
    //   specialSKUs,
    //   selectedDeliveryType,
    // } = useSelector(({general: {cartItems, zipCodeDetail, storeDetail, specialSKUs, selectedDeliveryType} = {}}) => ({
    //   cartItems,
    //   zipCodeDetail,
    //   storeDetail,
    //   specialSKUs,
    //   selectedDeliveryType,
    // }));

    const useCartItemsSelector = () =>
      useMemo(() => state => state.general?.cartItems ?? [], []);

    const useZipCodeDetailSelector = () =>
      useMemo(() => state => state.general?.zipCodeDetail, []);

    const useStoreDetailSelector = () =>
      useMemo(() => state => state.general?.storeDetail, []);

    const useSpecialSKUsSelector = () =>
      useMemo(() => state => state.general?.specialSKUs, []);

    const useSelectedDeliveryTypeSelector = () =>
      useMemo(() => state => state.general?.selectedDeliveryType, []);

    const cartItems = useSelector(useCartItemsSelector());
    const zipCodeDetail = useSelector(useZipCodeDetailSelector());
    const storeDetail = useSelector(useStoreDetailSelector());
    const specialSKUs = useSelector(useSpecialSKUsSelector());
    const selectedDeliveryType = useSelector(useSelectedDeliveryTypeSelector());

    orderType = orderType || selectedDeliveryType;
    const dispatch = useDispatch();

    const billingValue = useMemo(() => {
      if (invoice) {
        return invoice;
      }
      const cartInvoice = getBillingInfo(
        cartItems,
        zipCodeDetail,
        storeDetail,
        isRefund,
        {},
        {isFreightToAirline, specialSKUs, orderType},
      );
      dispatch(saveCartInvoice(cartInvoice));
      return cartInvoice;
    }, [
      invoice,
      cartItems,
      zipCodeDetail,
      storeDetail,
      isRefund,
      isFreightToAirline,
      specialSKUs,
      orderType,
      dispatch,
    ]);

    const setModalData = item => {
      setInvoiceModalData({key: item?.key, item});
    };

    const closeModal = () => setInvoiceModalData({});

    const renderAmountItemModal = useMemo(() => {
      if (withIconButtons) {
        const {details, header} = invoiceModalData?.item || {};
        return (
          <BottomSheetModal
            visible={invoiceModalData?.key}
            title={header}
            onBottomPress={closeModal}
            buttonTitle={APP_CONSTANTS.CLOSE}
            headerContainerStyle={styles.modalHeader}
            containerStyle={styles.modalContainer}
            onCrossPress={closeModal}>
            <Text allowFontScaling={false} style={styles.modalText}>{details}</Text>
          </BottomSheetModal>
        );
      }
      return null;
    }, [invoiceModalData, withIconButtons]);

    useImperativeHandle(ref, () => ({
      getBillingValues: () => lodashCloneDeep(billingValue),
    }));

    const onPressIconButton = item => {
      setModalData(item);
    };

    const renderBillingCharges = item => {
      const {
        name = '',
        refundName,
        key,
        isDivider,
        isNegative = false,
        color = COLORS.GRAY_6,
        valueColor = COLORS.BLACK,
        fontFamily = FONTS.REGULAR,
        text,
        icon,
      } = item ?? {};

      let keyAmount = billingValue[key] || 0;
      let label = withIconButtons ? text ?? name : name;

      if (isRefund) {
        label = refundName || label || '';
      }
      if (
        orderType === APP_CONSTANTS.HOME_DELIVERY &&
        key === BILLING_KEYS.FREIGHT_CHARGE
      ) {
        label = APP_CONSTANTS.DELIVERY_FEE;
      }

      if (snapTaxForgiven) {
        if (key === BILLING_KEYS.TAX_FORGIVEN) {
          keyAmount = BigNumber(keyAmount).plus(snapTaxForgiven);
        }
        if (key === BILLING_KEYS.TOTAL_AMOUNT) {
          keyAmount = BigNumber(keyAmount).minus(snapTaxForgiven);
        }
      }

      if (!key || (isRefund && BigNumber(keyAmount).lte(0))) {
        return null;
      }

      return (
        <TouchableOpacity activeOpacity={1} key={key}>
          {isDivider && <View style={styles.divider} />}
          <View style={styles.billingTextWrapper}>
            <Text allowFontScaling={false} style={[styles.billingTextStyle, {color, fontFamily}]}>
              {label}
            </Text>
            {icon && withIconButtons && (
              <Pressable
                hitSlop={20}
                onPress={() => onPressIconButton(item)}
                activeOpacity={0.8}
                style={styles.infoButton}>
                <ImageComponent source={icon} style={styles.infoIcon} />
              </Pressable>
            )}
            <Text
                allowFontScaling={false}
              style={[
                styles.billingTextStyle,
                {
                  color: valueColor,
                  fontFamily,
                },
              ]}>
              {`${isRefund ? '-' : isNegative ? '- ' : ''}$${formatAmountValue(
                keyAmount,
              )}`}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderBillingUI = () => {
      return (
        <View style={[styles.billingAmountWrapper, containerStyle]}>
          {BILLING_CHARGES.map(renderBillingCharges)}
        </View>
      );
    };

    return (
      <>
        {renderBillingUI()}
        {renderAmountItemModal}
      </>
    );
  },
);

const arePropsEqual = (prevProps, nextProps) =>
  shallowEqual(prevProps?.invoice, nextProps?.invoice) &&
  prevProps?.snapTaxForgiven === nextProps?.snapTaxForgiven &&
  prevProps?.orderType === nextProps?.orderType &&
  prevProps?.isFreightToAirline === nextProps?.isFreightToAirline;

export default memo(BillingInformationView, arePropsEqual);
