import React, {useMemo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {COLORS} from '../../theme';
import {FONTS, getFontSize} from '../../theme';
import {APP_CONSTANTS} from '../../constants/Strings';
import {useSelector} from 'react-redux';
import {logToConsole} from '../../configs/ReactotronConfig';

const SnapEligibilityText = ({
  text = APP_CONSTANTS.SNAP_ELIGIBLE,
  snapFlag,
  textStyle,
  forceDisplay,
}) => {
  const showSnapEligibility = useSelector(
    state => state?.general?.loginInfo?.userInfo?.showSnapEligibility ?? false,
  );

  const isSNAPEligible = snapFlag === 'Y';

  if ((!isSNAPEligible && !forceDisplay) || !showSnapEligibility) {
    return null;
  }

  return (<Text allowFontScaling={false} style={[
        styles.snapFlag,
        !isSNAPEligible && {color: COLORS.WHITE},
        textStyle,
      ]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  snapFlag: {
    fontFamily: FONTS.MEDIUM,
    fontStyle: 'italic',
    fontSize: getFontSize(11),
    color: COLORS.GREEN_SHADE,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SnapEligibilityText;
