/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import UnreadNotifications from '../UnreadNotifications';
import BottomSheetModal from '../BottomSheetModal';
import {
  deleteNotificationApiCall,
  deleteNotifications,
  getNotificationsListing,
  updateNotificationStatus,
} from '../../services/ApiCaller';
import {logToConsole} from '../../configs/ReactotronConfig';
import {COLORS, IMAGES} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import {IMAGES_RESIZE_MODES, pageLimits} from '../../constants/Common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageComponent from '../ImageComponent';
import {updateNotificationBadge} from '../../utils/notificationsUtils';
import {ModalHeader} from '../ModalHeader';
import DialogBox from '../DialogBox';

const NotificationsModal = forwardRef(({visibleModal, closeModal}, ref) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRemoveDialog, setIsRemoveDialog] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [clickedNotification, setClickedNotification] = useState({});
  const [isSpinner, setIsSpinner] = useState(false);
  const [page, setPage] = useState(1);
  const [modalTitle, setModalTitle] = useState('');

  const hasMore = useRef(true);
  const openTime = useRef();
  const isLoading = loading && isSpinner;

  useEffect(() => {
    if (visibleModal) {
      getNotifications();
    }
  }, [visibleModal]);

  const onSetSections = (newN, oldN) => {
    setSections([
      {
        title: '',
        data: newN,
      },
      {
        title:
          newN?.length && oldN?.length ? APP_CONSTANTS.PAST_NOTIFICATIONS : '',
        data: oldN,
      },
    ]);
  };

  const updateModalTitle = (newN = [], oldN = []) => {
    logToConsole({New: newN?.length, Old: oldN?.length});
    setModalTitle(
      newN?.length
        ? APP_CONSTANTS.NEW_NOTIFICATIONS
        : oldN?.length
          ? APP_CONSTANTS.PAST_NOTIFICATIONS
          : '',
    );
  };

  const onReceiveNotifications = (res, page) => {
    const {newNotifications = [], oldNotifications = []} = res || {};
    const dataLength = newNotifications?.length + oldNotifications?.length;
    if (page === 1) {
      openTime.current = new Date().getTime();
      updateNotificationBadge(0);
      updateModalTitle(newNotifications, oldNotifications);
      dataLength && onSetSections(newNotifications, oldNotifications);
    } else if (dataLength) {
      const newDataUpdate = (sections[0].data = [
        ...(sections?.[0]?.data || []),
        ...(newNotifications || []),
      ]);
      const oldDataUpdate = (sections[1].data = [
        ...(sections?.[1]?.data || []),
        ...(oldNotifications || []),
      ]);
      onSetSections(newDataUpdate, oldDataUpdate);
    }
    hasMore.current = dataLength >= pageLimits.MEDIUM;
  };

  const onDeleteAllNotifications = async () => {
    try {
      setPage(1);
      setLoading(true);
      const response = await deleteNotifications({lastDate: openTime.current});
      if (
        response?.response?.isNetworkError &&
        !response?.response?.isUnderMaintenance
      ) {
        throw {response};
      }
      setSections([]);
      hasMore.current = true;
      updateModalTitle();
    } catch (e) {
      setPage(page);
    } finally {
      setLoading(false);
    }
  };

  const getNotifications = (page = 1, isRefresh) => {
    setLoading(true);
    setPage(page);
    if (page === 1 && !isRefresh) {
      setModalTitle('');
      setSections([]);
    }
    getNotificationsListing({page, limit: pageLimits.MEDIUM})
      .then(response => {
        onReceiveNotifications(response?.response?.data, page);
      })
      .catch(e => {
        logToConsole(
          {ErrorGetNotificationsListing: e, message: e?.message},
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onModalHide = () => {
    setIsSpinner(false);
    updateNotificationStatus({lastTime: openTime.current}).then(() => {});
  };

  useImperativeHandle(ref, () => ({
    getNotifications,
    setClickedNotification,
  }));

  // const updateSectionsOnDelete = _id => {
  //   setSections(prevState => {
  //     const updated = prevState
  //       ?.map(({title, data}) => ({
  //         title,
  //         data: data?.filter(notif => notif?._id !== _id),
  //       }))
  //       ?.filter(item => item?.data?.length);
  //     logToConsole({prevState});
  //     updateModalTitle(updated?.[0] || [], updated?.[1] || []);
  //     return updated;
  //   });
  // };

  const updateSectionsOnDelete = _id => {
    setSections(prevState => {
      const updated = prevState
        .map(({title, data}) => ({
          title,
          data: data.filter(notif => notif?._id !== _id),
        }))
        .filter(item => item.data.length > 0);
      logToConsole({updated});
      if (updated.length >= 2) {
        updateModalTitle(updated[0].data, updated[1].data);
        return updated;
      } else {
        updateModalTitle([], updated[0]?.data || []);
        return updated.map(item => ({...item, data: item.data || []}));
      }
    });
  };

  const deleteUnreadNotification = useCallback(async item => {
    try {
      setLoading(true);
      let {_id} = item || {};
      await deleteNotificationApiCall({notificationId: _id});
      updateSectionsOnDelete(_id);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  const onEndReached = useCallback(() => {
    if (!loading && !refreshing && hasMore.current) {
      getNotifications(page + 1);
    }
  }, [loading, refreshing, hasMore.current]);

  const onRefresh = useCallback(() => {
    hasMore.current = true;
    setRefreshing(true);
    getNotifications(1, true);
  }, []);

  const closeDeleteDialog = () => {
    setIsRemoveDialog(false);
  };

  const renderEmptyComponent = () => {
    if (!loading) {
      return (
        <View style={styles.emptyComponent}>
          <View>
            <ImageComponent
              source={IMAGES.PLACE_HOLDER_IMAGE}
              style={{
                width: 90,
                height: 90,
                resizeMode: IMAGES_RESIZE_MODES.CONTAIN,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: getFontSize(15),
              fontFamily: FONTS.REGULAR,
              marginTop: heightPercentageToDP('1.5%'),
            }}>
            {APP_CONSTANTS.NO_NEW_NOTIFICATION}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderLoadingComponent = () => {
    if (isLoading && isSpinner && !refreshing && page === 1) {
      return <Spinner visible={isLoading} color={COLORS.MAIN} />;
    }
    return null;
  };

  const {bottom = 0} = useSafeAreaInsets() ?? {};

  const renderCustomHeader = () => {
    return (
      <ModalHeader
        title={modalTitle}
        style={styles.modalHeader}
        backgroundColor={'transparent'}
        titleStyle={styles.headerText}
        imageStyle={{tintColor: '#000'}}
        closeModal={closeModal}>
        {!!modalTitle && (
          <TouchableOpacity
            style={styles.removeAllContainer}
            onPress={() => setIsRemoveDialog(true)}>
            <Text style={styles.removeAllText}>Remove All</Text>
          </TouchableOpacity>
        )}
      </ModalHeader>
    );
  };

  return (
    <BottomSheetModal
      visible={visibleModal}
      avoidKeyboard={false}
      title={modalTitle}
      showButton={false}
      onModalHide={onModalHide}
      renderCustomHeader={renderCustomHeader}
      onModalWillShow={() => setIsSpinner(true)}
      containerStyle={{flex: 0.88}}
      onCrossPress={closeModal}
      headerTitleStyle={styles.headerText}>
      <View
        style={{
          height: '89%',
          marginBottom: bottom + 10,
        }}>
        <UnreadNotifications
          pageNo={page}
          data={sections}
          loading={loading}
          onRefresh={onRefresh}
          refreshing={refreshing}
          closeModal={closeModal}
          onEndReached={onEndReached}
          clickedNotification={clickedNotification}
          renderEmptyComponent={renderEmptyComponent}
          setClickedNotification={setClickedNotification}
          onDeletePress={deleteUnreadNotification}
        />
      </View>
      <DialogBox
        visible={isRemoveDialog}
        closeModal={closeDeleteDialog}
        title={APP_CONSTANTS.REMOVE_ALL_ITEMS}
        messageContainerStyles={{marginTop: 5}}
        message={APP_CONSTANTS.DELETE_ALL_CONFIRMATION}
        cancelButtonLabel={APP_CONSTANTS.NO}
        confirmButtonLabel={APP_CONSTANTS.YES}
        onConfirmPress={() => {
          closeDeleteDialog();
          setTimeout(onDeleteAllNotifications, 250);
        }}
        onCancelPress={closeDeleteDialog}
      />
      {renderLoadingComponent()}
    </BottomSheetModal>
  );
});

function arePropsEqual(prevProps, nextProps) {
  return prevProps.visibleModal === nextProps.visibleModal;
}

export default React.memo(NotificationsModal, arePropsEqual);

const styles = StyleSheet.create({
  headerText: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
    letterSpacing: -0.24,
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_40,
  },
  emptyComponent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: heightPercentageToDP('10%'),
  },
  removeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  removeAllText: {
    textAlign: 'right',
    color: COLORS.MAIN,
    fontFamily: FONTS.MEDIUM,
    letterSpacing: -0.21,
    fontSize: getFontSize(13),
  },
  modalHeader: {
    marginStart: 0,
    marginEnd: 0,
    paddingHorizontal: wp('6%'),
  },
});
