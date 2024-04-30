import {StyleSheet, View} from 'react-native';
import {IMAGES} from '../../theme';
import FastImage from 'react-native-fast-image';
import React, {useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {IMAGES_RESIZE_MODES} from '../../constants/Common';
import ImageComponent from '../ImageComponent';

const DepartmentImageComponent = ({imageUrl = '', containerStyle = {}, imageStyle = {}}) => {
  const [imageFound, setImageFound] = useState(true);

  const onImageLoadError = () => {
    setImageFound(false);
  };

  return (
    <View style={[styles.productImageView, containerStyle]}>
      {imageFound ? (
        <FastImage
          source={{
            uri: imageUrl,
            cache: FastImage.cacheControl.immutable,
          }}
          onError={onImageLoadError}
          style={[styles.productImage, imageStyle]}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : (
        <ImageComponent source={IMAGES.PLACE_HOLDER_IMAGE} style={[styles.productImage, imageStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productImageView: {
    marginStart: wp('1%'),
  },
  productImage: {
    width: 35,
    height: 35,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
});
export default React.memo(DepartmentImageComponent);
