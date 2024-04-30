import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {Button, TextField} from '../../components';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import ContactUsTopicsModal from '../../components/ContactUsTopicsModal';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {callNumber} from '../../utils/phoneUtils';
import {TextInputMask} from 'react-native-masked-text';
import {useSelector} from 'react-redux';
import {postContactUsFormForGuest} from '../../services/ApiCaller';
import {KEYBOARD_FEATURES, TOLL_FREE} from '../../constants/Common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageComponent from '../../components/ImageComponent';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {isValidEmail} from '../../utils/validationUtils';
import {STATUSES} from '../../constants/Api';
import {logToConsole} from '../../configs/ReactotronConfig';

const ContactUs = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    comment: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  });

  const {
    firstName = '',
    lastName = '',
    email = '',
    contactNumber = '',
  } = state ?? {};
  const [btnDisable, setBtnDisable] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [emailErrorAlertText, setEmailErrorAlertText] = useState('');
  const [topic, setTopic] = useState('');
  const lastNameInput = useRef(null);
  const emailInput = useRef(null);
  const contactInputRef = useRef(null);
  const myToast = useRef(null);

  // const loginInfo = useSelector(({general: {loginInfo = {}} = {}} = {}) => loginInfo);
  const loginInfoSelector = useMemo(
    () => state => state.general.loginInfo || {},
    [],
  );
  const loginInfo = useSelector(loginInfoSelector);
  const {userInfo = {}} = loginInfo ?? {};
  const {_id: userId = ''} = userInfo;

  const {reason = false, comment = ''} = route.params ?? {};

  const selectedTopicRef = useRef(null);

  useEffect(() => {
    if (reason) {
      actionsOnChangeText('comment', comment);
    }
  }, [reason]);

  const commentInput = useRef(null);
  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  const openModal = () => {
    logToConsole({openModal: true});
    setModalVisible(true);
  };
  const closeModal = () => {
    logToConsole({closeModal: true});
    setModalVisible(false);
  };

  useEffect(() => {
    validate(state.email);
  });

  // validate user entered email
  const validate = text => {
    if (isValidEmail(text) === false) {
      setBtnDisable(true);
      return false;
    } else {
      if (
        topic.length > 0 &&
        state.firstName.trim().length > 0 &&
        state.lastName.trim().length > 0 &&
        state.email.trim().length > 0 &&
        state.comment.trim().length > 0 &&
        state.contactNumber.trim().length > 13
      ) {
        setBtnDisable(false);
      } else {
        setBtnDisable(true);
      }
    }
  };
  const validateEmail = () => {
    if (email.trim().length >= 1) {
      if (isValidEmail(state.email) === false) {
        setEmailErrorAlertText(APP_CONSTANTS.SIGNUP_EMAIL_ERROR);
        setBtnDisable(true);
      }
    }
  };

  function actionsOnChangeText(key, value) {
    setState({...state, [key]: value});
    if (key === 'email') {
      setEmailErrorAlertText('');
    }
  }

  const submitIssue = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const params = {
      Customer_ID: userId,
      Ticket_topic: topic,
      Ticket_topic_description: state.comment,
      FirstName: state.firstName,
      LastName: state.lastName,
      Email: state.email,
      Phone: state.contactNumber,
    };
    const {response = {}} = (await postContactUsFormForGuest(params)) ?? {};
    const {
      ok = false,
      status = '',
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      setIsLoading(false);
      myToast.current.show('Your Request has been submitted', 2000);
      setTimeout(() => {
        navigation.pop();
      }, 2000);
    } else {
      setIsLoading(false);
      if (!isUnderMaintenance) {
        throw {message: status, isNetworkError};
      }
    }
    setIsLoading(false);
  };

  // const openModal = () => {
  //   contactInputRef.current?._inputElement?.blur();
  //   Keyboard.dismiss();
  //   toggleModal();
  // };
  const selectTopic = (id, topicName, toggle = true) => {
    setSelectedTopic(id);
    setTopic(topicName);
    closeModal();
    setTimeout(() => {
      commentInput?.current?.focus();
    }, 1000);
  };

  const focusCommentInput = prevTopic => {
    if (topic && selectedTopicRef.current !== prevTopic) {
      commentInput.current?.focus();
    }
    selectedTopicRef.current = prevTopic;
  };

  const renderScrollContainer = () => (
    <KeyboardAwareScrollView
      extraHeight={heightPercentageToDP('32%')}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={true}
      enableOnAndroid
      contentContainerStyle={styles.scrollContainer}>
      {renderHeaderAndSubHeader()}
      <View style={styles.mainWrapper}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <View style={{marginStart: wp('6%')}}>
              <Text allowFontScaling={false} style={styles.guestInfo}>{APP_CONSTANTS.GUEST_INFO}</Text>
            </View>
            {emailErrorAlertText ? (
              <View style={styles.errorStyle}>
                <Text allowFontScaling={false} style={styles.errorText}>{emailErrorAlertText}</Text>
              </View>
            ) : null}
            {renderPersonalInformation()}
            {renderTopicHeader()}
            {renderInputs()}
            {renderButton()}
            {renderContactDetails()}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAwareScrollView>
  );

  const renderPersonalInformation = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.personalInfoContent}>
          <View style={styles.inputsWrapper}>
            <View style={styles.inputRow}>
              <View style={styles.rowItem}>
                <TextField
                  autoComplete={'name-given'}
                  textContentType={'givenName'}
                  placeholder={APP_CONSTANTS.F_NAME}
                  value={firstName}
                  maxLength={30}
                  onChangeText={text => actionsOnChangeText('firstName', text)}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => lastNameInput.current.focus()}
                />
              </View>
              <View style={styles.verticalSeparator} />
              <View style={styles.rowItem}>
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
                  onSubmitEditing={() => emailInput.current.focus()}
                />
              </View>
            </View>
            <View style={styles.modal_divider} />
            <View style={styles.inputFullRowItem}>
              <TextField
                autoComplete={'email'}
                textContentType={'emailAddress'}
                placeholder={APP_CONSTANTS.EMAIL}
                autoCapitalize="none"
                inputRef={emailInput}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.emailAddress}
                value={email}
                onBlur={validateEmail}
                onChangeText={text => actionsOnChangeText('email', text)}
                maxLength={30}
                returnKeyType={'done'}
                onSubmitEditing={() =>
                  contactInputRef.current._inputElement.focus()
                }
              />
            </View>
            <View style={styles.modal_divider} />
            <View style={styles.inputFullRowItem}>
              <TextInputMask
                  allowFontScaling={false}
                ref={contactInputRef}
                keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
                maxLength={14}
                type={'custom'}
                options={{
                  mask: '(999) 999-9999',
                }}
                value={contactNumber}
                onChangeText={text =>
                  actionsOnChangeText('contactNumber', text)
                }
                returnKeyType={'done'}
                placeholder={APP_CONSTANTS.PHONE_NUM}
                placeholderTextColor={COLORS.GRAY_5}
                style={styles.input}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const renderHeaderAndSubHeader = () => (
    <View style={[styles.mainWrapper, {marginTop: hp('2%')}]}>
      <View style={styles.textWrapper}>
        <View style={styles.editProfileWrapper}>
          <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.WE_LOVE_TO_HEAR}</Text>
        </View>
        <Text allowFontScaling={false} style={styles.descriptionText}>
          {APP_CONSTANTS.CONTACT_US_SUBHEADER}
        </Text>
      </View>
    </View>
  );

  const renderTopicHeader = () => {
    return (
      <View style={styles.topicselectContainer}>
        <View>
          <Text allowFontScaling={false} style={styles.guestInfo}>{APP_CONSTANTS.FEEDBACK}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.selectTopicView}
          onPress={openModal}>
          <Text allowFontScaling={false} style={styles.selectedTopic}>
            {topic.length > 0 ? topic : APP_CONSTANTS.SELECT_TOPIC}
          </Text>
          <ImageComponent
            source={IMAGES.RIGHT_ARROW}
            style={styles.rightArrowImage}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderInputs = () => (
    <View style={styles.topicContainer}>
      <View style={styles.descriptionInputView}>
        <TextInput
          allowFontScaling={false}
          multiline={true}
          ref={commentInput}
          selectionColor={COLORS.MAIN}
          maxLength={500}
          placeholder="Enter Topic Details"
          placeholderTextColor={COLORS.GRAY_5}
          value={state.comment}
          fontSize={Platform.OS === 'ios' ? 17 : 15}
          onChangeText={text => actionsOnChangeText('comment', text)}
          style={styles.descriptionInput}
        />
        <Text allowFontScaling={false} style={styles.counterText}>{state.comment.length}/500</Text>
      </View>
    </View>
  );
  const renderButton = () => (
    <View
      style={[
        styles.btnWrapper,
        {
          backgroundColor: btnDisable
            ? COLORS.DISABLE_BUTTON_COLOR
            : COLORS.ACTIVE_BUTTON_COLOR,
        },
      ]}>
      <Button
        label={APP_CONSTANTS.SUBMIT}
        color={COLORS.WHITE}
        width="90%"
        disabled={btnDisable}
        onPress={submitIssue}
      />
    </View>
  );

  const renderContactDetails = () => {
    return (
      <View style={{marginTop: hp('2%')}}>
        <Text allowFontScaling={false} style={styles.callText}>
          {APP_CONSTANTS.CALL_CUSTOMER_SERVICE}
        </Text>
        <TouchableOpacity onPress={() => callNumber(TOLL_FREE.CALL)}>
          <Text allowFontScaling={false} style={styles.customerCareContact}>{TOLL_FREE.DISPLAY}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopicsModal = () => (
    <ContactUsTopicsModal
      isVisible={isModalVisible}
      closeModal={closeModal}
      reason={reason}
      // onModalClose={focusCommentInput}
      selectedTopic={selectedTopic}
      onTopicPress={selectTopic}
    />
  );
  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.CONTACT_US_HEADER}
      withBackButton
      isScrollView={false}
      containerStyle={{flex: 1}}
      isLoading={isLoading}>
      {renderScrollContainer()}
      {renderTopicsModal()}
      <ToastComponent toastRef={myToast} />
    </ScreenWrapperComponent>
  );
};

export default ContactUs;
