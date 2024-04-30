/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import {Button, Header} from '../../components';
import {COLORS, IMAGES} from '../../theme';
import {styles} from './styles';
import {changeList} from '../../redux/actions/general';
import {APP_CONSTANTS} from '../../constants/Strings';
import DialogBox from '../../components/DialogBox';
import {getListsOfUser} from '../../services/ApiCaller';
import {createListForUser, deleteListForUser} from '../../utils/listUtils';
import ListEditModal from '../../components/ListEditModal';
import {stringToLowerCase} from '../../utils/transformUtils';
import ToastComponent from '../../components/ToastComponent';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import useIsGuest from '../../hooks/useIsGuest';
import {STATUSES} from '../../constants/Api';
import { logToConsole } from "../../configs/ReactotronConfig";

const MyList = ({navigation, route}) => {
  const [edit, setEdit] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListItemIndex, setSelectedListItemIndex] = useState(null);
  const [openItems, setOpenItems] = useState({});

  const {comingFrom = ''} = route.params ?? {};

  const myToast = useRef();
  const isGuest = useIsGuest();
  // const {listItems = [], loginInfo = {}} = useSelector(({general}) => general);
  const listItemsSelector = useMemo(
    () => state => state.general?.listItems || [],
    [],
  );

  const loginInfoSelector = useMemo(
    () => state => state.general?.loginInfo || {},
    [],
  );
  const listItems = useSelector(listItemsSelector);
  const loginInfo = useSelector(loginInfoSelector);
  const {userInfo = {}} = loginInfo ?? {};
  const {_id = '', StoreNumber = '', Store = '', ZipCode = ''} = userInfo ?? {};

  const dispatch = useDispatch();

  logToConsole({listItems});

  useEffect(() => {
    !isGuest && getLists();
  }, [StoreNumber, Store, ZipCode, isGuest]);

  const setEditMode = () => {
    setEdit(!edit);
  };

  const getLists = async () => {
    setIsLoading(true);
    const {response = {}} = await getListsOfUser(_id);
    const {ok = false, status = 0} = response ?? {};
    setIsLoading(false);
    if (ok && status === STATUSES.OK) {
      const {data: {response: lists = []} = {}} = response ?? {};
      dispatch(changeList(lists));
    }
  };

  const refreshList = async () => {
    setOpenItems({});
    setIsRefreshing(true);
    const {response = {}} = await getListsOfUser(_id);
    const {ok = false, status = 0} = response ?? {};
    setIsRefreshing(false);
    if (ok && status === STATUSES.OK) {
      const {
        data: {response: lists = []},
      } = response ?? {};
      dispatch(changeList(lists));
    }
  };

  const toggleModal = () => {
    setVisibleEditModal(!visibleEditModal);
  };

  const closeDialog = () => {
    setVisibleDialog(false);
  };

  const createList = async name => {
    name = name?.trim?.() || '';
    if (name.length === 0) {
      return;
    }
    if (name) {
      setVisibleDialog(false);
      setTimeout(async () => {
        setIsLoading(true);
        await createListForUser(name, dispatch)
          .then(() => {
            setIsLoading(false);
            // getLists();
          })
          .catch(e => {
            setIsLoading(false);
            const {isNetworkError} = e ?? {};
            if (!isNetworkError) {
            }
          });
      }, 330);
    } else {
      displayMessage(APP_CONSTANTS.CREATE_MESSAGE_EMPTY_NAME);
    }
  };

  const displayMessage = message => {
    myToast.current.show(message, 1000);
  };

  const closeItem = useCallback((rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }, []);

  const createNewList = () => {
    setVisibleDialog(true);
  };

  const goToDetailScreen = (item, index) => () => {
    navigation.navigate('ListDetail', {listId: item._id, listIndex: index});
  };

  //Delete List
  const deleteItem = async (rowMap, rowKey) => {
    closeItem(rowMap, rowKey);
    setIsLoading(true);
    await deleteListForUser(listItems[rowKey], dispatch, rowKey)
      .then(() => {
        setIsLoading(false);
      })
      .catch(e => {
        const {isNetworkError} = e ?? {};
        setIsLoading(false);
        if (!isNetworkError) {
        }
      });
  };

  const renderItem = ({item, index}) => {
    const {
      Products: lists = [],
      CreatedAt: creationDate = '',
      Name: listName = '',
    } = item ?? {};
    return (
      <>
        <TouchableHighlight
          onPress={goToDetailScreen(item, index)}
          underlayColor={COLORS.WHITE}
          style={styles.rowFront}>
          <View
            style={[
              styles.storeInnerWrapper,
              {marginEnd: widthPercentageToDP('6%')},
            ]}>
            <View style={{paddingVertical: heightPercentageToDP('1%')}}>
              <View style={styles.radioButtonView}>
                <Text allowFontScaling={false} style={styles.itemName}>{listName}</Text>
              </View>
              <View style={styles.descriptionView}>
                <Text allowFontScaling={false} style={styles.descriptionText}>
                  {moment(creationDate).format('MM/DD/YYYY')}
                </Text>
                {renderProductName(lists, '60%')}
              </View>
            </View>
            {!openItems?.[index] && (
              <View style={{justifyContent: 'center'}}>
                <Image
                  source={IMAGES.RIGHT_ARROW}
                  style={{width: 10, height: 15, alignSelf: 'flex-end'}}
                />
              </View>
            )}
          </View>
        </TouchableHighlight>
        {ItemSeparatorView()}
      </>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <>
        <View style={styles.swipeRowBack}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.closeBtn,
              {
                flexDirection: 'row',
              },
            ]}
            onPress={() => {
              toggleModal();
              closeItem(rowMap, data.index);
              setSelectedListItemIndex(data.index);
            }}>
            <View style={styles.moreButton} />
            <Text allowFontScaling={false} style={styles.btnText}>{APP_CONSTANTS.MORE}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteBtn]}
            onPress={() => deleteItem(rowMap, data.index)}>
            <AntDesign size={24} color={COLORS.WHITE} name={'delete'} />
          </TouchableOpacity>
        </View>
        {ItemSeparatorView()}
      </>
    );
  };

  const renderFlatListItem = ({item, index}) => {
    const {
      Products: lists = [],
      CreatedAt: creationDate = '',
      Name: listName = '',
    } = item ?? {};
    return (
      <>
        <View style={styles.rowFront}>
          <View style={styles.storeInnerWrapper}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={goToDetailScreen(item, index)}
              style={{
                paddingVertical: heightPercentageToDP('1%'),
                width: '60%',
              }}>
              <View style={styles.radioButtonView}>
                <Text allowFontScaling={false} numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={styles.itemName}>
                  {listName}
                </Text>
              </View>
              <View style={styles.descriptionView}>
                <Text allowFontScaling={false} style={styles.descriptionText}>
                  {moment(creationDate).format('MM/DD/YYYY')}
                </Text>
                {renderProductName(lists, '30%')}
              </View>
            </TouchableOpacity>
            <View style={styles.rowBack}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.actionButton,
                  styles.closeBtn,
                  {
                    flexDirection: 'row',
                  },
                ]}
                onPress={() => {
                  toggleModal();
                  setSelectedListItemIndex(index);
                }}>
                <View style={styles.moreButton} />
                <Text allowFontScaling={false} style={styles.btnText}>{APP_CONSTANTS.MORE}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.actionButton, styles.deleteBtn]}
                onPress={() => deleteItem(item, index)}>
                <AntDesign size={24} color={COLORS.WHITE} name={'delete'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {ItemSeparatorView()}
      </>
    );
  };

  const renderProductName = (lists, nameWidth) => {
    let nameString = '';
    if (lists?.length > 0) {
      lists?.map((itemInList, i) => {
        const {item = []} = itemInList;
        const {E_COMM_DESCRIPTION_AND_SIZE: name = ''} = item[0] ?? {};
        if (i < 3) {
          if (lists.length > 1) {
            nameString = `${nameString}${name}, `;
          } else {
            nameString = name;
          }
        }
      });
    }
    return (
      <View style={styles.itemNamesView}>
        <Text
            allowFontScaling={false}
          style={[
            styles.descriptionText,
            {
              width:
                10 * nameString.length > 60
                  ? widthPercentageToDP(nameWidth)
                  : 8 * nameString.length,
            },
          ]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {stringToLowerCase(nameString)}
        </Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return <View style={styles.itemSeparator} />;
  };

  const onRowClose = row => {
    setOpenItems(prevState => ({...prevState, [row]: false}));
  };

  const onRowOpen = row => {
    setOpenItems(prevState => ({...prevState, [row]: true}));
  };

  const getKeys = (item, index) => index.toString();

  const renderListScreenComponents = () => {
    return (
      <View style={{height: '95%'}}>
        <View style={styles.listsContainer}>
          {edit ? (
            <FlatList
              contentContainerStyle={styles.flatListContentContainer}
              data={listItems}
              onRefresh={refreshList}
              refreshing={isRefreshing}
              renderItem={renderFlatListItem}
              keyExtractor={getKeys}
            />
          ) : (
            <SwipeListView
              contentContainerStyle={styles.flatListContentContainer}
              data={listItems}
              renderItem={renderItem}
              onRefresh={refreshList}
              refreshing={isRefreshing}
              renderHiddenItem={renderHiddenItem}
              keyExtractor={getKeys}
              disableRightSwipe={true}
              rightOpenValue={-150}
              rightActionValue={-10}
              previewFirstRow={false}
              onRowOpen={onRowOpen}
              onRowClose={onRowClose}
            />
          )}
        </View>
        <View style={styles.btnWrapper}>
          <Button
            label={APP_CONSTANTS.CREATE_NEW_LIST}
            width="90%"
            onPress={createNewList}
          />
        </View>
        {renderListMoreModal()}
        <DialogBox
          title={APP_CONSTANTS.CREATE_NEW_LIST}
          message={APP_CONSTANTS.CREATE_LIST_DESCRIPTION}
          messageContainerStyles={{marginTop: heightPercentageToDP('.8%')}}
          withInput={true}
          visible={visibleDialog}
          confirmButtonLabel={APP_CONSTANTS.CREATE}
          cancelButtonLabel={APP_CONSTANTS.CANCEL}
          onCancelPress={closeDialog}
          closeDialog={closeDialog}
          onConfirmPress={createList}
        />
      </View>
    );
  };

  const renderListMoreModal = () => {
    return (
      <ListEditModal
        visible={visibleEditModal}
        listIndex={selectedListItemIndex}
        onDisplayMessage={displayMessage}
        closeModal={toggleModal}
        isDeleteEnabled={false}
      />
    );
  };
  const createAccount = () => {
    navigation.navigate('AuthStackForGuest', {
      screen: 'Login',
      initial: true,
      params: {showHeader: true},
    });
  };

  const renderCustomHeader = () => (
    <Header
      title={APP_CONSTANTS.LIST_HEADER}
      backButton={comingFrom === 'Profile'}
      onPress={setEditMode}
      editButton={edit}
      showEditButton={!isGuest}
      imageStyle={styles.headerBackImage}
    />
  );

  return (
    <ScreenWrapperComponent
      customHeader={renderCustomHeader}
      isScrollView={false}
      isLoading={isLoading}>
      <View>
        {isGuest ? (
          <View style={styles.parent}>
            <Text allowFontScaling={false} style={styles.guestRestrictionText}>
              {APP_CONSTANTS.GUEST_FEATURE_RESTRICTION_MESSAGE}
            </Text>
            <View style={styles.buttonWrapper}>
              <Button
                label={APP_CONSTANTS.SIGN_IN_CREATE_ACCOUNT}
                color={COLORS.WHITE}
                width={'100%'}
                onPress={createAccount}
              />
            </View>
          </View>
        ) : (
          renderListScreenComponents()
        )}
      </View>
      <ToastComponent toastRef={myToast} />
    </ScreenWrapperComponent>
  );
};

export default MyList;
