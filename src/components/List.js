import React from 'react';
import {FlatList} from 'react-native';
import {logToConsole} from "../configs/ReactotronConfig";

const List = props => {
  const {
    ListHeaderComponent = () => {},
    ListFooterComponent = () => {},
    refreshing = false,
    onRefresh = () => {},
    scrollEnabled = true,
  } = props ?? {};

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={props.contentContainerStyle}
      style={props.style}
      keyboardShouldPersistTaps={props.keyboardShouldPersistTaps}
      data={props.data}
      removeClippedSubviews={false}
      renderItem={props.renderItem}
      ItemSeparatorComponent={props.ItemSeparatorComponent}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      horizontal={props.horizontal}
      showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
      numColumns={props.numColumns}
      snapToInterval={props.interval}
      keyExtractor={props.keyExtractor}
      ListEmptyComponent={props.ListEmptyComponent}
      onEndReached={props.onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent()}
      ListFooterComponent={ListFooterComponent()}
      extraData={props.extraData}
      ref={props.ref}
      scrollEnabled={scrollEnabled}
      scrollIndicatorInsets={props.scrollIndicatorInsets}
    />
  );
};

export {List};
