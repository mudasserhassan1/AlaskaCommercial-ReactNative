import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Linking, Platform, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {verifyEmail} from '../services/ApiCaller';
import Spinner from 'react-native-loading-spinner-overlay';
import {COLORS} from '../theme';
import {saveLoginInfo, setDeeplinkData} from '../redux/actions/general';
import queryString from 'query-string';
import {APP_CONSTANTS} from '../constants/Strings';
import {DEEPLINKS, SPLASH_TIME} from '../constants/Common';
import {NavigationService} from '../utils/navigationUtils';
import useIsGuest from '../hooks/useIsGuest';
import {MIX_PANEL_SCREENS} from '../constants/Mixpanel';
import DynamicLink from '@react-native-firebase/dynamic-links';
import {logToConsole} from '../configs/ReactotronConfig';

let firstCallDone = false;
let navigationParams = {};

const showEmailMessage = ({message} = {}) => {
  setTimeout(
    () =>
      showMessage({
        message,
        backgroundColor: COLORS.GRAY_TEXT_0_9,
        floating: true,
        duration: 5000,
        hideOnPress: true,
        statusBarHeight:
          Platform.OS === 'android' ? StatusBar.currentHeight : undefined,
      }),
    1000,
  );
};

function DeepLinkHandler() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isGuest = useIsGuest();
  // const {isEmailVerified, loginInfo, userToken, currentUserEmail} = useSelector(
  //   ({
  //     general: {loginInfo, loginInfo: {userToken, userInfo: {isEmailVerified, Email: currentUserEmail} = {}} = {}} = {},
  //   }) => ({
  //     isEmailVerified,
  //     loginInfo,
  //     userToken,
  //     currentUserEmail,
  //   }),
  // );

  const isEmailVerifiedSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.isEmailVerified,
    [],
  );

  const loginInfoSelector = useMemo(
    () => state => state.general?.loginInfo,
    [],
  );

  const userTokenSelector = useMemo(
    () => state => state.general?.loginInfo?.userToken,
    [],
  );

  const currentUserEmailSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.Email ?? null,
    [],
  );

  const isEmailVerified = useSelector(isEmailVerifiedSelector);
  const loginInfo = useSelector(loginInfoSelector);
  const userToken = useSelector(userTokenSelector);
  const currentUserEmail = useSelector(currentUserEmailSelector);

  const navigationHandler = useCallback(() => {
    const screen = 'BottomTabs';
    if (isGuest) {
      return false;
    }
    if (global.isAuthStack) {
      dispatch(setDeeplinkData({screen, params: navigationParams}));
      return false;
    }
    NavigationService.navigate(screen, navigationParams);
  }, [dispatch, isGuest]);

  const onEmailDeeplink = useCallback(
    async (params = {}) => {
      const {email, verificationCode} = params || {};
      if (!email) {
        return;
      }
      if (isEmailVerified && email === currentUserEmail) {
        showEmailMessage({message: APP_CONSTANTS.EMAIL_IS_ALREADY_VERIFIED});
        return;
      }
      try {
        setLoading(true);
        const {response} = await verifyEmail({email, verificationCode});
        const {ok = false, isUnderMaintenance} = response ?? {};

        if (!ok) {
          if (!isUnderMaintenance) {
            throw {message: APP_CONSTANTS.SOME_THING_WENT_WRONG};
          }
        }
        const {isEmailVerified: isVerified, isAlreadyVerified} =
          response?.data || {};
        if (userToken && email === currentUserEmail) {
          dispatch(
            saveLoginInfo({
              ...loginInfo,
              userInfo: {
                ...(loginInfo?.userInfo || {}),
                isEmailVerified: isVerified || isAlreadyVerified,
              },
            }),
          );
        }
        if (isAlreadyVerified) {
          // dispatch(
          //   saveLoginInfo({
          //     ...loginInfo,
          //     userInfo: {...(loginInfo?.userInfo || {}), isEmailVerified: isAlreadyVerified},
          //   }),
          // );
          return showEmailMessage({
            message: APP_CONSTANTS.EMAIL_IS_ALREADY_VERIFIED,
          });
        }
        if (isVerified) {
          return showEmailMessage({message: APP_CONSTANTS.EMAIL_VERIFIED});
        }
      } catch (e) {
        showEmailMessage({message: `${APP_CONSTANTS.SOME_THING_WENT_WRONG}.`});
      } finally {
        setLoading(false);
      }
    },
    [currentUserEmail, dispatch, isEmailVerified, loginInfo, userToken],
  );

  const onOrderDetailsDeeplink = useCallback(
    params => {
      const {orderId} = params || {};
      if (!orderId) {
        return;
      }
      navigationParams = {
        screen: 'History',
        initial: false,
        params: {
          screen: 'OrderHistoryDetail',
          initial: false,
          params: {orderId, isDeeplink: true},
        },
      };
      navigationHandler();
    },
    [navigationHandler],
  );

  const onOnSaleDeeplink = useCallback(
    params => {
      const {sku, store} = params || {};
      if (store && sku) {
        navigationParams = {
          screen: 'OnSaleStack',
          initial: false,
          params: {
            screen: 'Drawer',
            initial: false,
            params: {
              screen: 'ProductDetails',
              params: {
                searchQuery: {SKU: sku, store},
                entryPoint: MIX_PANEL_SCREENS.DEEP_LINK,
                isDeeplink: true,
              },
            },
          },
        };
      } else {
        navigationParams = {
          screen: 'OnSaleStack',
          initial: false,
          params: {
            screen: 'Drawer',
            initial: false,
            params: {screen: 'Products', isDeeplink: true},
          },
        };
      }
      navigationHandler();
    },
    [navigationHandler],
  );

  const onShopDeeplink = useCallback(
    params => {
      let {
        sku,
        store,
        departmentName = '',
        departmentId = '',
        subDepartmentId = '',
        subDepartmentName = '',
      } = params || {};
      const isPartyEligible = subDepartmentId === 'partytray';
      if (isPartyEligible) {
        departmentId = '';
        subDepartmentId = '';
      }
      if (store && sku) {
        navigationParams = {
          screen: 'ShopStack',
          params: {
            screen: 'ProductDetails',
            initial: false,
            params: {
              searchQuery: {SKU: sku, store},
              entryPoint: MIX_PANEL_SCREENS.DEEP_LINK,
              isDeeplink: true,
            },
          },
        };
      } else if ((departmentId && subDepartmentId) || isPartyEligible) {
        navigationParams = {
          screen: 'ShopStack',
          params: {
            screen: 'Products',
            initial: false,
            params: {
              isDeeplink: true,
              isPartyEligible,
              departmentName,
              departmentId,
              subDepartmentId,
              subDepartmentName,
            },
          },
        };
      } else if (departmentId) {
        navigationParams = {
          screen: 'ShopStack',
          initial: false,
          params: {isDeeplink: true, isPartyEligible, departmentId},
        };
      }
      navigationHandler();
    },
    [navigationHandler],
  );

  const onLinkOpenedApp = useCallback(
    async link => {
      const receivedUrl = link?.url ?? link;
      const params = queryString.parse(receivedUrl);
      if (receivedUrl?.includes(DEEPLINKS.EMAIL)) {
        onEmailDeeplink(params);
      } else if (receivedUrl?.includes(DEEPLINKS.ORDER_DETAILS)) {
        onOrderDetailsDeeplink(params);
      } else if (receivedUrl?.includes(DEEPLINKS.ONSALE)) {
        onOnSaleDeeplink(params);
      } else if (receivedUrl) {
        logToConsole({receivedUrl});
        const resolveLink = await DynamicLink().resolveLink(receivedUrl);
        const paramsResolved = queryString.parse(resolveLink.url || '');
        logToConsole({paramsResolved});
        onShopDeeplink(paramsResolved);
      }
    },
    [onEmailDeeplink, onOnSaleDeeplink, onOrderDetailsDeeplink, onShopDeeplink],
  );

  useEffect(() => {
    // onLinkOpenedApp(`${DEEPLINKS.EMAIL}?q=alaska&email=usman.arif@citrusbits.com&verficationCode=tn7CM`);
    // onLinkOpenedApp(`${DEEPLINKS.ORDER_DETAILS}?app=alaska&orderId=6274c67f8aa0f3002a63308a`);
    // onLinkOpenedApp(`${DEEPLINKS.ONSALE}?app=alaska&sku=1910016&store=125`); //correct
    // onLinkOpenedApp(`${DEEPLINKS.ONSALE}?app=alaska&sku=181asdfasdf5423&store=295`); // incorrect

    if (!firstCallDone) {
      setTimeout(
        () => Linking.getInitialURL().then(onLinkOpenedApp),
        SPLASH_TIME + 100,
      );
      firstCallDone = true;
    }
    const unsubscribe = Linking.addEventListener('url', onLinkOpenedApp);
    return unsubscribe.remove;
  }, [onLinkOpenedApp]);

  return <Spinner visible={loading} color={COLORS.MAIN} />;
}

export default memo(DeepLinkHandler);
