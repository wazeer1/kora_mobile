import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { disconnectSocket, initSocket } from '../services/socket';
import { RootState } from '../store';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Select token from Redux store for authentication
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (token) {
            const socketInstance = initSocket(token);
            setSocket(socketInstance);

            // Initial check
            setIsConnected(socketInstance.connected);

            // Listen for state changes to update context
            const onConnect = () => setIsConnected(true);
            const onDisconnect = () => setIsConnected(false);

            socketInstance.on('connect', onConnect);
            socketInstance.on('disconnect', onDisconnect);

            return () => {
                socketInstance.off('connect', onConnect);
                socketInstance.off('disconnect', onDisconnect);
                disconnectSocket();
            };
        } else {
            disconnectSocket();
            setSocket(null);
            setIsConnected(false);
        }
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
