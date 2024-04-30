import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';

import SearchKeyword from '../SearchKeyword';
import SearchListHeader from '../SearchListsHeaderComponent';
import {getTrendingSearchResult} from '../../services/ApiCaller';
import PreviousSearchView from '../PreviousSearchView';
import {COLORS} from '../../theme';

const TrendingSearchView = ({onItemPress}) => {
  const [trendingSearchResults, setTrendingSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderTrendingSearchResults = ({item}) => {
    const {SearchQuery = ''} = item ?? {};

    return (
      <View style={styles.searchKeyword}>
        <SearchKeyword text={SearchQuery} onPress={() => onItemPress(SearchQuery)} style={styles.textStyle} />
      </View>
    );
  };

  useEffect(() => {
    getTrendingSearchResults().then(() => {});
  }, []);


  const getTrendingSearchResults = async () => {
    setIsLoading(true);
    let param = {
      TRENDING_SEARCH: true,
    };
    const {response = {}} = await getTrendingSearchResult(param);
    setIsLoading(false);
    let {trendingSearchResults: result = ''} = response?.data ?? {};
    setTrendingSearchResults(result);
  };

  const listEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator style={styles.loader} size={'small'} color={COLORS.MAIN} />;
    }
    return null;
  };

  return (
    <View style={styles.parentView}>
      <FlatList
        data={trendingSearchResults}
        keyExtractor={item => String(item._id)}
        renderItem={renderTrendingSearchResults}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={<PreviousSearchView onItemPress={onItemPress} />}
        ListHeaderComponent={<SearchListHeader headerText="Trending Search Results" />}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  parentView: {
    flex: 1,
    marginTop: heightPercentageToDP('1.5%'),
  },
  loader: {
    marginVertical: 20,
  },
  textStyle: {
    marginStart: widthPercentageToDP('6%'),
    marginEnd: widthPercentageToDP('6%'),
  },
  containerStyle: {
    marginStart: widthPercentageToDP('6%'),
  },
  searchKeyword: {
    flexDirection: 'row',
    marginTop: heightPercentageToDP('1%'),
  },
});
export default TrendingSearchView;
