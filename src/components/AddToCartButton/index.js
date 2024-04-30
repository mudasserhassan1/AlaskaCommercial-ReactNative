import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {APP_CONSTANTS} from '../../constants/Strings';
import {COLORS, IMAGES} from '../../theme';
import {addItemToCart, getItemsFromCart} from '../../utils/cartUtils';
import ImageComponent from '../ImageComponent';
import {isCustomCake} from '../../utils/cakeUtils';
import {snakeToCamelCase} from '../../utils/transformUtils';
import useCakeTimeModal from '../../hooks/useCakeTimeModal';
import styles from './styles';
import {getItemPriceQuantity} from '../../utils/productUtils';
import useIsGuest from '../../hooks/useIsGuest';
import DialogForGuestUser from '../AuthenticationModalForGuestUser';
import {logToConsole} from '../../configs/ReactotronConfig';
import {updateCartItemsCount} from '../../redux/actions/general';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const AddToCartButton = ({
  containerStyle,
  item,
  isProductACustomCake,
  isDisabled,
  showConfirmation,
  showDisabledColor,
  onAddToCartSuccess,
  isHomeIcon,
}) => {
  const [isLoading, setIsLoading] = useState(() => false);
  const [isProductPartyTray, setIsProductPartyTray] = useState(false);
  const isGuest = useIsGuest();
  const [
    isAuthenticatedDialogForGuestUserVisible,
    setIsAuthenticatedDialogForGuestUserVisible,
  ] = useState(false);

  const navigation = useNavigation();
  const {
    setIsVisibleCakeTimeModal,
    setIsPartyTrayTimeModal,
    renderCakeTimeModal,
  } = useCakeTimeModal({
    onConfirmPress: params => addToCartApi(params),
  });

  useEffect(() => {
    const {item: innerItem = []} = item ?? {};
    let {PARTY_TRAY_FLAG: partyFlag = ''} = innerItem?.[0] ?? {};
    if (partyFlag === 'Y' || partyFlag === 'y') {
      return setIsProductPartyTray(true);
    }
  }, [isProductPartyTray]);

  const useCartItemsSelector = () =>
    useMemo(() => state => state.general?.cartItems ?? [], []);

  const useStoreNumberSelector = () =>
    useMemo(
      () => state => state.general?.loginInfo?.userInfo.StoreNumber ?? '',
      [],
    );

  const useGlobalSubstitutionSelector = () =>
    useMemo(
      () => state =>
        state.general.loginInfo?.userInfo?.GlobalSubstitution ?? false,
      [],
    );

  const StoreNumber = useSelector(useStoreNumberSelector());
  const GlobalSubstitution = useSelector(useGlobalSubstitutionSelector());
  const cartItems = useSelector(useCartItemsSelector());

  const dispatch = useDispatch();

  function isItemInCart(itemId) {
    for (const cartItem of cartItems) {
      if (cartItem.itemObj._id === itemId) {
        return true;
      }
    }
    return false;
  }

  const addToCartApi = async ({
    isCakeModalDisplayed = false,
    isPartyItemDisplayed = false,
  } = {}) => {
    boxOpacity.value = withTiming(0, {duration: 500});
    boxWidth.value = withSpring(widthPercentageToDP('25%'));

    const isItemInCart_ = isItemInCart(item?._id);
    if (isProductACustomCake && !isCakeModalDisplayed) {
      return setIsVisibleCakeTimeModal(true);
    }
    if (isProductPartyTray && !isPartyItemDisplayed) {
      return setIsPartyTrayTimeModal(true);
    }
    setIsLoading(true);
    const {
      SKU: sku = '',
      item: innerItem = [],
      CUSTOMER_UNIT_OF_MEASURE_SELECTION = '',
      QUERY_ID: queryId,
      POSITION: position,
    } = item || {};
    if (!isItemInCart_) {
      dispatch(updateCartItemsCount(cartItems?.length + 1));
    }
    const {FORM_REQUIRED: formRequired = ''} = innerItem?.[0] || {};
    let {quantity} = getItemPriceQuantity(item);
    let params = {
      products: [
        {
          item: sku,
          quantity: quantity,
          store: StoreNumber,
          formRequired: formRequired,
          queryId,
          position,
          createdDate: new Date(),
          substitutionAllowed: GlobalSubstitution,
          customerUnitOfMeasureSelection: CUSTOMER_UNIT_OF_MEASURE_SELECTION,
          ...(isCustomCake(item) && {
            cakeSelections: snakeToCamelCase(item.cakeSelections),
          }),
        },
      ],
    };
    await addItemToCart(dispatch, params)
      .then(async () => {
        onAddToCartSuccess?.();
        // adding delay, to show loader for 0.4 seconds, in the mean time redux updated..
        showConfirmation('Item added successfully');
        await getItemsFromCart(dispatch);
        setTimeout(() => {
          setIsLoading(false);
          // boxOpacity.value = withTiming(1, { duration: 500 });
          // boxWidth.value = withSpring(30);
        }, 400);
      })
      .catch(e => {
        const {isNetworkError} = e ?? {};
        setIsLoading(false);
        if (!isNetworkError) {
          showConfirmation(APP_CONSTANTS.SOME_THING_WENT_WRONG);
        }
      });
  };

  const boxOpacity = useSharedValue(1);
  const boxWidth = useSharedValue(widthPercentageToDP('25%'));

  const loadingStyle = useAnimatedStyle(() => {
    return {
      width: boxWidth.value,
    };
  });

  const renderLoading = () => {
    return (
      <Animated.View style={[styles.quantitychange, loadingStyle]}>
        <ImageComponent
          source={IMAGES.DELETE_ICON}
          style={[styles.quantitychangeicon]}
        />
        <ActivityIndicator color={COLORS.WHITE} size={20} />
        <ImageComponent
          source={IMAGES.INCREASE_ICON}
          style={[styles.quantitychangeicon]}
        />
      </Animated.View>
    );
  };

  const closeAutheticatedDialogBox = () => {
    setIsAuthenticatedDialogForGuestUserVisible(false);
  };
  const continueAsGuestHandling = () => {
    if (isCustomCake(item)) {
      onPressCustomizeCakeHandler();
    } else {
      setTimeout(() => addToCartApi().then(r => {}), 700);
    }
  };

  const onPressCustomizeCakeHandler = () => {
    navigation.push('CakesDetailsScreen', {item});
  };

  const renderContent = () => {
    if (isCustomCake(item)) {
      return <Text allowFontScaling={false} style={styles.customizableText}>Customize</Text>;
    } else {
      if (isHomeIcon && !isCustomCake(item)) {
        return (
          <View style={styles.box}>
            <ImageComponent
              source={IMAGES.INCREASE_ICON}
              style={[styles.quantitychangeicon]}
            />
          </View>
        );
      } else {
        return (
          <>
            {isLoading ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <>
                <View style={styles.addToCartTextWrapper}>
                  <Text allowFontScaling={false} style={styles.addToCartText}>{APP_CONSTANTS.ADD_}</Text>
                </View>
                <View style={styles.cartImageWrapper}>
                  <ImageComponent
                    source={IMAGES.CART_ICON}
                    style={styles.cartImage}
                  />
                </View>
              </>
            )}
          </>
        );
      }
    }
  };
  return (
    <>
      <TouchableOpacity
        disabled={isDisabled || isLoading}
        activeOpacity={0.9}
        style={[
          isCustomCake(item)
            ? styles.customcakeaddtocart
            : isHomeIcon && !isCustomCake(item)
            ? styles.addToCartCardItem
            : styles.addToCartCard,
          {
            backgroundColor:
              isDisabled && showDisabledColor ? '#b3b3b3' : COLORS.MAIN,
          },
          containerStyle,
        ]}
        onPress={() => {
          if (isCustomCake(item)) {
            onPressCustomizeCakeHandler();
          } else if (isGuest && cartItems.length === 0) {
            setIsAuthenticatedDialogForGuestUserVisible(true);
          } else {
            addToCartApi().then(r => {});
          }
        }}>
        {/*{isLoading ? renderLoading() : renderContent()}*/}
        {renderContent()}
      </TouchableOpacity>

      {renderCakeTimeModal()}
      <DialogForGuestUser
        isVisible={isAuthenticatedDialogForGuestUserVisible}
        onClose={closeAutheticatedDialogBox}
        continueAsGuestHandling={continueAsGuestHandling}
      />
    </>
  );
};
export default AddToCartButton;
