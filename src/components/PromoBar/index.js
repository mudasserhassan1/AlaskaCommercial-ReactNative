// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {FlatList, Linking, TouchableOpacity, View} from 'react-native';
// import styles from './styles';
// import {COLORS} from '../../theme';
// import {PROMO_CROSS_ICON_WIDTH, SCREEN_WIDTH} from '../../constants/Common';
// import Animated, {
//   cancelAnimation,
//   Easing,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withTiming,
// } from 'react-native-reanimated';
// import Entypo from 'react-native-vector-icons/Entypo';
// import ToastComponent from '../ToastComponent';
// import {changePromoVisibility} from '../../redux/actions/general';
// import {useDispatch} from 'react-redux';
//
// // const itemWidth = SCREEN_WIDTH - PROMO_CROSS_ICON_WIDTH;
// const itemWidth = SCREEN_WIDTH;
//
// const PromoItem = props => {
//   const {item, index, activeIndex, openLink, onAnimationEnd} = props;
//   const scrollRef = useRef();
//   const width = useSharedValue(0);
//   const [itemSize, setItemSize] = useState(0);
//
//   const timerRef = useRef();
//
//   useEffect(() => {
//     const duration = itemSize * 8;
//     if (index === activeIndex) {
//       if (itemSize > itemWidth) {
//         width.value = withDelay(
//           2000,
//           withTiming(-(itemSize - SCREEN_WIDTH / 2), {duration, easing: Easing.linear}, isFinished =>
//             runOnJS(onAnimationEnd)(isFinished, item, index),
//           ),
//         );
//       } else {
//         timerRef.current = setTimeout(() => {
//           onAnimationEnd(true, item, index);
//         }, 5000);
//       }
//     } else {
//       timerRef.current && clearTimeout(timerRef.current);
//       width.value = withDelay(2000, withTiming(0, {duration: 500}));
//     }
//   }, [itemSize, activeIndex]);
//
//   useEffect(() => {
//     return () => {
//       timerRef.current && clearTimeout(timerRef.current);
//       cancelAnimation(width.value);
//     };
//   }, []);
//
//   const textStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateX: width.value,
//         },
//       ],
//     };
//   });
//
//   const onContentSizeChange = w => {
//     setItemSize(w);
//   };
//
//   return (
//     <Animated.ScrollView
//       style={{
//         width: itemWidth,
//       }}
//       scrollEnabled={false}
//       onContentSizeChange={onContentSizeChange}
//       horizontal
//       ref={scrollRef}>
//       <TouchableOpacity
//         disabled={item?.link?.length === 0}
//         onPress={() => openLink(item?.link)}
//         activeOpacity={1}
//         style={styles.promoParentView}>
//         <Animated.Text
//           numberOfLines={1}
//           style={[
//             styles.textTicker,
//             {
//               minWidth: itemWidth,
//             },
//             textStyle,
//           ]}>
//           {item?.message}
//         </Animated.Text>
//       </TouchableOpacity>
//     </Animated.ScrollView>
//   );
// };
//
// const PromoBar = ({data = []}) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const pagerRef = useRef();
//   const [dataState, setDataState] = useState(data);
//
//   const searchToast = useRef(null);
//
//   const dispatch = useDispatch();
//
//   const onDisplayMessage = useCallback(message => {
//     searchToast.current?.show(message, 1000);
//   }, []);
//
//   const onClosePromo = () => dispatch(changePromoVisibility(false));
//
//   const scrollToItem = index => {
//     pagerRef.current?.scrollToOffset?.({
//       offset: itemWidth * index,
//       animated: true,
//     });
//   };
//
//   useEffect(() => {
//     setDataState(data);
//     setActiveIndex(0);
//   }, [data]);
//
//   const openLink = url => {
//     if (url) {
//       return Linking.openURL(url).catch(() => {
//         onDisplayMessage('Unable to open url');
//       });
//     }
//   };
//
//   const onAnimationEnd = (isFinished, item, index) => {
//     if (isFinished) {
//       let curIndex = index;
//       if (index + 2 >= dataState.length) {
//         setDataState(prevState => [...prevState, ...data]);
//       } else if (dataState.length === data.length * 20) {
//         curIndex = -1;
//         setDataState(data);
//       }
//       scrollToItem(curIndex + 1);
//     }
//   };
//
//   const onMomentumScrollEnd = e => {
//     const page = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
//     setActiveIndex(page);
//   };
//
//   const renderItem = ({item, index} = {}) => {
//     return (
//       <PromoItem
//         openLink={openLink}
//         activeIndex={activeIndex}
//         index={index}
//         onAnimationEnd={onAnimationEnd}
//         item={item}
//       />
//     );
//   };
//
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const keyExtractor = useCallback((item, index) => String(index));
//
//   if (!dataState?.length) {
//     return null;
//   }
//
//   return (
//     <>
//       <View style={styles.promoContainer}>
//         <View style={styles.promoTextView}>
//           <FlatList
//             scrollEnabled={false}
//             data={dataState}
//             renderItem={renderItem}
//             ref={pagerRef}
//             windowSize={3}
//             initialNumToRender={3}
//             keyExtractor={keyExtractor}
//             decelerationRate={0}
//             snapToInterval={itemWidth}
//             snapToAlignment={'center'}
//             onScroll={onMomentumScrollEnd}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />
//         </View>
//
//       </View>
//       <ToastComponent toastRef={searchToast} />
//     </>
//   );
// };
// export default React.memo(PromoBar);

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {COLORS, IMAGES} from '../../theme';
import {PROMO_CROSS_ICON_WIDTH, SCREEN_WIDTH} from '../../constants/Common';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import ToastComponent from '../ToastComponent';
import {changePromoVisibility} from '../../redux/actions/general';
import {useDispatch} from 'react-redux';
import ImageComponent from '../ImageComponent';
import {MixPanelInstance} from '../../utils/mixpanelUtils';

