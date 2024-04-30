import {snakeToCamelCase} from './transformUtils';
import {BILLING_KEYS, PAYMENT_METHODS, RANDOM_WEIGHT_VALUES} from '../constants/Common';
import {getItemPriceQuantity, isRandomWeightItem} from './productUtils';
import {logToConsole} from '../configs/ReactotronConfig';
import Big from 'big.js';
import {APP_CONSTANTS} from '../constants/Strings';

export const BigNumber = num => {
  try {
    return Big(parseFloat(num));
  } catch (e) {
    logToConsole({BigNumberError: e, num});
    return Big(0);
  }
};

/**
 * Function that truncates the value to 2 decimal places instead of doing round-off except that it is required
 * @param value
 * @param isRoundOff
 * @returns {`${string}.00`|`${string}.${*}`}
 */
export const formatAmountValue = (value, isRoundOff = true) => {
  let sign = BigNumber(value || 0).lt(0) ? '-' : '';
  value = Math.abs(value);
  if (isRoundOff) {
    const splitValues = String(value || 0.0).split('.');
    if (splitValues[1]?.[2] >= 5) {
      //roundup if 3rd digit is greater than || Equal to 5.
      return `${sign}${BigNumber(value).toFixed(2, Big.roundUp)}`;
    }
  }
  //truncate
  return `${sign}${BigNumber(value).toFixed(2, Big.roundDown)}`;
};

export const roundedOffAmount = value => parseFloat(formatAmountValue(value));

export const getSnapTaxForgiven = ({amount, subTotal, snapTax, isBushTaxExempt} = {}) => {
  if (isBushTaxExempt) {
    return 0;
  }
  return BigNumber(amount).gte(subTotal) ? BigNumber(snapTax) : BigNumber(amount).div(subTotal).times(snapTax);
};

export const getSnapSelectedAmount = ({food, cash}) => {
  return parseFloat(formatAmountValue(BigNumber(food).plus(cash)));
};

export const checkIfPaymentRemaining = ({
  snapTaxForgiven = 0,
  totalAmount = 0,
  snapAmount = 0,
  vwAmount = 0,
  gcAmount = 0,
  staAmount = 0,
  isDebitSelected,
} = {}) => {
  const remaining = getRemainingOrderTotal({snapTaxForgiven, snapAmount, vwAmount, gcAmount, staAmount, totalAmount});
  if (isDebitSelected) {
    return false;
  }
  return BigNumber(remaining).gt(0);
};

export const getRemainingOrderTotal = ({
  snapTaxForgiven = 0,
  totalAmount = 0,
  snapAmount = 0,
  vwAmount = 0,
  gcAmount = 0,
  staAmount = 0,
} = {}) => {
  return parseFloat(
    formatAmountValue(
      BigNumber(totalAmount)
        .minus(formatAmountValue(snapTaxForgiven))
        .minus(snapAmount)
        .minus(vwAmount)
        .minus(gcAmount)
        .minus(staAmount),
    ),
  );
};



export const getRemainingTotalForSnapFood = ({
  foodStampSubtotal,
  snapFoodEligibleAmount,
  remainingOrderTotal,
  snapTax = 0,
  isBushTaxExempt,
} = {}) => {
  let [remainingForSnapFood, taxForgiven] = [0, 0];
  remainingOrderTotal = BigNumber(remainingOrderTotal);
  if (BigNumber(foodStampSubtotal).gt(0) && remainingOrderTotal.gt(0)) {
    if (remainingOrderTotal.gt(snapFoodEligibleAmount)) {
      remainingForSnapFood = snapFoodEligibleAmount;
    } else {
      taxForgiven = getSnapTaxForgiven({
        amount: remainingOrderTotal,
        subTotal: foodStampSubtotal,
        snapTax,
        isBushTaxExempt,
      });
      remainingForSnapFood = remainingOrderTotal.minus(taxForgiven);
    }
  }
  return formatAmountValue(remainingForSnapFood);
};

export const getFloatValue = value => {
  return parseFloat((value || '$0')?.substring(1)) ?? 0.0;
};

const getHandlingFee = (percent = '0', minimum = '$0', subTotal) => {
  const computedValue = BigNumber(parseFloat(percent || '0'))
    .div(100)
    .times(subTotal);
  minimum = BigNumber(getFloatValue(minimum));
  return computedValue.gt(minimum) ? computedValue : minimum;
};

// Tax Calculation
const getTaxRate = (itemObj, store) => {
  let taxRate = 0.0;
  const {salesTaxMuniFlag, salesTaxCityFlag} = snakeToCamelCase(itemObj) || {};
  const {salesTaxPercentMuni, salesTaxPercentCity} = store || {};
  if (salesTaxMuniFlag === 'Y') {
    taxRate = salesTaxPercentMuni;
  } else if (salesTaxCityFlag === 'Y') {
    taxRate = salesTaxPercentCity;
  }
  return taxRate || 0.0;
};

