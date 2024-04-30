import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import DialogBox from '../DialogBox';
import {APP_CONSTANTS} from '../../constants/Strings';
import {FONTS, getFontSize} from '../../theme';
import {reasons} from '../../constants/Common';
import BottomSheetModal from '../BottomSheetModal';

const RefundReasonsModal = ({isVisible, closeModal, onSavePress, defaultReasonIndex, orderId}) => {
  const navigation = useNavigation();

  const [otherReasonModal, setOtherReasonModal] = useState(false);
  const [selectedReasonItem, setSelectedReasonItem] = useState(null);

  const returnToRefundRequest = () => {
    setOtherReasonModal(prevState => !prevState);
    setTimeout(() => {
      setSelectedReasonItem(null);
      closeModal();
      navigation.pop(2);
    }, 400);
  };

  const goToContactUs = () => {
    setOtherReasonModal(false);
    setTimeout(() => {
      setSelectedReasonItem(null);
      onSavePress(null, '');
      closeModal();
      navigation.navigate('ContactUs', {
        reason: true,
        comment: `Order #${String(orderId)}`,
      });
    }, 500);
  };

  const selectReason = () => {
    const {name = ''} = reasons[selectedReasonItem] ?? {};
    if (name === 'Other') {
      setOtherReasonModal(true);
    } else {
      onSavePress(selectedReasonItem, name);
      closeModal();
    }
  };

  const setReasonItem = index => {
    setSelectedReasonItem(index);
  };

  const onCloseWithoutSave = () => {
    setSelectedReasonItem(null);
    closeModal();
  };

  const renderReturnMethods = ({item, index}) => {
    const {name = ''} = item;
    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.listParentView} onPress={() => setReasonItem(index)}>
        <View style={styles.rowItem}>
          <View style={styles.radioButtonView}>
            <View style={styles.radioUnchecked}>
              {index === selectedReasonItem ? <View style={styles.checkedCircle} /> : null}
            </View>
            <Text allowFontScaling={false} style={styles.reasonNameText}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return <View style={styles.divider} />;
  };

  return (
    <BottomSheetModal
      visible={isVisible}
      title={APP_CONSTANTS.REASONS}
      buttonTitle={APP_CONSTANTS.CONTINUE}
      isButtonDisabled={selectedReasonItem == null || selectedReasonItem === defaultReasonIndex}
      onBottomPress={selectReason}
      onCrossPress={onCloseWithoutSave}>
      <View>
        <FlatList
          data={reasons}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={renderReturnMethods}
        />
        <View style={styles.divider} />
        <DialogBox
          visible={otherReasonModal}
          title={APP_CONSTANTS.OTHER_REASON}
          message={APP_CONSTANTS.OTHER_REASON_INSTRUCTION}
          isVerticalButtons={true}
          confirmButtonLabel={APP_CONSTANTS.CONTACT_CUSTOMER_SERVICE}
          cancelButtonLabel={APP_CONSTANTS.RETURN_TO_REFUND}
          onCancelPress={returnToRefundRequest}
          onConfirmPress={goToContactUs}
          closeDialog={() => setOtherReasonModal(false)}
        />
      </View>
    </BottomSheetModal>
  );
};
const styles = StyleSheet.create({
  divider: {
    borderBottomColor: COLORS.GRAY0_5,
    borderBottomWidth: 1,
    marginTop: hp('.5%'),
    width: '94%',
    alignSelf: 'center',
    marginBottom: hp('1%'),
    marginStart: wp('6%'),
  },
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
    maxHeight: hp('70%'),
  },
  listParentView: {
    flexDirection: 'row',
    width: '92%',
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('1%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '90%',
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
  },
  radioUnchecked: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.BLACK,
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonNameText: {
    fontSize: getFontSize(13),
    fontFamily: FONTS.MEDIUM,
    marginStart: wp('2.5%'),
    lineHeight: 22,
    letterSpacing: -0.25,
    color: '#000000',
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: wp('2%'),
    marginTop: hp('1%'),
  },
});
export default RefundReasonsModal;
