import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import React, {useMemo} from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import {getImageUrl} from '../../utils/imageUrlUtils';
import {FONTS} from '../../theme';
import ProductImageComponent from '../ProductImageComponent';
import {camelToSnakeCase, stringToLowerCase} from '../../utils/transformUtils';
import {getColorSchemeForProduct} from '../../utils/productUtils';
import useProductItem from '../../hooks/useProductItem';
import ProductUnavailableView from '../ProductUnavailableView';
import {actualPriceInclusionsForRandomWeightItems, RANDOM_WEIGHT_VALUES} from '../../constants/Common';
import {APP_CONSTANTS} from '../../constants/Strings';
import SnapEligibilityText from '../SnapEligibilityText';
import styles from './styles';
const CartItemConfirmationCard = ({item, status, orderStatus, isRefund}) => {
  const {itemObj = {}, ...rest} = item ?? {};
  const {
    substituteMessage = '',
    isSubstituted = false,
    decoration = false,
    decorationName = '',
    customerUnitOfMeasureSelection = '',
    quantity,
  } = rest || {};
  const snakeCaseRest = useMemo(() => camelToSnakeCase(rest), [rest]);
  const {
    sku,
    price,
    isLowBandwidth,
    productName,
    getBannerType,
    isOnSale,
    isRandomWeightItem,
    snapFlag,
    trueWeight,
    trueWeightPrice,
    adjustedTrueWeight,
    isProductACustomCake,
    isDropDownSelector,
  } = useProductItem({
    product: {...snakeCaseRest, quantity, ...itemObj},
    isRefund,
  });
  const {mainPrice, totalPrice, resolvedQuantity, isApplyingAvgPricePerEach, unitOfMeasure} = useProductItem({
    product: {
      ...snakeCaseRest,
      ...itemObj,
      quantity,
      CUSTOMER_UNIT_OF_MEASURE_SELECTION: isRefund && isRandomWeightItem ? 'WT' : customerUnitOfMeasureSelection,
      TRUE_WEIGHT: isRefund || customerUnitOfMeasureSelection === RANDOM_WEIGHT_VALUES.lb ? trueWeight : 0,
    },
    isRefund,
  });
  const {mainColor, lightColor} = getColorSchemeForProduct(itemObj, isSubstituted);
  const isUnavailable = status === 'Unavailable';
  const {onSale = false, regularPrice = 0.0} = isOnSale();
  const bannerType = getBannerType();
  const renderApproxTextForRandomWeightItems = () => {
    if (isDropDownSelector) {
      return <Text allowFontScaling={false} style={styles.approxtest}>approx </Text>;
    }
    return null;
  };
  const getDiscountedPrice = () => {
    if (onSale) {
      return `$${regularPrice}`;
    }
  };
  const renderSaleBanner = () => {
    return (
      <FastImage
        source={IMAGES[bannerType]}
        style={styles.productBannerImage}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  };
  const renderSubstitutionMessage = () => {
    if (substituteMessage) {
      return (
        <View style={{marginTop: '4%'}}>
          <Text allowFontScaling={false} style={styles.substituteText}>{stringToLowerCase(substituteMessage)}</Text>
        </View>
      );
    }
    return null;
  };
  const renderTrueWeightPriceView = () => {
    if (isApplyingAvgPricePerEach && !isRefund && actualPriceInclusionsForRandomWeightItems.includes(orderStatus)) {
      return (
        <View style={[styles.quantityWrapper, {marginTop: 0}]}>
          <View style={styles.quantityInnerWrapper}>
            <Text allowFontScaling={false}>
              <Text
                  allowFontScaling={false}
                style={[
                  styles.qtyText,
                  {
                    color: mainColor,
                    fontFamily: onSale ? FONTS.SEMI_BOLD : FONTS.MEDIUM,
                  },
                ]}>
                {`$${price}    `}
              </Text>
              <Text
                style={[
                  styles.qtyText,
                  {
                    color: isSubstituted || isUnavailable ? COLORS.GRAY0_25 : COLORS.BLACK,
                  },
                ]}>
                {adjustedTrueWeight} <Text allowFontScaling={false} style={[styles.unitText, {fontFamily: FONTS.REGULAR}]}>{'lb'}</Text>
              </Text>
              <Text
                  allowFontScaling={false}
                style={{
                  color: isSubstituted ? COLORS.GRAY0_25 : COLORS.BLACK,
                  fontFamily: FONTS.MEDIUM,
                }}>
                {'   Actual'}
              </Text>
            </Text>
          </View>
          <View style={styles.priceTextWrapper}>
            <Text
                allowFontScaling={false}
              style={[
                styles.priceText,
                {
                  color: isSubstituted || isUnavailable ? COLORS.GRAY0_25 : COLORS.BLACK,
                },
              ]}>
              ${trueWeightPrice || ''}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };
  return (
    <TouchableOpacity activeOpacity={1} style={styles.productCard}>
      <View style={styles.productBannerView}>
        {/*{onSale ? renderSaleBanner() : null}*/}
        <ProductImageComponent
          imageUrl={getImageUrl(sku, isLowBandwidth)}
          imageStyle={styles.productImage}
          containerStyle={[styles.productImageContainer]}
        />
        <SnapEligibilityText snapFlag={snapFlag} textStyle={styles.snapFlag} text={APP_CONSTANTS.SNAP} />
      </View>
      <View style={styles.itemDescWrapper}>
        <View style={[styles.itemDescInnerWrapper]}>
          <Text
              allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.productDescriptionText, (isSubstituted || isUnavailable) && {color: COLORS.GRAY0_25}]}>
            {decoration ? decorationName : stringToLowerCase(productName)}
          </Text>
        </View>
        {renderApproxTextForRandomWeightItems()}
        {renderSubstitutionMessage()}
        {status === 'Unavailable' || status === 'Substitute' ? (
          <ProductUnavailableView color={COLORS.MAIN} />
        ) : (
          <>
            <View style={[styles.quantityWrapper]}>
              {!!isProductACustomCake || !!decoration ? (
                <View style={styles.quantityInnerWrapper} />
              ) : (
                <View style={styles.quantityInnerWrapper}>
                  {/*{renderApproxTextForRandomWeightItems()}*/}
                  <View style={styles.singleItemPriceView}>

                    <View style={onSale ? styles.salePriceText : null}>
                      <Text
                          allowFontScaling={false}
                        style={[
                          styles.productPriceText,
                          {
                            fontFamily: onSale ? FONTS.BOLD : FONTS.MEDIUM,
                          },
                        ]}>
                        ${mainPrice}
                      </Text>
                    </View>
                    {onSale ? (
                      <Text allowFontScaling={false} style={[styles.discountedPriceText, {color: lightColor}]}>{getDiscountedPrice()}</Text>
                    ) : null}
                  </View>
                  <Text
                      allowFontScaling={false}
                    style={[
                      styles.qtyText,
                      {
                        color: isSubstituted || isUnavailable ? COLORS.GRAY0_25 : COLORS.BLACK,
                      },
                    ]}>
                    {`${resolvedQuantity} `}
                    <Text allowFontScaling={false} style={[styles.unitText, {fontFamily: FONTS.REGULAR}]}>
                      {unitOfMeasure}
                      {'   '}
                    </Text>
                  </Text>
                </View>
                // <View style={styles.quantityInnerWrapper}>
                //   <Text>
                //     {onSale ? (
                //       <Text
                //         style={[
                //           styles.lineThroughText,
                //           {
                //             color: lightColor,
                //             fontFamily: onSale ? FONTS.SEMI_BOLD : FONTS.MEDIUM,
                //           },
                //         ]}>
                //         {getDiscountedPrice()}
                //         {'  '}
                //       </Text>
                //     ) : (
                //       ''
                //     )}
                //     <Text
                //       style={[
                //         styles.qtyText,
                //         {
                //           color: mainColor,
                //           fontFamily: onSale ? FONTS.SEMI_BOLD : FONTS.MEDIUM,
                //         },
                //       ]}>
                //       ${mainPrice}
                //       {'    '}
                //     </Text>
                //
                //     <Text
                //       style={[
                //         styles.qtyText,
                //         {
                //           color:
                //             isSubstituted || isUnavailable
                //               ? COLORS.GRAY0_25
                //               : COLORS.BLACK,
                //         },
                //       ]}>
                //       {`${resolvedQuantity} `}
                //       <Text
                //         style={[styles.unitText, {fontFamily: FONTS.REGULAR}]}>
                //         {unitOfMeasure}
                //         {'   '}
                //       </Text>
                //     </Text>
                //     <Text
                //       style={{
                //         color: isSubstituted ? COLORS.GRAY0_25 : COLORS.BLACK,
                //         fontFamily: FONTS.MEDIUM,
                //       }}>
                //       {renderApproxTextForRandomWeightItems()}
                //     </Text>
                //   </Text>
                // </View>
              )}
              <View style={styles.priceTextWrapper}>
                <Text
                    allowFontScaling={false}
                  style={[
                    styles.priceText,
                    {
                      color: isSubstituted || isUnavailable ? COLORS.GRAY0_25 : COLORS.BLACK,
                    },
                  ]}>
                  {isRefund && '-'}${totalPrice}
                </Text>
              </View>
            </View>
            {renderTrueWeightPriceView()}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default CartItemConfirmationCard;
