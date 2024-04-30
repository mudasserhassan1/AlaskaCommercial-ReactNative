import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import styles from './style';
import {APP_CONSTANTS} from '../../constants/Strings';
import {navigateTo} from "../../utils/navigationUtils";
import BottomSheetModal from "../BottomSheetModal";

const DialogForGuestUser = ({isVisible, onClose, continueAsGuestHandling}) => {
    const handleContinueAsGuest = () => {
        onClose();
        continueAsGuestHandling()
    }


    // Function to render the footer section
    const renderFooter = () => {
        return (
            <View style={styles.footer}>
                <TouchableOpacity onPress={createAccountHandling}>
                    <Text allowFontScaling={false} style={styles.createAccountbuttonText}>{APP_CONSTANTS.CREATE_ACCOUNT}</Text>
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.orbuttonText}>{APP_CONSTANTS.OR}</Text>
                <TouchableOpacity onPress={handleContinueAsGuest}>
                    <Text allowFontScaling={false} style={styles.guestbuttonText}>{APP_CONSTANTS.CONTINUE_AS_GUEST}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Function to handle navigation to create account screen
    const createAccountHandling = () => {
        onClose();
        navigateTo('AuthStackForGuest', {
            screen: 'CreateAccount',
            initial: true,
            params: {showHeader: true},
        });
    };

    // Function to handle navigation to login screen
    const loginHandling = () => {
        onClose();
        navigateTo('AuthStackForGuest', {
            screen: 'Login',
            initial: true,
            params: {showHeader: true},
        });
    };

    return (
        <BottomSheetModal
            visible={isVisible}
            avoidKeyboard={false}
            closeOnBackdrop={false}
            onCrossPress={onClose}
            headerTitleStyle={styles.title}
            title={APP_CONSTANTS.DO_YOU_WANT_TO_LOG_IN}
            showButton={false}
            showSkipButton={false}>
            <View style={styles.dialogContainer}>
                <View style={styles.dialogContent}>
                    <Text allowFontScaling={false} style={styles.subtitle}>{APP_CONSTANTS.ALREADY_MEMBER_SO_SIGN_IN}</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={loginHandling}>
                        <Text allowFontScaling={false} style={styles.loginButtonText}>{APP_CONSTANTS.LOGIN}</Text>
                    </TouchableOpacity>
                    {renderFooter()}
                </View>
            </View>
        </BottomSheetModal>
    )
};

export default DialogForGuestUser;

