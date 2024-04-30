import React, {useEffect, useMemo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../theme';
import {Button, List} from '../../components';
import DialogBox from '../../components/DialogBox/index';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import RefundProductCard from '../../components/RefundProductCard';
import {useSelector} from 'react-redux';
import {formatDateForRefundCard} from '../../utils/timeUtils';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';
import {SCREEN_HEIGHT} from '../../constants/Common';
import {getResourcesForQuantityChange} from '../../utils/productUtils';

const RefundItemsSelection = ({navigation, route}) => {
  const {item: order} = route.params;
  const {createdDate = '', orderItems = [], orderId = ''} = order ?? {};

  // const {is24Hour} = useSelector(({general: {is24Hour, zipCodeDetail} = {}} = {}) => ({
  //   is24Hour,
  //   zipCodeDetail,
  // }));

  const is24HourSelector = useMemo(() => state => state.general?.is24Hour, []);

  const zipCodeDetailSelector = useMemo(
    () => state => state.general?.zipCodeDetail,
    [],
  );

  const is24Hour = useSelector(is24HourSelector);
  const zipCodeDetail = useSelector(zipCodeDetailSelector);

  const [selectedItemToReturn, setSelectedItemToReturn] = useState(orderItems);
  const [showDialog, setShowDialog] = useState(false);

  const refundItems = useMemo(() => {
    return selectedItemToReturn.filter(r => r.isSelected);
  }, [selectedItemToReturn]);

  useEffect(() => {
    for (let item of orderItems) {
      item.item.maxQuantity = parseFloat(item.item.quantity ?? 1);
    }
  }, [orderItems]);

  const toggleDialog = () => {
    setShowDialog(!showDialog);
  };

  const onSelectItem = index => {
    selectedItemToReturn[index].isSelected =
      !selectedItemToReturn[index].isSelected;
    setSelectedItemToReturn([...selectedItemToReturn]);
  };

  const filterOutSelectedItems = () => {
    toggleDialog();
    navigation.navigate('RefundDetails', {
      refundItems,
      order,
    });
  };

  const handleQuantityChange = (index, operation) => {
    let clickedItem = selectedItemToReturn[index];
    let {clickedItem: updatedItem, userSelectedQty} =
      getResourcesForQuantityChange(
        clickedItem.item.itemObj,
        operation,
        1,
        clickedItem.item.maxQuantity,
        true,
        clickedItem.item.quantity,
      );
    clickedItem.item.itemObj = updatedItem;
    clickedItem.item.quantity = userSelectedQty;
    selectedItemToReturn[index] = clickedItem;
    setSelectedItemToReturn([...selectedItemToReturn]);
  };

  const ItemSeparatorView = () => {
    return <View style={styles.separator} />;
  };

  const headerComponent = () => {
    return <Text allowFontScaling={false} style={styles.ordernumber}>Order #{orderId}</Text>;
  };
  const renderListItems = ({item, index}) => {
    return (
      <RefundProductCard
        index={index}
        onPlusPress={handleQuantityChange}
        onMinusPress={handleQuantityChange}
        onItemPress={onSelectItem}
        item={item}
        isSelected={item.isSelected}
      />
    );
  };

  const renderListFooter = () => {
    return (
      <View style={{backgroundColor: '#f4f4f4'}}>
        <View
          style={[
            styles.btnWrapper,
            {
              backgroundColor: !refundItems.length
                ? COLORS.DISABLE_BUTTON_COLOR
                : COLORS.ACTIVE_BUTTON_COLOR,
            },
          ]}>
          <Button
            label={APP_CONSTANTS.CONTINUE}
            color="white"
            width="100%"
            disabled={!refundItems.length}
            onPress={toggleDialog}
          />
        </View>
      </View>
    );
  };

  const renderDateHeader = () => (
    <View style={styles.dateOuterWrapper}>
      <View style={styles.dateInnerWrapper}>
        <Text allowFontScaling={false} style={styles.dateHeaderText}>
          {formatDateForRefundCard(is24Hour, createdDate)}
        </Text>
      </View>
    </View>
  );

  const renderList = () => (
    <TouchableOpacity activeOpacity={1} style={styles.listWrapper}>
      <List
        data={selectedItemToReturn}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: SCREEN_HEIGHT * 0.02,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={renderListFooter}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderListItems}
      />
    </TouchableOpacity>
  );

  const renderConfirmationDialog = () => (
    <DialogBox
      visible={showDialog}
      confirmButtonLabel={APP_CONSTANTS.YES}
      cancelButtonLabel={APP_CONSTANTS.NO}
      messageContainerStyles={styles.dialogMessageContainer}
      message="Are you sure you would like to confirm the selected items?"
      title="Confirm Items"
      onCancelPress={toggleDialog}
      onConfirmPress={filterOutSelectedItems}
    />
  );

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.REFUND_REQUEST}
      withBackButton
      containerStyle={{flex: 1}}
      isScrollView={false}>
      {renderDateHeader()}
      {renderList()}
      {renderConfirmationDialog()}
    </ScreenWrapperComponent>
  );
};

export default RefundItemsSelection;
