import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import styles from './styles';
import {Pressable, Text, TextInput, View} from 'react-native';
import {APP_CONSTANTS} from '../../../constants/Strings';
import {COLORS, getFontSize} from '../../../theme';
import {Divider} from '../../../screens/ShoppingCartPickup/PaymentsButtons';
import {TextInputMask} from 'react-native-masked-text';
import {KEYBOARD_FEATURES} from '../../../constants/Common';
import ErrorMessage from '../../ErrorMessage';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import CheckBox from "../../CheckBox";

const AddSTAModal = forwardRef((props, ref) => {
  const {onBottomDisabled, isProfileScreen, isGuest} = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [account, setAccount] = useState('');

  const lastNameRef = useRef();
  const accountRef = useRef();

  const cleanedAcc = useMemo(() => {
    return account?.replaceAll(/ /g, '');
  }, [account]);

  const error = cleanedAcc.length === 12 && cleanedAcc?.[0] !== '5';

  const isBottomDisabled = useMemo(() => {
    return !(((firstName && lastName) || organization) && cleanedAcc?.length === 12 && String(cleanedAcc?.[0]) === '5');
  }, [cleanedAcc, firstName, lastName, organization]);

  useEffect(() => {
    onBottomDisabled(isBottomDisabled);
  }, [isBottomDisabled, onBottomDisabled]);

  useImperativeHandle(ref, () => ({
    getSTAInfo: () => ({
      firstName,
      lastName,
      organization,
      account: cleanedAcc,
    }),
      getSaveForTransaction: () => isSaveCard,
  }));

    const [isSaveCard, setIsSaveCard] = useState(false);
    const showSaveTransaction = !isProfileScreen && !isGuest

    const renderSaveToTransaction = () => {
        if (showSaveTransaction) {
            return <Pressable style={{ flexDirection: 'row',
                width: wp(86),
                alignItems: 'center',
                marginTop: hp('2%'),
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
    <View>
      <View style={styles.inputContainer}>
        <TextInput
            allowFontScaling={false}
          editable={!organization}
          maxLength={25}
          placeholder={APP_CONSTANTS.STA_FIRST_NAME}
          placeholderTextColor={COLORS.GRAY_4}
          value={firstName}
          onChangeText={setFirstName}
          returnKeyType={'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => lastNameRef.current?.focus()}
          style={[styles.input, styles.firstNameInput, organization && {backgroundColor: COLORS.DISABLED}]}
          underlineColorAndroid={'transparent'}
        />
        <TextInput
            allowFontScaling={false}
          editable={!organization}
          maxLength={25}
          ref={lastNameRef}
          placeholder={APP_CONSTANTS.STA_LAST_NAME}
          placeholderTextColor={COLORS.GRAY_4}
          value={lastName}
          onChangeText={setLastName}
          returnKeyType={'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => accountRef.current?.getElement?.()?.focus?.()}
          style={[styles.input, styles.lastNameInput, organization && {backgroundColor: COLORS.DISABLED}]}
          underlineColorAndroid={'transparent'}
        />
      </View>
      <Text allowFontScaling={false} style={styles.or}>or</Text>
      <TextInput
          allowFontScaling={false}
        editable={!firstName && !lastName}
        maxLength={25}
        placeholderTextColor={COLORS.GRAY_4}
        placeholder={APP_CONSTANTS.STA_ORGANIZATION}
        value={organization}
        onChangeText={setOrganization}
        returnKeyType={'next'}
        blurOnSubmit={false}
        onSubmitEditing={() => accountRef.current?.getElement?.()?.focus?.()}
        style={[styles.input, (firstName || lastName) && {backgroundColor: COLORS.DISABLED}]}
        underlineColorAndroid={'transparent'}
      />
      <Divider style={styles.divider} />
      <ErrorMessage error={error && APP_CONSTANTS.INVALID_STA_NUMBER} textStyle={{marginBottom: 5}} />
      <TextInputMask
          allowFontScaling={false}
        ref={accountRef}
        placeholderTextColor={COLORS.GRAY_4}
        placeholder={APP_CONSTANTS.CHARGE_ACCOUNT_NUMBER}
        keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
        customTextInputProps={{maxLength: 12}}
        value={account}
        onChangeText={setAccount}
        type={'custom'}
        style={[styles.input, styles.accountInput, error && {borderColor: COLORS.MAIN_II}]}
        options={{
          mask: KEYBOARD_FEATURES.maskTypes.storeCharge,
        }}
      />
        {renderSaveToTransaction()}
    </View>
  );
});

AddSTAModal.propTypes = {};

export default memo(AddSTAModal);
