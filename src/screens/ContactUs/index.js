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

import {Button} from '../../components';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import ContactUsTopicsModal from '../../components/ContactUsTopicsModal';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {callNumber} from '../../utils';
import {useSelector} from 'react-redux';
import {postContactUsFormForUser} from '../../services/ApiCaller';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DialogBox from '../../components/DialogBox';
import ImageComponent from '../../components/ImageComponent';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {TOLL_FREE} from '../../constants/Common';
import {STATUSES} from '../../constants/Api';
import {logToConsole} from '../../configs/ReactotronConfig';

const ContactUs = ({navigation, route}) => {
  const {reason = false, comment = ''} = route.params ?? {};
  const [isModalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState({comment});
  const [btnDisable, setBtnDisable] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [apiErrorTitle, setApiErrorTitle] = useState('');
  const myToast = useRef(null);
  const [allowModalOpen, setAllowModalOpen] = useState(true);
  // const loginInfo = useSelector(
  //   ({general: {loginInfo = {}} = {}}) => loginInfo,
  // );

  const loginInfoSelector = useMemo(
    () => state => state.general.loginInfo || {},
    [],
  );
  const loginInfo = useSelector(loginInfoSelector);

  const {userInfo = {}} = loginInfo ?? {};
  const {_id: userId = ''} = userInfo ?? {};
  const toggleApiErrorDialog = () =>
    setIsApiErrorDialogVisible(prevState => !prevState);

  const eligibleRefundOrdersLengthSelector = useMemo(
    () => state => state.general?.eligibleRefundOrders?.length ?? 0,
    [],
  );

  const storeDetailSelector = useMemo(
    () => state => state.general?.storeDetail,
    [],
  );
  const storeDetail = useSelector(storeDetailSelector);
  const eligibleRefundOrdersLength = useSelector(
    eligibleRefundOrdersLengthSelector,
  );

  // logToConsole({storeDetail, eligibleRefundOrdersLength, loginInfo});

  useEffect(() => {
    if (reason) {
      actionsOnChangeText('comment', comment);
    }
  }, [reason]);

  useEffect(() => {
    if (topic.length > 0 && state.comment.trim().length > 0) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  }, [state.comment, topic]);

  const commentInput = useRef(null);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    if (allowModalOpen) {
      setModalVisible(!isModalVisible);
    }
  };
  function actionsOnChangeText(key, value) {
    setState({...state, [key]: value});
  }

  const submitIssue = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const params = {
      Customer_ID: userId,
      Ticket_topic: topic,
      Ticket_topic_description: state.comment,
    };
    const {response = {}} = (await postContactUsFormForUser(params)) ?? {};
    const {
      ok = false,
      status = '',
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    if (ok && status === STATUSES.OK) {
      setIsLoading(false);
      setBtnDisable(true);
      myToast.current?.show('Your Request has been submitted', 2000);
      setTimeout(() => {
        navigation.pop(
          reason ? (eligibleRefundOrdersLength - 1 > 0 ? 3 : 4) : 1,
        );
      }, 2000);
    } else if (!isNetworkError && !isUnderMaintenance) {
      setIsLoading(false);
      setApiErrorTitle(APP_CONSTANTS.QUALTRICS);
      setApiErrorMessage(APP_CONSTANTS.SOME_THING_WENT_WRONG);
      toggleApiErrorDialog();
    }
    setIsLoading(false);
  };

  const selectTopic = (id, topicName, toggle = true) => {
    setSelectedTopic(id);
    setTopic(topicName);
    closeModal();
    setTimeout(() => {
      commentInput?.current?.focus();
    }, 1000);
  };

  // const selectTopic = (id, topicName) => {
  //   setSelectedTopic(id);
  //   setTopic(topicName);
  //   setModalVisible(false);
  //   setAllowModalOpen(false);
  //   // Re-enable modal opening after 1 second
  //   setTimeout(() => setAllowModalOpen(true), 1000);
  // };

  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={toggleApiErrorDialog}
        title={apiErrorTitle}
        message={apiErrorMessage}
        messageContainerStyles={{marginTop: 5}}
        isSingleButton={true}
        onCancelPress={toggleApiErrorDialog}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={toggleApiErrorDialog}
        cancelButtonLabel={APP_CONSTANTS.OK}
      />
    );
  };
  const renderScrollContainer = () => (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps
      extraHeight={hp('32%')}
      automaticallyAdjustContentInsets={false}
      contentContainerStyle={styles.scrollContainer}>
      {renderHeaderAndSubHeader()}
      <View style={styles.mainWrapper}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            {renderTopicHeader()}
            {renderInputs()}
            {renderButton()}
            {renderContactDetails()}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAwareScrollView>
  );

  const renderHeaderAndSubHeader = () => (
    <View style={styles.mainWrapper}>
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

        <View style={styles.contactNumberWrapper}>
          <Text allowFontScaling={false} style={styles.storeContactNumber}>
            Call the {storeDetail.storeName} Store at{' '}
          </Text>
          <TouchableOpacity
            onPress={() => callNumber(storeDetail.storePhoneNumber)}>
            <Text allowFontScaling={false} style={styles.contactNumber}>
              {' '}
              {storeDetail.storePhoneNumber}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.CONTACT_US_HEADER}
      withBackButton
      isScrollView={false}
      isLoading={isLoading}>
      <ContactUsTopicsModal
        isVisible={isModalVisible}
        closeModal={closeModal}
        reason={reason}
        selectedTopic={selectedTopic}
        onTopicPress={selectTopic}
      />
      {renderScrollContainer()}
      <ToastComponent positionValue={260} toastRef={myToast} />
      {renderApiErrorDialog()}
    </ScreenWrapperComponent>
  );
};

export default ContactUs;
