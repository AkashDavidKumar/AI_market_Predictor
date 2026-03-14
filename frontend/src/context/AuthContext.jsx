import React, { createContext, useState, useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

// 1. Context Creation
const AuthContext = createContext(null);

// 2. AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // Derive simple admin check
    const isAdmin = user?.role === "admin";

    // Simulate token parsing / initial logic
    useEffect(() => {
        if (token) {
            // In a real app, you would decode the JWT or call a /me endpoint here:
            try {
                const payloadBase64 = token.split(".")[1];
                if (payloadBase64) {
                    const payload = JSON.parse(atob(payloadBase64));
                    setUser(payload); // payload assumed to hold role
                } else {
                    // Dummy logic fallback if no real JWT structured
                    setUser({ role: "user", name: "Guest" });
                }
            } catch (err) {
                console.error("Token decode failed", err);
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    if (loading) return <div>Loading Auth...</div>;

    return (
        <AuthContext.Provider value={{ user, token, isAdmin, login, logout }}>
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
    const { token, isAdmin } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
