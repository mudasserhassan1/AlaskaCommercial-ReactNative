import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {COLORS} from '../../theme';
import FastImage from 'react-native-fast-image';
import React, {useMemo, useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {getDefaultImageUrl} from '../../utils/imageUrlUtils';
import {logToConsole} from '../../configs/ReactotronConfig';

const ProductImageComponent = ({
  imageUrl = '',
  containerStyle = {},
  imageStyle = {},
  isDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // const {isLowBandwidth} = useSelector(({general: {loginInfo: {userInfo: {isLowBandwidth} = {}} = {}} = {}}) => ({
  //   isLowBandwidth,
  // }));
  //

  const useIsLowBandwidthSelector = () =>
    useMemo(
      () => state => state.general.loginInfo?.userInfo?.isLowBandwidth ?? false,
      [],
    );

  const isLowBandwidth = useSelector(useIsLowBandwidthSelector());

  const onImageLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={[styles.productImageView, containerStyle]}>
      <FastImage
        source={{uri: imageUrl}}
        onError={onImageLoadEnd}
        onLoadEnd={onImageLoadEnd}
        fallback
        defaultSource={getDefaultImageUrl(isLowBandwidth, isDetails)}
        style={[styles.productImage, imageStyle]}
        resizeMode={FastImage.resizeMode.contain}
      />
      {isLoading && (
        <View style={[styles.loader, {...imageStyle}]}>
          <ActivityIndicator size={'small'} color={COLORS.MAIN} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productImageView: {
    marginHorizontal: wp('1%'),
  },
  productImage: {
    width: '100%',
    height: 75,
  },
  loader: {
    width: 100,
    height: 75,
    position: 'absolute',
    top: 20,
  },
});
export default ProductImageComponent;
