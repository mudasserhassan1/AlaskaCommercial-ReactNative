import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {APP_CONSTANTS} from '../../constants/Strings';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {styles} from './styles';

const TermOfService = ({navigation, route}) => {
  const [url, setUrl] = useState();
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(() => false);

  const goback = () => {
    if (canGoBack) {
      return webViewRef.current.goBack();
    }
    return navigation.pop();
  };

  const {url: link, title} = route.params || {};

  async function backButtonHandler() {
    await goback();
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {
    setUrl(link);
  }, [link, url]);

  return (
    <ScreenWrapperComponent
      isWebView
      withBackButton
      isScrollView={false}
      headerTitle={title || APP_CONSTANTS.ABOUT_HEADER}
      containerStyle={styles.container}>
      <WebView
        source={{uri: route.params.url}}
        ref={webViewRef}
        cacheEnabled={false}
        startInLoadingState
        onNavigationStateChange={navState => {
          setCanGoBack(navState.url !== route.params.url);
        }}
        scalesPageToFit={false}
        javaScriptEnabled
        decelerationRate={'normal'}
        domStorageEnabled
        contentMode={'recommended'}
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        overScrollMode={'never'}
        containerStyle={styles.webView}
      />
      <View style={styles.divider} />
    </ScreenWrapperComponent>
  );
};
export default TermOfService;
