import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Target, Zap, Clock, Info } from "lucide-react";
import { marketService } from "../services/marketService";

const SmartSellCard = ({ cropName }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState(null);

    useEffect(() => {
        const fetchRecommendation = async () => {
            if (!cropName) return;
            try {
                setLoading(true);
                const data = await marketService.getSellRecommendation(cropName);
                setRecommendation(data);
            } catch (err) {
                console.error("Sell recommendation fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [cropName]);

    if (loading) return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream animate-pulse">
            <div className="h-4 bg-cream w-3/4 mb-4 rounded" />
            <div className="h-10 bg-cream w-1/2 mb-2 rounded" />
            <div className="h-4 bg-cream w-full rounded" />
        </div>
    );

    if (!recommendation) return null;

    const isHold = recommendation.recommendation === "Hold";

    return (
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(74,92,26,0.12)] border-t-4 border-forest relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="font-display text-forest font-bold text-lg mb-1">{recommendation.crop} Intelligence</h3>
                    <p className="text-xs text-gray-400 font-body flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Analysis for next 3 days
                    </p>
                </div>
                <div className={`p-2 rounded-xl ${isHold ? "bg-olive/10 text-olive" : "bg-rust/10 text-rust"}`}>
                    <Zap className="w-5 h-5" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                <div className="bg-cream/30 p-3 rounded-xl">
                    <p className="text-[10px] text-gray-500 font-body uppercase tracking-wider mb-1">Current</p>
                    <p className="font-mono font-bold text-forest">₹{recommendation.current_price} <span className="text-[10px] font-normal">{recommendation.unit}</span></p>
                </div>
                <div className="bg-cream/30 p-3 rounded-xl border border-forest/10">
                    <p className="text-[10px] text-gray-500 font-body uppercase tracking-wider mb-1">Predicted</p>
                    <p className="font-mono font-bold text-forest">₹{recommendation.predicted_price} <span className="text-[10px] font-normal">{recommendation.unit}</span></p>
                </div>
            </div>

            <div className={`p-4 rounded-2xl mb-4 relative z-10 ${isHold ? "bg-olive text-white shadow-lg shadow-olive/20" : "bg-rust text-white shadow-lg shadow-rust/20"}`}>
                <div className="flex items-center gap-2 mb-1">
                    {isHold ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-display font-bold text-sm tracking-wide">AI RECOMMENDATION</span>
                </div>
                <p className="text-2xl font-display font-black mb-1">{recommendation.recommendation.toUpperCase()}</p>
                <p className="text-xs font-body opacity-90 leading-tight">{recommendation.reason}</p>
            </div>

            <div className="flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1.5 text-gray-500 bg-cream/50 px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    <span>Confidence: <strong>{recommendation.confidence}%</strong></span>
                </div>
                <button 
                    onClick={() => navigate(`/sell-report/${recommendation.crop}`)}
                    className="font-bold text-forest hover:underline transition-all"
                >
                    Full Report
                </button>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-500">
                {isHold ? <TrendingUp className="w-32 h-32" /> : <TrendingDown className="w-32 h-32" />}
            </div>
        </div>
    );
};

export default SmartSellCard;
