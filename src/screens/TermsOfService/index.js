/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {APP_CONSTANTS} from '../../constants/Strings';
import ScreenWrapperComponent from '../../components/ScreenWrapperComponent';

const TermOfService = ({route}) => {
  const [url, setUrl] = useState();

  useEffect(() => {
    setUrl(route.params.url);
  }, [url]);

  return (
    <ScreenWrapperComponent
      headerTitle={APP_CONSTANTS.ABOUT_HEADER}
      withBackButton
      isScrollView={false}
      containerStyle={{flex: 1}}>
      <View style={styles.contentView}>
        <View style={styles.contentHeader} />
      </View>
    </ScreenWrapperComponent>
  );
};
export default TermOfService;
