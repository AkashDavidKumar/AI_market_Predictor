import React, { createContext, useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

// 1. Context Creation
const AuthContext = createContext(null);

// Helper to parse JWT or return default user
const parseUserToken = (token) => {
    if (!token) return null;
    try {
        if (token.includes(".")) {
            const payloadBase64 = token.split(".")[1];
            if (payloadBase64) {
                return JSON.parse(atob(payloadBase64));
            }
        }
        return { role: "user", name: "User" };
    } catch (err) {
        console.error("Token decode failed", err);
        return { role: "user", name: "User" };
    }
};

// 2. AuthProvider Component
export const AuthProvider = ({ children }) => {
    // Initialize state synchronously from storage
    const initialToken = localStorage.getItem("token") || null;
    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(parseUserToken(initialToken));
    const [loading, setLoading] = useState(false);

    // Derive simple admin check
    const isAdmin = user?.role === "admin";

    // Keep state in sync with token changes (e.g. from other tabs or manual setToken)
    useEffect(() => {
        if (token) {
            setUser(parseUserToken(token));
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        if (userData) {
            setUser(userData);
        } else {
            setUser(parseUserToken(newToken));
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook Hook wrapper
export const useAuth = () => {
    return useContext(AuthContext);
};

// 4. ProtectedRoute Component
export const ProtectedRoute = ({ requireAdmin = false }) => {
    const { token, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-cream flex items-center justify-center p-4 text-forest font-bold">Loading Auth...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
