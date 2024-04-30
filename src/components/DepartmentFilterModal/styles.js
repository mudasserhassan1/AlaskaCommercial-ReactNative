import {Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../theme';
import {getFontSize, getFontWeight} from '../../theme';
import {SCREEN_HEIGHT} from '../../constants/Common';

export default StyleSheet.create({
  parent: {
    height: SCREEN_HEIGHT * 0.9,
  },
  content: {
    height: hp('88%'),
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    paddingBottom: hp('5%'),
  },
  view: {
    height: SCREEN_HEIGHT * 0.9,
  },
  modalHeaderView: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 56 : 60,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginStart: wp('6%'),
    marginEnd: wp('6%'),
    marginTop: hp('1%'),
  },
  backButtonView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 20,
  },
  backButton: {
    width: 10,
    height: 22,
    tintColor: COLORS.BLACK,
  },
  headerTextView: {
    marginStart: wp('2%'),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  headerText: {
    lineHeight: 20,
    fontSize: getFontSize(15),
    color: COLORS.BLACK,
    fontFamily: 'SFProDisplay-SemiBold',
    fontWeight: getFontWeight('600'),
  },
  listView: {
    flex: 1,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  separatorView: {
    backgroundColor: COLORS.GRAY0_5,
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
  listFooterView: {
    height: 50,
  },
  loader: {
    alignSelf: 'center',
  },
  listParentView: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  listRow: {
    width: '100%',
    marginStart: wp('5%'),
    marginRight: wp('5%'),
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioUnchecked: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderColor: COLORS.BLACK,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  descriptionView: {
    flexDirection: 'row',
    width: '80%',
    marginStart: wp('7%'),
    marginTop: hp('.5%'),
  },
  itemName: {
    marginStart: wp('2%'),
    fontFamily: 'SFProDisplay-Regular',
    fontSize: getFontSize(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: -0.25,
    color: COLORS.BLACK,
  },
});
