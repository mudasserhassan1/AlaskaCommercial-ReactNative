import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import {PaymentTextComponent} from '../../SnapModals/SnapBalanceModal';
import {APP_CONSTANTS} from '../../../constants/Strings';
import {formatAmountValue} from '../../../utils/calculationUtils';
import SnapWebView from '../../SnapModals/SnapWebView';
import {getDebitCardHtml, getPanErrorMessage, submitSnapFormScript} from '../../../utils/paymentUtils';
import {useSelector} from 'react-redux';
import {CARD_USAGE_TYPE, SCREEN_HEIGHT, SNAP_CODES} from '../../../constants/Common';
import {
    TextInput,
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Pressable,
    Touchable,
    TouchableOpacity
} from 'react-native';
import {logToConsole} from '../../../configs/ReactotronConfig';
import ErrorMessage from '../../ErrorMessage';
import styles from './styles';
import {COLORS} from '../../../theme';
import isPostalCode from 'validator/lib/isPostalCode';
import isInt from 'validator/lib/isInt';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {BLOB_URLS} from "../../../constants/Api";
import LabelRadioItem from "../../LabelRadioItem";
import CheckBox from "../../CheckBox";

const DebitSaveModal = forwardRef((props, ref) => {
    const {
        remainingOrderTotal = 0.0,
        onSubmitSuccess,
        onToggleLoading,
        onBottomDisabled,
        isProfileScreen,
        isGuest = true
    } = props;

    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const webViewRef = useRef();
    const usageTypeRef = useRef();

    useEffect(() => {
        onBottomDisabled(!isPostalCode(zipCode, 'US'));
    }, [onBottomDisabled, zipCode]);

    useEffect(() => {
        onToggleLoading(submitting);
    }, [onToggleLoading, submitting]);

    // const {fisCreditDebitConfig} = useSelector(({payment: {paymentsConfig: {fisCreditDebitConfig = {}} = {}} = {}}) => ({
    //     fisCreditDebitConfig,
    // }));

    const useFisCreditDebitConfigSelector = () => useMemo(
      () => state => state.payment?.paymentsConfig?.fisCreditDebitConfig ?? {},
      []
    );

    const fisCreditDebitConfig = useSelector(useFisCreditDebitConfigSelector());

    const onBridgeMessage = response => {
        setSubmitting(false);
        const {response: code, message} = response || {};
        if (code === SNAP_CODES.SUCCESS) {
            onSubmitSuccess({data: {...response, zipCode}, usageType: usageTypeRef.current});
        } else {
            setError(getPanErrorMessage({code, message, isEBT: false}));
        }
    };

    const onSubmitForm = () => {
        let usageType = CARD_USAGE_TYPE.SINGLE
        if (!isGuest && (isSaveCard || isProfileScreen)) {
            usageType = CARD_USAGE_TYPE.MULTIPLE
        }
        // if (!isGuest && isSaveCard) {
        //     usageType = CARD_USAGE_TYPE.MULTIPLE
        // }
        usageTypeRef.current = usageType;
        setSubmitting(true);
        webViewRef.current.injectJavaScript?.(submitSnapFormScript);
    };

    const onChangeZipCode = value => {
        if (!value || isInt(value)) {
            setZipCode(value);
        }
    };

    useImperativeHandle(ref, () => ({
        onSubmitForm,
    }));

    const renderError = () => {
        if (error) {
            return <ErrorMessage error={error} textStyle={styles.error}/>;
        }
    };

    const renderRemainingTotal = () => {
        if (!isProfileScreen) {
            return (
                <PaymentTextComponent
                    text={APP_CONSTANTS.REMAINING_ORDER_TOTAL_II}
                    amount={remainingOrderTotal > 0 ? formatAmountValue(remainingOrderTotal, true) : '0.00'}
                />
            );
        }
    };

    const isAndroid = Platform.OS === 'android';
    const ParentView = isAndroid ? View : Pressable;
    const parentViewExtraScrollHeight = !isAndroid
        ? -(SCREEN_HEIGHT * (isProfileScreen ? 0.28 : 0.2))
        : SCREEN_HEIGHT * (isProfileScreen ? 0.15 : 0.1);

    const [isSaveCard, setIsSaveCard] = useState(false);
    const showSaveTransaction = !isProfileScreen && !isGuest

    const renderSaveToTransaction = () => {
        if (showSaveTransaction) {
            return <Pressable style={styles.termsWrapper} onPress={() => setIsSaveCard(!isSaveCard)}>
                <CheckBox disabled isSelected={isSaveCard} onPress={() => {
                }}/>

                <Text allowFontScaling={false} style={[styles.bottomTextStyle]}>
                    {APP_CONSTANTS.SAVE_CARD_CHECKOUT}
                </Text>
            </Pressable>
        }
        return null
    }
    return (
        <KeyboardAwareScrollView
            scrollEnabled={true}
            extraScrollHeight={parentViewExtraScrollHeight}
            enableOnAndroid={true}>
            {renderRemainingTotal()}
            <ParentView style={[styles.iframeWrapper,showSaveTransaction ? styles.iframeWrapperHeight: styles.iframeWrapperGuestHeight]}>
                <SnapWebView
                    webViewRef={webViewRef}
                    source={{html: getDebitCardHtml(fisCreditDebitConfig)}}
                    onMessage={onBridgeMessage}
                />
                <Text allowFontScaling={false} style={styles.zipCodeText}>{APP_CONSTANTS.ZIP_CODE}</Text>
                <View style={[styles.inputContainer]}>
                    <TextInput
                        allowFontScaling={false}
                        style={styles.input}
                        onChangeText={onChangeZipCode}
                        value={zipCode}
                        placeholder={APP_CONSTANTS.ZIP_CODE}
                        maxLength={5}
                        placeholderTextColor={COLORS.GRAY_4}
                        keyboardType={'decimal-pad'}
                        returnKeyType={"done"}
                    />
                </View>
                {renderSaveToTransaction()}
            </ParentView>
            {renderError()}
        </KeyboardAwareScrollView>
    );
});

export default memo(DebitSaveModal);
