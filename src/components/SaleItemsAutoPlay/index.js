import React, {useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import styles from './styles';
import {SCREEN_WIDTH} from '../../constants/Common';
import SaleItem from './SaleItem';
import {
  setHomeSaleItems,
  setPopularItemsInYourArea,
} from '../../redux/actions/config';
import {useDispatch} from 'react-redux';

const scrollGap = 300;

const Slider = ({
  data,
  onItemPress,
  item: forItem,
  containerStyle,
  autoPlay,
  entryPoint,
  featuredItem,
  saleItemFromHome
}) => {
  const [flatListMeta, setFlatListMeta] = useState(null);
  const [sliderHeight, setSliderHeight] = useState(0);

  const flatListRef = useRef();
  const scrollPosition = useRef(0);
  const dispatch = useDispatch();

  const changeSelectionOfUnit = (item = {}, itemIndex = 0) => {
    if (featuredItem === 'popularItems') {
      data[itemIndex] = item;
      dispatch(setPopularItemsInYourArea([...data]));
    } else if (featuredItem === 'saleItems') {
      data[itemIndex] = item;
      dispatch(setHomeSaleItems([...data]));
    }
  };


  const renderItem = ({item, index}) => (
    <SaleItem
      onUnitSelectionChange={({item: product}) =>
        changeSelectionOfUnit(product, index)
      }
      entryPoint={entryPoint}
      item={item}
      onItemPress={onItemPress}
      forItemId={forItem?._id}
      saleItemFromHome={saleItemFromHome}
    />
  );

  const keyExtractor = (item, index) => String(item?._id || index);

  // const onLayout = e => {
  //   setSliderHeight(parseFloat(e?.nativeEvent?.layout?.height || 260));
  // };

  const onScrollEndDrag = event => {
    if (autoPlay) {
      const {targetContentOffset, contentSize, layoutMeasurement} =
        event?.nativeEvent || {};
      // setIsEndReached(false);
      // setIsTopReached(false);
      if (!flatListMeta) {
        setFlatListMeta(event?.nativeEvent);
      }
      const {x} = targetContentOffset || {};
      if (parseInt(x, 10) <= 0) {
        // setIsTopReached(true);
      } else if (
        parseFloat(x) + parseFloat(layoutMeasurement?.width) >=
        parseInt(contentSize.width, 10)
      ) {
        // setIsEndReached(true);
      }
      scrollPosition.current = x;
    }
  };

  const onScrollToTop = () => {
    // setIsEndReached(false);
    scrollPosition.current =
      scrollPosition.current - scrollGap > 0
        ? scrollPosition.current - scrollGap
        : 0;
    flatListRef.current.scrollToOffset({
      offset: scrollPosition.current,
    });
    if (scrollPosition.current <= 0) {
      // setIsTopReached(true);
    }
  };

  const onScrollToEnd = () => {
    // setIsTopReached(false);
    scrollPosition.current =
      scrollPosition.current + scrollGap <
      scrollPosition.current +
        (flatListMeta?.layoutMeasurement?.width || SCREEN_WIDTH)
        ? scrollPosition.current + scrollGap
        : flatListMeta?.contentSize?.width || SCREEN_WIDTH;
    flatListRef.current.scrollToOffset({
      offset: scrollPosition.current,
    });
    if (scrollPosition.current >= flatListMeta?.contentSize?.width) {
      // setIsEndReached(true);
    }
  };

  return (
    <View style={[styles.parentView, containerStyle]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        bounces={false}
        contentContainerStyle={styles.flatList}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        // onEndReached={() => setIsEndReached(true)}
        // onScrollToTop={() => setIsTopReached(true)}
        disableScrollViewPanResponder
        ref={flatListRef}
        // onLayout={onLayout}
        // onScrollBeginDrag={handleScroll}
        // onScrollEndDrag={handleScrollEnd}
        // onScrollEndDrag={onScrollEndDrag}
      />
      {/*{!!sliderHeight && autoPlay && (*/}
      {/*  <>*/}
      {/*    <ArrowButton*/}
      {/*      containerStyle={{left: 10}}*/}
      {/*      disabled={isTopReached}*/}
      {/*      height={sliderHeight}*/}
      {/*      icon={'chevron-left'}*/}
      {/*      onPress={onScrollToTop}*/}
      {/*    />*/}
      {/*    <ArrowButton*/}
      {/*      containerStyle={{right: 10}}*/}
      {/*      disabled={isEndReached}*/}
      {/*      height={sliderHeight}*/}
      {/*      icon={'chevron-right'}*/}
      {/*      onPress={onScrollToEnd}*/}
      {/*    />*/}
      {/*  </>*/}
      {/*)}*/}
    </View>
  );
};
export default React.memo(Slider);
