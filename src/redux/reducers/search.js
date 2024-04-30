import {CHANGE_FILTER_PREFERENCE} from '../types/search';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer} from "redux-persist";

const initialState = {
  filterPreference: 'asc',
};

const searchReducer = (state = initialState, action) => {
  const {type, payload} = action || {};
  switch (type) {
    case CHANGE_FILTER_PREFERENCE:
      return {...state, filterPreference: payload};
    default:
      return state;
  }
};

export default searchReducer;

// const providerPersistConfig = {
//   key: 'search',
//   storage: AsyncStorage,
// };
// export default persistReducer(providerPersistConfig, searchReducer);



