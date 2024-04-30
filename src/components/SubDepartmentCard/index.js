import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

const SubDepartmentCard = ({item, onItemPress, isSelected}) => {
  const {_id = '', E_COMM_CLASS_NAME: subDepartmentName = '', CLASS: subDepartmentId = ''} = item ?? {};
  return (
    <View key={_id}>
      <TouchableOpacity style={styles.header} onPress={() => onItemPress(subDepartmentId, subDepartmentName)}>
        <View style={styles.subDepartmentTextView}>
          <Text allowFontScaling={false} style={[styles.headerText, isSelected && {color: COLORS.MAIN}]}>{subDepartmentName || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.WHITE,
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    paddingStart: wp('1%'),
  },
  separator: {
    height: 0.5,
    backgroundColor: COLORS.GRAY_1,
    width: '100%',
    marginLeft: wp('6%'),
    marginRight: wp('6%'),
  },
  headerText: {
    marginStart: wp('6.5%'),
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-Regular',
  },
  subDepartmentTextView: {
    justifyContent: 'center',
    marginStart: wp('13%'),
    height: 50,
  },
});
export default SubDepartmentCard;
