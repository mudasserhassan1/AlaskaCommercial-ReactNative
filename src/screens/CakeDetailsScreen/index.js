import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {COLORS, IMAGES} from '../../theme';
import styles from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {
  getCakeFrostings,
  getCakesFillings,
  getCakesFlavours,
  getItemsYouMayLike,
  getSingleList,
  triggerItemClickedEvent,
  updateListItems,
} from '../../services/ApiCaller';
import SaleItems from '../../components/SaleItemsAutoPlay';
import ArrowItemComponent from '../../components/ArrowItemComponent';
import CustomButtonComponent from '../../components/CustomButtonComponent';
import BottomSheetModal from '../../components/BottomSheetModal';
import LabelRadioItem from '../../components/LabelRadioItem';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import ProductImageComponent from '../../components/ProductImageComponent';
import {getDetailImageUrl} from '../../utils/imageUrlUtils';
import useProductItem from '../../hooks/useProductItem';
import {snakeToCamelCase} from '../../utils/transformUtils';
import {addItemToCart, getItemsFromCart} from '../../utils/cartUtils';
import {
  itemRWQuantityHandler,
  splitFeaturesIntoArray,
} from '../../utils/productUtils';
import {changeList} from '../../redux/actions/general';
import DialogBox from '../../components/DialogBox';
import ImageComponent from '../../components/ImageComponent';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import SnapEligibilityText from '../../components/SnapEligibilityText';
import {checkIfCakeSelectionsAreComplete} from '../../utils/cakeUtils';
import {CAKE_TYPES} from '../../constants/Common';
import {
  CAKE_INFO_KEYS,
  CAKE_MODALS_INFO,
  CAKE_OPTIONS,
  DECORATION_DATA,
  DIALOG_BOX_DATA,
  DIALOG_BOX_KEYS,
} from './constants';
import ProductUnavailableView from '../../components/ProductUnavailableView';
import useIsGuest from '../../hooks/useIsGuest';
import {STATUSES} from '../../constants/Api';
import {MIX_PANEL_EVENTS, MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {logToConsole} from '../../configs/ReactotronConfig';
import DialogForGuestUser from '../../components/AuthenticationModalForGuestUser';

let allSettled = require('promise.allsettled');
const CakeDetailsScreen = ({navigation, route}) => {
  const {
    item = {},
    list = [],
    listId = '',
    comingFrom = '',
    index,
    listIndex,
    entryPoint,
    departmentName,
    subDepartmentName,
  } = route.params ?? {};

  const {cakeSelections = {}} = item ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [isParentLoading, setIsParentLoading] = useState(false);
  const [cakeModalKey, setCakeModalKey] = useState('');
  const [youMightLikeProducts, setYouMightLikeProducts] = useState([]);
  const [cakeInfo, setCakeInfo] = useState(cakeSelections);
  const [selectedCakeInfo, setSelectedCakeInfo] = useState(cakeSelections);
  const [cakesData, setCakesData] = useState({});
  const [dialogBoxKey, setDialogBoxKey] = useState('');
  const [isDialogBox, setIsDialogBox] = useState(false);
  const [isDialogBoxHidden, setIsDialogBoxHidden] = useState(true);
  const [isUpdatingList, setIsUpdatingList] = useState(false);

  const [featuresState, setFeaturesState] = useState([]);

  const listRef = useRef();
  const selectedCakeInfoRef = useRef();
  const selectedCakeListInfoRef = useRef();

  const isGuest = useIsGuest();

  const [
    isAuthenticatedDialogForGuestUserVisible,
    setIsAuthenticatedDialogForGuestUserVisible,
  ] = useState(false);

  const useShowSnapEligibilitySelector = () =>
    useMemo(
      () => state => state.general.loginInfo?.userInfo?.showSnapEligibility,
      [],
    );

  const useStoreNumberSelector = () =>
    useMemo(
      () => state => state.general.loginInfo?.userInfo?.StoreNumber ?? '',
      [],
    );

  const useIsLowBandwidthSelector = () =>
    useMemo(
      () => state => state.general.loginInfo?.userInfo?.isLowBandwidth ?? false,
      [],
    );

  const useGlobalSubstitutionSelector = () =>
    useMemo(
      () => state =>
        state.general.loginInfo?.userInfo?.GlobalSubstitution ?? false,
      [],
    );

  const useListItemsSelector = () =>
    useMemo(() => state => state.general?.listItems ?? [], []);

  const useStoreDetailSelector = () =>
    useMemo(() => state => state.general?.storeDetail, []);

  const useCartItemsSelector = () =>
    useMemo(() => state => state.general?.cartItems ?? [], []);

  const showSnapEligibility = useSelector(useShowSnapEligibilitySelector());
  const StoreNumber = useSelector(useStoreNumberSelector());
  const isLowBandwidth = useSelector(useIsLowBandwidthSelector());
  const GlobalSubstitution = useSelector(useGlobalSubstitutionSelector());
  const listItems = useSelector(useListItemsSelector());
  const storeDetail = useSelector(useStoreDetailSelector());
  const cartItems = useSelector(useCartItemsSelector());

  const {storeEmailAddress} = storeDetail || {};

  const {
    productId,
    sku,
    productName,
    queryId,
    position,
    features,
    unitOfMeasure,
    snapFlag,
    departmentId,
    subDepartmentId,
    formRequired: cakeType,
    isProductACustomCake,
    price,
    mainColor,
    lightColor,
    renderDialogs,
    renderAddToListModal,
    isOnSale,
    onSelectItem,
    onTrackProduct,
    isTemporaryUnavailable,
  } = useProductItem({
    list: [item],
    product: item,
    entryPoint: MIX_PANEL_SCREENS.PRODUCT_DETAILS,
    departmentName,
    subDepartmentName,
  });

  const isSnapFlag = snapFlag === 'Y' && showSnapEligibility;
  const {onSale = false, regularPrice = 0.0} = isOnSale();

  const unitInCart = useCallback(
    item => {
      const itemExists = cartItems?.find(obj => obj?.item === item?.SKU);
      if (itemExists && item) {
        item.CUSTOMER_UNIT_OF_MEASURE_SELECTION =
          itemExists.customerUnitOfMeasureSelection;
      }
      return item;
    },
    [cartItems],
  );

  useEffect(() => {
    if (dialogBoxKey) {
      setIsDialogBox(true);
    }
  }, [dialogBoxKey]);

  const myToast = useRef();
  const previouslyTrackedId = useRef('');

  useEffect(() => {
    if (productId && productId !== previouslyTrackedId.current) {
      onTrackProduct(MIX_PANEL_EVENTS.VIEW_ITEM_DETAIL_PAGE, entryPoint);
      previouslyTrackedId.current = productId;
    }
  }, [entryPoint, onTrackProduct, productId]);

  useEffect(() => {
    const featuresArray = splitFeaturesIntoArray(features);
    setFeaturesState(featuresArray);
    getYouMayAlsoLikeItems();
    fetchCakesData();
  }, []);

  useEffect(() => {
    if (queryId) {
      triggerItemClickedEvent({queryId, position, SKU: sku});
    }
  }, [queryId, position, sku]);

  useEffect(() => {
    listRef.current = list;
    selectedCakeInfoRef.current = selectedCakeInfo;
  }, [selectedCakeInfo, list]);

  const isAddToCartDisabled = useMemo(() => {
    return checkIfCakeSelectionsAreComplete({
      isProductACustomCake,
      cakeType,
      cakeSelections: selectedCakeInfo,
    });
  }, [cakeType, isProductACustomCake, selectedCakeInfo]);

  const dispatch = useDispatch();

  const fetchCakesData = async () => {
    setIsLoading(true);
    const promises = [getFlavours(), getFrostings()];
    if (cakeType === CAKE_TYPES.FILLED_SHEET_CAKE) {
      promises.push(getFillings());
    }
    const response = await allSettled(promises);
    const [
      {value: flavors = []} = {},
      {value: frostings = []} = {},
      {value: fillings = []} = {},
    ] = response || {};
    setCakesData(prevState => {
      return {
        ...prevState,
        [CAKE_INFO_KEYS.CAKE_FLAVOR]: flavors,
        [CAKE_INFO_KEYS.FROSTING_FLAVOR]: [
          ...frostings,
          {
            [CAKE_MODALS_INFO[CAKE_INFO_KEYS.FROSTING_FLAVOR].dataKey]:
              APP_CONSTANTS.OTHER,
            isRightArrow: true,
          },
        ],
        [CAKE_INFO_KEYS.FILLING]: fillings,
        [CAKE_INFO_KEYS.DECORATION_TYPE]: DECORATION_DATA,
      };
    });
    setIsLoading(false);
  };

  const getYouMayAlsoLikeItems = async () => {
    const params = {
      store: StoreNumber,
      deptId: departmentId,
      classId: subDepartmentId,
      id: productId,
      sku,
    };
    const {response = {}} = (await getItemsYouMayLike(params)) ?? {};
    const {
      ok = false,
      status = '',
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: items = []} = {}} = response || {};
      let modifiedSaleItems = [];
      for (const itm of items) {
        let modifiedItem = await itemRWQuantityHandler(itm);
        modifiedItem = unitInCart(modifiedItem);
        modifiedSaleItems.push(modifiedItem);
      }
      setYouMightLikeProducts(modifiedSaleItems);
      setIsLoading(false);
    } else {
      if (!isUnderMaintenance) {
        throw {status, message: status, isNetworkError};
      }
    }
  };

  const handleSeeAll = () => {
    navigation.navigate('ShopStack', {
      screen: 'Products',
      initial: false,
      params: {
        departmentId: [departmentId],
        subDepartmentId: [subDepartmentId],
      },
    });
  };

  const getFlavours = async () => {
    const {response = {}} = (await getCakesFlavours({type: cakeType})) || {};
    const {
      ok = false,
      status = '',
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: flavours = []} = {}} = response ?? {};
      return flavours;
    } else {
      if (!isUnderMaintenance) {
        throw {status, message: status, isNetworkError};
      }
    }
  };

  const getFrostings = async () => {
    const {response = {}} = (await getCakeFrostings({type: cakeType})) || {};
    const {
      ok = false,
      status = '',
      isNetworkError,
      isUnderMaintenance,
    } = response || {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: frostings = []} = {}} = response || {};
      return frostings;
    } else {
      if (!isUnderMaintenance) {
        throw {status, message: status, isNetworkError};
      }
    }
  };

  const getFillings = async () => {
    const {response = {}} = (await getCakesFillings({type: cakeType})) ?? {};
    const {
      ok = false,
      status = '',
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data: {response: fillings = []} = {}} = response || {};
      return fillings;
    } else {
      if (!isUnderMaintenance) {
        throw {status, message: status, isNetworkError};
      }
    }
  };

  const updateCakeInList = async () => {
    if (comingFrom === APP_CONSTANTS.LIST) {
      setIsUpdatingList(true);
      const listDummy = {...(listRef.current || [])};
      listDummy.Products[index].cakeSelections =
        selectedCakeListInfoRef.current || selectedCakeInfoRef.current;
      selectedCakeListInfoRef.current = undefined;
      const {response = {}} = await updateListItems(
        listDummy?.Products,
        listId,
      );
      const {
        ok = false,
        status = 0,
        isNetworkError,
        isUnderMaintenance,
      } = response ?? {};
      if (ok && status === STATUSES.OK) {
        await getListDetails().then(() => {});
      } else if (!isNetworkError && !isUnderMaintenance) {
        handleApiError();
      }
      setIsUpdatingList(false);
    }
    navigation.goBack();
  };

  const getListDetails = async () => {
    const {response = {}} = await getSingleList(listId);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      const {data = {}} = response ?? {};
      const {response: list = {}} = data ?? {};
      listItems[listIndex] = list;
      dispatch(changeList(listItems));
    } else if (!isNetworkError && !isUnderMaintenance) {
      handleApiError();
    }
  };

  const handleApiError = () => {
    return setDialogBoxKey(DIALOG_BOX_KEYS.API_ERROR);
  };

  const addCakeToCart = async ({isConfirmed} = {}) => {
    if (!isConfirmed) {
      setDialogBoxKey(DIALOG_BOX_KEYS.CAKE_LEAD_TIME);
      return;
    }
    setIsParentLoading(true);
    const finalFormOfCakeInfo = snakeToCamelCase(selectedCakeInfo);
    delete finalFormOfCakeInfo.other;
    const params = {
      products: [
        {
          item: sku,
          store: StoreNumber,
          queryId,
          position,
          createdDate: new Date(),
          formRequired: cakeType,
          substitutionAllowed: GlobalSubstitution,
          cakeSelections: finalFormOfCakeInfo,
        },
      ],
    };
    await addItemToCart(dispatch, params)
      .then(async () => {
        onTrackProduct(
          MIX_PANEL_EVENTS.ADD_ITEM_TO_CART,
          MIX_PANEL_SCREENS.PRODUCT_DETAILS,
        );
        // adding delay, to show loader for 0.4 seconds, in the mean time redux updated..
        setTimeout(() => {
          setIsParentLoading(false);
        }, 400);
        displayMessage('Item added successfully');
        await getItemsFromCart(dispatch);
        selectedCakeListInfoRef.current = selectedCakeInfo;
        setSelectedCakeInfo({});
        setCakeInfo({});
      })
      .catch(e => {
        const {isNetworkError} = e ?? {};
        setIsParentLoading(false);
        if (!isNetworkError) {
          displayMessage(
            APP_CONSTANTS.OOPS + ', ' + APP_CONSTANTS.SOME_THING_WENT_WRONG,
          );
        }
      });
  };

  const closeModal = () => {
    setCakeModalKey('');
  };

  const onPressCakeInfo = label => {
    setCakeInfo(prevState => ({...prevState, [cakeModalKey]: label}));
  };

  const onPressModalBottomButtons = () => {
    if (cakeModalKey === CAKE_INFO_KEYS.FROSTING_FLAVOR) {
      if (cakeInfo[cakeModalKey] === APP_CONSTANTS.OTHER) {
        return setCakeModalKey(CAKE_INFO_KEYS.FROSTING_DESC);
      }
      setSelectedCakeInfo(prevState => ({
        ...prevState,
        [CAKE_INFO_KEYS.FROSTING_DESC]: '',
        [cakeModalKey]: cakeInfo[cakeModalKey],
      }));
      setCakeInfo(prevState => ({
        ...prevState,
        [CAKE_INFO_KEYS.FROSTING_DESC]: '',
      }));
      return closeModal();
    }

    if (cakeModalKey === CAKE_INFO_KEYS.FROSTING_DESC) {
      setSelectedCakeInfo(prevState => ({
        ...prevState,
        [CAKE_INFO_KEYS.FROSTING_FLAVOR]:
          cakeInfo[CAKE_INFO_KEYS.FROSTING_FLAVOR],
        [cakeModalKey]: cakeInfo[cakeModalKey],
      }));
      return closeModal();
    }

    if (cakeModalKey === CAKE_INFO_KEYS.DECORATION_TYPE) {
      if (cakeInfo[cakeModalKey] === APP_CONSTANTS.EMAIL_IMAGE_TO_STORE) {
        setSelectedCakeInfo(prevState => ({
          ...prevState,
          [CAKE_INFO_KEYS.DECORATION_DESC]: '',
          [cakeModalKey]: cakeInfo[cakeModalKey],
        }));
        setCakeInfo(prevState => ({
          ...prevState,
          [CAKE_INFO_KEYS.DECORATION_DESC]: '',
        }));
        return setDialogBoxKey(DIALOG_BOX_KEYS.EMAIL_DECORATION);
      }
      return setCakeModalKey(CAKE_INFO_KEYS.DECORATION_DESC);
    }

    if (cakeModalKey === CAKE_INFO_KEYS.DECORATION_DESC) {
      setSelectedCakeInfo(prevState => ({
        ...prevState,
        [CAKE_INFO_KEYS.DECORATION_TYPE]:
          cakeInfo[CAKE_INFO_KEYS.DECORATION_TYPE],
        [cakeModalKey]: cakeInfo[cakeModalKey],
      }));
      return closeModal();
    }

    setSelectedCakeInfo(prevState => ({
      ...prevState,
      [cakeModalKey]: cakeInfo[cakeModalKey],
    }));

    closeModal();
  };

  const displayMessage = message => {
    myToast?.current?.show(message, 1000);
  };

  const closeAuthenticatedDialogBox = () => {
    setIsAuthenticatedDialogForGuestUserVisible(false);
  };
  const openAuthenticatedDialogBox = () => {
    setIsAuthenticatedDialogForGuestUserVisible(true);
  };
  const continueAsGuestHandling = () => {
    setTimeout(() => addCakeToCart(), 700);
  };

  const onChangeCakeInputFieldsText = text => {
    setCakeInfo(prevState => ({...prevState, [cakeModalKey]: text}));
  };

  const handleCrossPress = () => {
    setCakeInfo(prevState => {
      prevState = {
        ...prevState,
        [cakeModalKey]: selectedCakeInfo[cakeModalKey],
      };
      if (cakeModalKey === CAKE_INFO_KEYS.DECORATION_DESC) {
        prevState = {
          ...prevState,
          [CAKE_INFO_KEYS.DECORATION_TYPE]:
            selectedCakeInfo[CAKE_INFO_KEYS.DECORATION_TYPE],
          [CAKE_INFO_KEYS.DECORATION_DESC]: '',
        };
      }
      if (cakeModalKey === CAKE_INFO_KEYS.FROSTING_DESC) {
        prevState = {
          ...prevState,
          [CAKE_INFO_KEYS.FROSTING_FLAVOR]:
            selectedCakeInfo[CAKE_INFO_KEYS.FROSTING_FLAVOR],
          [CAKE_INFO_KEYS.FROSTING_DESC]: '',
        };
      }
      return prevState;
    });

    return setCakeModalKey('');
  };

  const isModalButtonDisabled = useMemo(() => {
    if (
      [CAKE_INFO_KEYS.FROSTING_FLAVOR, CAKE_INFO_KEYS.DECORATION_TYPE].includes(
        cakeModalKey,
      )
    ) {
      return !cakeInfo[cakeModalKey];
    }
    return (
      !cakeInfo?.[cakeModalKey]?.trim?.() ||
      cakeInfo[cakeModalKey] === selectedCakeInfo[cakeModalKey]
    );
  }, [cakeInfo, cakeModalKey, selectedCakeInfo]);

  const renderListIcon = () => {
    if (!isGuest && !isTemporaryUnavailable) {
      return (
        <TouchableOpacity
          style={styles.listIconButton}
          onPress={() => onSelectItem(item, 0, selectedCakeInfo)}>
          <ImageComponent
            source={IMAGES.MENU_LIST_ICON}
            style={styles.listIcon}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.listIconButton} />;
  };

  const renderProductInfoView = () => {
    return (
      <>
        {isSnapFlag && (
          <View style={styles.snapFlagView}>
            <SnapEligibilityText
              snapFlag={snapFlag}
              textStyle={styles.snapFlag}
            />
          </View>
        )}
        <View style={styles.productInfoParent}>
          <View style={styles.priceAndNameView}>
            {renderPriceContainer?.()}
            <Text
                allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.productNameText}>
              {productName}
            </Text>
          </View>
          {renderListIcon?.()}
        </View>
      </>
    );
  };

  const renderProductUnavailable = () => {
    if (isTemporaryUnavailable) {
      return <ProductUnavailableView containerStyle={styles.unavailable} />;
    }
  };

  const renderPriceContainer = () => (
    <View style={styles.priceContainer}>
      <Text  allowFontScaling={false} style={[styles.itemPriceText, {color: mainColor}]}>
        ${price}{' '}
        {unitOfMeasure !== 'EA' || unitOfMeasure !== 'LB'
          ? 'ea'
          : unitOfMeasure}
      </Text>
      {renderDiscountedPrice()}
    </View>
  );

  const renderDiscountedPrice = () => {
    if (onSale) {
      return (
        <Text allowFontScaling={false} style={[styles.discountedPriceText, {color: lightColor}]}>
          ${regularPrice}
        </Text>
      );
    }
    return null;
  };

  const getCakeOrderDescription = (key, description) => {
    const value = selectedCakeInfo[key];
    if (
      key === CAKE_INFO_KEYS.DECORATION_TYPE &&
      value === APP_CONSTANTS.ENTER_EDIBLE_DECORATION_REQUEST
    ) {
      return `${APP_CONSTANTS.ENTER_REQUEST}, ${
        selectedCakeInfo[CAKE_INFO_KEYS.DECORATION_DESC]
      }`;
    }
    if (
      key === CAKE_INFO_KEYS.FROSTING_FLAVOR &&
      value === APP_CONSTANTS.OTHER
    ) {
      return `${APP_CONSTANTS.OTHER}, ${
        selectedCakeInfo[CAKE_INFO_KEYS.FROSTING_DESC]
      }`;
    }
    return value || description;
  };

  const renderSnapFlagText = () => (
    <Text allowFontScaling={false} style={styles.eligibleText}>{APP_CONSTANTS.ELIGIBLE_FOR_SNAP}</Text>
  );

  const renderFeaturesContainer = () => (
    <View style={styles.featuresParent}>
      <Text allowFontScaling={false} style={styles.featureTextHeader}>
        {APP_CONSTANTS.PRODUCT_FEATURES}
      </Text>
      {snapFlag === 'Y' && renderSnapFlagText()}
      {featuresState?.map(feature => {
        if (feature) {
          return <Text allowFontScaling={false} style={styles.featuresText}>{feature}</Text>;
        }
        return null;
      })}
    </View>
  );

  const renderCustomizeContainer = () => (
    <View style={styles.featuresParent}>
      <Text allowFontScaling={false} style={styles.featureTextHeader}>
        {cakeType === CAKE_TYPES.CUPCAKE
          ? APP_CONSTANTS.CUSTOMIZE_YOUR_CUPCAKE
          : APP_CONSTANTS.CUSTOMIZE_YOUR_CAKE}
      </Text>
      <Text allowFontScaling={false} style={styles.featuresText}>
        {APP_CONSTANTS.CUSTOMIZE_CAKE_DESC}
      </Text>
    </View>
  );

  const renderYouMayLikeHeader = () => (
    <View style={styles.youMightAlsoLikeHeaderView}>
      <Text allowFontScaling={false} style={styles.youMayLikeHeaderText}>
        {APP_CONSTANTS.YOU_MIGHT_ALSO_LIKE}
      </Text>
      {/*<TouchableOpacity onPress={handleSeeAll}>*/}
      {/*  <Text style={styles.seeAllText}>{APP_CONSTANTS.SEE_ALL}</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
  );

  const renderProductImage = () => {
    return (
      <ProductImageComponent
        isDetails
        imageUrl={getDetailImageUrl(sku, isLowBandwidth)}
        containerStyle={styles.productDetailImageWrapper}
        imageStyle={styles.productDetailImage}
      />
    );
  };

  const renderSuggestedProductsContainer = () => {
    if (isLoading) {
      return (
        <View style={styles.youMayLikeParent}>
          {renderYouMayLikeHeader}
          <ActivityIndicator
            size={'small'}
            color={COLORS.MAIN}
            style={{marginTop: heightPercentageToDP('2%')}}
          />
        </View>
      );
    }
    if (youMightLikeProducts?.length) {
      return (
        <View style={styles.youMayLikeParent}>
          {renderYouMayLikeHeader()}
          <SaleItems
            item={item}
            entryPoint={MIX_PANEL_SCREENS.ITEMS_YOU_MAY_LIKE}
            onItemPress={clickedItem =>
              navigation.push('ProductDetails', {
                entryPoint: MIX_PANEL_SCREENS.PRODUCT_DETAILS,
                item: clickedItem,
                departmentName,
                subDepartmentName,
              })
            }
            data={youMightLikeProducts}
          />
        </View>
      );
    }
  };

  const handleAddToCart = () => {
    if (isGuest && cartItems.length === 0) {
      openAuthenticatedDialogBox();
    } else {
      addCakeToCart();
    }
  };

  const renderCakeOrderOptions = () => (
    <>
      <View style={styles.cakeFeaturesContainer}>
        {CAKE_OPTIONS[cakeType].map(option => {
          const {title = '', description = '', key = ''} = option || {};
          return (
            <ArrowItemComponent
              key={String(key)}
              title={title}
              description={getCakeOrderDescription(key, description)}
              onItemPress={() => setCakeModalKey(key)}
              descriptionStyles={
                selectedCakeInfo[key] ? styles.descriptionTextStyles : {}
              }
            />
          );
        })}
      </View>
      <View style={styles.AddToCartContainer}>
        <CustomButtonComponent
          showCartIcon
          buttonTitle={APP_CONSTANTS.ADD_TO_CART}
          disabled={isAddToCartDisabled}
          onPress={handleAddToCart}
          containerStyle={[
            styles.customizeButtonContainer,
            {
              backgroundColor: isAddToCartDisabled
                ? COLORS.DISABLE_BUTTON_COLOR
                : COLORS.MAIN,
            },
          ]}
          textStyle={styles.addToCartStyles}
        />
      </View>
    </>
  );

  const renderModals = () => {
    const {title, buttonTitle, cupCakeTitle} =
      CAKE_MODALS_INFO[cakeModalKey] ?? {};
    const modalTitle =
      cakeModalKey === CAKE_INFO_KEYS.CAKE_FLAVOR &&
      cakeType === CAKE_TYPES.CUPCAKE
        ? cupCakeTitle
        : title;

    return (
      <BottomSheetModal
        title={modalTitle}
        visible={!!cakeModalKey}
        onCrossPress={handleCrossPress}
        onBottomPress={onPressModalBottomButtons}
        buttonTitle={buttonTitle}
        isLoading={isLoading}
        isButtonDisabled={isModalButtonDisabled}
        containerStyle={{paddingStart: 0, paddingEnd: 0}}>
        {renderModalBody()}
        {renderDialogBox()}
      </BottomSheetModal>
    );
  };

  const renderModalBody = () => {
    const {dataKey, placeHolder, maxLength, description} =
      CAKE_MODALS_INFO[cakeModalKey] || {};
    if (placeHolder) {
      return (
        <View style={styles.modalInputContainer}>
          {!!description && (
            <Text allowFontScaling={false} style={styles.modalDescription}>{description}</Text>
          )}
          <TextInput
              allowFontScaling={false}
            maxLength={maxLength || 200}
            multiline
            autoFocus
            placeholder={placeHolder}
            placeholderTextColor={COLORS.GRAY_5}
            value={cakeInfo?.[cakeModalKey]}
            fontSize={Platform.OS === 'ios' ? 17 : 15}
            onChangeText={onChangeCakeInputFieldsText}
            style={styles.descriptionInput}
          />
          {!!maxLength && (
            <Text allowFontScaling={false} style={styles.limitText}>{`${
              cakeInfo?.[cakeModalKey]?.length ?? 0
            }/${maxLength}`}</Text>
          )}
        </View>
      );
    }
    return cakesData[cakeModalKey]?.map(data => {
      const {[dataKey]: label, isRightArrow} = data ?? {};
      return (
        <LabelRadioItem
          key={String(label)}
          isSelected={label === cakeInfo?.[cakeModalKey]}
          onItemPress={onPressCakeInfo}
          label={label}
          isRightArrow={isRightArrow}
        />
      );
    });
  };

  const renderToast = () => (
    <ToastComponent toastRef={myToast} position={'bottom'} />
  );

  const onDialogBoxHide = () => {
    setIsDialogBoxHidden(true);
    setDialogBoxKey('');
  };

  const onCloseDialogBox = () => {
    setDialogBoxKey('');
    setIsDialogBox(false);
  };

  const onConfirmPress = () => {
    onCloseDialogBox();
    switch (dialogBoxKey) {
      case DIALOG_BOX_KEYS.EMAIL_DECORATION:
        setTimeout(closeModal, 400);
        break;
      case DIALOG_BOX_KEYS.CAKE_LEAD_TIME:
        addCakeToCart({isConfirmed: true});
        break;
    }
  };

  const onCancelPress = () => {
    onCloseDialogBox();
    switch (dialogBoxKey) {
      case DIALOG_BOX_KEYS.EMAIL_DECORATION:
        setTimeout(closeModal, 400);
    }
  };

  const dialogBoxMessage = useMemo(() => {
    if (dialogBoxKey === DIALOG_BOX_KEYS.EMAIL_DECORATION) {
      return `${APP_CONSTANTS.DECORATION_EMAIL_INSTRUCTIONS_I} ${
        storeEmailAddress || 'store'
      } ${APP_CONSTANTS.DECORATION_EMAIL_INSTRUCTIONS_II}`;
    }
    return DIALOG_BOX_DATA[dialogBoxKey]?.message || '';
  }, [dialogBoxKey, storeEmailAddress]);
  const dialogBoxMessageComponent = useMemo(() => {
    if (dialogBoxKey === DIALOG_BOX_KEYS.EMAIL_DECORATION) {
      return (
        <Text allowFontScaling={false}>
          {APP_CONSTANTS.DECORATION_EMAIL_INSTRUCTIONS_I}{' '}
          {storeEmailAddress ? (
            <Text
                allowFontScaling={false}
              style={{color: COLORS.BLUE, textDecorationLine: 'underline'}}
              onPress={() => {
                Linking.openURL('mailto:' + storeEmailAddress);
              }}>
              {storeEmailAddress}
            </Text>
          ) : (
            <Text allowFontScaling={false}>{'store'}</Text>
          )}{' '}
          <Text allowFontScaling={false}>{APP_CONSTANTS.DECORATION_EMAIL_INSTRUCTIONS_II}</Text>
        </Text>
      );
    }
    return <Text allowFontScaling={false}>{DIALOG_BOX_DATA[dialogBoxKey]?.message || ''}</Text>;
  }, [dialogBoxKey, storeEmailAddress]);

  const renderDialogBox = () => {
    const {title, isSingleButton, leftButtonTitle, rightButtonTitle} =
      DIALOG_BOX_DATA[dialogBoxKey] || {};
    return (
      <DialogBox
        visible={isDialogBox}
        title={title}
        isSingleButton={isSingleButton}
        message={dialogBoxMessageComponent}
        isMessageComponent={true}
        onModalHide={onDialogBoxHide}
        onModalWillShow={() => setIsDialogBoxHidden(false)}
        closeModal={onCloseDialogBox}
        cancelButtonLabel={leftButtonTitle}
        confirmButtonLabel={rightButtonTitle}
        onConfirmPress={onConfirmPress}
        onCancelPress={onCancelPress}
      />
    );
  };

  const renderCakeSelections = () => {
    if (!isTemporaryUnavailable) {
      return (
        <>
          {renderCustomizeContainer()}
          {renderCakeOrderOptions()}
        </>
      );
    }
  };

  return (
    <>
      <ScreenWrapperComponent
        headerTitle={APP_CONSTANTS.DETAILS}
        withBackButton
        showCartButton
        onBackButtonPress={updateCakeInList}
        isLoading={
          (isLoading || isParentLoading || isUpdatingList) && isDialogBoxHidden
        }>
        <View style={styles.imageSliderContainer}>
          {renderProductImage()}
          {renderProductInfoView()}
          {renderProductUnavailable()}
        </View>
        {renderFeaturesContainer()}
        {renderCakeSelections()}
        {!isLoading || youMightLikeProducts.length !== 0
          ? renderSuggestedProductsContainer()
          : null}
        {renderModals()}
        {!cakeModalKey && renderDialogBox()}
        {renderAddToListModal}
        {renderDialogs}
      </ScreenWrapperComponent>
      {renderToast()}
      <DialogForGuestUser
        isVisible={isAuthenticatedDialogForGuestUserVisible}
        onClose={closeAuthenticatedDialogBox}
        continueAsGuestHandling={continueAsGuestHandling}
      />
    </>
  );
};

export default CakeDetailsScreen;
