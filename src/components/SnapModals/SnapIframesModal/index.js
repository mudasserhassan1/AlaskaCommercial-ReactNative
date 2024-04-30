import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {Keyboard, Pressable, Text, View} from 'react-native';
import {logToConsole} from '../../../configs/ReactotronConfig';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {addPaymentMethod} from '../../../redux/actions/payment';
import {
    CARD_USAGE_TYPE,
    PAYMENT_METHODS,
    PIN_TYPE,
    SNAP_CODES,
    SNAP_IFRAME_SYSTEM_ERRORS,
} from '../../../constants/Common';
import SnapWebView from '../SnapWebView';
import {Button} from '../../Button';
import {COLORS, getFontSize} from '../../../theme';
import {
    clearSnapFormScript,
    getPanErrorMessage,
    getPinErrorMessage,
    getSnapCardHtml,
    getSnapPinHtml,
    submitSnapFormScript,
} from '../../../utils/paymentUtils';
import {MODAL_BUTTON_TITLES, MODAL_GUEST_BUTTON_TITLES} from '../../../screens/ShoppingCartPickup/Constants';
import {getSnapBalance, postSnapCardToken, postSnapPinToken} from '../../../services/ApiCaller';
import {APP_CONSTANTS} from '../../../constants/Strings';
import ErrorMessage from '../../ErrorMessage';
import DialogBox from '../../DialogBox';
import useIsGuest from '../../../hooks/useIsGuest';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import CheckBox from "../../CheckBox";

