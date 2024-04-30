import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SwipeListView} from 'react-native-swipe-list-view';
import {COLORS, IMAGES} from '../../theme';
import styles from './styles';
import {NOTIFICATION_STATUS, NOTIFICATION_TYPE_KEY} from '../../constants/Common';
import moment from 'moment';
import momentDurationPlugin from 'moment-duration-format';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ImageComponent from '../ImageComponent';
import {goToOnSale} from '../../utils/navigationUtils';

const getTimeAgo = createdAt => {
  createdAt = moment(createdAt || new Date());
  const diff = moment().diff(createdAt, 'seconds');
  return (
    moment.duration?.(diff, 'seconds').format?.('y[y], M[m], w[w], d[d], h[hrs], m[mins]', {
      largest: 1,
    }) || ''
  );
};

momentDurationPlugin(moment);

const NotificationInfo = props => {
  const {title, createdAt, body, type, _id, clickNotifId, isAgainClicked} = props || {};
  const shake = useSharedValue(0);

  useEffect(() => {
    if (clickNotifId === _id) {
      shake.value = withRepeat(
        withSequence(withTiming(5, {duration: 50}), withTiming(-5, {duration: 50}), withTiming(0, {duration: 50})),
        3,
      );
    }
  }, [clickNotifId, _id, shake, isAgainClicked]);

  const shakeAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginLeft: shake.value,
    };
  });

  const renderIcon = type => {
    let imageSource = type === NOTIFICATION_TYPE_KEY.ORDER_TRACKING ? IMAGES.ICON_ORDER_TRACKING : IMAGES.SALE_ICON;
    return (
      <FastImage resizeMode={FastImage.resizeMode.contain} style={styles.notificationImage} source={imageSource} />
    );
  };

  return (
    <Animated.View style={[styles.notificationImageView, shakeAnimatedStyle]}>
      {renderIcon(type)}
      <Animated.View style={[styles.notificationDescriptionView]}>
        <Animated.View style={[styles.textContainer]}>
          <Text allowFontScaling={false} style={styles.bottomLabelText}>
            {title}
            <Text allowFontScaling={false} style={styles.notificationTimeText}>
              {'  '}
              {getTimeAgo(createdAt) || 'moments ago'}
            </Text>
          </Text>
          {!!body && <Text allowFontScaling={false} style={styles.labelInfo}>{body}</Text>}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const UnreadNotifications = ({
  data,
  loading,
  onDeletePress,
  clickedNotification,
  setClickedNotification,
  closeModal = () => {},
  onRefresh,
  onEndReached,
  refreshing,
  renderEmptyComponent,
  pageNo,
}) => {
  const [clickNotifId, setClickedNotifId] = useState('');
  const [isFlipClicked, setIsFlipClicked] = useState('');
  const closeItem = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const navigation = useNavigation();
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: 'rgba(190,30,45,0.44)',
      opacity: opacity.value,
    };
  });

  const onHighlighting = (isFinished, _) => {
    isFinished && setClickedNotification({});
  };

  const onAnimateItem = () => {
    opacity.value = withSequence(
      withTiming(1, {duration: 500}),
      withDelay(
        2000,
        withTiming(0, {duration: 500}, isFinished => {
          runOnJS(onHighlighting)(isFinished);
        }),
      ),
    );
  };

  const onPressNotification = (notification, _id) => {
    let {type, orderId} = notification || {};

    switch (type) {
      case NOTIFICATION_TYPE_KEY.ORDER_TRACKING:
        closeModal();
        setTimeout(() => {
          navigation.navigate('OrderHistoryDetail', {orderId});
        }, 800);
        break;
      case NOTIFICATION_TYPE_KEY.ON_SALE:
        closeModal();
        setTimeout(goToOnSale, 300);
        break;
      case NOTIFICATION_TYPE_KEY.VW_REWARD:
        closeModal(true);
        break;
      case NOTIFICATION_TYPE_KEY.QUALTRICS:
        closeModal();
        break;
      default: {
        setClickedNotifId(prevId => {
          if (prevId === _id) {
            setIsFlipClicked(prevState => !prevState);
          }
          return _id;
        });
      }
    }
  };

  const renderUnreadNotifications = ({item}) => {
    let {_id, status} = item || {};
    const isClicked = !loading && clickedNotification?.data?.id && clickedNotification?.data?.id === _id;

    if (isClicked) {
      onAnimateItem();
    }

    return (
      <TouchableOpacity activeOpacity={1} onPress={() => onPressNotification(item, _id)}>
        <View style={[styles.notificationCardContainer]}>
          <View style={styles.storeInnerWrapper}>
            <NotificationInfo {...item} clickNotifId={clickNotifId} isAgainClicked={isFlipClicked} />
            {status === NOTIFICATION_STATUS.NEW && <View style={styles.redDot} />}
          </View>
        </View>
        {!!isClicked && <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} />}
      </TouchableOpacity>
    );
  };

  const renderHiddenUnreadNotificationItem = (item, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            onDeletePress(item.item, item.index);
            closeItem(rowMap, item.index);
          }}>
          <ImageComponent source={IMAGES.ICON_DELETE} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const renderSectionHeader = ({section: {title} = {}}) => {
    if (title) {
      return (
        <View style={styles.headerTitleView}>
          <Text allowFontScaling={false} style={styles.headerTitleText}>{title}</Text>
        </View>
      );
    }

    return null;
  };

  const listFooterComponent = () => {
    if (loading && pageNo > 1 && !refreshing) {
      return (
        <View style={styles.listFooterView}>
          <ActivityIndicator color={COLORS.MAIN} size="small" style={styles.loader} />
        </View>
      );
    }
    return null;
  };

  return (
    <SwipeListView
      useSectionList
      sections={data}
      keyExtractor={(item, index) => String(item?._id || index)}
      contentContainerStyle={styles.contentContainerStyle}
      disableRightSwipe={true}
      refreshing={refreshing}
      rightOpenValue={-90}
      stickyHeaderHiddenOnScroll={false}
      rightActionValue={-10}
      previewFirstRow={false}
      renderItem={renderUnreadNotifications}
      renderHiddenItem={renderHiddenUnreadNotificationItem}
      ListFooterComponent={listFooterComponent}
      renderSectionHeader={renderSectionHeader}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={renderSeparator}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.15}
      onRefresh={onRefresh}
    />
  );
};

export default UnreadNotifications;
