import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';

import styles from './styles';
import {APP_CONSTANTS} from '../../../constants/Strings';
import {COLORS} from '../../../theme';
import LabelRadioItem from '../../LabelRadioItem';
import {BigNumber, formatAmountValue} from '../../../utils/calculationUtils';
import {getPinErrorMessage, getSnapPinHtml, submitSnapFormScript} from '../../../utils/paymentUtils';
import SnapWebView from '../SnapWebView';
import {logToConsole} from '../../../configs/ReactotronConfig';
import {KEYBOARD_FEATURES, PAYMENT_METHODS, SNAP_CODES, SNAP_IFRAME_SYSTEM_ERRORS} from '../../../constants/Common';
import ErrorMessage from '../../ErrorMessage';
import {useDispatch, useSelector} from 'react-redux';
import {postSnapPinToken} from '../../../services/ApiCaller';
import {addCartPayments, removeCartPayment} from '../../../redux/actions/payment';
import {paymentMethodTitle} from '../../../screens/ShoppingCartPickup/PaymentsButtons';
import {BENEFIT_ERRORS, ENTER_AMOUNT, FULL_AMOUNT} from '../../../screens/ShoppingCartPickup/Constants';
import {TextField} from '../../TextField';
import STABenefitView from '../../StoreChargeModals/STABenefitView';
import {FONTS} from '../../../theme';

