import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axios-client";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
    csrf: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Default to null to indicate no user
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [notification, _setNotification] = useState('');

    // Load token and user from localStorage on first load
    useEffect(() => {
        const storedToken = localStorage.getItem('ACCESS_TOKEN');
        const storedUser = JSON.parse(localStorage.getItem('USER_DATA')); 

        if (storedToken) {
            _setToken(storedToken);
        }
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification('');
        }, 5000);
    };

    const csrf = async () => {
        try {
            await axiosClient.post("/sanctum/csrf-cookie");
        } catch (error) {
            console.error("CSRF token fetch failed", error);
        }
    };

    return (
        <StateContext.Provider value={{ user, setUser, token, setToken, notification, setNotification, csrf }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
