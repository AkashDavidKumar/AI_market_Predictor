import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, MapPin, Target, DollarSign, BarChart3 } from "lucide-react";
import { marketService } from "../services/marketService";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import MarketChart from "../components/MarketChart";
import { formatLineChartData } from "../utils/chartHelpers";

const CropDetailsPage = () => {
    const { cropName } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await marketService.getCropDetails(cropName);
                setDetails({
                    ...data,
                    chartData: formatLineChartData(data.historical_prices)
                });
            } catch (err) {
                console.error("Failed to fetch crop details", err);
                setError("Could not load crop details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [cropName]);

    if (loading) return <Loader message={`Analyzing ${cropName} market data...`} />;
    if (error) return <ErrorMessage message={error} />;
    if (!details) return <ErrorMessage message="No data found for this crop." />;

    const { crop, recommendation } = details;
    const isUp = crop.trend === "up";

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white border border-cream text-forest hover:bg-forest hover:text-white transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-display text-3xl font-bold text-forest">{crop.name} Analysis</h1>
            </div>

            {/* Top Cards: Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-forest/10 text-forest">
                            <Target className="w-6 h-6" />
                        </div>
                        <p className="font-body font-bold text-gray-500">Profitability</p>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-mono font-bold text-forest">{crop.score}</span>
                        <span className="text-gray-400 font-body mb-2">/ 100</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-harvest/10 text-harvest">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <p className="font-body font-bold text-gray-500">Best Market</p>
                    </div>
                    <p className="text-2xl font-display font-bold text-forest">{recommendation?.best_market || "N/A"}</p>
                    <p className="text-sm text-gray-400 font-body">{recommendation?.predicted_price ? `Expected: ₹${recommendation.predicted_price}` : ""}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-olive/10 text-olive">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <p className="font-body font-bold text-gray-500">Market Trend</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isUp ? <TrendingUp className="text-olive w-8 h-8" /> : <TrendingDown className="text-rust w-8 h-8" />}
                        <span className={`text-2xl font-body font-bold ${isUp ? "text-olive" : "text-rust"}`}>
                            {isUp ? "Bullish" : "Bearish"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content: Chart and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-cream h-[450px]">
                    <MarketChart 
                        type="line" 
                        data={details.chartData} 
                        title={`7-Day Price Trend: ${crop.name}`} 
                    />
                </div>
                
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-forest text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-display text-xl font-bold mb-4">Quick Insights</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-harvest mt-2" />
                                    <p className="text-sm font-body opacity-90">Expected market arrival is high this weekend.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-harvest mt-2" />
                                    <p className="text-sm font-body opacity-90">Demand for high-quality {crop.name} is peak in {recommendation?.best_market}.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-harvest mt-2" />
                                    <p className="text-sm font-body opacity-90">Weather conditions are favorable for storage.</p>
                                </li>
                            </ul>
                        </div>
                        <div className="absolute top-[-20px] right-[-20px] opacity-10">
                            <Target className="w-32 h-32" />
                        </div>
                    </div>

                    <div className="bg-cream/30 p-6 rounded-3xl border border-dashed border-forest/30 flex flex-col items-center justify-center text-center">
                        <DollarSign className="w-12 h-12 text-forest mb-2" />
                        <h4 className="font-display text-forest font-bold">Estimated Profit</h4>
                        <p className="text-3xl font-mono text-forest font-bold">₹{Math.round(crop.expectedPrice * 0.4)}</p>
                        <p className="text-xs text-gray-500 font-body mt-1">per quintal based on score</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropDetailsPage;
