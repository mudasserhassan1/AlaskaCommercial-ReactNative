import {styles} from '../../screens/Home/styles';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {APP_CONSTANTS} from '../../constants/Strings';
import React, {memo, useMemo} from 'react';
import {Card} from '../Card';
import DepartmentImageComponent from '../DepartmentIConComponent';
import {getDeptIcon} from '../../utils/imageUrlUtils';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../theme';
import {setsubDepartments} from '../../redux/actions/config';
import {useDispatch} from 'react-redux';
import {logToConsole} from '../../configs/ReactotronConfig';

const HomeDepartments = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const useHomeDepartmentsSelector = () =>
    useMemo(() => state => state.config?.homeDepartments ?? [], []);
  const homeDepartments = useSelector(useHomeDepartmentsSelector());
  const navigateToDepartments = (
    index,
    item,
    isPartyEligible,
    departmentName,
  ) => {
    if (!isPartyEligible) {
      const itemArray = item || {};
      const {SUB_DEPARTMENTS} = itemArray || {};
      dispatch(setsubDepartments(SUB_DEPARTMENTS));
      navigation.navigate('ShopStack', {
        screen: 'SubDepartments',
        initial: false,
        params: {
          isPartyEligible: false,
          departmentName: departmentName,
          departmentsId: item?.DEPT_ID?.[0],
        },
      });
    } else {
      navigation.navigate('ShopStack', {
        screen: 'Products',
        initial: false,
        params: {
          screen: 'Drawer',
          params: {
            isPartyEligible,
            comingFrom: 'Home',
            departmentName,
            onSaleTag: false,
            subDepartmentName: 'Party Trays',
            fromHomeDept: true,
            departmentId: item?.DEPT_ID?.[0],
          },
        },
      });
    }
  };

  const renderDepartmentsList = ({item, index}) => {
    const {
      E_COMM_DEPT_NAME: departmentName,
      DEPT_ID: deptId = [],
      IS_PARTY_ELIGIBLE: isPartyEligible,
    } = item ?? {};
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigateToDepartments(index, item, isPartyEligible, departmentName)
        }>
        <Card style={styles.deptCardContainer}>
          <View style={styles.deptItemWrapper}>
            <View
              style={{
                backgroundColor: COLORS.LIGHT_RED,
                height: 120,
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 66,
              }}>
              <DepartmentImageComponent
                imageUrl={getDeptIcon(deptId?.[0])}
                imageStyle={styles.departmentImage}
              />
            </View>

            <View style={styles.departmentContainer}>
              <Text
                  allowFontScaling={false}
                style={styles.departmentName}
                // minimumFontScale={0.95}
                numberOfLines={2}>
                {departmentName}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.homeDepartmentsWrapper}>
      <View style={{marginTop: hp('1.9%'), marginBottom: hp('3%')}}>
        <View style={styles.userNameWrapper}>
          <Text allowFontScaling={false} style={styles.featureText}>
            {APP_CONSTANTS.FEATURED_CATEGORIES}
          </Text>
          <TouchableOpacity
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            onPress={() =>
              navigation.navigate('ShopStack', {
                screen: 'Departments',
                initial: true,
              })
            }>
            <Text allowFontScaling={false} style={styles.changeText}>{APP_CONSTANTS.VIEW_ALL}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={homeDepartments}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item, index) => item?._id || index}
        showsHorizontalScrollIndicator={false}
        horizontal
        renderItem={renderDepartmentsList}
      />
    </TouchableOpacity>
  );
};

export default memo(HomeDepartments);
