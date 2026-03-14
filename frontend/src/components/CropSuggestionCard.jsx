import React from "react";
import { Leaf } from "lucide-react";

const CropSuggestionCard = ({ crop }) => {
    // crop: { name: "Wheat", score: 85, bestMarket: "Pune", expectedPrice: 2200, trend: "up" }
    if (!crop) return null;

    const isUp = crop.trend === "up";

    return (
        <div className="bg-white rounded-2xl p-5 border-t-4 border-harvest shadow-[0_4px_24px_rgba(74,92,26,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(74,92,26,0.15)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-forest" />
                    </div>
                    <h3 className="font-display text-forest font-bold text-lg">{crop.name}</h3>
                </div>
                <span className="bg-harvest text-white font-body font-semibold px-3 py-1 rounded-full text-xs">
                    {crop.bestMarket}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between font-body text-sm mb-1">
                    <span className="text-gray-500">Profitability Score</span>
                    <span className="text-forest font-bold">{crop.score}/100</span>
                </div>
                <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                    <div
                        className="h-full bg-olive rounded-full"
                        style={{ width: `${crop.score}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-cream">
                <div>
                    <p className="text-xs text-gray-400 font-body mb-0.5">Expected Price</p>
                    <p className={`font-mono text-lg font-bold ${isUp ? "text-olive" : "text-rust"}`}>
                        ₹{crop.expectedPrice}
                    </p>
                </div>
                <button className="text-sm font-body font-bold text-forest border border-forest px-4 py-1.5 rounded-lg hover:bg-forest hover:text-white transition-colors">
                    Details
                </button>
            </div>
        </div>
    );
};

export default CropSuggestionCard;
