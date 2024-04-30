import {StyleSheet} from "react-native";
import {COLORS, FONTS, getFontSize, getFontWeight} from '../../theme'
const styles = StyleSheet.create({
    dialogContainer: {
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogContent: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        width: '100%',
    },

    header:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    closebutton:{
        justifyContent:"flex-end",
        marginRight:0,
        width:28,
        height:28


    },
    subtitle:{
        fontSize: getFontSize(15),
        fontWeight: getFontWeight("400"),
        fontFamily:FONTS.REGULAR,

    },
    title: {
        fontSize: getFontSize(20),
        fontWeight: getFontWeight("400"),
        fontFamily:FONTS.REGULAR,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%', // Take the width of the whole page
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: COLORS.MAIN,
        borderRadius: 5,
        width: '100%',
        justifyContent:'center',
        minHeight:50,
        alignItems: 'center',
        marginTop: 26,
        marginBottom:29,

    },
    loginButtonText: {
        color: 'white',
        fontSize: getFontSize(18),
        fontFamily:FONTS.REGULAR,
    },
    footer:{
        alignItems:"center",
        marginBottom:20
    },
    createAccountbuttonText:{
        color:COLORS.MAIN,
        fontFamily:FONTS.MEDIUM,
        fontSize:getFontSize(18),

    },
    orbuttonText:{
        color: 'rgba(0, 0, 0, 0.40)',
        fontFamily:FONTS.REGULAR,
        fontSize:getFontSize(15),
        fontWeight: getFontWeight("400"),
        marginTop:15,
        marginBottom:15
    },
    guestbuttonText:{
        color:COLORS.MAIN,
        fontFamily:FONTS.MEDIUM,
        fontSize:getFontSize(18),


    }

});

export default styles