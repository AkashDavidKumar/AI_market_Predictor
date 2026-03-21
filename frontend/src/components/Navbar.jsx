import React, { useState, useEffect } from "react";
import { Menu, Bell, Sun, CloudRain } from "lucide-react";
import { useLocation } from "react-router-dom";
import { notificationService } from "../services/notificationService";
import { weatherService } from "../services/weatherService";
import NotificationPanel from "./NotificationPanel";

const Navbar = ({ onMobileMenuToggle }) => {
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [weather, setWeather] = useState({ temperature: 31, condition: "Sunny" });

    useEffect(() => {
        const routeMap = {
            "/dashboard": "Dashboard",
            "/prediction": "Price Prediction",
            "/analytics": "Market Analytics",
            "/crops": "Crop Suggestions",
            "/alerts": "Price Alerts",
            "/weather": "Weather Today",
            "/admin": "Admin Panel",
        };
        setPageTitle(routeMap[location.pathname] || "FormarAsOwner");
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [n, w] = await Promise.all([
                    notificationService.getNotifications(),
                    weatherService.getWeather()
                ]);
                setNotifications(n);
                setWeather(w);
            } catch (err) {
                console.error("Navbar data fetch failed", err);
            }
        };
        fetchData();
    }, []);

    return (
        <header className="h-16 bg-cream border-b border-olive/20 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuToggle}
                    className="sm:hidden text-forest p-1 rounded-md hover:bg-forest/10 transition"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-forest font-display font-bold text-2xl tracking-wide hidden sm:block">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-4 relative">
                {/* Weather Mini-Pill */}
                <div className="hidden md:flex items-center gap-2 bg-olive/10 px-3 py-1.5 rounded-full border border-olive/30 shadow-sm">
                    {weather.condition === "Rainy" ? <CloudRain className="w-4 h-4 text-olive" /> : <Sun className="w-4 h-4 text-olive" />}
                    <span className="text-forest font-mono font-semibold text-sm">{weather.temperature}°C</span>
                </div>

                {/* Notifications */}
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-full transition text-forest ${showNotifications ? 'bg-forest/10' : 'hover:bg-forest/10'}`}
                >
                    <Bell className="w-5 h-5 text-forest" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rust rounded-full ring-2 ring-cream animate-pulse"></span>
                    )}
                </button>

                {showNotifications && (
                    <NotificationPanel 
                        notifications={notifications} 
                        onClose={() => setShowNotifications(false)} 
                    />
                )}
            </div>
        </header>
    );
};

export default Navbar;
