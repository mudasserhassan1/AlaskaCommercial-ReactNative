import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import styles from './styles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ArrowItemComponent = props => {
  const {
    title = '',
    description = '',
    onItemPress = () => {},
    descriptionStyles = {},
  } = props ?? {};
  const shouldDisplayDivider = !title.includes('Special Instructions');

  return (
    <>
      <TouchableOpacity
        style={styles.mainContainer}
        activeOpacity={0.9}
        onPress={onItemPress}>
        <View>
          <Text allowFontScaling={false} style={styles.titleText}>{title}</Text>
          <Text allowFontScaling={false} style={[styles.subtitle, descriptionStyles]}>
            {description}
          </Text>
        </View>
        <Image source={IMAGES.RIGHT_ARROW} style={styles.addIcon} />
      </TouchableOpacity>
      {shouldDisplayDivider && (
        <View>
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.GRAY0_5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
      )}
    </>
  );
};

export default ArrowItemComponent;
