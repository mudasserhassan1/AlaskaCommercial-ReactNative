import React, {useState} from 'react';

import {COLORS, FONTS, getFontSize, IMAGES} from '../../theme';
import {Platform, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {APP_CONSTANTS} from '../../constants/Strings';
import FastImage from 'react-native-fast-image';
import PaginationDot from '../../components/PaginationDotsForImageSwiper';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import ArrowButton from '../ArrowImageButton';
import {SCREEN_WIDTH} from '../../constants/Common';
import {act} from 'react-test-renderer';
import {MixPanelInstance} from '../../utils/mixpanelUtils';
import {BLOB_URLS} from '../../constants/Api';
import Config from 'react-native-config';
import {snakeToCamelCase} from '../../utils/transformUtils';
import { logToConsole } from "../../configs/ReactotronConfig";

const BannersList = [
  {
    title: APP_CONSTANTS.swiper_header1,
    description: APP_CONSTANTS.swiper_subHeading1,
    subDepartmentId: '59,60',
    departmentId: '6010',
    image:
      'https://accstorageapp.blob.core.windows.net/assets/AC_e_comm_web_app_hero_banner_CookingVegetables_20231201.jpg',
  },
  {
    title: APP_CONSTANTS.swiper_header2,
    description: APP_CONSTANTS.swiper_subHeading2,
    subDepartmentId: '83,85,88',
    departmentId: '8310,8805,8810,',
    image:
      'https://accstorageapp.blob.core.windows.net/assets/AC_e_comm_web_app_hero_banner_Beef_and_Steaks_20231201.jpg',
  },
  {
    title: APP_CONSTANTS.swiper_header3,
    description: APP_CONSTANTS.swiper_subHeading3,
    subDepartmentId: '43,44,45,46,47,71,72',
    departmentId: '4304',
    image:
      'https://accstorageapp.blob.core.windows.net/assets/AC_e_comm_web_app_hero_banner_Cookies_20231201.jpg',
  },
];

const HomePagerBannerView = () => {
  const [activePage, setActivePage] = useState(0);
  const navigation = useNavigation();
  const currentEnv = capitalizeFirstLetter(Config.ENV);

  function capitalizeFirstLetter(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  const onPress = () => {
    MixPanelInstance.trackHeroBanner({
      promotionalName:
        activePage === 0
          ? 'Fresh Vegetables'
          : activePage === 1
          ? 'Beef and Steaks'
          : 'Delicious Cookies',
      promotionalImage:
        activePage === 0
          ? BLOB_URLS.HOME_BANNER_URL +
            'AC_e_comm_web_app_hero_banner_CookingVegetables_20231201_WebApp.jpg'
          : activePage === 1
          ? BLOB_URLS.HOME_BANNER_URL +
            'AC_e_comm_web_app_hero_banner_Beef_and_Steaks_20231201_WebApp.jpg'
          : BLOB_URLS.HOME_BANNER_URL +
            'AC_e_comm_web_app_hero_banner_Cookies_20231201_WebApp.jpg',
      promotionalLink:
        activePage === 0
          ? `${currentEnv}/product/sub-department-product-listing/6010/59,60`
          : activePage === 1
          ? `${currentEnv}/product/sub-department-product-listing/8310,8805,8810/83,85,88`
          : `${currentEnv}/product/sub-department-product-listing/4304/43,44,45,46,47,71,72`,
      slot: 'Hero banner',
      location: 'Home page',
      promotionalId: '2024Q1-1',
    });
    navigation.navigate('ShopStack', {
      screen: 'Products',
      initial: false,
      params: {
        screen: 'Drawer',
        params: {
          departmentId:
            activePage === 0
              ? '59,60'
              : activePage === 1
              ? '83,85,88'
              : '43,44,45,46,47,71,72',
          subDepartmentId:
            activePage === 0
              ? '6010'
              : activePage === 1
              ? '8310,8805,8810'
              : '4304',
          subDepartmentName:
            activePage === 0
              ? 'Cooking Vegetables'
              : activePage === 1
              ? 'Beef and Steaks'
              : 'Cookies',
          fromBanner: true,
          isPartyEligible: false,
          onSaleTag: false,
          comingFrom: 'Home',
        },
      },
    });
  };
  const renderItem = ({item}) => {
    const {title, description, image, departmentId} = item ?? {};
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.itemContainer}>
        <FastImage
          style={styles.image}
          source={{uri: image}}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.blackTransparencyContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
            style={styles.blackTransparencySize}>
            <View
              style={{
                position: 'absolute',
                right: activePage === 2 ? widthPercentageToDP('6%') : null,
                left: activePage !== 2 ? widthPercentageToDP('12%') : null,
                top:
                  activePage === 2
                    ? heightPercentageToDP('5%')
                    : heightPercentageToDP('6%'),
              }}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={[
                  styles.header,
                  {
                    color: activePage === 2 ? COLORS.MAIN : COLORS.WHITE,
                    width: '100%',
                  },
                ]}>
                {title}
              </Text>
            </View>
            <>
              <ArrowButton
                containerStyle={{left: widthPercentageToDP('6%')}}
                disabled={false}
                height={heightPercentageToDP('28%')}
                image={IMAGES.LEFT_ARROW_SWIPER}
                onPress={() => {
                  const newIndex =
                    (activePage - 1 + BannersList?.length) %
                    BannersList?.length;
                  setActivePage(newIndex);
                }}
              />
              <ArrowButton
                containerStyle={{right: widthPercentageToDP('6%')}}
                disabled={false}
                height={heightPercentageToDP('28%')}
                image={IMAGES.RIGHT_ARROW_SWIPER}
                onPress={() => {
                  const newIndex = (activePage + 1) % BannersList?.length;
                  setActivePage(newIndex);
                }}
              />
            </>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
      }}>
      {renderItem({item: BannersList[activePage]})}
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          position: 'absolute',
          top:
            activePage === 2 && global?.isiPhone7or8
              ? heightPercentageToDP('14%')
              : activePage === 2 && !global?.isiPhone7or8
              ? heightPercentageToDP('12%')
              : activePage !== 2 && global?.isiPhone7or8
              ? heightPercentageToDP('15%')
              : heightPercentageToDP('13%'),
          right:
            activePage === 2 && global?.isiPhone7or8
              ? widthPercentageToDP('22%')
              : activePage === 2 &&
                !global?.isiPhone7or8 &&
                Platform.OS === 'ios'
              ? widthPercentageToDP('20%')
              : activePage === 2 &&
                !global?.isiPhone7or8 &&
                Platform.OS !== 'ios'
              ? widthPercentageToDP('16%')
              : null,
          left: activePage !== 2 ? widthPercentageToDP('12%') : null,

          backgroundColor: COLORS.WHITE,
          padding: 8,
          paddingHorizontal: 14,
          borderRadius: heightPercentageToDP(10),
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 1,
            paddingHorizontal: 2,
            borderRadius: heightPercentageToDP(0.5),
          }}
          onPress={onPress}>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: global?.isiPhone7or8
                ? getFontSize(8)
                : Platform.OS === 'ios'
                ? getFontSize(10)
                : getFontSize(12),
              letterSpacing: -0.04,
              color: COLORS.BLACK,
            }}>
            SHOP NOW
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <PaginationDot
        inActiveColor={COLORS.white_5}
        curPage={activePage}
        maxPage={BannersList?.length}
        containerStyle={styles.paginationContainer}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  header: {
    fontFamily: FONTS.BOLD,
    fontSize: getFontSize(16),
    lineHeight: 21,
    width: '70%',
    letterSpacing: 0.3,
    textAlign: 'left',
  },
  description: {
    fontFamily: FONTS.MEDIUM,
    fontSize: getFontSize(16),
    lineHeight: 16,
    paddingTop: 6,
    paddingHorizontal: wp(8),
    color: COLORS.WHITE,
    letterSpacing: -0.38,
    textAlign: 'center',
  },
  blackTransparencySize: {
    height: '100%',
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
  },
  itemContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: hp(1.6),
    alignSelf: 'center',
  },
  skip: {
    fontFamily: FONTS.SEMI_BOLD,
    fontSize: getFontSize(17),
    lineHeight: 22,
    color: COLORS.BLACK,
  },
  blackTransparencyContainer: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
  },

  arrowImageStyle: {
    width: 12,
    height: 21,
  },
  arrowRightImageStyle: {
    width: 12,
    height: 21,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
  },
  arrowText: {
    fontSize: 24,
    color: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText1: {
    fontSize: 20,
    color: 'white',
  },
  centerText2: {
    fontSize: 20,
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  shopNowText: {
    fontSize: Platform.OS === 'ios' ? getFontSize(11) : getFontSize(12),
    // fontFamily: FONTS.SEMI_BOLD,
    // lineHeight: 17,
    letterSpacing: -0.04,
    color: COLORS.BLACK,
  },
});

export default HomePagerBannerView;
