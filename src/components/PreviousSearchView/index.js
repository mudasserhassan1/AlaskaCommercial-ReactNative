import React, { useMemo } from "react";
import {FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import SearchListHeader from '../SearchListsHeaderComponent';
import SearchKeyword from '../SearchKeyword';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const PreviousSearchView = ({onItemPress}) => {
  const usePreviousSearchesSelector = () => useMemo(
    () => state => state.general?.previousSearches ?? [],
    []
  );
  const previousSearches = useSelector(usePreviousSearchesSelector());

  const renderPreviousSearchResults = ({item}) => {
    const {name = ''} = item ?? {};
    // return <SearchKeyword text={name} onPress={() => onItemPress(name)} />;
    return (
      <View style={{marginTop: heightPercentageToDP('1%')}}>
        <SearchKeyword text={name} onPress={() => onItemPress(name)} />
      </View>
    );
  };

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={previousSearches}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<SearchListHeader headerText="Previous Searches" />}
        renderItem={renderPreviousSearchResults}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 20,
  },
});
export default PreviousSearchView;