const SnapIframesModals = forwardRef((props, ref) => {
    const {closeModal, onSuccess, isPinModal, modalKey, onToggleLoading, withSingleButton, isProfileScreen} = props;
    const [error, setError] = useState('');
    const [loadedSuccessfully, setLoadedSuccessfully] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const [isErrorModal, setIsErrorModal] = useState(false);
    const [isRetryModalHidden, setIsRetryModalHidden] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const webViewRef = useRef();
    const cardUsageType = useRef();
    const errorDetails = useRef();

    const isGuest = useIsGuest();

    useEffect(() => {
        onToggleLoading(isRetryModalHidden && submitting);
    }, [isRetryModalHidden, onToggleLoading, submitting]);

    const {
        _id: userId,
        savedSnapCard,
        fisConfig,
    } = useSelector(
        ({
             general: {loginInfo: {userInfo: {_id} = {}} = {}} = {},
             payment: {
                 paymentsConfig: {fisConfig} = {},
                 payments: {[PAYMENT_METHODS.SNAP]: savedSnapCard = []} = {}
             } = {},
         }) => ({
            _id,
            savedSnapCard,
            fisConfig,
        }),
    );

    const {_id: paymentMethodId} = savedSnapCard?.[savedSnapCard?.length - 1] ?? {};

    const isSubmitDisabled = useMemo(
        () => SNAP_IFRAME_SYSTEM_ERRORS.includes(errorCode) || !loadedSuccessfully,
        [errorCode, loadedSuccessfully],
    );

    const dispatch = useDispatch();

    const onSaveCard = useCallback(
        (response, balance = {}) => {
            setSubmitting(false);
            if (response.ok) {
                const {data: {response: details = {}} = {}} = response ?? {};
                dispatch(
                    addPaymentMethod({
                        method: PAYMENT_METHODS.SNAP,
                        details: [{type: PAYMENT_METHODS.SNAP, ...details, ...balance}],
                    }),
                );
                if (typeof onSuccess === 'function') {
                    onSuccess();
                }
            } else {
                webViewRef.current?.injectJavaScript?.(clearSnapFormScript);
                if (!response?.isUnderMaintenance) {
                    const {data: {message: {message = ''} = {}} = {}} = response ?? {};
                    throw {...(response?.data?.message || {}), message};
                } else {
                    closeModal();
                }
            }
        },
        [dispatch, onSuccess],
    );

    const onPanResponse = useCallback(
        async (data = {}) => {
            setError('');
            setErrorCode('');
            const {panResponse, pinResponse, response: cardCode, message: cardMessage} = data ?? {};
            const {response: pinCode, message: pinMessage} = pinResponse ?? {};
            const {response: panCode, message: panMessage} = panResponse ?? {};
            try {
                if (pinCode === SNAP_CODES.SUCCESS && panCode === SNAP_CODES.SUCCESS) {
                    const {response} = await postSnapCardToken({userId, usageType: cardUsageType.current, ...data});
                    onSaveCard(response);
                } else {
                    let [message, code] = ['', ''];
                    if (cardCode) {
                        code = cardCode;
                        message = cardMessage;
                    } else if (panCode !== SNAP_CODES.SUCCESS && pinCode !== SNAP_CODES.SUCCESS) {
                        message = APP_CONSTANTS.INVALID_SNAP_CARD_PIN;
                        code = panCode || pinCode;
                    } else if (pinCode !== SNAP_CODES.SUCCESS && pinMessage) {
                        code = pinCode;
                        message = getPinErrorMessage({code: pinCode, message: pinMessage});
                    } else if (panMessage) {
                        message = getPanErrorMessage({code: panCode, message: panMessage});
                        code = panCode;
                    }
                    throw {...data, message, code};
                }
            } catch (e) {
                errorDetails.current = e;
                const {message, code} = e ?? {};
                setError(message || APP_CONSTANTS.SOME_THING_WENT_WRONG);
                setErrorCode(code);
            } finally {
                setSubmitting(false);
            }
        },
        [onSaveCard, userId],
    );

    const onPinResponse = useCallback(
        async (data = {}) => {
            try {
                setError('');
                setErrorCode('');
                const {response: code, message} = data ?? {};
                if (code === SNAP_CODES.SUCCESS) {
                    const {response} = await postSnapPinToken({
                        paymentMethodId,
                        pinType: PIN_TYPE.BALANCE_INQUIRY,
                        ...data,
                    });
                    // const balance = await onGetBalance();
                    onSaveCard(response);
                } else {
                    throw {...data, message: getPinErrorMessage({code, message})};
                }
            } catch (e) {
                errorDetails.current = e;
                const {message, response: code} = e ?? {};
                setError(message || APP_CONSTANTS.SOME_THING_WENT_WRONG);
                setErrorCode(code);
            } finally {
                setSubmitting(false);
            }
        },
        [paymentMethodId, onSaveCard],
    );

    const onSubmitForm = () => {
        Keyboard.dismiss();
        cardUsageType.current = isSaveCard || isProfileScreen?  CARD_USAGE_TYPE.MULTIPLE :CARD_USAGE_TYPE.SINGLE;
        setSubmitting(true);
        setErrorCode('');
        setError('');
        webViewRef.current.injectJavaScript(submitSnapFormScript);
    };

    const onLoadWebView = () => {
        setLoadedSuccessfully(true);
        setError('');
        setErrorCode('');
    };

    const onLoadError = () => {
        setIsErrorModal(true);
        setLoadedSuccessfully(false);
    };

    const onCancelRetry = () => {
        setIsErrorModal(false);
        closeModal(false);
    };

    const onConfirmPress = () => {
        webViewRef.current?.reload();
        setIsErrorModal(false);
    };

    useImperativeHandle(ref, () => ({
        onSubmitForm,
    }));

    const renderButton = () => {
        return (
            <Button
                label={isGuest ? MODAL_GUEST_BUTTON_TITLES[modalKey] : MODAL_BUTTON_TITLES[modalKey]}
                width="90%"
                disabled={isSubmitDisabled}
                buttonStyle={[styles.buttonBottom, isSubmitDisabled && {backgroundColor: COLORS.DISABLE_BUTTON_COLOR}]}
                onPress={() => onSubmitForm()}
            />
        );
    }

    const renderSingleButton =() => {
        if (!isPinModal && withSingleButton && !isGuest) {
            return (
                <Pressable
                    disabled={isSubmitDisabled}
                    activeOpacity={0.7}
                    style={styles.singleUseButton}
                    onPress={() => onSubmitForm()}>
                    <Text allowFontScaling={false} style={[styles.singleUseText, isSubmitDisabled && {color: COLORS.DISABLE_BUTTON_COLOR}]}>
                        {APP_CONSTANTS.THIS_TRANSACTION_ONLY}
                    </Text>
                </Pressable>
            );
        }
        return null;
    }

    const renderPinView = useMemo(() => {
        if (isPinModal) {
            return (
                <View style={{height: 100}}>
                    <SnapWebView
                        webViewRef={webViewRef}
                        onError={onLoadError}
                        onLoadEnd={onLoadWebView}
                        source={{html: getSnapPinHtml(fisConfig)}}
                        onMessage={onPinResponse}
                    />
                </View>
            );
        }
        return null;
    }, [isPinModal, fisConfig, onPinResponse]);

    const [isSaveCard, setIsSaveCard] = useState(false);
    const showSaveTransaction = !isProfileScreen && !isGuest

    const renderSaveToTransaction = () => {
        if (showSaveTransaction) {
            return <Pressable style={{
                flexDirection: 'row',
                width: wp(86),
                alignItems: 'center',
                marginTop: hp('0.5%'),
                marginBottom: hp('1%'),
                marginStart: wp(5),
                marginEnd: wp(4),
            }} onPress={() => setIsSaveCard(!isSaveCard)}>
                <CheckBox disabled isSelected={isSaveCard} onPress={() => {
                }}/>

                <Text allowFontScaling={false} style={{
                    marginStart: wp('2%'),
                    color: COLORS.MAIN,
                    fontSize: getFontSize(12),
                    width: wp('80%'),
                }}>
                    {APP_CONSTANTS.SAVE_CARD_CHECKOUT}
                </Text>
            </Pressable>
        }
        return null
    }
    const renderCardView = useMemo(() => {
        if (!isPinModal) {
            return (
                <View style={{height: 180}}>
                    <SnapWebView
                        onError={onLoadError}
                        webViewRef={webViewRef}
                        onLoadEnd={onLoadWebView}
                        source={{html: getSnapCardHtml(fisConfig)}}
                        onMessage={onPanResponse}
                    />
                </View>
            );
        }
        return null;
    }, [isPinModal, fisConfig, onPanResponse]);

    const renderError = useMemo(() => {
        if (error) {
            return <ErrorMessage error={error} errorDetails={errorDetails?.current}/>;
        }
        return null;
    }, [error]);

    return (
        <>
            {renderPinView}
            {renderCardView}
            {renderError}
            {renderSaveToTransaction()}
            {renderButton()}
            {renderSingleButton()}
            <DialogBox
                visible={isErrorModal}
                onModalHide={() => setIsRetryModalHidden(true)}
                onModalShow={() => setIsRetryModalHidden(false)}
                title={APP_CONSTANTS.ALASKA_COMMERCIAL_COMPANY}
                message={APP_CONSTANTS.SOME_THING_WENT_WRONG}
                confirmButtonLabel={APP_CONSTANTS.RETRY}
                cancelButtonLabel={APP_CONSTANTS.CANCEL}
                onConfirmPress={onConfirmPress}
                onCancelPress={onCancelRetry}
            />
        </>
    );
});

export default React.memo(SnapIframesModals);
