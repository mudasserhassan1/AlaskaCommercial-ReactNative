import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

//Local imports
import DialogBox from '../../components/DialogBox';
import {lodashDebounce} from '../../utils/transformUtils';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import SearchComponent from '../../components/SearchComponent';
import SaleItems from '../../components/SaleItemsAutoPlay';
import NotificationsModal from '../../components/NotificationModal';
import VirtualWalletModal from '../../components/VirtualWalletModal';
import {
  getAppLatestVersion,
  getItems,
  getNotificationSettings,
} from '../../services/ApiCaller';
import {
  saveLoginInfo,
  savePreviousSearches,
  setDeeplinkData,
  setDisabledDates,
} from '../../redux/actions/general';
import ActiveSearchView from '../../components/ActiveSearchView';
import TrendingSearchView from '../../components/TrendingSearchView';
import {APP_CONSTANTS} from '../../constants/Strings';
import {getItemsFromCart} from '../../utils/cartUtils';
import QualtricsComponent from '../../components/QualtricsComponent';
import NotificationHandler from '../../containers/NotificationHandler';
import PromoBar from '../../components/PromoBar';
import ImageComponent from '../../components/ImageComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {NavigationService} from '../../utils/navigationUtils';
import {CancelToken} from 'apisauce';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import {useIsFocused} from '@react-navigation/native';
import useIsGuest from '../../hooks/useIsGuest';
import {itemRWQuantityHandler} from '../../utils/productUtils';
import {STATUSES} from '../../constants/Api';
import {MIX_PANEL_SCREENS} from '../../constants/Mixpanel';
import {emitter} from '../../navigation/navigators/BottomTabsNavigator';
import {TAB_EVENTS} from '../../constants/Events';
import MarketingOptInModal from '../../components/MarketingOptInModal';
import HomeDepartments from '../../components/HomeDepartments';
import useHomeAPIs from './useHomeAPIs';
import HomePagerBannerView from '../../components/HomePageBannerView';
import {isiPhone7or8} from '../../utils/DeviceModal';
import {logToConsole} from '../../configs/ReactotronConfig';

let apiSource;

