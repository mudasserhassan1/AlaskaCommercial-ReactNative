import React from 'react';
import {Platform, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {FONTS, getFontSize, COLORS, IMAGES} from '../theme';
import {useNavigation} from '@react-navigation/native';
import ImageComponent from './ImageComponent';

const Header = props => {
  const {onBackPress} = props ?? {};
  const navigation = useNavigation();

  const onBackButtonPress = () => {
    if (typeof onBackPress === 'function') {
      return onBackPress?.();
    }
    return navigation.goBack();
  };
  return (
    <SafeAreaView
      style={{
        flexDirection: 'row',
        width: '100%',
        height: Platform.OS === 'ios' ? 56 : 60,
        backgroundColor: COLORS.MAIN,
        ...props.style,
      }}>
      {props.backButton ? (
        <TouchableOpacity
          onPress={onBackButtonPress}
          style={{
            width: '14%',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginStart: wp('6%'),
          }}>
          <ImageComponent style={props.imageStyle} source={IMAGES.BACK_ARROW} />
        </TouchableOpacity>
      ) : (
        <View
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}

      <View style={{width: '60%', justifyContent: 'center', alignItems: 'center'}}>
        <Text
            allowFontScaling={false}
          style={{
            fontSize: getFontSize(22),
            color: COLORS.WHITE,
            fontFamily: FONTS.HEADER,
          }}>
          {props.title}
        </Text>
      </View>

      {props.showEditButton ? (
        <View
          style={{
            width: '24%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginEnd: wp('4%'),
          }}>
          <TouchableOpacity
            disabled={props.loader}
            onPress={() => props.onPress()}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
                allowFontScaling={false}
              style={{
                fontSize: Platform.OS === 'ios' ? 17 : 15,
                color: COLORS.WHITE,
              }}>
              {props.editButton === true ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export {Header};