const getTaxForgiven = ({tax, isBushTaxExempt}) => {
  if (isBushTaxExempt) {
    return tax;
  }
  return 0;
};

export const getTrueWeight = (trueWeight, tare) => {
  let finalTrueWeight = BigNumber(trueWeight || 0).minus(tare || 0);
  return finalTrueWeight.gt(0) ? finalTrueWeight.toNumber() : trueWeight;
};

export const checkIfBushTaxExempt = bushOrderTaxExempt => bushOrderTaxExempt === 'Y';

export const checkIfSnapEligible = itemObj =>
  (itemObj?.item?.[0]?.SNAP_FLAG || itemObj?.item?.[0]?.['SNAP FLAG']) === 'Y';

export const getBillingInfo = (
  list,
  zipCodeDetail,
  storeDetail,
  isRefund = false,
  invoice = {},
  {isFreightToAirline, specialSKUs = {}, snapFoodAmount = 0, orderType} = {},
) => {
  let {freightRate, minimumFreightCharge, handlingFee, minimumHandlingFee, bushOrderTaxExempt} = zipCodeDetail || {};
  const isBushTaxExempt = checkIfBushTaxExempt(bushOrderTaxExempt);
  freightRate = getFloatValue(freightRate);
  minimumFreightCharge = getFloatValue(minimumFreightCharge);
  let bigZero = BigNumber(0.0);
  let [subTotal, total, savings, foodStampSubtotal, freightCharge, handlingCharge, tax, taxForgiven, snapTax] = [
    bigZero,
    bigZero,
    bigZero,
    bigZero,
    bigZero,
    bigZero,
    bigZero,
    bigZero,
    bigZero,
  ];

  for (const item of list) {
    const product = isRefund ? item.item : item;
    const {itemObj = {}, customerUnitOfMeasureSelection = '', trueWeight = ''} = product ?? {};
    const {item: innerItem = []} = itemObj ?? {};
    const {
      SELL_UNIT_OF_MEASURE: sellUnitOfMeasure = '',
      CUSTOMER_ORDER_UNIT_OF_MEASURE: customerOrderUnitOfMeasure = '',
      AVG_WEIGHT_PER_EACH_UNIT: avgWeightPerEachUnit = '',
      TARE: tare = 0,
    } = innerItem?.[0] ?? {};

    const isRandomWeight = isRandomWeightItem(sellUnitOfMeasure, customerOrderUnitOfMeasure);
    let {price, quantity} = getItemPriceQuantity(itemObj);
    quantity = BigNumber(product?.quantity || quantity);
    let itemWeight = parseFloat(itemObj?.ITEM_WEIGHT || 0);
    price = BigNumber(price);
    if (quantity > 0) {
      let regularPrice = BigNumber(parseFloat(itemObj?.REG_PRICE || 0));
      if (isRandomWeight) {
        if (trueWeight) {
          quantity = getTrueWeight(trueWeight, tare);
        } else if (customerUnitOfMeasureSelection !== RANDOM_WEIGHT_VALUES.lb) {
          itemWeight = BigNumber(parseFloat(avgWeightPerEachUnit || 0));
          price = BigNumber(avgWeightPerEachUnit).times(price);
          regularPrice = BigNumber(avgWeightPerEachUnit).times(regularPrice);
        }
      }
      const currentItemTax = price.times(quantity).times(getTaxRate(itemObj, storeDetail));
      tax = tax.plus(currentItemTax);
      subTotal = subTotal.plus(price.times(quantity));
      if (!isRefund) {
        savings = savings.plus(regularPrice.minus(price).gt(0) ? regularPrice.minus(price).times(quantity) : 0);
        freightCharge = freightCharge.plus(BigNumber(itemWeight).times(quantity).times(freightRate));
      }
      if (checkIfSnapEligible(itemObj)) {
        foodStampSubtotal = foodStampSubtotal.plus(BigNumber(price).times(quantity));
        snapTax = snapTax.plus(currentItemTax);
      }
    }
  }

  if (subTotal.gt(0)) {
    if (isRefund) {
      const snapFoodRefundAmount = foodStampSubtotal.lte(snapFoodAmount) ? foodStampSubtotal : snapFoodAmount;
      const snapFoodTaxForgiven = getSnapTaxForgiven({
        amount: snapFoodRefundAmount,
        snapTax,
        isBushTaxExempt,
        subTotal: foodStampSubtotal,
      });
      let taxToReturn = isBushTaxExempt ? BigNumber(0) : BigNumber(tax).minus(snapFoodTaxForgiven);
      tax = taxToReturn.gt(0) ? taxToReturn : 0;
      total = BigNumber(formatAmountValue(subTotal)).plus(formatAmountValue(tax));
    } else {
      handlingCharge = BigNumber(getHandlingFee(handlingFee, minimumHandlingFee, subTotal));
      freightCharge = BigNumber(freightCharge.gt(minimumFreightCharge) ? freightCharge : minimumFreightCharge);
      freightCharge = isFreightToAirline || orderType === APP_CONSTANTS.CURBSIDE_PICKUP ? 0 : freightCharge;
      const freightChargeF = formatAmountValue(freightCharge);
      const handlingChargeF = formatAmountValue(handlingCharge);
      const {handlingFeeItem, freightChargeItem} = specialSKUs || {};
      const handlingChargeTax = BigNumber(handlingChargeF).times(getTaxRate(handlingFeeItem, storeDetail));
      const freightChargeTax = BigNumber(freightChargeF).times(getTaxRate(freightChargeItem, storeDetail));
      if (checkIfSnapEligible(handlingFeeItem)) {
        foodStampSubtotal = foodStampSubtotal.plus(handlingChargeF);
        snapTax = snapTax.plus(handlingChargeTax);
      }
      if (checkIfSnapEligible(freightChargeItem)) {
        foodStampSubtotal = foodStampSubtotal.plus(freightChargeF);
        snapTax = snapTax.plus(freightChargeTax);
      }
      tax = tax.plus(handlingChargeTax).plus(freightChargeTax);
      taxForgiven = BigNumber(getTaxForgiven({tax, isBushTaxExempt}));
      total = BigNumber(formatAmountValue(subTotal))
        .plus(handlingChargeF)
        .plus(freightChargeF)
        .plus(formatAmountValue(tax))
        .minus(formatAmountValue(taxForgiven));
    }
  }

  return {
    [BILLING_KEYS.FOOD_STAMP_SUBTOTAL]: foodStampSubtotal,
    [BILLING_KEYS.SUBTOTAL]: subTotal,
    [BILLING_KEYS.SAVINGS]: savings,
    [BILLING_KEYS.HANDLING_FEE]: handlingCharge,
    [BILLING_KEYS.FREIGHT_CHARGE]: freightCharge,
    [BILLING_KEYS.TAX]: tax,
    [BILLING_KEYS.TAX_FORGIVEN]: taxForgiven,
    [BILLING_KEYS.SNAP_TAX]: snapTax,
    [BILLING_KEYS.TOTAL_AMOUNT]: formatAmountValue(total),
  };
};