const Home = ({navigation}) => {
  // const {
  //   loginInfo = {},
  //   previousSearches = [],
  //   isPromoVisible,
  //   deeplinkData = {},
  //   isBiometricsModal = false,
  // } = useSelector(({general}) => general);

  // const {
  //   promos = [],
  //   homeSaleItems = [],
  //   isFirstVisit = false,
  //   popularItemsInYourArea = [],
  // } = useSelector(({config}) => config);

  const loginInfoSelector = useMemo(
    () => state => state.general?.loginInfo,
    [],
  );

  const previousSearchesSelector = useMemo(
    () => state => state.general?.previousSearches,
    [],
  );

  const isPromoVisibleSelector = useMemo(
    () => state => state.general?.isPromoVisible,
    [],
  );

  const deeplinkDataSelector = useMemo(
    () => state => state.general?.deeplinkData,
    [],
  );

  const isBiometricsModalSelector = useMemo(
    () => state => state.general?.isBiometricsModal,
    [],
  );

  const loginInfo = useSelector(loginInfoSelector);
  const previousSearches = useSelector(previousSearchesSelector);
  const isPromoVisible = useSelector(isPromoVisibleSelector);
  const deeplinkData = useSelector(deeplinkDataSelector);
  const isBiometricsModal = useSelector(isBiometricsModalSelector);

  const promosSelector = useMemo(() => state => state.config?.promos, []);

  const homeSaleItemsSelector = useMemo(
    () => state => state.config?.homeSaleItems,
    [],
  );

  const isFirstVisitSelector = useMemo(
    () => state => state.config?.isFirstVisit,
    [],
  );

  const popularItemsInYourAreaSelector = useMemo(
    () => state => state.config?.popularItemsInYourArea,
    [],
  );

  const disabledDatesSelector = useMemo(
    () => state => state.general?.disabledDates || [],
    [],
  );

  const promos = useSelector(promosSelector);
  const homeSaleItems = useSelector(homeSaleItemsSelector);
  const isFirstVisit = useSelector(isFirstVisitSelector);
  const popularItemsInYourArea = useSelector(popularItemsInYourAreaSelector);
  const disabledDates_ = useSelector(disabledDatesSelector);

  const isGuest = useIsGuest();

  const {userInfo = {}, userId = ''} = loginInfo ?? {};
  const {
    isLowBandwidth = false,
    FirstName = '',
    ZipCode = '',
    Store = '',
    StoreNumber = '',
    isVWRewarded,
    isSMSOptIn,
    isEmailOptIn,
  } = userInfo ?? {};
  const ntfModalRef = useRef(null);
  const ntfModalVisibleRef = useRef(null);
  const storeNumRef = useRef(StoreNumber);
  const userIdRef = useRef('');

  const dispatch = useDispatch();
  const displayNotificationModal = (notification, flag) => {
    ntfModalRef.current?.setClickedNotification?.(notification);
    if (!flag && ntfModalVisibleRef.current) {
      ntfModalRef.current?.getNotifications?.();
    }
    setTimeout(() => toggleModal(true), flag ? 3000 : 1500);
  };

  const [isNotificationModal, setIsNotificationModal] = useState(false);
  const [isWalletModal, setIsWalletModal] = useState(false);
  const [isRewardModal, setIsRewardModal] = useState(false);
  const [isMarketingOptInModal, setIsMarketingOptInModal] = useState(false);
  const [isSearchActivated, setIsSearchActivated] = useState(false);
  const [search, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noRecordBoolean, setNoRecordBoolean] = useState(false);
  const {onFetchHomeData, onDisplayBadge} = useHomeAPIs({
    StoreNumber,
    userId,
    isGuest,
  });

  const toggleModal = useCallback((visible, openVWModal) => {
    setIsNotificationModal(visible);
    if (openVWModal) {
      setTimeout(() => setIsWalletModal(true), 700);
    }
  }, []);

  const toggleWalletModal = useCallback(
    () => setIsWalletModal(prevState => !prevState),
    [],
  );

  useEffect(() => {
    isiPhone7or8();
  }, []);

  useEffect(() => {
    // When app is logged out from an account Redux state is set ti Initial state and we loose Disabled dates data,
    // user tries to logIn with same/Other account before killing the app, we need to get the disabled dates again.
    if (disabledDates_ && disabledDates_.length === 0) {
      getLatestVersion();
    }
  }, [disabledDates_]);

  const getLatestVersion = async () => {
    const {response} = await getAppLatestVersion();
    const {holidayDates = []} = response?.data || {};
    dispatch(setDisabledDates(holidayDates));
  };

  const fetchHomeData = async () => {
    await onFetchHomeData();
    setIsLoading(false);
    setRefreshing(false);
  };

  const cartItemsSelector = useMemo(
    () => state => state.general?.cartItems ?? [],
    [],
  );

  const cartItems = useSelector(cartItemsSelector);

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

  const isReApiCallNeeded =
    isFirstVisit ||
    storeNumRef.current !== StoreNumber ||
    userIdRef.current !== userId;

  const isFocused = useIsFocused();

  const cancelSearch = useCallback(() => {
    setTimeout(Keyboard.dismiss, 100);
    toggleSearchMode();
    setSearchValue('');
  }, []);

  useEffect(() => {
    emitter.on(TAB_EVENTS.TAB_PRESS_HOME, () => {
      if (isSearchActivated) {
        cancelSearch();
      }
    });
    return () => emitter.off(TAB_EVENTS.TAB_PRESS_HOME);
  }, [isSearchActivated]);

  useEffect(() => {
    getNotificationSettings(userId, dispatch);
    if (isReApiCallNeeded) {
      setIsLoading(true);
      storeNumRef.current = StoreNumber;
      userIdRef.current = userId;
      fetchHomeData();
    } else {
      getItemsFromCart(dispatch);
    }
  }, [StoreNumber, userId, isReApiCallNeeded]);

  useEffect(() => {
    if (isFocused && isVWRewarded && !isBiometricsModal) {
      setTimeout(() => {
        setIsRewardModal(true);
      }, 400);
    }
  }, [isVWRewarded, isFocused, isBiometricsModal]);

  useEffect(() => {
    logToConsole({
      isSMSOptIn,
      isEmailOptIn,
      isVWRewarded,
      isRewardModal,
      isGuest,
      isWalletModal,
      isBiometricsModal,
    });
    let timerRef;
    if (
      isFocused &&
      [isSMSOptIn, isEmailOptIn].includes(undefined) &&
      !isGuest &&
      !isVWRewarded &&
      !isRewardModal &&
      !isBiometricsModal
    ) {
      timerRef = setTimeout(() => {
        if (!isWalletModal) {
          setIsMarketingOptInModal(true);
        }
      }, 500);
    }
    return () => clearTimeout(timerRef);
  }, [
    isSMSOptIn,
    isEmailOptIn,
    isRewardModal,
    isBiometricsModal,
    isFocused,
    isVWRewarded,
    isGuest,
    isWalletModal,
  ]);

  useEffect(() => {
    ntfModalVisibleRef.current = isNotificationModal;
  }, [isNotificationModal]);

  useEffect(() => {
    const {screen, params} = deeplinkData || {};
    if (screen) {
      setTimeout(() => {
        NavigationService.navigate(screen, params);
        dispatch(setDeeplinkData({}));
      }, 1000);
    }
  }, [deeplinkData]);

  useEffect(() => {
    if (search.length === 0) {
      setSearchResult([]);
    }
  }, [search]);

  const updateSearch = text => {
    setSearchValue(text);
    setSearchResult([]);
    !isLowBandwidth && text && debounceOnChangeText(text);
  };

  const toggleSearchMode = useCallback(
    () => setIsSearchActivated(prevState => !prevState),
    [],
  );

  const getSearchQuery = (searchParam, sku = '') => {
    return {
      store: userInfo.StoreNumber,
      search: searchParam,
      SKU: sku,
    };
  };

  const searchItem = async searchParam => {
    setNoRecordBoolean(false);
    setIsSearchLoading(true);

    const searchQuery = getSearchQuery(searchParam);
    if (apiSource) {
      apiSource.cancel();
    }
    apiSource = CancelToken.source();
    const {response = {}} = await getItems(searchQuery, {
      cancelToken: apiSource.token,
    });
    const {
      data: {response: searchResults = []} = {},
      ok = false,
      status = 0,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      setIsSearchLoading(false);
      if (searchResults.length === 0) {
        setNoRecordBoolean(true);
      }
      MixPanelInstance.trackSearch({
        term: searchParam,
        results: searchResults,
      });
      let modifiedSaleItems = [];
      for (const result of searchResults) {
        let modifiedItem = await itemRWQuantityHandler(result);
        modifiedItem = unitInCart(modifiedItem);
        modifiedSaleItems.push(modifiedItem);
      }
      setSearchResult(modifiedSaleItems);
    } else {
      setIsSearchLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceOnChangeText = useCallback(
    lodashDebounce(searchParam => {
      searchItem(searchParam).then(() => {});
    }, 700),
    [StoreNumber],
  );

  const goToShopItems = useCallback(
    (searchText, sku, item) => {
      Keyboard.dismiss();
      let tempPreviousSearches = previousSearches;
      let isAlreadyPresent = tempPreviousSearches.filter(
        itm => itm.name?.toUpperCase() === searchText?.toUpperCase(),
      );
      if (isAlreadyPresent.length === 0) {
        let searchObj = {
          _id: tempPreviousSearches.length + 1,
          name: searchText,
        };
        tempPreviousSearches = [...tempPreviousSearches, searchObj];
        dispatch(savePreviousSearches(tempPreviousSearches));
      }
      const searchQuery = getSearchQuery(searchText, sku);

      setTimeout(() => {
        if (item) {
          navigation.navigate('ProductDetails', {
            item,
            comingFrom: 'Home',
            entryPoint: MIX_PANEL_SCREENS.SEARCH,
          });
          return;
        }
        navigation.navigate('ShopStack', {
          screen: 'Departments',
          params: {search: searchText, comingFrom: 'Home', searchQuery},
        });
      }, 100);
    },
    [previousSearches],
  );

  const onItemPress = useCallback(
    (item, index) => {
      navigation.navigate('ProductDetails', {
        item,
        comingFrom: 'SALE DETAILS',
        entryPoint: MIX_PANEL_SCREENS.HOME,
        index,
      });
    },
    [navigation],
  );

  const handleNotificationIconPress = useCallback(() => {
    toggleModal(true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const renderSearchComponent = () => (
    <View style={styles.searchComponentWrapper}>
      <SearchComponent
        placeholder="Search Items"
        leftImage={true}
        withCrossButton
        leftImageSrc={
          isSearchActivated ? IMAGES.LEFT_ARROW : IMAGES.SEARCH_ICON
        }
        onLeftIconPress={isSearchActivated ? cancelSearch : null}
        onChangeText={updateSearch}
        value={search}
        maxLength={100}
        onSubmitEditing={() => search && goToShopItems(search)}
        onTouchStart={() => setIsSearchActivated(true)}
        isLoading={isSearchActivated && isSearchLoading}
        loaderStyle={styles.searchLoadingStyle}
      />
    </View>
  );

  const renderPromoBar = () => {
    if (!isLoading && isPromoVisible && promos.length > 0) {
      return <PromoBar data={promos} />;
    } else {
      return <View style={{height: hp('0%')}} />;
    }
  };

  const renderHomeBannerView = () => {
    return (
      <View>
        <HomePagerBannerView />
      </View>
    );
  };

  const renderWelcomeText = useCallback(() => {
    if (!isGuest) {
      return `${APP_CONSTANTS.HI} ${FirstName}`;
    }
    return APP_CONSTANTS.WELCOME;
  }, [isGuest, FirstName]);

  const renderZipCodeText = useCallback(() => {
    return `Zip Code: ${ZipCode} - ${Store}`;
  }, [ZipCode, Store]);

  const onPressStoreMessage = () => {
    navigation.navigate('UserPreference');
  };

  const goToPopularItemsScreen = () => {
    navigation.navigate('PopularItemsScreen');
  };
  const goToOnDeals = () => {
    navigation.navigate('OnSaleStack', {
      screen: 'DepartmentsProductsScreen',
    });
  };
  const renderInfoView = () => (
    <TouchableOpacity activeOpacity={1} style={styles.infoWrapper}>
      <View style={{height: 0.3, backgroundColor: COLORS.BACKGROUND}} />
      <View style={styles.zipCodeWrapper}>
        <View style={styles.storeImageWrapper}>
          <Text allowFontScaling={false} style={styles.zipCodeText}>
            {renderZipCodeText()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.changeLocation}
          onPress={onPressStoreMessage}>
          <ImageComponent
            source={IMAGES.LOCATION_ICON}
            style={styles.walletIcon}
          />
          <Text allowFontScaling={false} style={styles.changeLocationText}>
            {APP_CONSTANTS.CHANGE_LOCATION}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const SaleItemFromHome = true;

  const renderFeaturedSaleItems = () => {
    if (homeSaleItems?.length > 0) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.featuredProductsWrapper, {paddingBottom: hp('1.5%')}]}>
          <View style={{marginTop: hp('2.8%')}}>
            <View style={styles.userNameWrapper}>
              <Text allowFontScaling={false} style={styles.featureText}>
                {APP_CONSTANTS.SALE_ITEMS}
              </Text>
              <TouchableOpacity
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                onPress={goToOnDeals}>
                <Text allowFontScaling={false} style={styles.changeText}>
                  {APP_CONSTANTS.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <SaleItems
            entryPoint={MIX_PANEL_SCREENS.HOME}
            onItemPress={onItemPress}
            data={homeSaleItems}
            autoPlay
            featuredItem={'saleItems'}
            saleItemFromHome={SaleItemFromHome}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderFeaturedPopularItems = () => {
    if (popularItemsInYourArea?.length > 0) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.featuredProductsWrapper, {paddingBottom: hp('1.5%')}]}>
          <View style={{marginTop: hp('1%')}}>
            <View style={styles.userNameWrapper}>
              <Text allowFontScaling={false} style={styles.featureText}>
                {APP_CONSTANTS.POPULAR_ITEMS_IN_YOUR_AREA}
              </Text>
              <TouchableOpacity
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                onPress={goToPopularItemsScreen}>
                <Text allowFontScaling={false} style={styles.changeText}>
                  {APP_CONSTANTS.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <SaleItems
            entryPoint={MIX_PANEL_SCREENS.HOME}
            onItemPress={onItemPress}
            data={popularItemsInYourArea}
            autoPlay
            featuredItem={'popularItems'}
            saleItemFromHome={SaleItemFromHome}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const onOpenVirtualWallet = () => {
    setIsRewardModal(false);
    dispatch(
      saveLoginInfo({
        ...loginInfo,
        userInfo: {...(loginInfo?.userInfo || {}), isVWRewarded: false},
      }),
    );
    setTimeout(() => {
      setIsWalletModal(true);
    }, 400);
  };

  const onCloseOptInModal = () => {
    setIsMarketingOptInModal(false);
  };

  const onCloseNotificationModal = openVWModal =>
    toggleModal(false, openVWModal);

  const renderSearchView = () => (
    <View style={styles.searchView}>
      {search && !isLowBandwidth ? (
        <ActiveSearchView
          data={searchResult}
          noRecordLabel={noRecordBoolean}
          isLoading={isSearchLoading}
          onItemPress={goToShopItems}
        />
      ) : (
        <TrendingSearchView onItemPress={goToShopItems} />
      )}
    </View>
  );

  const options = ['ea', 'lb'];

  const renderRewardModal = () => (
    <DialogBox
      visible={!isLoading && isRewardModal}
      title={APP_CONSTANTS.AC_SHOPPING_ACCOUNT}
      message={APP_CONSTANTS.AC_SIGN_UP_REWARD}
      confirmButtonLabel={APP_CONSTANTS.OPEN_VIRTUAL_WALLET}
      isSingleButton
      onConfirmPress={onOpenVirtualWallet}
    />
  );
  return (
    <ScreenWrapperComponent
      isLoading={isLoading && !isBiometricsModal && !isMarketingOptInModal}
      isHomeHeader
      homeHeaderTitle={APP_CONSTANTS.HOME}
      showCartButton
      isScrollView={false}
      containerStyle={{flexGrow: 1, backgroundColor: 'white'}}
      onHeaderAlertIconPress={handleNotificationIconPress}>
      {renderSearchComponent()}
      {renderInfoView()}
      {isSearchActivated ? (
        renderSearchView()
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollContentContainer}>
          {/*{renderInfoView()}*/}
          {renderPromoBar()}
          {renderHomeBannerView()}
          {renderFeaturedSaleItems()}
          {renderFeaturedPopularItems()}
          <HomeDepartments />
        </ScrollView>
      )}
      {renderRewardModal()}

      <VirtualWalletModal
        visible={isWalletModal}
        closeModal={toggleWalletModal}
      />
      <MarketingOptInModal
        visible={isMarketingOptInModal && !isLoading}
        closeModal={onCloseOptInModal}
      />
      <QualtricsComponent
        isLoading={
          isLoading ||
          isBiometricsModal ||
          isRewardModal ||
          isMarketingOptInModal
        }
      />
      <NotificationHandler
        onNotificationTap={displayNotificationModal}
        onNewNotification={onDisplayBadge}
      />
      <NotificationsModal
        ref={ntfModalRef}
        visibleModal={isNotificationModal}
        closeModal={onCloseNotificationModal}
      />
    </ScreenWrapperComponent>
  );
};
export default Home;
