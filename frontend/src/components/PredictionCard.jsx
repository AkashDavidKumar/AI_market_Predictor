import React from "react";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";

const PredictionCard = ({ prediction }) => {
    // prediction: { price: 2350, trend: "up", confidence: 92, recommendedMarket: "Delhi" }
    if (!prediction) return null;

    const isUp = prediction.trend === "upward";

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(74,92,26,0.12)] border-l-4 border-harvest p-6 animate-slide-up relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="font-display text-forest text-xl mb-1">Predicted Price</h3>
                    <p className="text-gray-500 font-body text-sm">Based on FormarAsOwner AI</p>
                </div>
                <div className={`p-3 rounded-full ${isUp ? "bg-olive/10" : "bg-rust/10"}`}>
                    {prediction.trend === "upward" ? (
                        <TrendingUp className="w-6 h-6 text-olive" title="Upward Trend" />
                    ) : (
                        <TrendingDown className="w-6 h-6 text-rust" title="Downward / Stable" />
                    )}
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <span className="font-mono text-5xl font-bold text-harvest flex items-center">
                    <span className="text-3xl mr-1">₹</span>{prediction.price}
                </span>
                <span className="text-forest font-body font-medium ml-1"> {prediction.unit || "/ Quintal"}</span>
            </div>

            <div className="space-y-4 relative z-10">
                <div>
                    <div className="flex justify-between text-sm mb-1 font-body text-forest">
                        <span>Confidence Score</span>
                        <span className="font-mono">{prediction.confidence}%</span>
                    </div>
                    <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
                        <div
                            className="h-full bg-olive rounded-full transition-all duration-1000"
                            style={{ width: `${prediction.confidence}%` }}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-cream flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-harvest shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-forest leading-relaxed">
                        <span className="font-semibold block mb-0.5">Recommended Market Action</span>
                        Best prices expected at <span className="font-bold">{prediction.recommendedMarket}</span>.
                        {isUp ? " Hold stock if possible." : " Sell immediately to avoid losses."}
                    </p>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-harvest/5 rounded-full blur-2xl pointer-events-none" />
        </div>
    );
};

export default PredictionCard;
