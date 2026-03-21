import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Clock, ShieldCheck, Zap, Info, FileText } from "lucide-react";
import { marketService } from "../services/marketService";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import MarketChart from "../components/MarketChart";
import { formatLineChartData } from "../utils/chartHelpers";

const SellReportPage = () => {
    const { crop } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const data = await marketService.getSellReport(crop);
                setReport({
                    ...data,
                    chartData: formatLineChartData(data.historical_data)
                });
            } catch (err) {
                console.error("Failed to fetch sell report", err);
                setError("Could not load report. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [crop]);

    if (loading) return <Loader message={`Generating AI Sell Report for ${crop}...`} />;
    if (error) return <ErrorMessage message={error} />;
    if (!report) return <ErrorMessage message="Report data not found." />;

    const isHold = report.recommendation === "HOLD";

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-white border border-cream text-forest hover:bg-forest hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-display text-3xl font-bold text-forest">{report.crop} Sell Intelligence</h1>
                        <p className="text-gray-500 font-body text-sm flex items-center gap-1.5 mt-1">
                            <Clock className="w-4 h-4" /> Generated on {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-body text-gray-400 uppercase tracking-widest font-bold">Analysis Integrity</span>
                        <div className="flex items-center gap-1 text-olive">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-sm font-bold">Verified AI Model</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center text-forest">
                        <FileText className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Top Cards: Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                    <p className="text-xs font-body text-gray-400 uppercase font-bold mb-2">Market Loc</p>
                    <p className="text-xl font-display font-bold text-forest">{report.market}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                    <p className="text-xs font-body text-gray-400 uppercase font-bold mb-2">Current Price</p>
                    <p className="text-2xl font-mono font-bold text-forest">₹{report.current_price}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                    <p className="text-xs font-body text-gray-400 uppercase font-bold mb-2">3-Day Predict</p>
                    <p className="text-2xl font-mono font-bold text-forest">₹{report.predicted_price}</p>
                </div>
                <div className={`p-6 rounded-3xl shadow-lg flex flex-col justify-center ${isHold ? "bg-olive text-white" : "bg-rust text-white"}`}>
                    <p className="text-xs font-body opacity-80 uppercase font-bold mb-1">AI Confidence</p>
                    <p className="text-3xl font-display font-black">{report.confidence}%</p>
                </div>
            </div>

            {/* Recommendation Hero Section */}
            <div className={`rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 ${isHold ? "bg-olive/5 border border-olive/20" : "bg-rust/5 border border-rust/20"}`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 ${isHold ? "bg-olive/20 text-olive" : "bg-rust/20 text-rust"}`}>
                    {isHold ? <TrendingUp className="w-12 h-12" /> : <TrendingDown className="w-12 h-12" />}
                </div>
                <div className="flex-grow text-center md:text-left relative z-10">
                    <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 ${isHold ? "bg-olive text-white" : "bg-rust text-white"}`}>
                        Recommendation: {report.recommendation}
                    </div>
                    <h2 className={`font-display text-4xl font-black mb-4 ${isHold ? "text-olive" : "text-rust"}`}>
                        {isHold ? "Strategic Hold Advised" : "Immediate Liquidation Recommended"}
                    </h2>
                    <p className="text-lg font-body text-gray-700 leading-relaxed max-w-2xl">
                        {report.reason}
                    </p>
                </div>
                <Zap className={`absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-[0.03] ${isHold ? "text-olive" : "text-rust"}`} />
            </div>

            {/* Main Content: Chart & Technical Data */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream h-[500px]">
                        <MarketChart 
                            type="line" 
                            data={report.chartData} 
                            title={`Market Price Volatility: ${report.crop}`} 
                        />
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-cream">
                        <h3 className="font-display text-xl font-bold text-forest mb-4">Sentiment Analysis</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-body">
                                    <span className="text-gray-500">Global Demand</span>
                                    <span className="text-olive font-bold">Strong</span>
                                </div>
                                <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                    <div className="h-full bg-olive w-[85%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-body">
                                    <span className="text-gray-500">Local Supply</span>
                                    <span className="text-rust font-bold">High</span>
                                </div>
                                <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                    <div className="h-full bg-rust w-[92%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-body">
                                    <span className="text-gray-500">Storage Potential</span>
                                    <span className="text-harvest font-bold">Average</span>
                                </div>
                                <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                                    <div className="h-full bg-harvest w-[60%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-forest p-6 rounded-3xl shadow-lg text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-harvest" />
                            <h3 className="font-display text-lg font-bold">Decision Support</h3>
                        </div>
                        <p className="text-sm font-body opacity-90 leading-relaxed mb-6">
                            This report combines ML price forecasts with current market arrivals data from e-NAM portals. 
                            The {report.recommendation} is calculated based on a profitability threshold of ₹50/quintal.
                        </p>
                        <button className="w-full py-3 bg-white text-forest font-display font-bold rounded-2xl hover:bg-harvest hover:text-white transition-all">
                            Export PDF Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellReportPage;
