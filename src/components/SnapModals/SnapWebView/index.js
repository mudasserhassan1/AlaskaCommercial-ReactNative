import WebView from 'react-native-webview';
import {logToConsole} from '../../../configs/ReactotronConfig';
import React, {forwardRef, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {COLORS} from '../../../theme';
import styles from './styles';

export const WebViewLoader = props => {
  const {containerStyle, loading} = props;
  if (loading) {
    return (
      <View style={[styles.loader, containerStyle]}>
        <ActivityIndicator color={COLORS.MAIN} />
      </View>
    );
  }
  return null;
};

const SnapWebView = forwardRef(
  ({uri, error, source, onMessage, webViewRef, onLoadEnd, onError, onSetHeight, onLoadStart = () => {}}, ref) => {
    const [loading, setLoading] = useState(true);
    const [iframeLoading, setIframeLoading] = useState(true);

    useEffect(() => {
      if (!loading && !iframeLoading) {
        onLoadEnd?.();
      }
    }, [loading, iframeLoading]);

    const onBridgeMessage = event => {
      try {
        let data = event?.nativeEvent?.data;
        logToConsole({onMessage: data});
        data = JSON.parse(data ?? '{}');
        setIframeLoading(false);
        if (!data?.iframeIsReady && typeof onMessage === 'function') {
          onMessage(data);
        }
      } catch (e) {
        logToConsole({onMessageError: e});
      }
    };

    return (
      <>
        <WebView
          cacheEnabled={false}
          scrollEnabled={false}
          onLoadEnd={() => setLoading(false)}
          onError={onError}
          ref={webViewRef}
          originWhitelist={['*']}
          onLoadStart={onLoadStart}
          source={source}
          nestedScrollEnabled
          onMessage={onBridgeMessage}
        />
        <WebViewLoader loading={loading || iframeLoading} />
      </>
    );
  },
);

export default SnapWebView;