const AmountOption = ({text, error, withInput, onChangeText, value, selectedOption, onPress, optionKey}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef();
    error = selectedOption === optionKey && error;
    useEffect(() => {
        if (selectedOption === ENTER_AMOUNT) {
            inputRef.current?.focus?.();
        } else if (isFocused) {
            inputRef.current?.blur?.();
            Keyboard.dismiss();
        }
    }, [selectedOption, isFocused]);

    return (
        <>
            <TouchableOpacity activeOpacity={0.9} style={styles.listRow} onPress={() => onPress(optionKey)}>
                <View style={styles.radioButtonView}>
                    <LabelRadioItem onlyRadio isSelected={selectedOption === optionKey}/>
                    <View style={styles.descriptionView}>
                        <Text allowFontScaling={false} style={styles.itemName}>{text}</Text>
                        {withInput && (
                            <>
                                <View style={[styles.inputContainer, error && {borderColor: COLORS.MAIN}]}>
                                    <Text allowFontScaling={false} style={[styles.dollar, value && {color: COLORS.BLACK}]}>$</Text>
                                    <TextInput
                                        allowFontScaling={false}
                                        ref={inputRef}
                                        style={styles.input}
                                        onChangeText={onChangeText}
                                        onFocus={() => {
                                            onPress(optionKey);
                                            setIsFocused(true);
                                        }}
                                        value={value}
                                        placeholder={'0.00'}
                                        maxLength={6}
                                        placeholderTextColor={COLORS.GRAY_4}
                                        keyboardType={'decimal-pad'}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </View>
                <ErrorMessage textStyle={styles.erroMessage} error={error}/>
            </TouchableOpacity>
            <View style={styles.listItemSeparator}/>
        </>
    );
};

const SNAPBenefitModal = forwardRef(
    (
        {
            benefitTitle = '',
            availableBalance,
            remainingEligibleAmount = 0,
            onSubmitPayment,
            pinType,
            method,
            onBottomDisabled,
            onToggleLoading,
            card,
            previousAmount = '',
            previousOption = FULL_AMOUNT,
            staPurchaseOrder = '',
        },
        ref,
    ) => {
        const [selectedOption, setSelectedOption] = useState(previousOption);
        const [error, setError] = useState('');
        const [pinError, setPinError] = useState({});
        const [amountValue, setAmountValue] = useState(previousAmount);
        const [submitting, setSubmitting] = useState(false);
        const [loading, setLoading] = useState(false);
        const [pin, setPin] = useState('');
        const [isSTADisabled, setIsSTADisabled] = useState(false);

        const webViewRef = useRef();
        const staRef = useRef();
        const errorDetails = useRef();

        const dispatch = useDispatch();

        const {fisConfig} = useSelector(({payment: {paymentsConfig: {fisConfig} = {}} = {}}) => ({
            fisConfig,
        }));

        const {_id: paymentMethodId, firstName = '', lastName = '', organization = ''} = card ?? {};

        const isRNPin = PAYMENT_METHODS.GIFT_CARD === method;
        const isSTAMode = PAYMENT_METHODS.STORE_CHARGE === method;
        const isSnapFood = PAYMENT_METHODS.SNAP_FOOD === method;
        const isSnapCash = PAYMENT_METHODS.SNAP_CASH === method;
        const isVirtualWallet = PAYMENT_METHODS.VIRTUAL_WALLET === method;

        useEffect(() => {
            setSelectedOption(previousOption)
            if (previousOption === FULL_AMOUNT) {
                setAmountValue('')
            } else {
                setAmountValue(previousAmount)
                if (isSnapCash) {
                    verifyAmount(previousAmount)
                }
            }
        }, [previousAmount, previousOption])

        const isButtonDisabled = useMemo(
            () =>
                SNAP_IFRAME_SYSTEM_ERRORS.includes(pinError?.code) ||
                (selectedOption === FULL_AMOUNT /*&& !isSTAMode */ && BigNumber(remainingEligibleAmount).lte(0)) ||
                (selectedOption === ENTER_AMOUNT && (error || !amountValue)) ||
                (isRNPin && pin?.length < 6),
            [amountValue, availableBalance, error, isRNPin, isSTAMode, pin.length, pinError?.code, selectedOption],
        );

        useEffect(() => {
            onBottomDisabled(isButtonDisabled || isSTADisabled || loading);
        }, [isSTADisabled, isButtonDisabled, loading, onBottomDisabled]);

        useEffect(() => {
            if (typeof onToggleLoading === 'function') {
                onToggleLoading(submitting);
            }
        }, [onToggleLoading, submitting]);

        const addCartPayment = useCallback(() => {
            let amount = amountValue;
            if (selectedOption !== ENTER_AMOUNT) {
                logToConsole({remainingEligibleAmount})
                amount = remainingEligibleAmount;
            }
            let details = {
                type: method,
                option: selectedOption,
                paymentMethodId: card?._id,
                subTitle: paymentMethodTitle(card)?.subTitle || '',
                amount: parseFloat(formatAmountValue(amount)),
            };
            if (isRNPin) {
                details.pin = pin;
            }
            if (isSTAMode) {
                details = {...details, ...(staRef.current?.getSTAInfo?.() || {})};
            }
            let showToast = BigNumber(remainingEligibleAmount).minus(amount).lte(0);
            dispatch(addCartPayments({method, details}));
            return {...details, showToast};
        }, [
            amountValue,
            selectedOption,
            card,
            isRNPin,
            isSTAMode,
            dispatch,
            method,
            availableBalance,
            remainingEligibleAmount,
            pin,
        ]);

        const onPinResponse = useCallback(
            async (data = {}) => {
                try {
                    setPinError({});
                    const {response: pinCode, message: pinMessage} = data ?? {};
                    if (pinCode === SNAP_CODES.SUCCESS) {
                        await postSnapPinToken({
                            paymentMethodId,
                            pinType,
                            ...data,
                        });
                        setSubmitting(false);
                        onSubmitPayment(addCartPayment());
                    } else {
                        throw {...data, message: getPinErrorMessage({code: pinCode, message: pinMessage})};
                    }
                } catch (e) {
                    errorDetails.current = e;
                    const {message, response: code} = e ?? {};
                    setPinError({
                        message: message || APP_CONSTANTS.SOME_THING_WENT_WRONG,
                        code,
                    });
                } finally {
                    setSubmitting(false);
                }
            },
            [addCartPayment, onSubmitPayment, paymentMethodId, pinType],
        );

        const onSubmitForm = () => {
            if (selectedOption === FULL_AMOUNT || (selectedOption !== FULL_AMOUNT && verifyAmount(amountValue))) {
                setSubmitting(true);
                setPinError({});
                webViewRef.current.injectJavaScript?.(submitSnapFormScript);
            }
        };

        const skipOrCancelSnapCashAmount = (snapCashSelectedAmount, remainingOrderTotalEdit, isEditPayment) => {
            if (selectedOption === FULL_AMOUNT) {
                if (snapCashSelectedAmount > remainingOrderTotalEdit || (isEditPayment && snapCashSelectedAmount > 0))
                    onSubmitPayment(addCartPayment())
            } else {
                if (snapCashSelectedAmount > remainingOrderTotalEdit)
                    dispatch(removeCartPayment({methods: [PAYMENT_METHODS.SNAP_CASH]}));
            }


        }

        const countDecimals = num => {
            return String(num || 0.0).split('.')?.length || 0;
        };

        const verifyAmount = (amount) => {
            amount = BigNumber(isNaN(amount) ? 0 : amount || 0);
            if (amount.lte(0) || isNaN(amount)) {
                setError(APP_CONSTANTS.ENTER_VALID_AMOUNT);
                return false
            } else if (amount.gt(remainingEligibleAmount)) {
                setError(BENEFIT_ERRORS[method].REMAINING);
                return false

            } else if ((isVirtualWallet || isRNPin) && amount.gt(availableBalance)) {
                setError(BENEFIT_ERRORS[method].AVAILABLE);
            } else {
                setError('');
                return true

            }

        }
        const onEnterAmount = useCallback(
            amount => {
                amount = amount.replace(/[^0-9\.]/g, '')
                if (countDecimals(amount) > 2) {
                    return;
                }
                setAmountValue(amount);
                verifyAmount(amount)
            },
            [availableBalance, isSTAMode, method, remainingEligibleAmount],
        );

        const onLoadWebView = () => {
            setLoading(false);
            setPinError({});
        };

        const onLoadWebStart = () => {
            setLoading(true);
        };

        const renderError = useMemo(() => {
            if (pinError?.message) {
                return (
                    <ErrorMessage
                        textStyle={styles.errorTextStyle}
                        error={pinError?.message}
                        errorDetails={errorDetails?.current}
                    />
                );
            }
            return null;
        }, [pinError]);

        const renderBenefitString = useMemo(() => {
            if (benefitTitle) {
                return (
                    <View style={styles.modalContainer}>
                        <Text allowFontScaling={false} style={styles.subHeaderText}>{benefitTitle}</Text>
                        {!!organization && (
                            <Text allowFontScaling={false} style={[styles.remainingBalanceText, {
                                color: COLORS.BLACK,
                                fontFamily: FONTS.SEMI_BOLD
                            }]}>
                                {organization}
                            </Text>
                        )}
                    </View>
                );
            }
            return null;
        }, [benefitTitle, organization]);

        const renderSTAView = useMemo(() => {
            if (method === PAYMENT_METHODS.STORE_CHARGE) {
                return (
                    <STABenefitView ref={staRef} firstName={firstName} lastName={lastName}
                                    staPurchaseOrder={staPurchaseOrder}
                                    onBottomDisabled={setIsSTADisabled}/>
                );
            }
            return null;
        }, [firstName, lastName, method]);

        const renderAccountBalanceText = useMemo(() => {
            let remainingTitle =
                method === PAYMENT_METHODS.SNAP_FOOD ? APP_CONSTANTS.REMAINING_SNAP_TOTAL : APP_CONSTANTS.REMAINING_ORDER_TOTAL;
            return (
                <>
                    {(isVirtualWallet || isRNPin) && (
                        <Text allowFontScaling={false} style={styles.availableBalanceText}>
                            {APP_CONSTANTS.TOOTAL_AVAILABLE_BALANCE}
                            {formatAmountValue(availableBalance)}
                        </Text>
                    )}
                    <Text allowFontScaling={false} style={styles.availableBalanceText}>{`${remainingTitle} $${formatAmountValue(
                        remainingEligibleAmount,
                    )}`}</Text>
                </>
            );
        }, [availableBalance, isSTAMode, method, remainingEligibleAmount]);

        const renderSNAPOptions = useMemo(() => {
            let text = isSTAMode ? APP_CONSTANTS.STA_CHARGE_FULL : APP_CONSTANTS.APPLY_FULL_ELIGIBLE_AMOUNT;

            return (
                <>
                    <AmountOption
                        text={text}
                        key={FULL_AMOUNT}
                        optionKey={FULL_AMOUNT}
                        selectedOption={selectedOption}
                        onPress={setSelectedOption}
                    />
                    <AmountOption
                        withInput
                        text={APP_CONSTANTS.ENTER_AMOUNT_C}
                        key={ENTER_AMOUNT}
                        optionKey={ENTER_AMOUNT}
                        onPress={setSelectedOption}
                        onChangeText={onEnterAmount}
                        selectedOption={selectedOption}
                        value={amountValue}
                        error={error}
                    />
                </>
            );
        }, [amountValue, error, isSTAMode, onEnterAmount, selectedOption]);

        const renderPinView = useMemo(() => {
            if ([PAYMENT_METHODS.SNAP_CASH, PAYMENT_METHODS.SNAP_FOOD].includes(method)) {
                return (
                    <View style={styles.pinView}>
                        <SnapWebView
                            webViewRef={webViewRef}
                            onLoadEnd={onLoadWebView}
                            onLoadStart={onLoadWebStart}
                            source={{html: getSnapPinHtml(fisConfig)}}
                            onMessage={onPinResponse}
                        />
                    </View>
                );
            }
            return null;
        }, [method, fisConfig, onPinResponse]);

        const renderRNPinView = useMemo(() => {
            if (isRNPin) {
                return (
                    <TextField
                        placeholder={APP_CONSTANTS.GC_PIN}
                        keyboardType={KEYBOARD_FEATURES.keyboardTypes.numberPad}
                        maxLength={6}
                        secureTextEntry
                        inputStyle={styles.textFieldWrapper}
                        value={pin}
                        blurOnSubmit={true}
                        onChangeText={setPin}
                        returnKeyType="done"
                    />
                );
            }
            return null;
        }, [isRNPin, pin]);

        const renderModalContent = useMemo(() => {
            return (
                <ScrollView>
                    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
                        <View style={styles.modalView}>
                            {renderBenefitString}
                            {renderAccountBalanceText}
                            {renderSTAView}
                            {renderSNAPOptions}
                            {renderRNPinView}
                            {renderPinView}
                            {renderError}
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            );
        }, [
            renderAccountBalanceText,
            renderBenefitString,
            renderError,
            renderPinView,
            renderRNPinView,
            renderSNAPOptions,
            renderSTAView,
        ]);

        useImperativeHandle(ref, () => ({
            addCartPayment,
            onSubmitForm,
            skipOrCancelSnapCashAmount
        }));

        return <>{renderModalContent}</>;
    },
);

export default React.memo(SNAPBenefitModal);
