import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import {getFontSize} from '../../theme';

import SearchKeyword from '../SearchKeyword';
import SearchListHeader from '../SearchListsHeaderComponent';
import {COLORS} from '../../theme';

const ActiveSearchView = ({data = [], onItemPress, isLoading = false, noRecordLabel = false}) => {
  const renderActiveSearchResults = ({item}) => {
    const {item: innerItem = {}, SKU: sku = ''} = item ?? {};
    const {E_COMM_DESCRIPTION_AND_SIZE: productName = ''} = innerItem[0];
    return (
      <SearchKeyword
        text={productName}
        onPress={() => onItemPress(productName, sku, item)}
        textPadding={styles.padding}
      />
    );
  };

  const renderListEmptyComponent = () => {
    if (!isLoading && noRecordLabel) {
      return (
        <View style={styles.itemParentView}>
          <Text
              allowFontScaling={false}
            style={{
              fontSize: getFontSize(20),
            }}>
            No Record found
          </Text>
          <Text
              allowFontScaling={false}
            style={{
              fontSize: getFontSize(15),
            }}>
            There are no results from your search
          </Text>
        </View>
      );
    }

    return null;
  };

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '94%',
          marginStart: widthPercentageToDP('6%'),
          backgroundColor: COLORS.GRAY_2,
        }}
      />
    );
  };

  return (
    <View style={styles.parentView}>
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.containerStyle}
        renderItem={renderActiveSearchResults}
        ListEmptyComponent={renderListEmptyComponent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={'on-drag'}
        ItemSeparatorComponent={FlatListItemSeparator}
        ListHeaderComponent={<SearchListHeader headerText="Your Search Results" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentView: {
    marginVertical: heightPercentageToDP('1%'),
    flex: 1,
  },
  containerStyle: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  itemParentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding: {
    paddingVertical: heightPercentageToDP('1.2%'),
    // height: heightPercentageToDP('8%'),
  },
});

export default ActiveSearchView;
