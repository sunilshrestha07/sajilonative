import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './userSlice';
import captainReducer from './captainSlice';
import locationReducer from './locationSlice';
import globalReducer from './globalSlice';
import rideReducer from './rideSlice';
import socketReducer from './socketSlice';

// Combine your reducers into a root reducer
const appReducer = combineReducers({
    user: userReducer,
    captain: captainReducer,
    location: locationReducer,
    global: globalReducer,
    ride: rideReducer,
    socket: socketReducer
});

// Handle the RESET action to reset state and persisted data
const rootReducer = (state: any, action: any) => {
    if (action.type === 'RESET') {
        // Reset only persisted reducers by setting their state to undefined
        state = {
            ...state,
            user: undefined,
            captain: undefined,
        };
    }
    return appReducer(state, action);
};

// Configuration for Redux Persist
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    version: 1,
    blacklist: ['location', 'global', 'ride', 'socket'], // Do not persist these reducers
};

// Create a persisted reducer using the root reducer and persist configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

// Create the Redux Persistor (for persisting the Redux store)
export const persistor = persistStore(store);

// Define TypeScript types for easier usage throughout the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type RootStateType = RootState;
