import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import styles from './styles';
import {TextInput, View} from 'react-native';
import {APP_CONSTANTS} from '../../../constants/Strings';
import {COLORS} from '../../../theme';
import isAlphanumeric from 'validator/es/lib/isAlphanumeric';

const STABenefitView = forwardRef((props, ref) => {
    const {onBottomDisabled, firstName: fName = '', lastName: lName = '', staPurchaseOrder = ''} = props;
    const [firstName, setFirstName] = useState(fName);
    const [lastName, setLastName] = useState(lName);
    const [purchaseOrder, setPurchaseOrder] = useState(!!staPurchaseOrder ? staPurchaseOrder + "" : '');

    const lastNameRef = useRef('');
    const purchaseOrderRef = useRef('');

    const onEnterPurchaseOrder = value => {
        if (value && !isAlphanumeric(value)) {
            return '';
        }
        setPurchaseOrder(value);
    };

    const isBottomDisabled = useMemo(() => {
        return !(lastName && firstName && purchaseOrder);
    }, [firstName, lastName, purchaseOrder]);

    useEffect(() => {
        onBottomDisabled(isBottomDisabled);
    }, [isBottomDisabled, onBottomDisabled]);

    useImperativeHandle(ref, () => ({
        getSTAInfo: () => ({firstName, lastName, purchaseOrder}),
    }));

    return (
        <>
            <View style={styles.inputContainer}>
                <TextInput
                    allowFontScaling={false}
                    editable={!fName}
                    maxLength={25}
                    placeholder={APP_CONSTANTS.F_NAME}
                    placeholderTextColor={COLORS.GRAY_4}
                    value={firstName}
                    onChangeText={setFirstName}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                    style={[styles.input, styles.firstNameInput, fName && {backgroundColor: COLORS.DISABLED}]}
                    underlineColorAndroid={'transparent'}
                />
                <TextInput
                    allowFontScaling={false}
                    ref={lastNameRef}
                    editable={!lName}
                    maxLength={25}
                    placeholder={APP_CONSTANTS.L_NAME}
                    placeholderTextColor={COLORS.GRAY_4}
                    value={lastName}
                    onChangeText={setLastName}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    onSubmitEditing={() => purchaseOrderRef.current?.focus()}
                    style={[styles.input, styles.lastNameInput, lName && {backgroundColor: COLORS.DISABLED}]}
                    underlineColorAndroid={'transparent'}
                />
            </View>
            <TextInput
                allowFontScaling={false}
                ref={purchaseOrderRef}
                maxLength={25}
                placeholderTextColor={COLORS.GRAY_4}
                placeholder={APP_CONSTANTS.PURCHASE_ORDER_NUMBER}
                value={purchaseOrder}
                onChangeText={onEnterPurchaseOrder}
                returnKeyType={'next'}
                style={[styles.input, styles.purchaseInput]}
                underlineColorAndroid={'transparent'}
            />
        </>
    );
});

export default memo(STABenefitView);
