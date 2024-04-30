// import React, {useMemo, useRef, useState} from 'react';
// import {Animated, Pressable, Text, TouchableOpacity, View} from 'react-native';
// import FastImage from 'react-native-fast-image';
// import {COLORS, FONTS, IMAGES} from '../../theme';
// import ProductQuantityStepper from '../ProductQuantityStepper';
// import {getImageUrl} from '../../utils/imageUrlUtils';
// import ProductImageComponent from '../ProductImageComponent';
// import {camelToSnakeCase, stringToLowerCase} from '../../utils/transformUtils';
// import useProductItem from '../../hooks/useProductItem';
// import {APP_CONSTANTS} from '../../constants/Strings';
// import SnapEligibilityText from '../SnapEligibilityText';
// import styles from './styles';
// import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
// import CarItemHiddenItem from './CarItemHiddenItem';
// import {SwipeRow} from 'react-native-swipe-list-view';
// import {
//   heightPercentageToDP as hp,
//   heightPercentageToDP,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// // import SwipeRow from '../SwipeRow/SwipeRow';
// import useIsGuest from '../../hooks/useIsGuest';
// import {useDispatch, useSelector} from 'react-redux';
// import {setIsGuestCartViewed, setIsUserCartViewed} from '../../redux/actions/config';
// const CartItemCard = ({
//   item: globalItem = {},
//   onMorePress,
//   index,
//   onPlusPress,
//   onMinusPress,
//   isLoading = false,
//   isSwipeAble = false,
//   onRowDidOpen: rowOpen,
//   onLeftAction: leftAction,
//   onRightAction: rightAction,
//   onLeftActionStatusChange: leftStatusChange,
//   onRightActionStatusChange: rightStatusChange,
//   onDeleteRow,
//   onAddToList,
//   onSwipeStart = () => {},
//   onSwipeEnd = () => {},
// }) => {
//   const {itemObj: item = {}, ...rest} = globalItem ?? {};
//   const isGuest = useIsGuest();
//   const {isUserCartViewed, isGuestCartViewed} = useSelector(
//     ({config: {isUserCartViewed = false, isGuestCartViewed = false} = {}}) => ({
//       isUserCartViewed,
//       isGuestCartViewed,
//     }),
//   );
//   const dispatch = useDispatch();
//   const snakeCaseRest = useMemo(() => camelToSnakeCase(rest || {}), [rest]);
//   const {
//     sku,
//     quantity,
//     mainColor,
//     lightColor,
//     isLowBandwidth,
//     productName,
//     getBannerType,
//     isOnSale,
//     isProductACustomCake,
//     isRandomWeightItem,
//     limit,
//     snapFlag,
//     unitOfMeasure,
//     mainPrice,
//     totalPrice,
//     isApplyingAvgPricePerEach,
//     minimumQuantity,
//     isMinusDisabled,
//     isDropDownSelector
//   } = useProductItem({
//     entryPoint: MIX_PANEL_SCREENS.CART,
//     product: {...snakeCaseRest, ...item},
//   });
//   const bannerType = getBannerType();
//   const {onSale = false, regularPrice = 0.0} = isOnSale();
//   const openRowRef = useRef(null);
//   const leftPreview = 61;
//   const rightPreview = -61;
//   const [isLeftPreviewed, setIsLeftPreviewd] = useState(isGuest ? true : isUserCartViewed);
//   const [isRightPreviewed, setIsRightPreviewd] = useState(isGuest ? isGuestCartViewed : isUserCartViewed);
//   const deleteRow = () => {
//     onDeleteRow(index);
//   };
//   const onRowDidOpen = () => {
//     rowOpen(openRowRef);
//   };
//   const closeOpenRow = () => {
//     if (openRowRef.current && openRowRef.current.closeRow) {
//       openRowRef.current.closeRow();
//     }
//   };
//   const onLeftActionStatusChange = rowKey => {};
//   const onRightActionStatusChange = rowKey => {};
//   const onRightAction = rowKey => {
//     rightAction(index);
//     closeOpenRow();
//   };
//   const addToList = () => {
//     onAddToList(index);
//   };
//   const onLeftAction = rowKey => {
//     leftAction(index);
//     closeOpenRow();
//   };
//   const onSwipeValueChange = swipeData => {
//     const {key, value} = swipeData;
//     if (value === 0) {
//       onSwipeEnd();
//     }
//   };
//   const getUnitOfMeasureForRandomWeightItems = () => {
//     if (isRandomWeightItem) {
//       return unitOfMeasure || '';
//     }
//     return '';
//   };
//   const renderApproxTextForRandomWeightItems = () => {
//     if (unitOfMeasure === 'ea' && isDropDownSelector) {
//       return <Text allowFontScaling={false} style={styles.approxtest}>approx </Text>;
//     }
//     return null;
//   };
//   const renderSaleBanner = () => {
//     if (bannerType) {
//       return (
//         <FastImage
//           source={IMAGES[bannerType]}
//           style={styles.productBannerImage}
//           resizeMode={FastImage.resizeMode.contain}
//         />
//       );
//     }
//     return <View style={styles.productBannerImage} />;
//   };
//   const renderPriceAndDiscountedPrice = () => {
//     return (
//       <View style={styles.singleItemPriceView}>
//         {/*{onSale ? <Text style={styles.approxtest}>approx</Text> : null}*/}
//
//         <View style={onSale ? styles.salePriceText : null}>
//           <Text
//               allowFontScaling={false}
//             style={[
//               styles.productPriceText,
//               {
//                 fontFamily: onSale ? FONTS.BOLD : FONTS.MEDIUM,
//               },
//             ]}>
//             ${mainPrice}
//           </Text>
//
//         </View>
//         {onSale ? <Text allowFontScaling={false} style={[styles.discountedPriceText, {color: lightColor}]}>${regularPrice}</Text> : null}
//         {/*{renderApproxTextForRandomWeightItems()}*/}
//       </View>
//     );
//   };
//   const renderMainUI = () => {
//     return (
//       <TouchableOpacity activeOpacity={1} style={[styles.productCard, isSwipeAble && {backgroundColor: COLORS.WHITE}]}>
//         <View style={styles.productBannerView}>
//           <ProductImageComponent
//             imageUrl={getImageUrl(sku, isLowBandwidth)}
//             imageStyle={styles.productImage}
//             containerStyle={styles.productImageContainer}
//           />
//           <SnapEligibilityText text={APP_CONSTANTS.SNAP} snapFlag={snapFlag} textStyle={styles.snapFlag} />
//         </View>
//         <View style={styles.productInfoContainer}>
//           <View style={styles.productDescriptionContainer}>
//             <Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={styles.productDescriptionText}>
//               {stringToLowerCase(productName)}
//             </Text>
//             <Pressable style={styles.moreIconWrapper} onPress={onMorePress}>
//               <Text allowFontScaling={false} numberOfLines={2} ellipsizeMode="tail" style={styles.moreIcon}>
//                 {APP_CONSTANTS.MORE}
//               </Text>
//             </Pressable>
//           </View>
//           {!isProductACustomCake && renderApproxTextForRandomWeightItems()}
//           <View style={styles.productPriceParent}>
//
//             {!isProductACustomCake && renderPriceAndDiscountedPrice()}
//             {!isProductACustomCake ? (
//               <>
//                 <ProductQuantityStepper
//                   isRemoveItemEnabled
//                   onMinusPress={() => onMinusPress(index, minimumQuantity)}
//                   onPlusPress={() => onPlusPress(index, minimumQuantity)}
//                   value={quantity}
//                   isMinusDisabled={isMinusDisabled}
//                   qtyLimit={limit}
//                   containerStyle={{left: 3}}
//                   isDisabled={quantity > limit}
//                   isLoading={isLoading}
//                 />
//                 <Text allowFontScaling={false} style={[styles.productPriceText, {start:onSale || unitOfMeasure === 'ea' ?  5 :2 }]}>{getUnitOfMeasureForRandomWeightItems()}</Text>
//               </>
//             ) : (
//               <View />
//             )}
//             <View style={styles.totalPriceContainer}>
//               <Text allowFontScaling={false} numberOfLines={1} style={[styles.productPriceText, {width: '100%', textAlign: 'right'}]}>
//                 ${totalPrice}
//               </Text>
//             </View>
//
//           </View>
//           {onSale ? <Text allowFontScaling={false} style={[styles.discountedPriceText, {color: lightColor}]}>${regularPrice}</Text> : null}
//         </View>
//       </TouchableOpacity>
//     );
//   };
//   const renderHiddenItem = (data, rowMap) => {
//     const rowActionAnimatedValue = new Animated.Value(65);
//     const rowLeftActionAnimatedValue = new Animated.Value(95);
//     return (
//       <CarItemHiddenItem
//         data={data}
//         rowMap={rowMap}
//         rowActionAnimatedValue={rowActionAnimatedValue}
//         rowLeftActionAnimatedValue={rowLeftActionAnimatedValue}
//         onClose={addToList}
//         onDelete={deleteRow}
//       />
//     );
//   };
//   if (isSwipeAble) {
//     return (
//       <SwipeRow
//         onSwipeValueChange={onSwipeValueChange}
//         ref={openRowRef}
//         leftOpenValue={102}
//         disableRightSwipe={isGuest}
//         rightOpenValue={-102}
//         preview={index === 0 && (!isLeftPreviewed || !isRightPreviewed)}
//         previewRepeat={!isLeftPreviewed || !isRightPreviewed}
//         previewOpenValue={!isRightPreviewed ? rightPreview : leftPreview}
//         onRowDidOpen={onRowDidOpen}
//         leftActivationValue={200}
//         swipeGestureBegan={onSwipeStart}
//         swipeGestureEnded={onSwipeEnd}
//         rightActivationValue={-200}
//         keyExtractor={index}
//         previewRepeatDelay={100}
//         onPreviewEnd={() => {
//           if (!isRightPreviewed) {
//             setIsRightPreviewd(true);
//             if (isGuest) {
//               dispatch(setIsGuestCartViewed(true));
//             }
//           } else if (!isLeftPreviewed) {
//             setIsLeftPreviewd(true);
//             if (!isGuest) {
//               dispatch(setIsUserCartViewed(true));
//             }
//           }
//         }}
//         onLeftActionStatusChange={onLeftActionStatusChange}
//         onRightActionStatusChange={onRightActionStatusChange}>
//         {renderHiddenItem()}
//         {renderMainUI()}
//       </SwipeRow>
//     );
//   } else {
//     return renderMainUI();
//   }
// };
// export default CartItemCard;

