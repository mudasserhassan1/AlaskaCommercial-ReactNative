import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {styles} from '../../screens/ShoppingCart/styles';
import {Image, Switch, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import {removeItemsFromCart, updateCartProducts} from '../../utils/cartUtils';
import {useDispatch, useSelector} from 'react-redux';
import {APP_CONSTANTS} from '../../constants/Strings';
import DialogBox from '../DialogBox';
import Spinner from 'react-native-loading-spinner-overlay';
import useProductItem from '../../hooks/useProductItem';
import {camelToSnakeCase} from '../../utils/transformUtils';
import BottomSheetModal from '../BottomSheetModal';
import useIsGuest from '../../hooks/useIsGuest';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';

const CartMoreModal = forwardRef(
  (
    {
      visible,
      onRequestClose,
      selectedItem,
      selectedItemIndex,
      cakeSelections,
      setLoading,
      onDeleted,
    },
    ref,
  ) => {
    // const {cartItems = [], StoreNumber} = useSelector(
    //   ({general: {cartItems = [], loginInfo: {userInfo: {StoreNumber = 0} = {}} = {}} = {}}) => ({
    //     cartItems,
    //     StoreNumber,
    //   }),
    // );
    const useCartItemsSelector = () =>
      useMemo(() => state => state?.general.cartItems ?? [], []);

    const useStoreNumberSelector = () =>
      useMemo(
        () => state => state.general?.loginInfo?.userInfo?.StoreNumber ?? 0,
        [],
      );

    const cartItems = useSelector(useCartItemsSelector());
    const StoreNumber = useSelector(useStoreNumberSelector());

    const item = selectedItem || {};

    const {
      renderDialogs,
      onSelectItem,
      isProductACustomCake,
      isProductACustomCupCake,
    } = useProductItem({
      product: item?.itemObj,
      entryPoint: MIX_PANEL_SCREENS.CART,
    });

    const {substitutionAllowed = false} = item || {};
    const [substituteEnabled, setSubstituteEnabled] =
      useState(substitutionAllowed);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisibleLimited, setIsVisibleLimited] = useState(false);
    const [isVisibleRemoveItemDialog, setIsVisibleRemoveItemDialog] =
      useState(false);
    const [isVisibleApiErrorDialog, setIsVisibleApiErrorDialog] =
      useState(false);

    const dispatch = useDispatch();
    const isGuest = useIsGuest();

    const hideSubstituteOption = isProductACustomCake;

    useImperativeHandle(ref, () => ({
      onRemoveItemFromCart: () => {
        setIsVisibleRemoveItemDialog(true);
        setIsVisibleLimited(true);
      },
      onRemoveItemFromCartWithoutConfirmation: () => {
        removeItemFromCart();
      },
    }));

    useEffect(() => {
      setSubstituteEnabled(substitutionAllowed);
    }, [substitutionAllowed, visible]);

    const isBtnDisabled = useMemo(
      () => substitutionAllowed === substituteEnabled,
      [substitutionAllowed, substituteEnabled],
    );

    const toggleSwitch = () =>
      setSubstituteEnabled(previousState => !previousState);

    const removeItemFromCart = async () => {
      isVisibleRemoveItemDialog && setIsVisibleRemoveItemDialog(false);
      isVisibleApiErrorDialog && setIsVisibleApiErrorDialog(false);
      apiCallWithTimeout();
    };

    const closeModal = () => {
      setIsVisibleLimited(false);
      setIsVisibleRemoveItemDialog(false);
      onDeleted();
    };

    const apiCallWithTimeout = () =>
      setTimeout(async () => {
        setIsLoading(true);
        if (isVisibleLimited) {
          setLoading(true);
        }
        removeItemsFromCart(dispatch, item)
          .then(() => {
            closeModal();
            onRequestClose();
          })
          .catch(e => {
            const {isNetworkError} = e || {};
            if (!isNetworkError) {
              setIsVisibleApiErrorDialog(true);
            }
          })
          .finally(() => {
            setIsLoading(false);
            setLoading(false);
          });
      }, 300);

    const performSaveAction = async () => {
      setIsLoading(true);
      let newCartItems = [...cartItems];
      let modifiedItem = newCartItems[selectedItemIndex];
      modifiedItem.substitutionAllowed = substituteEnabled;
      newCartItems[selectedItemIndex] = modifiedItem;
      await updateCartProducts(newCartItems, dispatch, StoreNumber)
        .then(() => {
          setIsLoading(false);
          onRequestClose();
        })
        .catch(e => {
          setIsLoading(false);
          onRequestClose();
          handleApiError();
        });
    };

    const getDialogMessage = () => {
      if (isProductACustomCake) {
        return isProductACustomCupCake
          ? APP_CONSTANTS.REMOVE_CUPCAKE_FROM_ORDER_MESSAGE
          : APP_CONSTANTS.REMOVE_CAKE_FROM_ORDER_MESSAGE;
      }
      return APP_CONSTANTS.REMOVE_FROM_ORDER_MESSAGE;
    };

    const handleApiError = () => {
      return setIsVisibleApiErrorDialog(true);
    };
    const renderApiErrorDialog = () => {
      return (
        <DialogBox
          visible={isVisibleApiErrorDialog}
          closeModal={() => setIsVisibleApiErrorDialog(false)}
          title={APP_CONSTANTS.ALASKA_COMMERCIAL}
          message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
          confirmButtonLabel={APP_CONSTANTS.RETRY}
          cancelButtonLabel={APP_CONSTANTS.CANCEL}
          onConfirmPress={removeItemFromCart}
          onCancelPress={() => setIsVisibleApiErrorDialog(false)}
        />
      );
    };
    const renderRemoveItemDialog = () => {
      return (
        <DialogBox
          visible={isVisibleRemoveItemDialog}
          title={APP_CONSTANTS.REMOVE_FROM_ORDER}
          message={getDialogMessage()}
          closeModal={closeModal}
          messageContainerStyles={{marginTop: 5}}
          confirmButtonLabel={APP_CONSTANTS.YES}
          cancelButtonLabel={APP_CONSTANTS.NO}
          onConfirmPress={removeItemFromCart}
          onCancelPress={closeModal}
        />
      );
    };

    const renderSubstitutionOption = () => {
      if (!hideSubstituteOption) {
        return (
          <>
            <View style={styles.listRow}>
              <Text allowFontScaling={false} style={styles.createListText}>
                {APP_CONSTANTS.SUBSTITUTION_ALLOWED}
              </Text>
              <Switch
                trackColor={{
                  false: COLORS.SWITCH_COLOR,
                  true: COLORS.SWITCH_ON_COLOR,
                }}
                thumbColor={COLORS.WHITE}
                ios_backgroundColor={COLORS.SWITCH_COLOR}
                onValueChange={toggleSwitch}
                value={substituteEnabled}
              />
            </View>
            <View style={styles.divider} />
          </>
        );
      }
      return null;
    };

    const renderListButton = () => {
      if (!isGuest) {
        return (
          <>
            <TouchableOpacity
              style={[styles.listRow, styles.listRow1]}
              onPress={() =>
                onSelectItem(
                  item.itemObj,
                  0,
                  camelToSnakeCase(item.cakeSelections),
                )
              }>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text allowFontScaling={false} style={styles.createListText}>Add to List</Text>
              </View>
              <View style={styles.rightArrow}>
                <Image
                  source={IMAGES.RIGHT_ARROW}
                  style={styles.rightArrowStyle}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        );
      }
      return null;
    };

    if (isVisibleLimited) {
      return <>{renderRemoveItemDialog()}</>;
    }

    return (
      <BottomSheetModal
        visible={visible}
        title={APP_CONSTANTS.MORE}
        onCrossPress={onRequestClose}
        showButton={!hideSubstituteOption}
        buttonTitle={APP_CONSTANTS.SAVE}
        isButtonDisabled={isBtnDisabled}
        onBottomPress={performSaveAction}
        hasBackdrop={!isVisibleLimited}>
        <View>
          {renderSubstitutionOption()}
          {renderListButton()}
          <TouchableOpacity
            style={[styles.listRow, styles.listRow1]}
            onPress={() => setIsVisibleRemoveItemDialog(true)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text allowFontScaling={false} style={styles.createListText}>
                {APP_CONSTANTS.REMOVE_FROM_ORDER}
              </Text>
            </View>
            <View style={styles.rightArrow}>
              <Image
                source={IMAGES.RIGHT_ARROW}
                style={styles.rightArrowStyle}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>
        <Spinner visible={isLoading} color={COLORS.MAIN} />
        {renderApiErrorDialog()}
        {renderRemoveItemDialog()}
        {renderDialogs}
      </BottomSheetModal>
    );
  },
);

export default CartMoreModal;
