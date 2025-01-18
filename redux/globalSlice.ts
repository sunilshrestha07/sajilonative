import {createSlice} from '@reduxjs/toolkit';
interface GlobalState {
  isLoading: boolean;
  isDarkMode: boolean;
  isLocationEnabled: boolean;
  isSearchingForDriver: boolean;
  isRideBooked: boolean;
  isCancelRideTrue: boolean;
}

const initialState: GlobalState = {
  isLoading: false,
  isDarkMode: false,
  isLocationEnabled: false,
  isSearchingForDriver: false,
  isRideBooked: false,
  isCancelRideTrue: false,
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
  },
});

export const {
  setIsLoading,
  setIsDarkMode,
  setIsLocationEnabled,
  setIsCancelRideTrue,
  setIsSearchingForDriver,
  setIsRideBooked,
  resetIsCancelRideTrue
} = globalSlice.actions;
export default globalSlice.reducer;
