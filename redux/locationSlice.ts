import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface DriverLocation{
      lat: number,
      lon: number
}

interface startingAndEndingLocation{
      latitude: number,
      longitude: number,
      name: string
}

//define interface for the location state
interface LocationState{
      error: string | null,
      loading: boolean,
      currentPickUpLocation: PickUpLocation | null,
      currentDropOffLocation: DropOffLocation | null,
      refresh: boolean,
      isLocationEnabled: boolean
      driverlocation: DriverLocation | null,
      startingLocation:startingAndEndingLocation | null,
      endingLocation: startingAndEndingLocation | null
}



interface PickUpLocation{
      formatted: string,
      address_line1: string,
      address_line2: string,
      city: string,
      state: string,
      country: string,
      lat: number,
      lon: number,

}
interface DropOffLocation{
      formatted: string,
      address_line1: string,
      address_line2: string,
      city: string,
      state: string,
      country: string,
      lat: number,
      lon: number,
}


const initialState: LocationState = {
      error: null,
      loading: false,
      currentPickUpLocation: null,
      currentDropOffLocation: null,
      refresh: false,
      isLocationEnabled: false,
      driverlocation: null,
      startingLocation: null,
      endingLocation: null
}

const locationSlice = createSlice({
      name: 'location',
      initialState,
      reducers: {
            pickUpLocationSuccess(state, action: PayloadAction<PickUpLocation>) {
                  state.loading = false;
                  state.error = null;
                  state.currentPickUpLocation = action.payload;
                  state.refresh = true
            },
            dropOffLocationSuccess(state, action: PayloadAction<DropOffLocation>) {
                  state.loading = false;
                  state.error = null;
                  state.currentDropOffLocation = action.payload;
                  state.refresh = true
            },
            changerefreshstate(state) {
                  state.loading = !state.refresh;
            },
            enableLocationSuccess(state){
                  state.isLocationEnabled = true
            },
            emptyPickUpLocation(state){
                  state.currentPickUpLocation = null;
            },
            emptyDropOffLocationLocation(state){
                  state.currentDropOffLocation = null;
            },
            driverLocation(state,action: PayloadAction<DriverLocation>){
                  state.driverlocation = action.payload
            },
            setstartingLocation(state,action: PayloadAction<startingAndEndingLocation>){
                  state.startingLocation = action.payload
            },
            setendingLocation(state,action: PayloadAction<startingAndEndingLocation>){
                  state.endingLocation = action.payload
            }
      },
});

export const { pickUpLocationSuccess, dropOffLocationSuccess,driverLocation,emptyPickUpLocation,emptyDropOffLocationLocation, changerefreshstate,enableLocationSuccess,setstartingLocation,setendingLocation } = locationSlice.actions;
export default locationSlice.reducer;
