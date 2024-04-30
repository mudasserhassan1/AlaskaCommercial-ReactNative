import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../theme';
import {topicsData} from '../../constants/Common';
import {logToConsole} from '../../configs/ReactotronConfig';
import styles from './styles';
import BottomSheetModal from '../BottomSheetModal';
import {APP_CONSTANTS} from '../../constants/Strings';

const ContactUsTopicsModal = ({isVisible, closeModal, onTopicPress, selectedTopic, onModalClose, reason}) => {
  const [userSelectedTopicId, setUserSelectedTopicId] = useState(selectedTopic);
  const [userSelectedTopicName, setUserSelectedTopicName] = useState(selectedTopic);
  const [isBtnDisable, setIsBtnDisable] = useState(true);

  useEffect(() => {
    if (userSelectedTopicId === null) {
      return setIsBtnDisable(true);
    }
    if (userSelectedTopicId === selectedTopic) {
      return setIsBtnDisable(true);
    }
    return setIsBtnDisable(false);
  }, [isVisible, userSelectedTopicId]);

  const closeModalHelper = () => {
    if (typeof closeModal === 'function') {
      return closeModal?.();
    }
    return logToConsole('Invalid Proptype for closeModal, Expected a function');
  };

  useEffect(() => {
    if (reason) {
      setUserSelectedTopicId('1');
      setUserSelectedTopicName(topicsData[0].topic);
      onTopicPress('1', topicsData[0].topic, false);
    }
  }, [reason]);

  const selectTopic = (topicName, id) => {
    setUserSelectedTopicId(id);
    setUserSelectedTopicName(topicName);
  };

  const renderModalContent = () => {
    return (
      <>
        <View style={styles.listView}>
          <FlatList
            data={topicsData}
            keyExtractor={item => item.id}
            renderItem={renderTopics}
            ItemSeparatorComponent={separatorView}
          />
        </View>
      </>
    );
  };

  const renderTopics = ({item}) => {
    const {topic = '', id = ''} = item ?? {};
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => selectTopic(topic, id)} style={styles.topicItem}>
        {renderRadioButtons(id)}
        <Text allowFontScaling={false} style={styles.topicText}>{topic}</Text>
      </TouchableOpacity>
    );
  };

  const separatorView = () => {
    return <View style={styles.separator} />;
  };

  const renderRadioButtons = id => {
    return (
      <View style={styles.radioUnchecked}>{id === userSelectedTopicId && <View style={styles.checkedCircle} />}</View>
    );
  };

  return (
    <BottomSheetModal
      visible={isVisible}
      title={'Select Topic'}
      onCrossPress={closeModalHelper}
      buttonTitle={APP_CONSTANTS.SELECT}
      onModalHide={() => onModalClose?.(userSelectedTopicName)}
      isButtonDisabled={isBtnDisable}
      onBottomPress={() => onTopicPress(userSelectedTopicId, userSelectedTopicName)}>
      <View>{renderModalContent()}</View>
    </BottomSheetModal>
  );
};

export default ContactUsTopicsModal;
