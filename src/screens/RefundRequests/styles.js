import {StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    marginTop: heightPercentageToDP('1.7%'),
  },
});

export default styles;
