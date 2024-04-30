import {formatPhoneNumber} from "../../utils";

//get contact information from redux
export const getInitialState = checkoutinformation => {
    const {firstName = '', lastName = '', contactNumber = '', email = ''} = checkoutinformation ?? {};
    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNumber: formatPhoneNumber(contactNumber),
    };
};

//get delivery address from redux
export const getdeliveryDateFromRedux=(deliveryDetail)=>{
    const {selectedDate: rSelectedDate='', selectedTime: rSelectedTime='',selectedDateIndex:rSelectedDateIndex, selectedTimeIndex:rSelectedTimeIndex}=deliveryDetail??{};
    return{
        selectedDate:rSelectedDate,
        selectedTime:rSelectedTime,
        selectedDateIndex:rSelectedDateIndex,
        selectedTimeIndex:rSelectedTimeIndex

    }
}

//get delivery address from redux - in case of home delivery
export const getAddressFromRedux=(address)=>{
    const {addressData:rAddressData=''}=address??{};
    return{

        addressData:rAddressData

    }
}