// import React, {createContext, useContext, useEffect, useRef} from 'react';
// import {useSelector} from 'react-redux';
// import {io, Socket} from 'socket.io-client';
// import {RootState} from '../../redux/store';

// // Define the shape of your context
// interface SocketContextValue {
//   socket: Socket | null;
// }

// const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// // Socket.IO Provider
// export const SocketProvider: React.FC<{children: React.ReactNode}> = ({
//   children,
// }) => {
//   const socket = useRef<Socket | null>(null);
//   const currentUser = useSelector((state: RootState) => state.user.currentUser);

//   useEffect(() => {
//     // Initialize the socket connection
//     socket.current = io(
//       'https://socketiobackendtest-production.up.railway.app/',
//       {
//         transports: ['websocket'], // Ensures WebSocket is used
//         autoConnect: true,
//         auth:
//           currentUser?.role === 'user'
//             ? {
//                 token: currentUser?._id,
//               }
//             : {
//                 drivertoken: currentUser?._id,
//               },
//       },
//     );

//     console.log('sjdfl');


//     return () => {
//       socket.current?.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{socket: socket.current}}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // Custom hook for accessing the socket
// export const useSocket = (): Socket | null => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return context.socket;
// };
