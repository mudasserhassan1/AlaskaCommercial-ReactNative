import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, ScrollView, View} from 'react-native';

import {TextField} from '../TextField';
import {COLORS} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {TextInputMask} from 'react-native-masked-text';
import BottomSheetModal from '../BottomSheetModal';
import {KEYBOARD_FEATURES} from '../../constants/Common';
import {isValidEmail} from '../../utils/validationUtils';
import {setCheckoutInfo} from "../../redux/actions/checkoutinfo";
import {useDispatch} from "react-redux";


const ContactInformationModal = ({visible, onRequestClose, defaultData, setData}) => {
  const [state, setState] = useState(defaultData);
  const [btnDisable, setBtnDisable] = useState(true);
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const contactInput = useRef(null);
  const  dispatch =  useDispatch()
  const {firstName = '', lastName = '', email = '', contactNumber = ''} = state ?? {};

  const {
    firstName: defaultFirstName = '',
    lastName: defaultLastName = '',
    email: defaultEmail = '',
    contactNumber: defaultContactNumber = '',
  } = defaultData ?? {};

  useEffect(() => {
    setState(defaultData);
  }, [visible]);

  useEffect(() => {
    validateEmail();
  }, [email]);

  useEffect(() => {
    if (isOldData() || isEmptyInputs()) {
      setBtnDisable(true);
    } else {
      if (!isValidEmail(email?.trim())) {
        setBtnDisable(true);
      } else {
        setBtnDisable(false);
      }
    }
  }, [firstName, lastName, email, contactNumber, visible]);

  const isOldData = () =>
    Boolean(
      String(firstName) === String(defaultFirstName) &&
        String(lastName) === String(defaultLastName) &&
        String(email) === String(defaultEmail) &&
        String(contactNumber) === String(defaultContactNumber),
    );

  const isEmptyInputs = () => Boolean(!firstName || !lastName || !email || !contactNumber || contactNumber.length < 14);

  const actionsOnChangeText = (key, value) => {
    setState({...state, [key]: value});
  };

  // will be called onBlur
  const validateEmail = () => {
    if (email?.trim().length) {
      if (!isValidEmail(email?.trim())) {
        setBtnDisable(true);
      }
    }
  };

  const save = () => {
    onRequestClose();
    setData(state);
    dispatch(setCheckoutInfo({checkoutInformation: state}))
  };

  return (
    <BottomSheetModal
      visible={visible}
      onCrossPress={onRequestClose}
      title={APP_CONSTANTS.CONTACT_INFORMATION}
      buttonTitle={APP_CONSTANTS.CONTINUE}
      onBottomPress={save}
      isButtonDisabled={!!btnDisable}>
      <View>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.textFieldWrapper}>
            <View style={styles.twoFieldsContainer}>
              <View style={styles.halfField}>
                <TextField
                  autoComplete={'name-given'}
                  textContentType={'givenName'}
                  placeholder={APP_CONSTANTS.F_NAME}
                  value={firstName}
                  maxLength={30}
                  onChangeText={text => actionsOnChangeText('firstName', text)}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => lastNameInput?.current?.focus()}
                />
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.halfField}>
                <TextField
                  autoComplete={'name-family'}
                  textContentType={'familyName'}
                  placeholder={APP_CONSTANTS.L_NAME}
                  inputRef={lastNameInput}
                  value={lastName}
                  maxLength={30}
                  blurOnSubmit={false}
                  onChangeText={text => actionsOnChangeText('lastName', text)}
                  returnKeyType={'next'}
                  onSubmitEditing={() => contactInput?.current?._inputElement?.focus()}
                />
              </View>
            </View>
            <View style={styles.modal_divider} />

            <View style={styles.fullFieldContainer}>
              <TextInputMask
                  allowFontScaling={false}
                autoComplete={'tel-national'}
                textContentType={'none'}
                ref={contactInput}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
                maxLength={14}
                type={'custom'}
                blurOnSubmit={false}
                options={{
                  mask: '(999) 999-9999',
                }}
                value={contactNumber}
                onChangeText={text => actionsOnChangeText('contactNumber', text)}
                placeholder={APP_CONSTANTS.PHONE_NUM}
                placeholderTextColor={COLORS.GRAY_4}
                returnKeyType={Platform.OS === 'android' ? 'next' : 'done'}
                onSubmitEditing={() => emailInput?.current?.focus()}
                style={styles.phoneInput}
              />
            </View>
            <View style={styles.modal_divider} />
            <View style={styles.fullFieldContainer}>
              <TextField
                autoComplete={'email'}
                textContentType={'emailAddress'}
                placeholder={APP_CONSTANTS.EMAIL}
                autoCapitalize="none"
                inputRef={emailInput}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
                value={email}
                returnKeyType={'done'}
                maxLength={30}
                blurOnSubmit={false}
                onBlur={validateEmail}
                onChangeText={text => actionsOnChangeText('email', text)}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
};

export default ContactInformationModal;
