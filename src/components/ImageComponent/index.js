import React from 'react';
import {Image} from 'react-native';

const ImageComponent = ({resizeMode, ...props}) => {
  return <Image resizeMode={resizeMode} {...props} />;
};

export default React.memo(ImageComponent);
