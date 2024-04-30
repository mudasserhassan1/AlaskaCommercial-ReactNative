/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../../theme/Styles';
import {BLOB_URLS} from '../../constants/Api';
import {aboutData} from '../../constants/Common';
import AboutItem from '../../components/AboutItemCard';
import {APP_CONSTANTS} from '../../constants/Strings';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';

const About = () => {
  const navigation = useNavigation();

  const onOpenLink = useCallback(async url => {
    navigation.navigate('WebView', {url: url});
  }, []);

  const handleItemPress = id => {
    switch (id) {
      case '1':
        return onOpenLink(BLOB_URLS.ABOUT_US);
      case '2':
        return onOpenLink(BLOB_URLS.FAQ);
      case '3':
        return onOpenLink(BLOB_URLS.TERM_OF_USE);
      case '4':
        return onOpenLink(BLOB_URLS.PRIVACY_POLICY);
      case '5':
        return onOpenLink(BLOB_URLS.SHIPPING_AND_RETURN);
    }
  };

  const renderAboutInfo = (item, index) => (
    <AboutItem key={item.id} item={item} onItemPress={id => handleItemPress(id)} index={index} />
  );

  return (
    <ScreenWrapperComponent headerTitle={APP_CONSTANTS.ABOUT_HEADER} withBackButton>
      <View style={styles.settingsWrapper}>
        <View style={styles.textWrapper}>
          <Text allowFontScaling={false} style={styles.textHeader}>{APP_CONSTANTS.ABOUT}</Text>
          {aboutData.map(renderAboutInfo)}
        </View>
      </View>
    </ScreenWrapperComponent>
  );
};

export default About;
