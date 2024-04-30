import React, { useMemo } from "react";
import {useSelector} from 'react-redux';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

const PaymentSelectionCard = ({item, onPress, onEditPress}) => {
  const {accountHolderName = '', cardType = '', last4 = '', id = ''} = item || {};

  // const {defaultPaymentOption = {}} = useSelector(({general}) => general) ?? {};
  const useDefaultPaymentOptionSelector = () => useMemo(
    () => state => state.general.defaultPaymentOption ?? {},
    []
  );
  const defaultPaymentOption = useSelector(useDefaultPaymentOptionSelector());
  const {id: selectedId = ''} = defaultPaymentOption ?? {};

  return (
    <TouchableOpacity style={styles.parent} activeOpacity={0.8} onPressIn={() => onPress(item)}>
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioUnChecked}>
          {id === selectedId ? <View style={styles.radioChecked} /> : <View style={styles.radioUncheckedInner} />}
        </View>
      </View>
      <View style={styles.infoView}>
        <Text allowFontScaling={false} style={styles.accountHolderName}>{accountHolderName}</Text>
        <Text allowFontScaling={false} style={styles.cardTypeText}>
          {cardType} ending in {last4}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.editButtonView} onPress={() => onEditPress(item)}>
        <Text allowFontScaling={false} style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    marginVertical: heightPercentageToDP('.5%'),
    width: '100%',
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY0_5,
    paddingTop: '1%',
  },
  radioButtonContainer: {
    width: '8%',
    height: '50%',
    marginTop: '0.7%',
  },
  radioUnChecked: {
    width: 18,
    height: 18,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  radioChecked: {
    width: 11,
    height: 11,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: COLORS.BLACK,
  },
  radioUncheckedInner: {
    width: 9,
    height: 9,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: COLORS.GRAY_1,
  },
  infoView: {
    width: '75%',
    height: '100%',
    alignItems: 'flex-start',
  },
  accountHolderName: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  editButtonView: {
    width: '15%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTypeText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    marginTop: '1%',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: -0.15,
    color: COLORS.CHARCOAL_GREY_60,
  },
  editButtonText: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: getFontSize(13),
    fontStyle: 'normal',
    letterSpacing: 0,
    color: COLORS.MAIN,
  },
});
function paymentPropsAreEqual(prevProps, nextProps) {
  return prevProps.selectedOption === nextProps.selectedOption && prevProps.item === nextProps.item;
}
export default React.memo(PaymentSelectionCard, paymentPropsAreEqual);
