import React, { useState, useEffect } from "react";
import { predictionService } from "../services/predictionService";
import { marketService } from "../services/marketService";
import PredictionCard from "../components/PredictionCard";
import { useToast } from "../components/Toast";
import { Calendar, Search } from "lucide-react";

const Prediction = () => {
    const [crops, setCrops] = useState([]);
    const [markets, setMarkets] = useState([]);

    const [formData, setFormData] = useState({
        crop: "",
        market: "",
        date: "",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const { addToast } = useToast();

    useEffect(() => {
        // Fetch dropdown data
        const fetchDropdowns = async () => {
            try {
                // Fallback dummy data if backend empty for DX
                const m = await marketService.getMarkets();
                setMarkets(Array.isArray(m.markets) ? m.markets : []);

                const c = await predictionService.getCropSuggestions();
                setCrops(c.length ? c.map(x => typeof x === 'string' ? x : x.name) : []);
            } catch (err) {
                console.error("Dropdown fetch failed", err);
                setMarkets([]);
                setCrops([]);
            }
        };
        fetchDropdowns();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await predictionService.predictPrice(formData);
            setResult(res);
            addToast("Prediction completed successfully!", "success");
        } catch (err) {
            console.error("Prediction failed", err);
            addToast(err.response?.data?.error || "Prediction failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-forest mb-2">Price Prediction Engine</h2>
                <p className="text-gray-600 font-body">Leverage FormarAsOwner AI to forecast crop prices across markets.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Left Panel: Form */}
                <div className="bg-cream border border-olive/30 p-6 sm:p-8 rounded-3xl shadow-sm h-fit">
                    <form onSubmit={handlePredict} className="space-y-6">

                        <div>
                            <label className="block text-forest font-bold mb-2">Select Crop</label>
                            <select
                                name="crop"
                                required
                                value={formData.crop}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none appearance-none"
                            >
                                <option value="">-- Choose a crop --</option>
                                {crops.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-forest font-bold mb-2">Select Market</label>
                            <select
                                name="market"
                                required
                                value={formData.market}
                                onChange={handleChange}
                                className="w-full bg-white border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none appearance-none"
                            >
                                <option value="">-- Choose a market --</option>
                                {markets.map((m, i) => <option key={i} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-forest font-bold mb-2">Target Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full bg-white border-2 border-olive rounded-xl px-4 py-3 pl-12 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none"
                                />
                                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-harvest pointer-events-none" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-forest text-cream font-bold py-4 rounded-xl hover:bg-harvest transition-colors flex items-center justify-center gap-2 mt-4 shadow-md"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Analyze & Predict
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Panel: Results */}
                <div className="flex items-center justify-center p-6 sm:p-12 relative min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-16 h-16 border-4 border-olive/30 border-t-harvest rounded-full animate-spin mb-4" />
                            <p className="text-forest font-bold font-body">Running ML Models...</p>
                        </div>
                    ) : result ? (
                        <div className="w-full max-w-md">
                            <PredictionCard prediction={result} />
                        </div>
                    ) : (
                        <div className="text-center space-y-4 opacity-50">
                            <div className="w-32 h-32 mx-auto bg-olive/10 rounded-full flex items-center justify-center">
                                <Search className="w-12 h-12 text-forest" />
                            </div>
                            <h3 className="font-display text-2xl text-forest font-bold">Awaiting Input</h3>
                            <p className="font-body text-forest max-w-xs mx-auto">
                                Fill out the form on the left to generate an AI-powered price forecast.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Prediction;
