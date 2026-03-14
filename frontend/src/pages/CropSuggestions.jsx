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
            } catch (err) {
                console.error("Crops fetch failed", err);
                setError("No crop suggestions currently available. Please try again later.");
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
