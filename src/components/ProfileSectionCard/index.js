// import React from 'react';
// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//
// import {COLORS, IMAGES} from '../../theme';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import {FONTS, getFontSize} from '../../theme';
// import ImageComponent from '../ImageComponent';
//
// const ProfileSectionCard = ({textContent = '', onPress}) => {
//   return (
//     <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
//       <View style={styles.storeWrapper}>
//         <View style={styles.storeInnerWrapper}>
//           <View style={styles.changePasswordTextWrapper}>
//             <Text style={styles.changePassword}>{textContent}</Text>
//             <View style={styles.rightArrowWrapper}>
//               <ImageComponent source={IMAGES.RIGHT_ARROW} style={styles.rightArrow} />
//             </View>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };
// const styles = StyleSheet.create({
//   storeWrapper: {
//     marginTop: hp('1.7%'),
//     backgroundColor: COLORS.WHITE,
//     justifyContent: 'center',
//   },
//   storeInnerWrapper: {
//     marginStart: wp('6%'),
//     marginEnd: wp('6%'),
//     paddingTop: hp('1.2%'),
//     paddingBottom: hp('1.2%'),
//   },
//   storeTextWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: hp('2%'),
//   },
//   changePasswordTextWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: hp('1.2%'),
//     paddingBottom: hp('1.2%'),
//   },
//   changePassword: {
//     fontSize: getFontSize(17),
//     fontFamily: FONTS.REGULAR,
//     fontWeight: 'normal',
//     fontStyle: 'normal',
//     lineHeight: 22,
//     color: COLORS.BLACK,
//     marginTop: hp('.5%'),
//   },
//   shopWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: hp('1.5%'),
//     marginStart: wp('6%'),
//     marginEnd: wp('6%'),
//   },
//   editTextWrapper: {
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     width: 100,
//   },
//   rightArrowWrapper: {justifyContent: 'center'},
//   rightArrow: {width: 8, height: 25, alignSelf: 'flex-end'},
// });
// export default ProfileSectionCard;

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {COLORS, IMAGES} from '../../theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FONTS, getFontSize} from '../../theme';
import ImageComponent from '../ImageComponent';

const ProfileSectionCard = ({textContent = '', onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.storeWrapper}>
        <View style={styles.storeInnerWrapper}>
          <View style={styles.changePasswordTextWrapper}>
            <Text allowFontScaling={false} style={styles.changePassword}>{textContent}</Text>
            <View style={styles.rightArrowWrapper}>
              <ImageComponent
                source={IMAGES.RIGHT_ARROW}
                style={styles.rightArrow}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  storeWrapper: {
    marginTop: hp('1.7%'),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
  },
  storeInnerWrapper: {
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  storeTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  changePasswordTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2.2%'),
  },
  changePassword: {
    fontSize: getFontSize(15),
    fontFamily: FONTS.REGULAR,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    color: COLORS.BLACK,
    // marginTop: hp('.5%'),
  },
  shopWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
  },
  editTextWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
  },
  rightArrowWrapper: {justifyContent: 'center'},
  rightArrow: {width: 8, height: 25, alignSelf: 'flex-end'},
});
export default ProfileSectionCard;