export const getFormattedTransactions = (trans = []) => {
  let [refund, purchase, overcharge, preAuthRelease] = [[], [], {}, {}];
  trans?.forEach(item => {
    const {isRefundTransaction, isOverCharge, isPreAuthRelease, isDeductionTransaction, isRefundRequest} = item || {};
    if (isRefundTransaction && !isRefundRequest) {
      refund.push(item);
    } else if (isOverCharge) {
      overcharge = item;
    } else if (isPreAuthRelease) {
      preAuthRelease = item;
    } else if (!isDeductionTransaction && !isRefundRequest) {
      purchase.push(item);
    }
  });
  refund.forEach(rfnd => {
    purchase = purchase?.map(pur => {
      const {paymentMethodId, transactionType, amount, paymentMethodType} = rfnd || {};
      if (paymentMethodId === pur?.paymentMethodId && transactionType === pur?.transactionType) {
        if (paymentMethodType === PAYMENT_METHODS.STORE_CHARGE) {
          let remainingAmount = BigNumber(pur?.amount || 0).minus(amount || 0);
          return {
            ...pur,
            amount: remainingAmount.gte(0) ? remainingAmount : 0,
          };
        }
        return {
          ...pur,
          adjustmentAmount: (amount || 0) * -1,
        };
      }
      return pur;
    });
  });
  if (overcharge?.paymentMethodId) {
    purchase = purchase?.map(pur => {
      const {paymentMethodId, transactionType, amount} = overcharge || {};
      if (paymentMethodId === pur?.paymentMethodId && transactionType === pur?.transactionType) {
        return {
          ...pur,
          overChargeAmount: amount || 0,
        };
      }
      return pur;
    });
  }
  if (preAuthRelease?.paymentMethodId) {
    purchase = purchase?.map(pur => {
      const {paymentMethodId, transactionType, amount = 0} = preAuthRelease || {};
      if (paymentMethodId === pur?.paymentMethodId && transactionType === pur?.transactionType) {
        let remainingAmount = BigNumber(pur.amount || 0).minus(amount || 0);

        return {
          ...pur,
          amount: remainingAmount.gte(0) ? remainingAmount : 0,
        };
      }
      return pur;
    });
  }
  return {purchase, refund, overcharge, preAuthRelease};
};

export {getTaxRate};
