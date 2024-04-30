import React, {useCallback, useMemo} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {COLORS, IMAGES} from '../theme';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {FONTS, getFontSize} from '../theme/Fonts';
import ImageComponent from './ImageComponent';
import {goBack, navigateTo} from '../utils/navigationUtils';
import {IMAGES_RESIZE_MODES} from '../constants/Common';
import useIsGuest from '../hooks/useIsGuest';
import {useNavigation} from '@react-navigation/native';
import { logToConsole } from "../configs/ReactotronConfig";
import ACCLogo from "../assets/svgs/ACCLogo";
import HeaderLogo from "../assets/svgs/HeaderLogo";

let sideButtonsWidth = '15%';

const AuthHeaderComponent = props => {
  const {
    onBackPress,
    renderHeaderLeft,
    backButton,
    fontFamily = FONTS.HEADER,
    textColor = COLORS.WHITE,
    fontsize = getFontSize(22),
    title,
    imageStyle,
    backgroundColor = COLORS.MAIN,
    searchButton = false,
    onSearchButtonPress,
    cartButton = false,
    loader,
    onAlertPress,
    isHome = false,
  } = props ?? {};

  const isGuest = useIsGuest();
  const navigation = useNavigation();

  const cartItemsCountSelector = useMemo(
    () => state => state.general?.cartItemsCount,
    [],
  );

  const showBadgeSelector = useMemo(
    () => state => state.general?.showBadge,
    [],
  );

  const cartItemsCount = useSelector(cartItemsCountSelector);
  const showBadge = useSelector(showBadgeSelector);
  // logToConsole({cartItemsCount, showBadge});

  const onBackButtonPress = useCallback(() => {
    if (typeof onBackPress === 'function') {
      return onBackPress?.();
    }
    return goBack();
  }, [onBackPress]);

  const goToCart = useCallback(() => navigateTo('Cart'), []);

  const onNavDrawerTap = () => {
    navigation.openDrawer();
  };

  const renderLeftIcon = () => {
    if (typeof renderHeaderLeft === 'function') {
      return renderHeaderLeft?.();
    }
    if (isHome) {
      return (
        <View style={styles.headerTextWrapper}>
          <TouchableOpacity onPress={onNavDrawerTap}>
            <ImageComponent
              source={IMAGES.NAV_DRAWER_ICON}
              style={styles.navDrawerIconStyle}
              resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
            />
          </TouchableOpacity>

          {/*<ImageComponent*/}
          {/*  source={IMAGES.LOGO_HR_MN_SYN}*/}
          {/*  style={styles.accLogoStyle}*/}
          {/*  resizeMode={IMAGES_RESIZE_MODES.CONTAIN}*/}
          {/*/>*/}
          <View style={styles.accLogoStyle}>
            <HeaderLogo/>
          </View>

          <ImageComponent
            source={IMAGES.LOGO_NAME}
            style={styles.headerLogo}
            resizeMode={IMAGES_RESIZE_MODES.CONTAIN}
          />
        </View>
      );
    }
    if (backButton) {
      return (
        <TouchableOpacity
          onPress={onBackButtonPress}
          style={styles.backIconView}>
          <ImageComponent
            style={[styles.iconStyle, imageStyle]}
            source={IMAGES.BACK_ARROW}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.emptyBackIconView} />;
  };

  const renderTitle = () => {
    if (title) {
      return (
        <View style={styles.titleView}>
          <Text
              allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.titleText,
              {fontSize: fontsize, color: textColor, fontFamily},
            ]}>
            {title}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderSearchIcon = () => {
    if (searchButton) {
      return (
        <TouchableOpacity
          onPress={onSearchButtonPress}
          style={styles.searchIconView}>
          <ImageComponent
            style={styles.iconStyle}
            source={IMAGES.SEARCH_ICON}
          />
        </TouchableOpacity>
      );
    }
    // return <View style={styles.iconStyle} />;
  };

  const renderCounter = () => {
    return (
      <View style={styles.cartCounterView}>
        <Text allowFontScaling={false} style={styles.cartText}>{cartItemsCount}</Text>
      </View>
    );
  };

  const renderCartIcon = () => {
    if (cartButton) {
      return (
        <TouchableOpacity
          disabled={loader}
          onPress={goToCart}
          style={[styles.cartIconView, {marginLeft: isGuest ? 30 : 10}]}>
          <ImageComponent source={IMAGES.CART_ICON} style={styles.iconStyle} />
          {renderCounter()}
        </TouchableOpacity>
      );
    }
    return <View style={styles.emptyBackIconView} />;
  };

  const renderNotificationIcon = () => {
    if (isHome && !isGuest) {
      return (
        <TouchableOpacity onPress={onAlertPress}>
          {!!showBadge && <View style={styles.notificationBadge} />}
          <View style={styles.buttonStyle}>
            <ImageComponent
              source={IMAGES.ALERT_ICON}
              style={styles.headerRightIcon}
            />
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderSettingsIcon = () => {
    if (isHome) {
      return (
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigateTo('SettingsStack')}>
          <ImageComponent
            source={IMAGES.SETTING_ICON}
            style={styles.headerRightIcon}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderRightIcons = () => (
    <View
      style={[
        styles.headerButtonWrapper,
        !isHome && {minWidth: sideButtonsWidth},
      ]}>
      {renderSearchIcon()}
      {renderNotificationIcon()}
      {/*{renderSettingsIcon()}*/}
      {renderCartIcon()}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.headerStyleWrapper, {backgroundColor, ...props.style}]}>
      <View style={styles.headerLogoWrapper}>
        {renderLeftIcon()}
        {renderTitle()}
        {renderRightIcons()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parentView: {
    flexDirection: 'row',
    width: '100%',
    height: Platform.OS === 'ios' ? 56 : 60,
  },
  backIconView: {
    width: '22%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cartCounterView: {
    // width: 22,
    // height: 22,
    // borderRadius: 11,
    // backgroundColor: COLORS.WHITE,
    // position: 'absolute',
    // bottom: 15,
    // right: 15,
    // zIndex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginLeft: 10,
  },
  homeCounterContainer: {
    top: -2,
    left: -8,
  },
  homeCounterContainerCounter: {
    top: -2,
    left: -8,
  },
  counterStyle: {
    width: 22,
    height: 22,
  },
  cartText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: Platform.OS === 'ios' ? getFontSize(15) : getFontSize(18),
  },
  emptyBackIconView: {
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  titleText: {
    letterSpacing: -0.5,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  iconStyle: {
    height: 16,
    width: 16,
    // tintColor: COLORS.WHITE,
  },
  searchIconView: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cartIconView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 14,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF33',
    borderRadius: 40,
  },
  headerButtonWrapper: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  userName: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: Platform.OS === 'ios' ? 23 : 20,
    color: COLORS.BLACK,
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  headerTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerStyleWrapper: {
    height: Platform.OS === 'ios' ? 56 : 60,
    backgroundColor: COLORS.MAIN,
    justifyContent: 'center',
    width: '100%',
  },
  headerRightIcon: {
    height: 25,
    width: 25,
  },
  headerIconSeparatorView: {
    width: wp('1%'),
  },
  headerLogoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('6%'),
  },
  headerLogo: {
    width: wp('36%'),
  },
  navDrawerIconStyle: {
    width: wp('8%'),
    marginStart: -3,
  },
  accLogoStyle: {
    // width: wp('8%'),
    marginHorizontal: wp('2%'),
  },
  notificationBadge: {
    width: 10,
    height: 10,
    borderRadius: 10,
    left: 5,
    top: -3,
    position: 'absolute',
    backgroundColor: COLORS.WHITE,
    zIndex: 1,
  },
});

const AuthHeader = React.memo(AuthHeaderComponent);
export {AuthHeader};
