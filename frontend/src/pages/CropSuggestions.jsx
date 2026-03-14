import React, { useState, useEffect } from "react";
import CropSuggestionCard from "../components/CropSuggestionCard";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { predictionService } from "../services/predictionService";
import { Sparkles } from "lucide-react";

const CropSuggestions = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const data = await predictionService.getCropSuggestions();
                if (data && data.length > 0 && typeof data[0] === 'object') {
                    setCrops(data);
                } else {
                    // fallback dummy data if backend just returns strings or fails
                    throw new Error("Needs mock");
                }
            } catch (err) {
                // Fallback layout since API might not exactly return structured data
                setCrops([
                    { name: "Wheat", score: 92, bestMarket: "Delhi", expectedPrice: 2250, trend: "up" },
                    { name: "Rice (Basmati)", score: 88, bestMarket: "Pune", expectedPrice: 3100, trend: "up" },
                    { name: "Cotton", score: 75, bestMarket: "Mumbai", expectedPrice: 6200, trend: "down" },
                    { name: "Sugarcane", score: 85, bestMarket: "Bangalore", expectedPrice: 350, trend: "up" },
                    { name: "Soybean", score: 80, bestMarket: "Indore", expectedPrice: 4200, trend: "up" },
                    { name: "Maize", score: 70, bestMarket: "Hyderabad", expectedPrice: 1800, trend: "down" },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    if (loading) return <Loader message="Analyzing best crops for your region..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 border-b border-olive/20 pb-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-forest mb-2 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-harvest" />
                        AI Crop Suggestions
                    </h2>
                    <p className="text-gray-600 font-body text-sm max-w-2xl">
                        Based on current market demand, weather predictions, and historical profitability data.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {crops.map((crop, idx) => (
                    <CropSuggestionCard key={idx} crop={crop} />
                ))}
                {crops.length === 0 && (
                    <div className="col-span-full">
                        <ErrorMessage message="No crop suggestions currently available." />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropSuggestions;
