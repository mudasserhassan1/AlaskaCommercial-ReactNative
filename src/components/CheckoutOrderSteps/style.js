import {Platform, StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../theme';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.WHITE,
    },
    container: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 15,
    },
    step: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    lineContainer: {
        width: '100%',
        height: 1,
        position: 'absolute',
        top: 30,
        backgroundColor: COLORS.GRAY0_5,
    },
    line: {
        width: '100%',
        height: '100%',
    },
    circle:{
        width: 22,
        height: 22,
        backgroundColor: COLORS.WHITE,
        borderRadius:11,
        borderWidth:1,
justifyContent:'center',
        alignItems:'center'
    },
    numberingText: {
        fontSize: 14,
        fontFamily: FONTS.BOLD,
        textAlign: 'center',
    },
    stepValue: {
        paddingTop: 10,
        fontFamily: FONTS.REGULAR,
        fontSize: 13,
    },
    image: {width: 22, height: 22},
});

export default styles;