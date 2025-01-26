// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null; // Adjust type to match your socket implementation
  socketDriver: Socket | null; // Adjust type to match your socket implementation
}

const initialState: SocketState = {
  socket: null,
  socketDriver: null

};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload;
    },
    clearSocket: (state) => {
      state.socket = null;
    },
    setdriversocket: (state, action: PayloadAction<any>) => {
      state.socketDriver = action.payload;
    },
    cleardriversocket: (state) => {
      state.socketDriver = null;
    },
  },
});

export const { setSocket, clearSocket,setdriversocket ,cleardriversocket} = socketSlice.actions;
export default socketSlice.reducer;
