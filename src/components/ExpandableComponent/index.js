import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {COLORS, IMAGES} from '../../theme';
import SubDepartmentCard from '../SubDepartmentCard';
import styles from './styles';
import ImageComponent from '../ImageComponent';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setsubDepartments} from '../../redux/actions/config';

const ExpandableComponent = ({
  item,
  selected = {},
  onClickFunction,
  isExpanded,
  onSubDepartmentPress,
  onSale = false,
  filter = false,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const itemArray = item || {};
  const {SUB_DEPARTMENTS} = itemArray || {};
  const [layoutHeight, setLayoutHeight] = useState(0);
  const {E_COMM_DEPT_NAME: departmentName = '', DEPT_ID: deptId = []} =
    item ?? {};
  useEffect(() => {
    if (isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [isExpanded]);

  const getIconTintColor = () => {
    if (isExpanded) {
      return COLORS.MAIN;
    }
    return COLORS.BLACK;
  };

  const renderSubDepartmentsView = () => {
    return (
      <View style={[styles.subDepartmentView, {height: layoutHeight}]}>
        {onSale
          ? item.subDepartments?.map(renderSubDepartmentsList)
          : item.SUB_DEPARTMENTS?.map(renderSubDepartmentsList)}
      </View>
    );
  };
  const onPresshandler = () => {
    if (filter) {
      return onClickFunction();
    }
    if (!filter && departmentName === 'Party Trays') {
      navigation.navigate('ShopStack', {
        screen: 'Products',
        initial: false,
        params: {
          screen: 'Drawer',
          params: {
            isPartyEligible: true,
            departmentName,
            subDepartmentName: 'Party Trays',
          },
        },
      });
    } else if (!filter && departmentName !== 'Party Trays') {
      const hasSubDepartments =
        item?.SUB_DEPARTMENTS && item?.SUB_DEPARTMENTS?.length > 0;
      if (hasSubDepartments) {
        dispatch(setsubDepartments(SUB_DEPARTMENTS));
        navigation.navigate('SubDepartments', {
          departmentsId: item?.DEPT_ID?.[0],
          subDepartmentClick: subDepartmentClick,
          departmentName: departmentName,
        });
      }
    }
  };

  const subDepartmentClick = (subDepartmentId, subDepartmentName) => {
    onSubDepartmentPress(subDepartmentId, subDepartmentName);
  };

  const renderSubDepartmentsList = (subDepartment, key) => {
    return (
      <SubDepartmentCard
        isSelected={!!selected[subDepartment.CLASS.toString()]}
        key={key.toString()}
        item={subDepartment}
        onItemPress={(subDepartmentId, subDepartmentName) =>
          onSubDepartmentPress(subDepartmentId, subDepartmentName)
        }
      />
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPresshandler}
        style={styles.header}>
        <View style={styles.departmentImageView}>
          {/*<DepartmentImageComponent imageUrl={getDeptIcon(deptId[0])} imageStyle={styles.departmentImage} />*/}
          <Text
              allowFontScaling={false}
            style={[
              styles.headerText,
              {
                color: getIconTintColor(),
              },
            ]}>
            {departmentName || 'N/A'}
          </Text>
          <ImageComponent
            source={IMAGES.RIGHT_ICON}
            resizeMode={'contain'}
            style={{height: 24, width: 24}}
          />
        </View>
      </TouchableOpacity>
      {renderSeparator()}
      {renderSubDepartmentsView()}
    </View>
  );
};
export default React.memo(ExpandableComponent);