const itemWidth = SCREEN_WIDTH - PROMO_CROSS_ICON_WIDTH;

const PromoItem = props => {
  const {item, index, activeIndex, openLink, onAnimationEnd} = props;
  const scrollRef = useRef();
  const width = useSharedValue(0);
  const [itemSize, setItemSize] = useState(0);

  const timerRef = useRef();

  useEffect(() => {
    const duration = itemSize * 20;
    if (index === activeIndex) {
      if (itemSize > itemWidth) {
        width.value = withDelay(
          2000,
          withTiming(
            -(itemSize - SCREEN_WIDTH / 9),
            {duration, easing: Easing.linear},
            isFinished => runOnJS(onAnimationEnd)(isFinished, item, index),
          ),
        );
      } else {
        timerRef.current = setTimeout(() => {
          onAnimationEnd(true, item, index);
        }, 5000);
      }
    } else {
      timerRef.current && clearTimeout(timerRef.current);
      width.value = withDelay(2000, withTiming(0, {duration: 500}));
    }
  }, [itemSize, activeIndex]);

  useEffect(() => {
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
      if (width?.value) {
        cancelAnimation(width.value);
      }
    };
  }, []);

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: width.value,
        },
      ],
    };
  });

  const onContentSizeChange = w => {
    setItemSize(w);
  };

  return (
    <Animated.ScrollView
      style={{
        width: itemWidth,
      }}
      scrollEnabled={false}
      onContentSizeChange={onContentSizeChange}
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}>
      <TouchableOpacity
        disabled={item?.link?.length === 0}
        onPress={() => openLink(item)}
        activeOpacity={1}
        style={styles.promoParentView}>
        <Animated.Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.textTicker,
            {
              minWidth: itemWidth,
            },
            textStyle,
          ]}>
          {item?.message}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};

const PromoBar = ({data = []}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef();
  const [dataState, setDataState] = useState(data);

  const searchToast = useRef(null);

  const dispatch = useDispatch();

  const onDisplayMessage = useCallback(message => {
    searchToast.current?.show(message, 1000);
  }, []);

  const onClosePromo = () => dispatch(changePromoVisibility(false));

  const scrollToItem = index => {
    pagerRef.current?.scrollToOffset?.({
      offset: itemWidth * index,
      animated: true,
    });
  };

  useEffect(() => {
    setDataState(data);
    setActiveIndex(0);
  }, [data]);

  const openLink = item => {
    if (item?.link) {
      MixPanelInstance.trackPromoBar({
        slot: 'Promo Bar',
        location: 'Home page',
        promotionalId: '2024Q1-1',
        promotionalText: item?.message,
        promotionalLink: item?.link,
      });
      return Linking.openURL(item?.link).catch(() => {
        onDisplayMessage('Unable to open url');
      });
    }
  };

  const onAnimationEnd = (isFinished, item, index) => {
    if (isFinished) {
      let curIndex = index;
      if (index + 2 >= dataState.length) {
        setDataState(prevState => [...prevState, ...data]);
      } else if (dataState.length === data.length * 20) {
        curIndex = -1;
        setDataState(data);
      }
      scrollToItem(curIndex + 1);
    }
  };

  const onMomentumScrollEnd = e => {
    const page = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
    setActiveIndex(page);
  };

  const renderItem = ({item, index} = {}) => {
    return (
      <PromoItem
        openLink={openLink}
        activeIndex={activeIndex}
        index={index}
        onAnimationEnd={onAnimationEnd}
        item={item}
      />
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keyExtractor = useCallback((item, index) => String(index));

  if (!dataState?.length) {
    return null;
  }

  return (
    <>
      <View style={styles.promoContainer}>
        <View style={styles.promoTextView}>
          <FlatList
            scrollEnabled={false}
            data={dataState}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            ref={pagerRef}
            windowSize={3}
            initialNumToRender={3}
            keyExtractor={keyExtractor}
            decelerationRate={0}
            snapToInterval={itemWidth}
            snapToAlignment={'center'}
            onScroll={onMomentumScrollEnd}
            horizontal
          />
        </View>
        <Pressable
          hitSlop={5}
          style={styles.promoActionIconView}
          onPress={onClosePromo}>
          {/*<Entypo name={'cross'} color={COLORS.GRAY_6}  size={25} />*/}
          <ImageComponent style={styles.close} source={IMAGES.CLOSE_GRAY} />
        </Pressable>
      </View>
      <ToastComponent toastRef={searchToast} />
    </>
  );
};
export default React.memo(PromoBar);
