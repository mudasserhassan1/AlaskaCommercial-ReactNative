import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {APP_CONSTANTS} from '../../constants/Strings';
import {FONTS, getFontSize, COLORS} from '../../theme';
import {formatPhoneNumber} from '../../utils';
import React from 'react';

const RefundCustomerInfoComponent = ({info}) => {
  const {FirstName = '', LastName = '', Email = '', phoneNumber = '', zipCode = ''} = info ?? {};

  const renderDivider = () => <View style={styles.refundConfirmationDivider} />;

  return (
    <View style={styles.itemStatusWrapper}>
      <View style={{width: '100%'}}>
        <Text allowFontScaling={false} style={[styles.headingText, {marginStart: wp('6%')}]}>{APP_CONSTANTS.CUSTOMER_INFORMATION}</Text>
        <View style={styles.customerInfoRow}>
          <Text allowFontScaling={false} style={[styles.headerLabel, {marginTop: hp('1.5%'), fontSize: getFontSize(13)}]}>Name</Text>
          <Text allowFontScaling={false} style={styles.headerDescriptionText}>
            {FirstName} {LastName}
          </Text>
        </View>
        {renderDivider()}
        <View style={styles.customerInfoRow}>
          <Text allowFontScaling={false} style={[styles.headerLabel, {fontSize: getFontSize(13)}]}>{APP_CONSTANTS.PHONE_NUM}</Text>
          <Text allowFontScaling={false} style={styles.headerDescriptionText}>{formatPhoneNumber(phoneNumber)}</Text>
        </View>
        {renderDivider()}
        <View style={styles.customerInfoRow}>
          <Text allowFontScaling={false} style={[styles.headerLabel, {fontSize: getFontSize(13)}]}>{APP_CONSTANTS.EMAIL}</Text>
          <Text allowFontScaling={false} style={styles.headerDescriptionText}>{Email}</Text>
        </View>
        {renderDivider()}
        <View style={styles.customerInfoRow}>
          <Text allowFontScaling={false} style={[styles.headerLabel, {fontSize: getFontSize(13)}]}>{APP_CONSTANTS.ZIP_CODE}</Text>
          <Text  allowFontScaling={false} style={styles.headerDescriptionText}>{zipCode}</Text>
        </View>
      </View>
      {renderDivider()}
    </View>
  );
};
const styles = StyleSheet.create({
  itemStatusWrapper: {
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemStatusInnerWrapper: {
    marginStart: wp('6%'),
    marginRight: wp('6%'),
    width: '78%',
  },
  headingText: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(15),
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
  },
  headingDescription: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: '#8a8a8e',
    marginTop: hp('1%'),
  },
  refundConfirmationDivider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('1%'),
    marginStart: wp('6%'),
  },
  customerInfoRow: {
    marginTop: hp('1%'),
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  headerLabel: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.MEDIUM,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: COLORS.BLACK,
  },
  headerDescriptionText: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: COLORS.BLACK,
    marginTop: hp('.5%'),
  },
});
export default RefundCustomerInfoComponent;
