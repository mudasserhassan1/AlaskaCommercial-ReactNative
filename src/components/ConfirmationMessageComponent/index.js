import {APP_CONSTANTS} from '../../constants/Strings';
import {
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {formatOrderDateAndTime} from '../../utils/timeUtils';
import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';
import {FONTS, getFontSize} from '../../theme';
import {COLORS} from '../../theme';
import {callNumber} from '../../utils/phoneUtils';

const ConfirmationMessageComponent = ({
  message = '',
  description = '',
  date = new date(),
  storeName = '',
}) => {
  const {is24Hour, storePhoneNumber} = useSelector(
    ({
      general: {is24Hour = false, storeDetail: {storePhoneNumber = ''}} = {},
    }) => ({is24Hour, storePhoneNumber}),
  );

  const renderStoreNameAndPhone = () => {
    return (
      <View style={styles.storeNameAndPhoneView}>
        <Text allowFontScaling={false} style={styles.storeNameAndPhoneText}>{storeName}</Text>
        <Text
            allowFontScaling={false}
          onPress={() => callNumber(storePhoneNumber)}
          style={styles.storeNameAndPhoneText}>
          {storePhoneNumber}
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.topHeaderInfoContainer}>
        <View style={styles.companyNameView}>
          <Text allowFontScaling={false} style={styles.companyNameText}>
            {APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
          </Text>
          <Text
              allowFontScaling={false}
            style={[
              styles.companyNameText,
              {marginTop: heightPercentageToDP('1%')},
            ]}>
            {formatOrderDateAndTime(is24Hour, date)}
          </Text>
        </View>
        <Text
            allowFontScaling={false}
          style={[
            styles.headerInfoText,
            {marginTop: heightPercentageToDP('2.7%')},
          ]}>
          {message}
        </Text>
        <Text allowFontScaling={false} style={styles.headerDescriptionText}>{description}</Text>
      </View>
      {renderStoreNameAndPhone()}
    </>
  );
};

const styles = StyleSheet.create({
  topHeaderInfoContainer: {
    marginVertical: hp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyNameView: {
    paddingVertical: hp('1.7%'),
    alignItems: 'center',
  },
  companyNameText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    fontStyle: 'normal',
    letterSpacing: -0.09,
    color: '#3c3c43',
  },
  storeNameAndPhoneView: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP('6%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  storeNameAndPhoneText: {
    fontFamily: FONTS.REGULAR,
    fontSize: getFontSize(15),
    letterSpacing: -0.09,
    color: COLORS.BLACK,
  },
  headerInfoText: {
    fontSize: getFontSize(34),
    fontFamily: FONTS.BOLD,
    lineHeight: 41,
    letterSpacing: 0.37,
    textAlign: 'center',
    color: COLORS.BLACK,
  },
  headerDescriptionText: {
    fontSize: getFontSize(16),
    fontFamily: FONTS.REGULAR,
    color: COLORS.CHARCOAL_GREY_60,
    textAlign: 'center',
    width: '70%',
    marginTop: hp('1.5%'),
    lineHeight: 20,
    letterSpacing: -0.32,
  },
});
export default ConfirmationMessageComponent;
