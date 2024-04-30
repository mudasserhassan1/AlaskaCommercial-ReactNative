import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';

import {COLORS} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import {getFontSize} from '../../theme';
import {Button} from '../Button';
import {logout} from '../../utils/userUtils';

const GuestRestrictionView = () => {
  const dispatch = useDispatch();
  const createAccount = () => logout(dispatch);

  return (
    <View style={styles.parent}>
      <Text allowFontScaling={false} style={styles.guestRestrictionText}>{APP_CONSTANTS.GUEST_FEATURE_RESTRICTION_MESSAGE}</Text>
      <View style={styles.buttonWrapper}>
        <Button
          label={APP_CONSTANTS.SIGN_IN_CREATE_ACCOUNT}
          color={COLORS.WHITE}
          width={'100%'}
          onPress={createAccount}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP('6%'),
  },
  guestRestrictionText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(18),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: -0.35,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: heightPercentageToDP('4%'),
    backgroundColor: COLORS.MAIN,
    alignItems: 'center',
    alignSelf: 'center',
    height: 50,
    borderRadius: widthPercentageToDP('2%'),
    marginBottom: 10,
    marginStart: widthPercentageToDP('6%'),
    marginRight: widthPercentageToDP('6%'),
  },
});

export default GuestRestrictionView;
