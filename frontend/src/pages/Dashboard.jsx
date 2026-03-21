import React, { useState, useEffect } from "react";
import { IndianRupee, Leaf, Bell, Store, Zap } from "lucide-react";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import WeatherWidget from "../components/WeatherWidget";
import CropSuggestionCard from "../components/CropSuggestionCard";
import MarketChart from "../components/MarketChart";
import { formatLineChartData } from "../utils/chartHelpers";
import { predictionService } from "../services/predictionService";
import { alertService } from "../services/alertService";
import { dashboardService } from "../services/dashboardService";
import { marketService } from "../services/marketService";
import { weatherService } from "../services/weatherService";
import SmartSellCard from "../components/SmartSellCard";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("profit");
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
                
                // 1. Start fetching dashboard data immediately (Independent)
                const dashboardPromise = dashboardService.getDashboardData();
                
                // 2. Fetch weather to get location - Step 1
                console.log("Dashboard: weatherService is:", typeof weatherService, weatherService);
                const weatherData = await weatherService.getWeather();
                console.log("Dashboard: weatherData is:", weatherData);
                
                // 3. SUPPORTED_MARKETS - Step 2
                const SUPPORTED_MARKETS = ["Delhi", "Indore", "Mumbai", "Nagpur"];
                const detectedMarket = (weatherData && weatherData.location) 
                    ? (SUPPORTED_MARKETS.find(m => 
                        weatherData.location.toLowerCase().includes(m.toLowerCase())
                      ) || "Delhi")
                    : "Delhi";

                // 4. Fetch trends for detected market (Dependent on weather)
                const trendRaw = await marketService.getMarketTrends("Wheat", detectedMarket);
                
                // 5. Wait for dashboard data to complete
                const dashboardData = await dashboardPromise;

                setData({
                    trendChart: formatLineChartData(trendRaw),
                    crops: dashboardData.cropSuggestions || [],
                    alerts: dashboardData.alerts || [],
                    marketsCount: dashboardData.activeMarkets || 0,
                    bestPrice: dashboardData.bestPrice,
                    currentMarket: detectedMarket // Store for UI title
                });
            } catch (err) {
                console.error("Dashboard fetch failed", err);
                if (err.response?.status !== 401) {
                    setError("Failed to load dashboard data. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Loader message="Loading FormarAsOwner Dashboard..." />;
    if (error) return <ErrorMessage message={error} />;

    // Filter and Sort Logic
    const filteredCrops = data.crops
        .filter(c => filter === "all" || (c.type && c.type.toLowerCase() === filter.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "price") return (b.expected_price || 0) - (a.expected_price || 0);
            if (sortBy === "profit") return (b.profitability_score || 0) - (a.profitability_score || 0);
            if (sortBy === "rec") return a.recommendation === "SELL" ? -1 : 1;
            return 0;
        });

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${colorClass} flex items-center justify-between transition-transform hover:scale-[1.02]`}>
            <div>
                <p className="text-gray-500 font-body text-sm mb-1">{title}</p>
                <h4 className="font-mono text-2xl font-bold text-forest">{value}</h4>
            </div>
            <div className={`p-4 rounded-full bg-cream/50`}>
                <Icon className="w-8 h-8 text-forest" />
            </div>
        </div>
    );

    const categories = ["All", "Crops", "Vegetables", "Fruits", "Seeds"];

    return (
        <div className="space-y-8 pb-12">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Main Content Grid: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Performance & Analytics (8/12) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm h-[450px]">
                        <MarketChart 
                            type="line" 
                            data={data.trendChart} 
                            title={`7-Day Price Trend (Wheat - ${data.currentMarket || 'Delhi'})`} 
                        />
                    </div>

                    {/* AI Market Intelligence Section (Dynamic) */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-forest text-2xl font-bold flex items-center gap-2">
                                <Zap className="w-6 h-6 text-harvest" /> AI Market Intelligence
                            </h3>
                            <span className="text-sm text-gray-500 font-mono">Based on your Alerts</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(() => {
                                // Extract unique crop names from active alerts
                                const activeAlertCrops = [...new Set(
                                    data.alerts
                                        .filter(alert => alert.is_active || alert.status === 'active' || alert.status === 'triggered')
                                        .map(alert => alert.crop || alert.crop_name)
                                )].slice(0, 6); // Limit to 6 cards

                                if (activeAlertCrops.length === 0) {
                                    return (
                                        <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-cream">
                                            <Bell className="w-12 h-12 text-cream mx-auto mb-4" />
                                            <h4 className="font-display text-lg font-bold text-forest mb-2">No Active Product Alerts</h4>
                                            <p className="text-gray-400 max-w-xs mx-auto text-sm">
                                                Add price alerts for crops to see personalized AI selling recommendations and market intelligence.
                                            </p>
                                        </div>
                                    );
                                }

                                return activeAlertCrops.map((cropName, idx) => (
                                    <SmartSellCard key={idx} cropName={cropName} />
                                ));
                            })()}
                        </div>
                    </section>
                </div>

                {/* Right Side: Quick Info & Widgets (4/12) - Fills the White Space */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-6 space-y-8">
                        {/* Weather Widget */}
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-2 border-cream/30">
                            <WeatherWidget />
                        </div>

                        {/* Recent Alerts Widget */}
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-4">
                            <h3 className="font-display text-forest text-lg font-bold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-rust" /> Recent Alerts
                            </h3>
                            <div className="space-y-3">
                                {data.alerts.slice(0, 5).map((alert, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-2xl border-l-4 transition-all hover:bg-white hover:shadow-md ${alert.condition === "above" ? "border-rust bg-rust/5" : "border-olive bg-olive/5"} flex items-center justify-between`}
                                    >
                                        <div>
                                            <p className="font-body text-forest font-bold text-sm">{alert.crop}</p>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Target: ₹{alert.targetPrice} {alert.condition}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${alert.status === "triggered" ? "bg-rust text-white animate-pulse" : "bg-harvest text-white"}`}>
                                            {alert.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                                {data.alerts.length === 0 && <p className="text-gray-400 italic text-center text-sm py-4">No active alerts.</p>}
                            </div>
                        </div>

                        {/* Top Performing Asset (Optional Mini-Widget) */}
                        <div className="bg-forest rounded-3xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full transition-transform group-hover:scale-150" />
                            <p className="text-white/70 text-xs uppercase font-mono tracking-widest mb-1">Top Performer</p>
                            <h5 className="text-xl font-bold">{data.crops[0]?.name || "N/A"}</h5>
                            <p className="text-2xl font-mono mt-2">+{data.crops[0]?.profitability_score || 0}%</p>
                            <p className="text-xs text-white/50 mt-1 uppercase tracking-tighter">Expected returns this week</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Dynamic Asset Exploration (Full Width) */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-display text-forest text-2xl font-bold">Top Market Suggestions</h3>
                    
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {/* Category Filters */}
                        <div className="flex bg-cream/50 p-1 rounded-xl">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat.toLowerCase())}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                        filter === cat.toLowerCase() 
                                        ? "bg-white text-forest shadow-sm" 
                                        : "text-gray-500 hover:text-forest"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border-none rounded-xl px-4 py-1.5 text-sm font-bold text-forest shadow-sm focus:ring-2 focus:ring-forest/20"
                        >
                            <option value="profit">Sort by Profit</option>
                            <option value="price">Sort by Price</option>
                            <option value="rec">Sort by Recommendation</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredCrops.map((crop, idx) => (
                        <CropSuggestionCard key={idx} crop={crop} />
                    ))}
                    {filteredCrops.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <Leaf className="w-12 h-12 text-cream mx-auto mb-4" />
                            <p className="text-gray-400 font-body">No assets found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
