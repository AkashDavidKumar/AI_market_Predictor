import React from "react";
import { TrendingUp, TrendingDown, Minus, MapPin, Sparkles, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CropSuggestionCard = ({ crop }) => {
    const navigate = useNavigate();
    
    // Debug logging as requested in Step 4
    console.log("Rendering crop card:", crop);
    
    // Ensure all fields have values or defaults - Step 2 & 3
    const { 
        name = "Unknown Asset", 
        type = "crops", 
        market = "General Market", 
        expected_price = 0, 
        unit = "₹/Unit", 
        profitability_score = 0, 
        trend = "stable", 
        recommendation = "Moderate" 
    } = crop;

    const getScoreColor = (score) => {
        if (score >= 85) return "bg-forest shadow-[0_0_12px_rgba(74,92,26,0.3)]";
        if (score >= 60) return "bg-harvest shadow-[0_0_12px_rgba(212,163,115,0.3)]";
        return "bg-rust shadow-[0_0_12px_rgba(188,71,39,0.3)]";
    };

    const getLabelColor = (label) => {
        if (label === "Highly Recommended") return "bg-forest/10 text-forest border-forest/20 shadow-sm";
        if (label === "Moderate") return "bg-harvest/10 text-harvest border-harvest/20 shadow-sm";
        return "bg-rust/10 text-rust border-rust/20 shadow-sm";
    };

    const TrendIcon = () => {
        if (trend === "upward") return <TrendingUp className="w-5 h-5 text-forest" />;
        if (trend === "downward") return <TrendingDown className="w-5 h-5 text-rust" />;
        return <Minus className="w-5 h-5 text-gray-300" />;
    };

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_32px_rgba(74,92,26,0.06)] border border-cream transition-all duration-500 hover:shadow-[0_20px_48px_rgba(74,92,26,0.12)] hover:-translate-y-2 group relative overflow-hidden flex flex-col items-stretch">
            {/* Glossy Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            
            {/* Category Badge & Recommended Sparkle */}
            <div className="flex justify-between items-start mb-5 relative z-10">
                <span className="px-3 py-1 rounded-full bg-cream/50 text-olive text-[10px] font-black uppercase tracking-widest border border-cream/80 backdrop-blur-sm">
                    {type.toUpperCase()}
                </span>
                {profitability_score >= 85 && (
                    <div className="flex items-center gap-1.5 bg-harvest/15 px-3 py-1 rounded-full border border-harvest/20 backdrop-blur-sm">
                        <Sparkles className="w-3 h-3 text-harvest animate-pulse" />
                        <span className="text-[10px] font-black text-harvest uppercase tracking-tighter">Premium Choice</span>
                    </div>
                )}
            </div>

            {/* Asset Identity */}
            <div className="mb-6 relative z-10">
                <h3 className="font-display text-2xl font-black text-forest group-hover:text-olive transition-colors">{name || "Unknown Asset"}</h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-body mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-harvest/60" />
                    <span className="truncate opacity-80">{market}</span>
                </div>
            </div>

            {/* AI Insights: Price & Trend */}
            <div className="flex items-end justify-between mb-8 relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-widest opacity-60">Expected Market Price</p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-mono font-black text-forest">₹{expected_price}</span>
                        <span className="text-xs text-gray-400 font-body font-bold italic">/ {unit.replace('₹/', '')}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 group-hover:scale-110 transition-transform">
                    <TrendIcon />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${trend === 'upward' ? 'text-forest' : 'text-rust'}`}>
                        {trend}
                    </span>
                </div>
            </div>

            {/* Dynamic Profitability Progress */}
            <div className="space-y-2.5 mb-8 relative z-10">
                <div className="flex justify-between text-[11px] font-bold">
                    <span className="font-display text-gray-400 uppercase tracking-widest">AI Profitability Rating</span>
                    <span className="font-mono text-forest">{profitability_score}%</span>
                </div>
                <div className="h-3 w-full bg-cream/50 rounded-full overflow-hidden border border-cream transition-shadow group-hover:shadow-inner">
                    <div 
                        className={`h-full ${getScoreColor(profitability_score)} transition-all duration-[1500ms] cubic-bezier(0.34, 1.56, 0.64, 1)`} 
                        style={{ width: `${profitability_score}%` }}
                    />
                </div>
            </div>

            {/* AI Recommendation Badge */}
            <div className={`px-4 py-3 rounded-2xl border text-center text-xs font-black mb-6 relative z-10 transition-transform group-hover:scale-[1.02] ${getLabelColor(recommendation)}`}>
                {recommendation.toUpperCase()}
            </div>

            {/* Action CTA */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/crop-details/${name}`);
                }}
                className="w-full py-4 mt-auto rounded-2xl bg-forest text-white font-display font-black text-xs uppercase tracking-[2px] shadow-lg shadow-forest/20 hover:bg-olive hover:shadow-olive/30 hover:scale-[0.98] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn relative z-10"
            >
                Deep Intelligence Report
                <Info className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            </button>
        </div>
    );
};

export default CropSuggestionCard;
