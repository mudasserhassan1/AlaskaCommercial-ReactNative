/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {FONTS, getFontSize, IMAGES, COLORS} from '../theme';
import DialogBox from './DialogBox';
import {APP_CONSTANTS} from '../constants/Strings';
import {createListForUser} from '../utils/listUtils';
import {addProductsToList, getListsOfUser} from '../services/ApiCaller';
import {changeList} from '../redux/actions/general';
import {IMAGES_RESIZE_MODES} from '../constants/Common';
import BottomSheetModal from './BottomSheetModal';
import {stringToLowerCase} from '../utils/transformUtils';
import ImageComponent from './ImageComponent';
import useProductItem from '../hooks/useProductItem';
import useIsGuest from '../hooks/useIsGuest';
import {getItemPriceQuantity} from '../utils/productUtils';
import {STATUSES} from '../constants/Api';
import {MIX_PANEL_EVENTS, MIX_PANEL_PROPS} from '../constants/Mixpanel';

const AddToListModal = ({
  visible,
  onRequestClose,
  selectedItem,
  showApiErrorDialog,
  hasBackDrop = true,
  entryPoint,
}) => {
  const listItemsSelector = useMemo(
    () => state => state.general?.listItems || [],
    [],
  );

  const userIdSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo._id || '',
    [],
  );

  const listItems = useSelector(listItemsSelector);
  const _id = useSelector(userIdSelector);

  const {onTrackProduct} = useProductItem({product: selectedItem, entryPoint});

  const dispatch = useDispatch();
  const isGuest = useIsGuest();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [duplicatedListIndexes, setDuplicatedListIndexes] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const selectedListsNames = useRef([]);

  const showDialog = () => {
    setDialogVisible(true);
  };
  useEffect(() => {
    if (!visible) {
      !isGuest && getLists();
    }
  }, [_id, visible]);

  const getLists = async () => {
    // visible && setIsLoading(true);
    const {response = {}} = await getListsOfUser(_id);
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    setIsLoading(false);
    if (ok && status === STATUSES.OK) {
      const {data: {response: lists = []} = {}} = response ?? {};
      dispatch(changeList(lists));
    } else if (!isNetworkError && !isUnderMaintenance) {
      showApiErrorDialog();
    }
  };

  useEffect(() => {
    if (visible) {
      checkForDuplication();
    }
  }, [visible]);

  const selectList = (id, name) => {
    let tempList = selectedLists;
    if (tempList.indexOf(id) > -1) {
      const indexToRemove = tempList.indexOf(id);
      tempList.splice(indexToRemove, 1);
      selectedListsNames.current.splice(indexToRemove, 1);
      setSelectedLists(tempList);
      setRefresh(prevState => !prevState);
    } else {
      tempList.push(id);
      selectedListsNames.current.push(name);
      setSelectedLists(tempList);
      setRefresh(prevState => !prevState);
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const checkForDuplication = () => {
    const {_id = ''} = selectedItem ?? {};
    let tempListIndexes = [];
    setSelectedLists([]);
    listItems?.forEach(listItem => {
      listItem?.Products?.forEach(item => {
        if (item._id === _id) {
          tempListIndexes.push(listItem._id);
        }
      });
      setDuplicatedListIndexes(tempListIndexes);
    });
  };

  const addItems = async () => {
    setIsLoading(true);
    const {quantity} = getItemPriceQuantity(selectedItem);
    let tempNewItem = {
      ...selectedItem,
      Quantity: quantity,
      createdDate: new Date(),
    };
    let modifiedProducts = [tempNewItem];
    const {response = {}} =
      (await addProductsToList(modifiedProducts, selectedLists)) ?? {};
    const {
      ok = false,
      status = 0,
      isNetworkError,
      isUnderMaintenance,
    } = response ?? {};
    onRequestClose();
    setSelectedLists([]);
    setIsLoading(false);
    if (ok && status === STATUSES.OK) {
      onTrackProduct(MIX_PANEL_EVENTS.ADD_ITEM_TO_MY_LIST, entryPoint, {
        [MIX_PANEL_PROPS.MY_LIST_NAME]: selectedListsNames.current,
      });
      selectedListsNames.current = [];
    } else if (!isNetworkError && !isUnderMaintenance) {
      setTimeout(() => showApiErrorDialog(), 220);
    }
  };
  const createList = async name => {
    const trimmedName = name?.trim?.() || '';
    if (!trimmedName?.length) {
      return;
    }
    setDialogVisible(false);
    setTimeout(() => setIsLoading(true), 220);
    createListForUser(trimmedName, dispatch, listItems)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getActiveColor = index => {
    if (duplicatedListIndexes.indexOf(index) > -1) {
      return COLORS.GRAY0_25;
    }
    return 'black';
  };

  const getDescriptionColor = index => {
    if (duplicatedListIndexes.indexOf(index) > -1) {
      return COLORS.GRAY0_25;
    }
    return COLORS.CHARCOAL_GREY_60;
  };

  const getItemsNamesWidth = name => {
    if (10 * name.length > 60) {
      return widthPercentageToDP('60%');
    }
    return 8 * name.length;
  };

  const getListName = (index, listName, id) => {
    if (duplicatedListIndexes.indexOf(id) > -1) {
      return listName + '   (Already Added)';
    }
    return listName;
  };

  const renderModalContent = () => (
    <>
      <FlatList
        data={listItems}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={renderSeparatorComponent}
        ListFooterComponent={
          <>
            {renderSeparatorComponent()}
            {renderCreateListButton()}
            {renderSeparatorComponent()}
          </>
        }
        renderItem={renderList}
        extraData={refresh}
      />
      <DialogBox
        title={APP_CONSTANTS.CREATE_NEW_LIST}
        message={APP_CONSTANTS.CREATE_LIST_DESCRIPTION}
        messageContainerStyles={{marginTop: heightPercentageToDP('.8%')}}
        withInput={true}
        visible={dialogVisible}
        confirmButtonLabel={APP_CONSTANTS.CREATE}
        cancelButtonLabel={APP_CONSTANTS.CANCEL}
        onCancelPress={closeDialog}
        closeDialog={closeDialog}
        onConfirmPress={createList}
      />
    </>
  );

  const renderList = ({item, index}) => {
    const {Name = '', Products = [], CreatedAt = '', _id = ''} = item ?? {};
    return (
      <TouchableOpacity
        style={styles.listRow}
        disabled={duplicatedListIndexes.indexOf(_id) > -1}
        onPress={() => selectList(_id, Name)}>
        {renderRadioButtonsAndListName(Name, index, _id)}
        <View style={styles.descriptionView}>
          <Text allowFontScaling={false} style={[styles.descriptionText, {color: getDescriptionColor(_id)}]}>
            {moment(CreatedAt).format('MM/DD/YYYY')}
          </Text>
          {renderItemsInList(Products, index, _id)}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRadioButtonsAndListName = (listName, index, id) => {
    return (
      <View style={styles.radioButtonView}>
        {renderRadioButtons(id)}
        <Text allowFontScaling={false} style={[styles.itemName, {color: getActiveColor(id)}]}>
          {getListName(index, listName, id)}
        </Text>
      </View>
    );
  };

  const renderRadioButtons = id => {
    return (
      <View style={[styles.radioUnchecked, {borderColor: getActiveColor(id)}]}>
        {selectedLists.indexOf(id) > -1 ||
        duplicatedListIndexes.indexOf(id) > -1 ? (
          <View
            style={[
              styles.checkedCircle,
              {backgroundColor: getActiveColor(id)},
            ]}
          />
        ) : null}
      </View>
    );
  };

  const renderItemsInList = (items, index, id) => {
    return (
      <View style={styles.itemNamesView}>
        {renderItemsNames(items, index, id)}
      </View>
    );
  };

  const renderSeparatorComponent = () => {
    return <View style={styles.separator} />;
  };

  const renderCreateListButton = () => {
    return (
      <TouchableOpacity style={styles.createListButton} onPress={showDialog}>
        <View style={styles.createListButtonLeftContainer}>
          <ImageComponent source={IMAGES.ADD_ICON} style={styles.addIcon} />
          <Text allowFontScaling={false} style={styles.createListText}>Create New List</Text>
        </View>
        <View style={styles.rightArrow}>
          <Entypo name="chevron-right" size={20} color={COLORS.GRAY_4} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemsNames = (items = [], index, id) => {
    let nameString = '';
    if (items) {
      items?.forEach((itemInList, i) => {
        const {item = []} = itemInList ?? {};
        const {E_COMM_DESCRIPTION_AND_SIZE: name = ''} = item?.[0] ?? {};
        if (i < 3) {
          if (items.length > 1) {
            nameString = `${nameString}${name}, `;
          } else {
            nameString = name;
          }
        }
      });
    }
    return (
      <View style={styles.itemNamesList}>
        <Text
            allowFontScaling={false}
          style={[
            styles.descriptionText,
            {
              width: getItemsNamesWidth(nameString),
              color: getDescriptionColor(id),
            },
          ]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {stringToLowerCase(nameString)}
        </Text>
      </View>
    );
  };
  return (
    <BottomSheetModal
      visible={visible}
      title={APP_CONSTANTS.ADD_TO_LIST}
      avoidKeyboard={false}
      hasBackdrop={hasBackDrop}
      onCrossPress={onRequestClose}
      isLoading={isLoading}
      statusBarTranslucent
      buttonTitle={APP_CONSTANTS.CONFIRM}
      buttonStyles={styles.modalButtonStyle}
      isButtonDisabled={selectedLists.length === 0}
      onBottomPress={addItems}>
      <View style={styles.modalContent}>{renderModalContent()}</View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'flex-end',
    margin: 0,
    ...Platform.select({
      android: {
        bottom: 0,
        width: '100%',
        position: 'absolute',
      },
    }),
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: heightPercentageToDP('5%'),
    maxHeight: heightPercentageToDP('70%'),
  },
  modalCrossIcon: {tintColor: COLORS.BLACK},
  listRow: {
    width: '92%',
    paddingHorizontal: widthPercentageToDP('2%'),
    paddingVertical: heightPercentageToDP('1%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  itemNamesList: {flexDirection: 'row', width: '100%'},
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
  listInfoView: {
    marginStart: widthPercentageToDP('1%'),
    alignItems: 'center',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: widthPercentageToDP('2.5%'),
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  descriptionText: {
    fontFamily: FONTS.REGULAR,
    fontSize: Platform.OS === 'ios' ? 17 : 15,
    lineHeight: 20,
    letterSpacing: -0.15,
    color: COLORS.CHARCOAL_GREY_60,
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionView: {
    flexDirection: 'row',
    width: '80%',
    marginStart: widthPercentageToDP('7%'),
    marginTop: heightPercentageToDP('.5%'),
  },
  itemNamesView: {
    flexDirection: 'row',
    marginStart: widthPercentageToDP('2%'),
    width: '50%',
    height: 30,
  },
  separator: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    width: '94%',
    alignSelf: 'flex-end',
  },
  addIcon: {
    width: 9,
    height: 9,
    resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
  },
  createListText: {
    color: COLORS.MAIN,
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: widthPercentageToDP('2%'),
    lineHeight: 22,
    letterSpacing: -0.25,
  },
  rightArrow: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  btnWrapper: {
    width: '90%',
    backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: widthPercentageToDP('2%'),
    marginTop: heightPercentageToDP('1%'),
  },
  createListButton: {
    width: '92%',
    paddingHorizontal: widthPercentageToDP('2%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPercentageToDP('3%'),
  },
  createListButtonLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonStyle: {
    marginTop: 0,
  },
});
export default AddToListModal;
