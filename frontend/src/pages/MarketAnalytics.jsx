import React, { useState, useEffect } from "react";
import { marketService } from "../services/marketService";
import { Loader } from "../components/Loader";
import MarketChart from "../components/MarketChart";
import { Filter, AlertCircle, TrendingUp, BarChart3, PieChart, Activity, Zap, Clock, Info } from "lucide-react";
import { 
    formatLineChartData, 
    formatBarChartData, 
    formatRadarChartData 
} from "../utils/chartHelpers";
import SearchableDropdown from "../components/SearchableDropdown";
import { predictionService } from "../services/predictionService";

const MarketAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState("Wheat");
    const [selectedMarket, setSelectedMarket] = useState("");
    const [items, setItems] = useState({ crops: [], vegetables: [], fruits: [], seeds: [] });
    const [markets, setMarkets] = useState({});
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState({ line: null, bar: null, radar: null });

    const fetchData = async (crop = "Wheat", market = "") => {
        console.log("Fetching analytics for:", { crop, market });
        setLoading(true);
        setError(null);
        try {
            const res = await marketService.getAnalytics(crop, market);
            console.log("Analytics Response:", res);
            if (res) {
                setData(res);
                setChartData({
                    line: formatLineChartData(res.line || []),
                    bar: formatBarChartData(res.bar || []),
                    radar: formatRadarChartData(res.radar || { labels: [], values: [] })
                });
            }
        } catch (err) {
            console.error("Analytics fetch failed", err);
            setError("No detailed analytics available for this combination.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                // Fetch initialization data and first analytics in parallel
                const [itemsData, marketsData] = await Promise.all([
                    predictionService.getItems(),
                    marketService.getMarkets()
                ]);
                setItems(itemsData);
                setMarkets(marketsData);
            } catch (err) {
                console.error("Initialization failed", err);
            }
        };
        initialize();
        fetchData(selectedCrop, selectedMarket);
    }, []);

    const handleApply = () => {
        fetchData(selectedCrop, selectedMarket);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Professional Filter Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-cream">
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Select Asset</label>
                        <SearchableDropdown
                            items={items}
                            isCategorized={true}
                            value={selectedCrop}
                            placeholder="All Crops/Veg/Fruits"
                            onChange={(item) => setSelectedCrop(item)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Select Market</label>
                        <SearchableDropdown
                            items={markets}
                            isCategorized={true}
                            value={selectedMarket}
                            placeholder="Select Market Mandi"
                            onChange={(m) => setSelectedMarket(m)}
                        />
                    </div>
                </div>
                <button 
                    onClick={handleApply}
                    className="w-full lg:w-auto px-10 py-4 rounded-2xl bg-forest text-white font-display font-black text-sm uppercase tracking-widest shadow-lg shadow-forest/20 hover:bg-olive transition-all flex items-center justify-center gap-2 mt-auto"
                >
                    <Filter className="w-4 h-4" /> Apply Intelligence
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <Loader message="AI is processing deep market insights..." />
                    <p className="text-forest/60 font-medium animate-pulse">Generating localized price trends...</p>
                </div>
            ) : error || !data || (data.line && data.line.length === 0) ? (
                <div className="py-20 text-center space-y-4 bg-white rounded-[40px] border-2 border-dashed border-cream">
                    <AlertCircle className="w-12 h-12 text-rust mx-auto opacity-50" />
                    <h3 className="font-display text-2xl font-black text-forest">No analytics available</h3>
                    <p className="text-gray-400 font-body max-w-xs mx-auto">
                        {error || "We couldn't retrieve or generate data for this combination. Try another asset or market."}
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Top Hero Section with AI Summary */}
                    <div className="bg-gradient-to-br from-forest to-olive rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-harvest/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/20">
                                <Zap className="w-8 h-8 text-harvest" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[4px] text-harvest opacity-80">AI Market Context</h4>
                                <p className="font-display text-xl md:text-2xl font-bold leading-relaxed italic">
                                    "{data.ai_summary}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Trend Chart - Full Width */}
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-cream h-[500px]">
                        <MarketChart type="line" data={chartData.line} title={`${selectedCrop} Price Performance - ${selectedMarket || 'Global'}`} />
                    </div>

                    {/* Secondary Insights Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Comparison */}
                        <div className="lg:col-span-1 bg-white rounded-[40px] p-6 shadow-sm border border-cream h-[450px]">
                            <MarketChart type="bar" data={chartData.bar} title="Cross-Market Comparison" />
                        </div>

                        {/* Profitability Radar */}
                        <div className="lg:col-span-1 bg-white rounded-[40px] p-6 shadow-sm border border-cream h-[450px]">
                            <MarketChart type="radar" data={chartData.radar} title="Asset Profitability Profile" />
                        </div>

                        {/* New Market Insights Panel */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-cream h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-cream">
                                    <Activity className="w-6 h-6 text-harvest" />
                                    <h3 className="font-display text-2xl font-black text-forest">Market Health</h3>
                                </div>
                                
                                <div className="flex-1 space-y-6">
                                    <InsightRow 
                                        icon={<TrendingUp className="text-forest" />} 
                                        label="Demand Index" 
                                        value={`${data.insights.demand_index}/100`} 
                                        subValue={data.insights.demand_index > 80 ? 'High Momentum' : 'Stable'} 
                                    />
                                    <InsightRow 
                                        icon={<BarChart3 className="text-harvest" />} 
                                        label="Supply Level" 
                                        value={data.insights.supply_level} 
                                        subValue="Regional Availability" 
                                    />
                                    <InsightRow 
                                        icon={<PieChart className="text-rust" />} 
                                        label="Volatility" 
                                        value={data.insights.volatility} 
                                        subValue="Calculated Std Dev" 
                                    />
                                    <InsightRow 
                                        icon={<Clock className="text-olive" />} 
                                        label="Best Sell Time" 
                                        value={data.insights.best_selling_time} 
                                        subValue="Optimal Window" 
                                    />
                                </div>

                                <div className="mt-8 p-4 bg-cream/30 rounded-2xl flex items-start gap-3">
                                    <Info className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                    <p className="text-[10px] text-gray-500 font-body leading-relaxed">
                                        Insights are generated by analyzing the last 60 market records using our weighted volatility model.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InsightRow = ({ icon, label, value, subValue }) => (
    <div className="flex items-center justify-between group transition-all hover:translate-x-1">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center group-hover:bg-harvest/10 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                <p className="text-sm font-body text-gray-500 opacity-60">{subValue}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-mono text-lg font-black text-forest">{value}</p>
        </div>
    </div>
);

export default MarketAnalytics;
