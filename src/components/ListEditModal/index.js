import React, { useMemo, useRef, useState } from "react";
import BottomSheetModal from '../BottomSheetModal';
import {APP_CONSTANTS} from '../../constants/Strings';
import {Text, TouchableOpacity, View} from 'react-native';
import DialogBox from '../DialogBox';
import {heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen';
import {styles} from '../../theme/Styles';
import {deleteListForUser, duplicateListForUser, renameListForUser} from '../../utils/listUtils';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {EDIT_LIST_OPTIONS} from '../../constants/Common';

const ListEditModal = ({visible, closeModal, listIndex, onDisplayMessage, isDeleteEnabled = true}) => {
  const [visibleRenameListDialog, setVisibleRenameListDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiErrorDialogVisible, setIsApiErrorDialogVisible] = useState(false);

  // const {listItems} = useSelector(({general: {listItems = []} = {}}) => ({listItems}));
  const useListItemsSelector = () => useMemo(
    () => state => state.general.listItems ?? [],
    []
  );
  const listItems = useSelector(useListItemsSelector());
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const retryFunction = useRef(null);
  const updatedListName = useRef();

  const showApiErrorDialog = () => setIsApiErrorDialogVisible(true);
  const hideApiErrorDialog = () => setIsApiErrorDialogVisible(false);

  const handleApiError = e => {
    const {isNetworkError} = e ?? {};
    setIsLoading(false);
    if (!isNetworkError) {
      setTimeout(() => showApiErrorDialog(), 300);
    }
  };

  const renameList = () => {
    let name = updatedListName.current?.trim?.() || '';
    if (!name || name === listItems[listIndex]?.Name) {
      //if list name is empty or remain unchanged then break here
      return;
    }
    setVisibleRenameListDialog(false);
    setTimeout(async () => {
      setIsLoading(true);
      await renameListForUser(name, dispatch, listItems, listIndex)
        .then(() => {
          setIsLoading(false);
          closeModal();
          onDisplayMessage('List renamed successfully');
        })
        .catch(e => {
          retryFunction.current = renameList;
          handleApiError(e);
        });
    }, 300);
  };

  //Duplicate current list with items
  const duplicateList = async () => {
    setIsLoading(true);
    await duplicateListForUser(listItems[listIndex], dispatch, listItems)
      .then(() => {
        setIsLoading(false);
        closeModal();
        onDisplayMessage('List duplicated successfully');
      })
      .catch(e => {
        retryFunction.current = duplicateList;
        handleApiError(e);
      });
  };

  //Delete list
  const deleteList = async () => {
    setIsLoading(true);
    await deleteListForUser(listItems[listIndex], dispatch, listIndex)
      .then(() => {
        setIsLoading(false);
        closeModal();
        setTimeout(() => navigation.goBack(), 220);
      })
      .catch(e => {
        retryFunction.current = deleteList;
        handleApiError(e);
      });
  };

  const handleItemPress = id => {
    switch (id) {
      case '1':
        setVisibleRenameListDialog(true);
        break;
      case '2':
        deleteList().then(() => {});
        break;
      case '3':
        duplicateList().then(() => {});
        break;
    }
  };

  const handleRetryAction = () => {
    hideApiErrorDialog();
    setTimeout(() => {
      retryFunction.current();
    }, 250);
  };

  const renderRenameListDialog = () => (
    <DialogBox
      title={APP_CONSTANTS.RENAME_LIST}
      message={APP_CONSTANTS.RENAME_LIST_DESCRIPTION}
      messageContainerStyles={{
        marginTop: hp('.8%'),
        paddingHorizontal: widthPercentageToDP('7%'),
      }}
      withInput={true}
      visible={visibleRenameListDialog}
      listName={listItems[listIndex]?.Name ?? ''}
      confirmButtonLabel={APP_CONSTANTS.RENAME}
      cancelButtonLabel={APP_CONSTANTS.CANCEL}
      onCancelPress={() => setVisibleRenameListDialog(false)}
      closeDialog={() => setVisibleRenameListDialog(false)}
      onConfirmPress={name => {
        updatedListName.current = name;
        renameList();
      }}
    />
  );

  const renderListOptions = (item, _) => {
    const {id, name} = item ?? {};
    if (!isDeleteEnabled && id === '2') {
      return null;
    }
    return (
      <View key={String(id)}>
        <TouchableOpacity
          style={[
            styles.listRow,
            {
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: hp('2%'),
            },
          ]}
          onPress={() => handleItemPress(id)}>
          <View style={styles.modalItemRow}>
            <Text allowFontScaling={false} style={styles.createListText}>{name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    );
  };
  const renderApiErrorDialog = () => {
    return (
      <DialogBox
        visible={isApiErrorDialogVisible}
        closeModal={hideApiErrorDialog}
        title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
        message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        confirmButtonLabel={APP_CONSTANTS.RETRY}
        onConfirmPress={handleRetryAction}
        onCancelPress={hideApiErrorDialog}
      />
    );
  };
  return (
    <BottomSheetModal
      visible={visible}
      title={APP_CONSTANTS.EDIT}
      avoidKeyboard={false}
      isLoading={isLoading}
      onCrossPress={closeModal}
      showButton={false}>
      <View>
        {renderRenameListDialog()}
        {EDIT_LIST_OPTIONS.map(renderListOptions)}
        {renderApiErrorDialog()}
      </View>
    </BottomSheetModal>
  );
};

function arePropsEqual(prevProps, nextProps) {
  return prevProps.visible === nextProps.visible;
}

export default React.memo(ListEditModal, arePropsEqual);
