import {createSlice, PayloadAction} from '@reduxjs/toolkit';
interface GlobalState {
  isLoading: boolean;
  isDarkMode: boolean;
  isLocationEnabled: boolean;
  isSearchingForDriver: boolean;
  isRideBooked: boolean;
  isCancelRideTrue: boolean;
  isRideStarted: boolean;
  isRideCompleted: boolean;
  isFindRoutesActive: boolean;
  isPopUpActive: boolean;
  totalPrice:number
}

const initialState: GlobalState = {
  isLoading: false,
  isDarkMode: false,
  isLocationEnabled: false,
  isSearchingForDriver: false,
  isRideBooked: false,
  isCancelRideTrue: false,
  isRideStarted: false,
  isRideCompleted: false,
  isFindRoutesActive: false,
  isPopUpActive: false,
  totalPrice:0,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsLoading: state => {
      state.isLoading = !state.isLoading;
    },
    setIsDarkMode: state => {
      state.isDarkMode = !state.isDarkMode;
    },
    setIsLocationEnabled: state => {
      state.isLocationEnabled = !state.isLocationEnabled;
    },
    setIsSearchingForDriver: state => {
      state.isSearchingForDriver = !state.isSearchingForDriver;
    },
    setIsRideBooked: state => {
      state.isRideBooked = !state.isRideBooked;
    },
    setIsCancelRideTrue: state => {
      state.isCancelRideTrue = true;
    },
    resetIsCancelRideTrue: state => {
      state.isCancelRideTrue = false;
    },
    setIsRideStarted: state => {
      state.isRideStarted = !state.isRideStarted;
    },
    setIsRideCompleted: state => {
      state.isRideCompleted = !state.isRideCompleted;
    },
    setIsFindRoutesActive: state => {
      state.isFindRoutesActive = !state.isFindRoutesActive;
    },
    setIsPopUpActive: state => {
      state.isPopUpActive = !state.isPopUpActive;
    },
    setTotalPrice:(state,action:PayloadAction<number>)=>{state.totalPrice = action.payload
    },
    setIsRideStartedFalse: state => {
      state.isRideStarted = false;
    }
  },
});

export const {
  setIsLoading,
  setIsDarkMode,
  setIsLocationEnabled,
  setIsCancelRideTrue,
  setIsSearchingForDriver,
  setIsRideBooked,
  resetIsCancelRideTrue,
  setIsRideStarted,
  setIsRideCompleted,
  setIsFindRoutesActive,
  setIsPopUpActive,
  setTotalPrice,
  setIsRideStartedFalse
} = globalSlice.actions;
export default globalSlice.reducer;
