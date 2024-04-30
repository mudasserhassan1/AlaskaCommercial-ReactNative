import {NOTIFICATION_KEYS} from '../../constants/Common';
import {Switch, Text, View} from 'react-native';
import {styles} from './styles';
import {COLORS} from '../../theme';
import React from 'react';

const NotificationItem = ({item, index, isNotificationAllowed, onPressItem}) => {
  let {name = '', isEnabled = false, extraInformation = '', key} = item ?? {};
  if (key === NOTIFICATION_KEYS.IN_APP_NOTIFICATION) {
    isEnabled = isEnabled && isNotificationAllowed;
  }
  return (
    <>
      <View style={styles.bandwidthWrapper}>
        <Text allowFontScaling={false} style={styles.bandwidthText}>{name}</Text>
        <Switch
          trackColor={{
            false: COLORS.SWITCH_COLOR,
            true: COLORS.SWITCH_ON_COLOR,
          }}
          thumbColor={COLORS.WHITE}
          ios_backgroundColor={COLORS.SWITCH_COLOR}
          style={styles.switch}
          onValueChange={() => onPressItem(index, isEnabled, item)}
          value={isEnabled}
        />
      </View>
      {extraInformation.length > 0 ? <Text allowFontScaling={false} style={styles.extraInformationText}>{extraInformation}</Text> : null}
      <View style={styles.divider} />
    </>
  );
};

export default NotificationItem;
