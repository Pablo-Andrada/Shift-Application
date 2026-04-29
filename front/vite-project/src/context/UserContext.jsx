import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        setIsLoading(false);
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const isAdmin = user?.role === "admin";

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, isLoading, isAuthenticated: !!user, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};
