import React, { useEffect, useState } from "react";
import { Menu, Bell, Sun, CloudRain } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = ({ onMobileMenuToggle }) => {
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState("Dashboard");

    useEffect(() => {
        const routeMap = {
            "/dashboard": "Dashboard",
            "/prediction": "Price Prediction",
            "/analytics": "Market Analytics",
            "/crops": "Crop Suggestions",
            "/alerts": "Price Alerts",
            "/admin": "Admin Panel",
        };
        setPageTitle(routeMap[location.pathname] || "FormarAsOwner");
    }, [location.pathname]);

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

            <div className="flex items-center gap-4">
                {/* Weather Mini-Pill (Dummy/Static for Navbar) */}
                <div className="hidden md:flex items-center gap-2 bg-olive/10 px-3 py-1.5 rounded-full border border-olive/30 shadow-sm">
                    <Sun className="w-4 h-4 text-olive" />
                    <span className="text-forest font-mono font-semibold text-sm">31°C</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-forest/10 transition text-forest">
                    <Bell className="w-5 h-5 text-forest" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rust rounded-full ring-2 ring-cream animate-pulse"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
