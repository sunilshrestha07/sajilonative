// userSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface RideState {
  loading: boolean;
  error: string | null;
  rideConfirmedDriver: RideDriver | null;
  rideConfirmedUser: RideUser | null;
}
interface RideUser {
  name: string;
  id: string;
  email: string;
  phone: string;
  pickuplocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  droplocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  price: number;
  vechicelType: string;
}
interface RideDriver {
  name: string;
  id: string;
  email: string;
  phone: string;
  avatar: string;
  location: {
    latitude: number;
    longitude: number;
  };
  vechicel: {
    color: string;
    plate: string;
    vehicleType: string;
  };
  price: number;
}

const initialState: RideState = {
  loading: false,
  error: null,
  rideConfirmedDriver: null,
  rideConfirmedUser: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    rideBookedDriverSuccess(state, action: PayloadAction<RideDriver>) {
      state.loading = false;
      state.error = null;
      state.rideConfirmedDriver = action.payload;
    }
  },
});

export const {rideBookedDriverSuccess} =
  rideSlice.actions;
export default rideSlice.reducer;
