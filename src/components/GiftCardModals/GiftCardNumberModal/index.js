import styles from './styles';
import {KEYBOARD_FEATURES} from '../../../constants/Common';
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {APP_CONSTANTS} from '../../../constants/Strings';
import {TextInputMask} from 'react-native-masked-text';
import ErrorMessage from '../../ErrorMessage';
import {COLORS, getFontSize} from '../../../theme';
import {Pressable, Text} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import CheckBox from "../../CheckBox";

const FIRST_SIX = '608562';
const GiftCardNumberModal = forwardRef(({onToggleLoading, onBottomDisabled, isProfileScreen, isGuest}, ref) => {
  const [cardNumber, setCardNumber] = useState('');

  const cleanedValue = useMemo(() => {
    return cardNumber?.replaceAll(/ /g, '');
  }, [cardNumber]);

  const error = cleanedValue.length === 19 && cleanedValue?.substring?.(0, 6) !== FIRST_SIX;

  useEffect(() => {
    let isError = true;
    if (cleanedValue.length === 19 && cleanedValue.substring(0, 6) === FIRST_SIX) {
      isError = false;
    }
    onBottomDisabled?.(isError);
  }, [cleanedValue, onBottomDisabled]);

  const onEnterCard = value => {
    setCardNumber(value);
  };

  useImperativeHandle(ref, () => ({
    getCardNumber: () => cleanedValue,
    getSaveForTransaction: () => isSaveCard,
  }));

  const [isSaveCard, setIsSaveCard] = useState(false);
  const showSaveTransaction = !isProfileScreen && !isGuest

  const renderSaveToTransaction = () => {
    if (showSaveTransaction) {
      return <Pressable style={{ flexDirection: 'row',
        width: wp(86),
        alignItems: 'center',
        marginTop: hp('0.5%'),
        marginBottom: hp('1%'),
        marginStart: wp(5),
        marginEnd: wp(4),}} onPress={() => setIsSaveCard(!isSaveCard)}>
        <CheckBox disabled isSelected={isSaveCard} onPress={() => {
        }}/>

        <Text allowFontScaling={false} style={{  marginStart: wp('2%'),
          color: COLORS.MAIN,
          fontSize: getFontSize(12),
          width: wp('80%'),}}>
          {APP_CONSTANTS.SAVE_CARD_CHECKOUT}
        </Text>
      </Pressable>
    }
    return null
  }

  return (
    <>
      <TextInputMask
          allowFontScaling={false}
        placeholder={'XXXX XXXX XXXX XXXX XXX'}
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
        customTextInputProps={{maxLength: 19}}
        value={cardNumber}
        placeholderTextColor={COLORS.GRAY_4}
        blurOnSubmit={true}
        onChangeText={onEnterCard}
        returnKeyType="done"
        type={'custom'}
        style={[styles.textFieldWrapper, error && {borderColor: COLORS.MAIN_II}]}
        options={{
          mask: KEYBOARD_FEATURES.maskTypes.giftCardNumber,
        }}
      />
      <ErrorMessage error={error && APP_CONSTANTS.INVALID_GC_NUMBER} textStyle={{marginTop: 5}} />
      {renderSaveToTransaction()}
    </>
  );
});

export default React.memo(GiftCardNumberModal);
