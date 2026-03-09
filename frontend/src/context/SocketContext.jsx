import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [stockUpdates, setStockUpdates] = useState({});

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('stock_update', (updates) => {
            const updatesObj = {};
            updates.forEach(u => {
                updatesObj[u.symbol] = u;
            });
            setStockUpdates(prev => ({ ...prev, ...updatesObj }));
        });

        return () => newSocket.close();
    }, []);

    const subscribeToSymbol = (symbol) => {
        if (socket) {
            socket.emit('subscribe', symbol);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, stockUpdates, subscribeToSymbol }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
