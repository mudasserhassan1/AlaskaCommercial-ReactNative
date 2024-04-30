import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {COLORS} from '../../theme';
import {getFontSize} from '../../theme';

const DepartmentListItem = ({item, onItemPress, selectedItem}) => {
  const {E_COMM_DEPT_NAME = '', DEPT_ID = ''} = item ?? {};

  const isSelected = id => {
    const jsonIds = JSON.stringify(id);
    return selectedItem.indexOf(jsonIds) > -1;
  };

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.listParentView} onPress={() => onItemPress(DEPT_ID)}>
      <View style={styles.listRow}>
        <View style={styles.radioButtonView}>
          <View style={styles.radioUnchecked}>
            <View
              style={[
                styles.checkedCircle,
                {
                  backgroundColor: isSelected(DEPT_ID) ? COLORS.BLACK : COLORS.GRAY_2,
                },
              ]}
            />
          </View>
          <Text allowFontScaling={false} style={styles.itemName}>{E_COMM_DEPT_NAME}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  listParentView: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  listRow: {
    width: '100%',
    marginStart: wp('5%'),
    marginRight: wp('5%'),
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  descriptionView: {
    flexDirection: 'row',
    width: '80%',
    marginStart: wp('7%'),
    marginTop: hp('.5%'),
  },
  itemName: {
    marginStart: wp('2%'),
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
});

export default DepartmentListItem;
