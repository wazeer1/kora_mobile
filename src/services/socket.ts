import { getTokens, saveTokens } from '@/src/utils/tokenStorage';
import { io, Socket } from 'socket.io-client';

// Use the IP/Port consistent with the backend configuration
// Android Emulator: 10.0.2.2, Physical device: LAN IP
const SOCKET_URL = 'http://10.113.236.230:8000';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
    // If socket exists and is connected/connecting, just return it ?
    // Or if token changed, we might want to reconnect. 
    // For simple singleton, if checks are robust:
    if (socket && socket.connected) {
        return socket;
    }

    // If socket exists but disconnected, or different token? 
    // Socket.io usually handles reconnection, but if we init with NEW token, we should probably disconnect old.
    if (socket) {
        socket.disconnect();
    }

    console.log('Initializing Socket Service with URL:', SOCKET_URL);

    socket = io(SOCKET_URL, {
        query: { token }, // Pass JWT token here
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
    });

    socket.on('connect', () => {
        console.log('Socket Service: Connected:', socket?.id);
    });

    socket.on('disconnect', () => {
        console.log('Socket Service: Disconnected');
    });

    socket.on('connect_error', async (err) => {
        console.error('Socket Service: Connection Error:', err.message);

        // Auto-refresh token if authentication error
        if (err.message.toLowerCase().includes('authentication') || err.message.toLowerCase().includes('jwt')) {
            console.log('Socket Service: Attempting to refresh token...');
            try {
                const { refreshToken } = await getTokens();
                if (refreshToken) {
                    const response = await fetch(`${SOCKET_URL}/api/v1/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });

                    const data = await response.json();
                    const newToken = data?.data?.token || data?.data?.accessToken;
                    const newRefreshToken = data?.data?.refreshToken || refreshToken;

                    if (newToken) {
                        console.log('Socket Service: Refreshed token successfully. Reconnecting...');
                        await saveTokens(newToken, newRefreshToken);

                        if (socket) {
                            socket.io.opts.query = { token: newToken };
                            socket.connect();
                        }
                    } else {
                        console.error('Socket Service: Failed to refresh token (No token in response).');
                    }
                } else {
                    console.log('Socket Service: No refresh token available.');
                }
            } catch (e) {
                console.error('Socket Service: Refresh attempt failed:', e);
            }
        }
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        console.log('Socket Service: Disconnecting...');
        socket.disconnect();
        socket = null;
    }
};
