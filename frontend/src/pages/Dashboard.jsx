import React, { useState, useEffect } from "react";
import { IndianRupee, Leaf, Bell, Store } from "lucide-react";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import WeatherWidget from "../components/WeatherWidget";
import CropSuggestionCard from "../components/CropSuggestionCard";
import MarketChart from "../components/MarketChart";
import { formatLineChartData } from "../utils/chartHelpers";
import { predictionService } from "../services/predictionService";
import { alertService } from "../services/alertService";
import { dashboardService } from "../services/dashboardService";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        trendChart: null,
        crops: [],
        alerts: [],
        marketsCount: 0,
        bestPrice: null
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const dashboardData = await dashboardService.getDashboardData();
                const trendRaw = await marketService.getMarketTrends("Wheat", "Delhi");

                setData({
                    trendChart: formatLineChartData(trendRaw),
                    crops: dashboardData.cropSuggestions || [],
                    alerts: dashboardData.alerts || [],
                    marketsCount: dashboardData.activeMarkets || 0,
                    bestPrice: dashboardData.bestPrice
                });
            } catch (err) {
                console.error("Dashboard fetch failed", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Loader message="Loading FormarAsOwner Dashboard..." />;
    if (error) return <ErrorMessage message={error} />;

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${colorClass} flex items-center justify-between`}>
            <div>
                <p className="text-gray-500 font-body text-sm mb-1">{title}</p>
                <h4 className="font-mono text-2xl font-bold text-forest">{value}</h4>
            </div>
            <div className={`p-4 rounded-full bg-cream/50`}>
                <Icon className="w-8 h-8 text-forest" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* Row 1: Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard 
                    title="Today's Best Price" 
                    value={data.bestPrice ? `₹${data.bestPrice.price}` : "N/A"} 
                    icon={IndianRupee} 
                    colorClass="border-harvest" 
                />
                <StatCard title="Top Recommended" value={data.crops[0]?.name || "-"} icon={Leaf} colorClass="border-forest" />
                <StatCard title="Active Alerts" value={data.alerts.length} icon={Bell} colorClass="border-rust" />
                <StatCard title="Tracked Markets" value={data.marketsCount} icon={Store} colorClass="border-olive" />
            </div>

            {/* Row 2: Charts & Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 h-[400px]">
                    <MarketChart type="line" data={data.trendChart} title="7-Day Price Trend (Wheat - Delhi)" />
                </div>
                <div className="lg:col-span-4 h-[400px]">
                    <WeatherWidget />
                </div>
            </div>

            {/* Row 3: Bottom Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <h3 className="font-display text-forest text-xl font-bold mb-4">Top Crop Suggestions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.crops.map((crop, idx) => (
                            <CropSuggestionCard key={idx} crop={crop} />
                        ))}
                        {data.crops.length === 0 && <p className="text-gray-500 italic p-4">No suggestions available.</p>}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <h3 className="font-display text-forest text-xl font-bold mb-4">Recent Alerts</h3>
                    <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(74,92,26,0.12)] p-4 space-y-3">
                        {data.alerts.map((alert, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-xl border-l-4 ${alert.condition === "above" ? "border-rust bg-rust/5" : "border-olive bg-olive/5"} flex items-center justify-between`}
                            >
                                <div>
                                    <p className="font-body text-forest font-bold">{alert.crop}</p>
                                    <p className="text-xs text-gray-500 font-mono">Target: ₹{alert.targetPrice} ({alert.condition})</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${alert.status === "triggered" ? "bg-rust text-white animate-pulse" : "bg-harvest text-white"
                                    }`}>
                                    {alert.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                        {data.alerts.length === 0 && <p className="text-gray-500 italic p-2 text-sm text-center">No active alerts.</p>}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
