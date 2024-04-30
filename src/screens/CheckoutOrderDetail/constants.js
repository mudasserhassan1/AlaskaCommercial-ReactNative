
import {formatPhoneNumber} from "../../utils";

export const getInitialState = (userInfo, checkoutInformation) => {
    const { FirstName = '', LastName = '', PhoneNumber = '', Email = '' } = userInfo ?? {};
    const {
        firstName: CFirstName = '',
        lastName: CLastName = '',
        contactNumber: CPhoneNumber = '',
        email: CEmail = ''
    } = checkoutInformation ?? {};
    return {
        firstName: !!CFirstName ? CFirstName : FirstName,
        lastName: !!CLastName ? CLastName : LastName,
        email: CEmail ? CEmail : Email,
        contactNumber: CPhoneNumber ? formatPhoneNumber(CPhoneNumber) : formatPhoneNumber(PhoneNumber),
        userConfirmNewPassword: '',
        userNewPassword: '',
    };
};



//get delivery address from redux
export const getDeliveryDateFromRedux = (deliveryDetail) => {
    const {selectedDate: rSelectedDate='', selectedTime: rSelectedTime='',selectedDateIndex:rSelectedDateIndex, selectedTimeIndex:rSelectedTimeIndex}=deliveryDetail??{};
    return{
        selectedDate:rSelectedDate,
        selectedTime:rSelectedTime,
        selectedDateIndex:rSelectedDateIndex,
        selectedTimeIndex:rSelectedTimeIndex

    }
};

//get delivery address from redux - Home delivery
export const getAddressFromRedux = (address) => {
    const { addressData: rAddressData = '' } = address ?? {};
    return {
        addressData: rAddressData
    };
};

//destination address for Bush delivery
export const getDeliveryAddressDetails = (ZipCode, FirstName, LastName, StoreLocation) => {
    return {
        destinationVillage: StoreLocation ?? '',
        state: 'AK',
        firstName: FirstName ?? '',
        lastName: LastName ?? '',
        zipCode: ZipCode ?? '',
    };
};
