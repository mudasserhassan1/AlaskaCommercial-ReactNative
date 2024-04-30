import React from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MyStatusBar from '../MyStatusBar';
import {FONTS, getFontSize, COLORS} from '../../theme';
import {AuthHeader} from '../AuthHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SCREEN_HEIGHT, STATUSBAR_STYLES} from '../../constants/Common';
import {useFocusEffect} from '@react-navigation/native';
import {MixPanelInstance} from '../../utils/mixpanelUtils';

const getScreenWrapper = (
  isScrollView = false,
  isKeyBoardAwareScrollView = false,
) => {
  if (isScrollView) {
    return ScrollView;
  }
  if (isKeyBoardAwareScrollView) {
    return KeyboardAwareScrollView;
  }
  return View;
};

const getTouchableWrapper = (isWebView = false) => {
  if (isWebView) {
    return View;
  }
  return TouchableWithoutFeedback;
};

const ScreenWrapperComponent = ({
  children,
  hasSpinner = true,
  isLoading = false,
  withHeader = true,
  isAuthHeader = false,
  withBackButton = false,
  headerTitle = '',
  isScrollView = true,
  isKeyBoardAwareScrollView = false,
  isScrollEnabled = true,
  containerStyle = {},
  isHomeHeader = false,
  homeHeaderTitle = '',
  showCartButton = false,
  onHeaderAlertIconPress,
  customHeader,
  customHeaderLeft,
  onBackButtonPress,
  extraHeight = 130,
  refreshControl,
  isWebView = false,
  style,
}) => {
  useFocusEffect(
    React.useCallback(() => {
      MixPanelInstance.trackScreen({screen: headerTitle || homeHeaderTitle});
    }, [headerTitle, homeHeaderTitle]),
  );

  const getStatusBarColor = () => {
    if (isAuthHeader) {
      return COLORS.WHITE;
    }
    return COLORS.MAIN;
  };

  const getStatusBarStyle = () => {
    if (isAuthHeader) {
      return STATUSBAR_STYLES.darkContent;
    }
    return STATUSBAR_STYLES.lightContent;
  };

  const renderHeader = () => {
    if (typeof customHeader === 'function') {
      return customHeader?.();
    }
    if (withHeader) {
      return (
        <AuthHeader
          title={headerTitle}
          textColor={isAuthHeader ? COLORS.BLACK : COLORS.WHITE}
          fontsize={isAuthHeader ? getFontSize(17) : getFontSize(22)}
          backButton={withBackButton}
          onBackPress={onBackButtonPress}
          renderHeaderLeft={customHeaderLeft}
          fontFamily={isAuthHeader ? FONTS.SEMI_BOLD : FONTS.HEADER}
          backgroundColor={isAuthHeader ? 'transparent' : COLORS.MAIN}
          imageStyle={
            isAuthHeader ? styles.blackBackButton : styles.whiteBackButton
          }
          isHome={isHomeHeader}
          cartButton={showCartButton}
          onAlertPress={onHeaderAlertIconPress}
        />
      );
    }
    return null;
  };

  const ScreenWrapper = getScreenWrapper(
    isScrollView,
    isKeyBoardAwareScrollView,
  );

  const TouchableWrapper = getTouchableWrapper(isWebView);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isAuthHeader ? COLORS.WHITE : COLORS.BACKGROUND},
      ]}>
      <MyStatusBar
        backgroundColor={getStatusBarColor()}
        barStyle={getStatusBarStyle()}
      />
      {renderHeader()}
      <TouchableWrapper
        style={isWebView && {flex: 1}}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <ScreenWrapper
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps="handled"
          extraHeight={extraHeight}
          alwaysBounceVertical={false}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          isScrollEnabled={isScrollEnabled}
          style={
            !isScrollView && !isKeyBoardAwareScrollView
              ? containerStyle
              : undefined
          }
          contentContainerStyle={[styles.scrollContainer, containerStyle]}>
          {children}
          {hasSpinner && <Spinner visible={isLoading} color={COLORS.MAIN} />}
        </ScreenWrapper>
      </TouchableWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: SCREEN_HEIGHT * 0.05,
    flexGrow: 1,
  },
  whiteBackButton: {
    tintColor: COLORS.WHITE,
    height: 24,
    width: 24,
  },
  blackBackButton: {
    width: 24,
    height: 24,
    tintColor: COLORS.BLACK,
  },
});
export default ScreenWrapperComponent;
