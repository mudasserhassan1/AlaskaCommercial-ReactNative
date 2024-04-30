import {Platform, StyleSheet} from 'react-native';
import {
    heightPercentageToDP as hp,
    heightPercentageToDP,
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import {COLORS, FONTS, getFontSize} from '../../../theme';
import {SCREEN_HEIGHT} from "../../../constants/Common";

const styles = StyleSheet.create({
    iframeWrapper: {
        flex: 1,
        marginStart: wp('2%'),
    },
    iframeWrapperHeight:{
        height: 510,
    },
    iframeWrapperGuestHeight:{
        height: 440,
    },
    inputContainer: {
        marginStart: wp(4),
        alignItems: 'center',
        flexDirection: 'row',
        paddingStart: 11,
        padding: wp('2%'),
        width: wp(86),
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        borderRadius: 10,
        height: 60,
    },
    input: {
        fontSize: getFontSize(15),
        flex: 1,
        height: '100%',
        color:COLORS.BLACK,
    },
    error: {
        marginTop: 15,
    },
    zipCodeText: {
        lineHeight: 20,
        color: COLORS.BLACK,
        letterSpacing: -0.24,
        fontFamily: FONTS.REGULAR,
        fontSize: getFontSize(16),
        marginStart: wp(3),
        marginBottom: wp(2),
        alignItems: 'center',
        flexDirection: 'row',
        padding: wp('2%'),
    },
    termsWrapper: {
        flexDirection: 'row',
        width: wp(86),
        alignItems: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('3%'),
        marginStart: wp(4),
        marginEnd: wp(4),
    },
    btnWrapper: {
        width: '90%',
        backgroundColor: COLORS.DISABLE_BUTTON_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 50,
        borderRadius: wp('2%'),
        marginTop: hp('4%'),
    },
    radioUnchecked: {
        width: 18,
        height: 18,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: COLORS.GRAY_TEXT_0_78,
        justifyContent: 'center',
    },
    radioChecked: {
        width: 12,
        height: 12,
        borderRadius: 10,
        backgroundColor: COLORS.GRAY_TEXT_0_78,
    },

    bottomTextStyle: {
        marginStart: wp('2%'),
        color: COLORS.MAIN,
        fontSize: getFontSize(12),
        width: wp('80%'),
    },
});

export default styles;