import React, {useMemo, useRef, useState} from 'react';
import {Animated, Pressable, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS, IMAGES} from '../../theme';
import ProductQuantityStepper from '../ProductQuantityStepper';
import {getImageUrl} from '../../utils/imageUrlUtils';
import ProductImageComponent from '../ProductImageComponent';
import {camelToSnakeCase, stringToLowerCase} from '../../utils/transformUtils';
import useProductItem from '../../hooks/useProductItem';
import {APP_CONSTANTS} from '../../constants/Strings';
import SnapEligibilityText from '../SnapEligibilityText';
import styles from './styles';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import CarItemHiddenItem from './CarItemHiddenItem';
import {SwipeRow} from 'react-native-swipe-list-view';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
// import SwipeRow from '../SwipeRow/SwipeRow';
import useIsGuest from '../../hooks/useIsGuest';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsGuestCartViewed,
  setIsUserCartViewed,
} from '../../redux/actions/config';
const CartItemCard = ({
  item: globalItem = {},
  onMorePress,
  index,
  onPlusPress,
  onMinusPress,
  isLoading = false,
  isSwipeAble = false,
  onRowDidOpen: rowOpen,
  onLeftAction: leftAction,
  onRightAction: rightAction,
  onLeftActionStatusChange: leftStatusChange,
  onRightActionStatusChange: rightStatusChange,
  onDeleteRow,
  onAddToList,
  onSwipeStart = () => {},
  onSwipeEnd = () => {},
}) => {
  const {itemObj: item = {}, ...rest} = globalItem ?? {};
  const isGuest = useIsGuest();
  const {isUserCartViewed, isGuestCartViewed} = useSelector(
    ({config: {isUserCartViewed = false, isGuestCartViewed = false} = {}}) => ({
      isUserCartViewed,
      isGuestCartViewed,
    }),
  );
  const dispatch = useDispatch();
  const snakeCaseRest = useMemo(() => camelToSnakeCase(rest || {}), [rest]);
  const {
    sku,
    quantity,
    mainColor,
    lightColor,
    isLowBandwidth,
    productName,
    getBannerType,
    isOnSale,
    isProductACustomCake,
    isRandomWeightItem,
    limit,
    snapFlag,
    unitOfMeasure,
    mainPrice,
    totalPrice,
    isApplyingAvgPricePerEach,
    minimumQuantity,
    isMinusDisabled,
    isDropDownSelector,
  } = useProductItem({
    entryPoint: MIX_PANEL_SCREENS.CART,
    product: {...snakeCaseRest, ...item},
  });
  const bannerType = getBannerType();
  const {onSale = false, regularPrice = 0.0} = isOnSale();
  const openRowRef = useRef(null);
  const leftPreview = 61;
  const rightPreview = -61;
  const [isLeftPreviewed, setIsLeftPreviewd] = useState(
    isGuest ? true : isUserCartViewed,
  );
  const [isRightPreviewed, setIsRightPreviewd] = useState(
    isGuest ? isGuestCartViewed : isUserCartViewed,
  );
  const deleteRow = () => {
    onDeleteRow(index);
  };
  const onRowDidOpen = () => {
    rowOpen(openRowRef);
  };
  const closeOpenRow = () => {
    if (openRowRef.current && openRowRef.current.closeRow) {
      openRowRef.current.closeRow();
    }
  };
  const onLeftActionStatusChange = rowKey => {};
  const onRightActionStatusChange = rowKey => {};
  const onRightAction = rowKey => {
    rightAction(index);
    closeOpenRow();
  };
  const addToList = () => {
    onAddToList(index);
  };
  const onLeftAction = rowKey => {
    leftAction(index);
    closeOpenRow();
  };
  const onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    if (value === 0) {
      onSwipeEnd();
    }
  };
  const getUnitOfMeasureForRandomWeightItems = () => {
    if (isRandomWeightItem) {
      return unitOfMeasure || '';
    }
    return '';
  };
  const renderApproxTextForRandomWeightItems = () => {
    if (unitOfMeasure === 'ea' && isDropDownSelector) {
      return (
        <Text allowFontScaling={false} style={styles.approxtest}>
          approx{' '}
        </Text>
      );
    }
    return null;
  };
  const renderSaleBanner = () => {
    if (bannerType) {
      return (
        <FastImage
          source={IMAGES[bannerType]}
          style={styles.productBannerImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }
    return <View style={styles.productBannerImage} />;
  };
  const renderPriceAndDiscountedPrice = () => {
    return (
      <View style={styles.singleItemPriceView}>
        {/*{onSale ? <Text style={styles.approxtest}>approx</Text> : null}*/}

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
        {/*{renderApproxTextForRandomWeightItems()}*/}
      </View>
    );
  };
  const renderMainUI = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.productCard,
          isSwipeAble && {backgroundColor: COLORS.WHITE},
        ]}>
        <View style={styles.productBannerView}>
          <ProductImageComponent
            imageUrl={getImageUrl(sku, isLowBandwidth)}
            imageStyle={styles.productImage}
            containerStyle={styles.productImageContainer}
          />
          <SnapEligibilityText
            text={APP_CONSTANTS.SNAP}
            snapFlag={snapFlag}
            textStyle={styles.snapFlag}
          />
        </View>
        <View style={styles.productInfoContainer}>
          <View style={styles.productDescriptionContainer}>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.productDescriptionText}>
              {stringToLowerCase(productName)}
            </Text>
            <Pressable style={styles.moreIconWrapper} onPress={onMorePress}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.moreIcon}>
                {APP_CONSTANTS.MORE}
              </Text>
            </Pressable>
          </View>
          {!isProductACustomCake && renderApproxTextForRandomWeightItems()}
          <View style={styles.productPriceParent}>
            {!isProductACustomCake && renderPriceAndDiscountedPrice()}
            {!isProductACustomCake ? (
              <>
                <ProductQuantityStepper
                  isRemoveItemEnabled
                  onMinusPress={() => onMinusPress(index, minimumQuantity)}
                  onPlusPress={() => onPlusPress(index, minimumQuantity)}
                  value={quantity}
                  isMinusDisabled={isMinusDisabled}
                  qtyLimit={limit}
                  containerStyle={{left: 3}}
                  isDisabled={quantity > limit}
                  isLoading={isLoading}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.productPriceText,
                    {start: onSale || unitOfMeasure === 'ea' ? 5 : 2},
                  ]}>
                  {getUnitOfMeasureForRandomWeightItems()}
                </Text>
              </>
            ) : (
              <View />
            )}
            <View style={styles.totalPriceContainer}>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={[
                  styles.productPriceText,
                  {width: '100%', textAlign: 'right'},
                ]}>
                ${totalPrice}
              </Text>
            </View>
          </View>
          {onSale ? (
            <Text
              allowFontScaling={false}
              style={[styles.discountedPriceText, {color: lightColor}]}>
              ${regularPrice}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(65);
    const rowLeftActionAnimatedValue = new Animated.Value(95);
    return (
      <CarItemHiddenItem
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowLeftActionAnimatedValue={rowLeftActionAnimatedValue}
        onClose={addToList}
        onDelete={deleteRow}
      />
    );
  };
  if (isSwipeAble) {
    return (
      <SwipeRow
        onSwipeValueChange={onSwipeValueChange}
        ref={openRowRef}
        leftOpenValue={102}
        disableRightSwipe={isGuest}
        rightOpenValue={-102}
        preview={index === 0 && (!isLeftPreviewed || !isRightPreviewed)}
        previewRepeat={!isLeftPreviewed || !isRightPreviewed}
        previewOpenValue={!isRightPreviewed ? rightPreview : leftPreview}
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={200}
        swipeGestureBegan={onSwipeStart}
        swipeGestureEnded={onSwipeEnd}
        rightActivationValue={-200}
        keyExtractor={index}
        previewRepeatDelay={100}
        onPreviewEnd={() => {
          if (!isRightPreviewed) {
            setIsRightPreviewd(true);
            if (isGuest) {
              dispatch(setIsGuestCartViewed(true));
            }
          } else if (!isLeftPreviewed) {
            setIsLeftPreviewd(true);
            if (!isGuest) {
              dispatch(setIsUserCartViewed(true));
            }
          }
        }}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}>
        {renderHiddenItem()}
        {renderMainUI()}
      </SwipeRow>
    );
  } else {
    return renderMainUI();
  }
};
export default CartItemCard;
