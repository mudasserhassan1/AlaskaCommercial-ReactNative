import AsyncStorage from "@react-native-async-storage/async-storage";
import {ASYNC_STORAGE_KEYS} from "../constants/Common";
import uuid from "react-native-uuid";
import {logToConsole} from "../configs/ReactotronConfig";

export const showDialogWithTimeout = func => {
    setTimeout(() => func(), 100);
};


export const getFCMUniqueId = async () => {
    const id = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.UNIQUE_ID)
    let uniqueId = ''
    if (!!id) {
        uniqueId = id
    } else {
        uniqueId = uuid.v4();
        await saveFCMUniqueId(uniqueId)
    }
    return uniqueId
}
export const saveFCMUniqueId = async (uniqueId) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.UNIQUE_ID, uniqueId);
}
export const removeFCMUniqueId = async (uniqueId) => {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.UNIQUE_ID, uniqueId);
}