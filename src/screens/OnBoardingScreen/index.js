import React, {useEffect, useMemo, useState} from 'react';

import {COLORS, IMAGES} from '../../theme';
import {FlatList, Platform, StatusBar, Text, View} from 'react-native';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import {SCREEN_WIDTH} from '../../constants/Common';
import FastImage from 'react-native-fast-image';
import PaginationDot from '../../components/PaginationDot';
import {useDispatch, useSelector} from 'react-redux';
import {setIsOnboarded} from '../../redux/actions/config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import Analytics from '../../utils/analyticsUtils';
import {ANALYTICS_EVENTS} from '../ShoppingCartPickup/Constants';
import useIsGuest from '../../hooks/useIsGuest';
import {logToConsole} from '../../configs/ReactotronConfig';

const ONBOARDING_PAGES = [
  {
    title: APP_CONSTANTS.ON_BOARDING1_HEADER,
    description: APP_CONSTANTS.ON_BOARDING1_TEXT,
    image: IMAGES.ON_BOARDING4,
    width: 200,
    height: 200,
  },
  {
    title: APP_CONSTANTS.ON_BOARDING2_HEADER,
    description: APP_CONSTANTS.ON_BOARDING2_TEXT,
    image: IMAGES.ON_BOARDING2,
    width: 254,
    height: 236,
  },
  {
    title: APP_CONSTANTS.ON_BOARDING3_HEADER,
    description: APP_CONSTANTS.ON_BOARDING3_TEXT,
    subtext: APP_CONSTANTS.ON_BOARDING3_SUBTEXT,
    image: IMAGES.ON_BOARDING1,
    width: 220,
    height: 200,
  },
  {
    title: APP_CONSTANTS.ON_BOARDING4_HEADER,
    description: APP_CONSTANTS.ON_BOARDING4_TEXT,
    image: IMAGES.ON_BOARDING5,
    width: 272,
    height: 227,
  },
  {
    title: APP_CONSTANTS.ON_BOARDING5_HEADER,
    description: APP_CONSTANTS.ON_BOARDING5_TEXT,
    image: IMAGES.ON_BOARDING3,
    label: APP_CONSTANTS.START_SHOPPING,
    width: 180,
    height: 140,
  },
];

const OnboardingItem = props => {
  const {item, onPress, isGuest} = props;
  const {
    title,
    description,
    subtext,
    image,
    width = 250,
    height = 250,
    label,
  } = item ?? {};
  return (
    <View style={styles.itemContainer}>
      <View style={[styles.imageContainer, label && {paddingBottom: 0}]}>
        <FastImage
          style={[styles.image, {width, height}]}
          source={image}
          resizeMode={FastImage.resizeMode.contain}
        />
        {!!label && (
          <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
            <Text allowFontScaling={false} style={styles.buttonLabel}>{label}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.headerContainer}>
        <Text allowFontScaling={false} style={styles.header}>{title}</Text>
      </View>
      <Text allowFontScaling={false} style={styles.description}>{description}</Text>
      <Text allowFontScaling={false} style={styles.subtext}>{isGuest ? subtext : ''}</Text>
    </View>
  );
};

const OnBoardingScreen = () => {
  const [activePage, setActivePage] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    StatusBar.setTranslucent(true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(COLORS.WHITE);
      StatusBar.setBarStyle('dark-content');
    }
    return () => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(COLORS.MAIN);
        StatusBar.setBarStyle('default');
      }
    };
  }, []);

  const {top = 0} = useSafeAreaInsets() ?? {};
  const isFocused = useIsFocused();
  const isGuest = useIsGuest();

  // const {FullName, PhoneNumber, Email} = useSelector(
  //   ({general: {loginInfo: {userInfo: {FullName, PhoneNumber, Email}} = {}} = {}}) => ({
  //     FullName,
  //     PhoneNumber,
  //     Email,
  //   }),
  // );

  const fullNameSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.FullName ?? '',
    [],
  );

  const phoneNumberSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.PhoneNumber ?? '',
    [],
  );

  const emailSelector = useMemo(
    () => state => state.general?.loginInfo?.userInfo?.Email ?? '',
    [],
  );

  const FullName = useSelector(fullNameSelector);
  const PhoneNumber = useSelector(phoneNumberSelector);
  const Email = useSelector(emailSelector);

  logToConsole({FullName, PhoneNumber, Email});

  const onStartShopping = () => {
    Analytics.logEvent(ANALYTICS_EVENTS.ONBOARDED, {
      FullName,
      PhoneNumber,
      Email,
    });
    dispatch(setIsOnboarded(true));
  };

  const renderItem = ({item}) => {
    return (
      <OnboardingItem item={item} onPress={onStartShopping} isGuest={isGuest} />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={ONBOARDING_PAGES}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)}
        horizontal
        contentContainerStyle={{flexGrow: 1}}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        pagingEnabled
        disableScrollViewPanResponder
        onScroll={event => {
          const x = event?.nativeEvent?.contentOffset?.x;
          const page = (x ?? 0) / SCREEN_WIDTH;
          setActivePage(Math.round(page));
        }}
      />
      {isFocused && (
        <PaginationDot
          curPage={activePage}
          // onDotPress={setActivePage}
          maxPage={ONBOARDING_PAGES?.length}
          containerStyle={styles.paginationContainer}
        />
      )}
      {isFocused && activePage !== ONBOARDING_PAGES.length - 1 && (
        <TouchableOpacity
          containerStyle={[
            styles.skiButton,
            {marginTop: top + heightPercentageToDP('3%')},
          ]}
          onPress={onStartShopping}>
          <Text allowFontScaling={false} style={styles.skip}>{APP_CONSTANTS.SKIP}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default OnBoardingScreen;
