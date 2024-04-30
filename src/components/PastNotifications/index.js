import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {SwipeListView} from 'react-native-swipe-list-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {COLORS, IMAGES} from '../../theme';
import {getFontSize, getFontWeight} from '../../theme';

const PastNotifications = ({data, onDeletePress}) => {
  const closeItem = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const renderHiddenPastNotificationItem = (item, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteBtn]}
          onPress={() => {
            onDeletePress(item, item.index, rowMap);
            closeItem(rowMap, item.index);
          }}>
          <AntDesign size={20} color={COLORS.WHITE} name={'delete'} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPastNotifications = ({item}) => {
    return (
      <TouchableWithoutFeedback>
        <View style={styles.notificationCardContainer}>
          <View style={styles.storeInnerWrapper}>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              style={styles.notificationImage}
              source={IMAGES.SALE_ICON}
            />
            <View style={styles.notificationImageView}>
              <View style={styles.notificationDescriptionView}>
                <View>
                  <Text allowFontScaling={false} style={styles.bottomLabelText}>
                    {item.notificationType}
                    <Text allowFontScaling={false} style={styles.notificationTimeText}>
                      {'  '}
                      {item.timeAgo}
                    </Text>
                  </Text>
                  <Text allowFontScaling={false} style={styles.labelInfo}>{item.description}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;
  return (
    <View>
      <View style={styles.headerTitleView}>
        <Text allowFontScaling={false} style={styles.headerTitleText}>Past Notifications</Text>
      </View>
      <SwipeListView
        data={data}
        renderItem={renderPastNotifications}
        renderHiddenItem={renderHiddenPastNotificationItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={renderSeparator}
        disableRightSwipe={true}
        rightOpenValue={-90}
        rightActionValue={-10}
        previewFirstRow={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerTitleText: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-SemiBold',
    fontWeight: getFontWeight('600'),
    letterSpacing: -0.24,
    fontStyle: 'normal',
  },
  headerTitleView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginStart: wp('6%'),
    marginVertical: hp('1.5%'),
  },
  notificationCardContainer: {
    backgroundColor: 'white',
    height: 70,
    justifyContent: 'center',
    marginStart: wp('6%'),
  },
  storeInnerWrapper: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomLabelText: {
    fontSize: getFontSize(15),
    fontFamily: 'SFProDisplay-Medium',
    marginStart: wp('3%'),
    letterSpacing: -0.36,
  },
  labelInfo: {
    fontSize: 14,
    marginTop: hp('.2%'),
    fontFamily: 'SFProDisplay-Regular',
    color: COLORS.GRAY_67,
    marginStart: wp('3%'),
  },
  actionButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 60,
  },
  deleteBtn: {
    backgroundColor: COLORS.MAIN,
    right: 0,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    height: 70,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  notificationImageView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('1%'),
  },
  notificationImage: {
    height: 20,
    width: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  notificationDescriptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationTimeText: {
    color: COLORS.CHARCOAL_GREY_60,
    fontSize: getFontSize(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.24,
    fontFamily: 'SFProDisplay-Regular',
  },
  separator: {
    width: '94%',
    alignSelf: 'flex-end',
    height: 1,
    backgroundColor: COLORS.GRAY0_5,
  },
});
export default PastNotifications;
