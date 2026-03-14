import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    TrendingUp,
    BarChart2,
    Leaf,
    Bell,
    Shield
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { user, isAdmin, logout } = useAuth();

    const navItems = [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Price Prediction", path: "/prediction", icon: TrendingUp },
        { label: "Market Analytics", path: "/analytics", icon: BarChart2 },
        { label: "Crop Suggestions", path: "/crops", icon: Leaf },
        { label: "Alerts", path: "/alerts", icon: Bell },
    ];

    if (isAdmin) {
        navItems.push({ label: "Admin Panel", path: "/admin", icon: Shield });
    }

    return (
        <div className="w-16 lg:w-64 h-screen bg-forest flex flex-col justify-between hidden sm:flex shrink-0 sticky top-0">
            <div>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 bg-forest shadow-sm border-b border-white/10">
                    <Leaf className="text-cream w-8 h-8" />
                    <span className="text-cream font-display font-bold text-xl ml-3 hidden lg:block tracking-wide">
                        FormarAsOwner
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="mt-6 flex flex-col gap-1 px-2 lg:px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-3 lg:px-4 lg:py-3 rounded-xl transition-all ${isActive
                                        ? "bg-cream/10 border-l-4 border-harvest text-harvest"
                                        : "text-cream/80 hover:bg-white/5 hover:text-cream border-l-4 border-transparent"
                                    }`
                                }
                            >
                                <Icon className="w-6 h-6" />
                                <span className="ml-4 font-body font-medium hidden lg:block">
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* User Chip */}
            <div className="p-4 border-t border-white/10 flex flex-col items-center lg:flex-row gap-3">
                <div className="w-10 h-10 rounded-full bg-harvest flex items-center justify-center text-white font-bold shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden lg:flex flex-col overflow-hidden">
                    <span className="text-cream font-body font-semibold truncate">{user?.name || "User"}</span>
                    <button
                        onClick={logout}
                        className="text-white/60 text-sm hover:text-harvest text-left transition font-body"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
