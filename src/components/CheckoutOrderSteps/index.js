import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {IMAGES} from '../../theme';
import ImageComponent from "../ImageComponent";
import styles from "./style";

const CheckoutOrderSteps = ({currentPage}) => {
    const steps = [
        {
            label: 'Order Details',
            color: currentPage === 1 ? '#BE1E2D' : currentPage > 1 ? '#000000' : '#00000080',
            borderColor: currentPage === 1 ? '#BE1E2D' : currentPage > 1 ? '#000000' : '#00000080',
            marker: currentPage > 1 ? IMAGES.CHECK_MARK : '1'
        },
        {
            label: 'Payment Details',
            color: currentPage === 2 ? '#BE1E2D' : currentPage > 2 ? '#000000' : '#00000080',
            borderColor: currentPage === 2 ? '#BE1E2D' : currentPage > 2 ? '#000000' : '#00000080',
            marker: currentPage > 2 ? IMAGES.CHECK_MARK : '2'
        },
        {
            label: 'Review Order',
            color: currentPage === 3 ? '#BE1E2D' : '#00000080',
            borderColor: currentPage === 3 ? '#BE1E2D' : '#00000080',
            marker: currentPage > 3 ? IMAGES.CHECK_MARK : '3'
        }
    ];

    return (
        <View style={styles.mainContainer}>

            <View style={styles.lineContainer}>
                <View style={styles.line}></View>
            </View>
            <View style={styles.container}>

                {steps.map((step, index) => (
                    <View key={index} style={styles.step}>
                        {typeof step.marker === 'string' ? (
                            <View style={[styles.circle,{borderColor:step.color}]}>
                            <Text allowFontScaling={false} style={[styles.numberingText, {
                                color: step.color,
                            }]}>{step.marker}</Text>
                            </View>
                        ) : (
                            <ImageComponent style ={styles.image} source={step.marker} resizeMode={'contain'} />
                        )}
                        <Text allowFontScaling={false} style={[{color: step.color}, styles.stepValue]}>{step.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};



export default CheckoutOrderSteps;
