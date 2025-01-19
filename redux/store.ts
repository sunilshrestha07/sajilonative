import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './userSlice';
import captainReducer from './captainSlice';
import locationReducer from './locationSlice'
import globalReducer from './globalSlice'
import rideReducer from './rideSlice'
import socketReducer from './socketSlice'

// Combine your reducers into a root reducer
const rootReducer = combineReducers({
    user: userReducer,
    captain: captainReducer,
    location: locationReducer,
    global: globalReducer,
    ride:rideReducer,
    socket:socketReducer
});



// Configuration for Redux Persist
const persistConfig = {
    key: 'root',
    storage:AsyncStorage,
    version: 1,
    blacklist: ['location', 'global','ride','socket'],
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
