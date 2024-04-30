/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, IMAGES} from '../../theme';
import {getDepartments} from '../../services/ApiCaller';
import DepartmentListItem from '../DepartmentListItem';
import styles from './styles';
import BottomSheetModal from '../BottomSheetModal';
import ImageComponent from '../ImageComponent';
import {STATUSES} from '../../constants/Api';

const ITEM_HEIGHT = 60;
const limit = 15;

const DepartmentFilterModal = ({visibleModal, closeModal, onDepartmentSelect, clearAll, selectedDepartments}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(selectedDepartments);
  const [departments, setDepartments] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalDataLength, setTotalDataLength] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedDepartment(selectedDepartments);
  }, [selectedDepartments]);

  useEffect(() => {
    if (totalDataLength !== departments.length) {
      getDepartmentsApi();
    }
  }, [pageNumber, limit]);

  useEffect(() => {
    if (clearAll) {
      setSelectedDepartment([]);
    }
  }, [clearAll]);

  const saveSelectedDepartment = dept => {
    setSelectedDepartment(dept);
    onDepartmentSelect(dept);
  };

  const getDepartmentsApi = async () => {
    setIsLoading(true);
    const {data: responseData = {}, status = 0, isUnderMaintenance} = await getDepartments?.({
      page: pageNumber,
      limit: limit,
    });
    if (status === STATUSES.OK) {
      const {data = [], total = 0} = responseData ?? {};
      setTotalDataLength(total);
      setIsLoading(false);
      if (pageNumber === 1) {
        return setDepartments(data);
      }
      setDepartments(prevState => [...prevState, ...data]);
      console.log('data.length', data.length, 'pageNumber', pageNumber);
    } else if (status === STATUSES.SERVER_ERROR) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const increasePageNumber = () => {
    !isLoading && setPageNumber(prevState => parseInt(prevState, 10) + 1);
  };

  const isSelected = id => {
    const jsonIds = JSON.stringify(id);
    return selectedDepartment.indexOf(jsonIds) > -1;
  };

  const handleSelection = id => {
    let temp = selectedDepartment ?? [];
    if (isSelected(id)) {
      temp = temp.filter(item => item !== JSON.stringify(id));
      return saveSelectedDepartment(temp);
    }
    const jsonStringOfIds = JSON.stringify(id);
    temp = [...temp, jsonStringOfIds];
    saveSelectedDepartment(temp);
  };

  const renderDepartments = ({item}) => {
    return <DepartmentListItem item={item} onItemPress={id => handleSelection(id)} selectedItem={selectedDepartment} />;
  };

  const ItemSeparatorView = () => {
    return <View style={styles.separatorView} />;
  };

  const renderListFooterComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.listFooterView}>
          <ActivityIndicator color={COLORS.MAIN} size="small" style={styles.loader} />
        </View>
      );
    }
    return <View />;
  };

  const renderModalHeader = () => (
    <SafeAreaView style={styles.modalHeaderView}>
      <TouchableOpacity style={styles.backButtonView} onPress={closeModal}>
        <ImageComponent style={styles.backButton} source={IMAGES.DEPT_BACK} />
      </TouchableOpacity>
      <View style={styles.headerTextView}>
        <Text allowFontScaling={false} style={styles.headerText}>Department</Text>
      </View>
    </SafeAreaView>
  );

  const renderList = () => (
    <FlatList
      data={departments}
      keyExtractor={(item, index) => index.toString()}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      ItemSeparatorComponent={ItemSeparatorView}
      contentContainerStyle={styles.listContentContainer}
      onEndReachedThreshold={0.01}
      ListFooterComponent={renderListFooterComponent}
      onEndReached={departments.length !== totalDataLength && increasePageNumber}
      renderItem={renderDepartments}
    />
  );
  return (
    <BottomSheetModal
      visible={visibleModal}
      onCrossPress={closeModal}
      showButton={false}
      containerStyle={styles.view}
      hasBackdrop={false}
      renderCustomHeader={renderModalHeader}>
      {renderList()}
    </BottomSheetModal>
  );
};
export default DepartmentFilterModal;
