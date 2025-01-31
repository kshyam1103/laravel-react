import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(null);

    // Load token and user from localStorage on first load
    useEffect(() => {
        const storedToken = localStorage.getItem('ACCESS_TOKEN');
        const storedUser = JSON.parse(localStorage.getItem('USER_DATA')); // assuming you store the user as well

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

    return (
        <StateContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);