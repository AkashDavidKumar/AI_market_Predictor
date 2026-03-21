import React, { useState, useEffect } from "react";
import CropSuggestionCard from "../components/CropSuggestionCard";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { cropService } from "../services/cropService";
import { Search, Filter, Sparkles, TrendingUp, ChevronDown, ListFilter, LayoutGrid } from "lucide-react";

const CropSuggestions = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Interactive State
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("profit");

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                setLoading(true);
                const data = await cropService.getCropSuggestions();
                setCrops(data);
            } catch (err) {
                console.error("Crops fetch failed", err);
                setError("Failed to load AI crop insights. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    if (loading) return <Loader message="AI is calculating crop profitability patterns..." />;
    if (error) return <ErrorMessage message={error} />;

    // Top 3 Highlights
    const top3 = [...crops].sort((a, b) => b.profitability_score - a.profitability_score).slice(0, 3);

    // Filtering & Sorting Logic
    const filteredCrops = crops
        .filter(c => {
            const assetName = c.name || c.item || "Unknown Asset";
            const matchesSearch = assetName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = category === "all" || (c.type && c.type.toLowerCase() === category.toLowerCase());
            return matchesSearch && matchesCat;
        })
        .sort((a, b) => {
            if (sortBy === "profit") return b.profitability_score - a.profitability_score;
            if (sortBy === "price") return b.expected_price - a.expected_price;
            if (sortBy === "trend") return a.trend === "upward" ? -1 : 1;
            return 0;
        });

    const categories = ["All", "Crops", "Vegetables", "Fruits", "Seeds"];

    return (
        <div className="space-y-10 pb-20">
            {/* Header / Hero */}
            <div className="relative pt-6 overflow-hidden rounded-[40px] bg-gradient-to-br from-forest to-olive p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-harvest/20 rounded-full blur-3xl opacity-50" />
                <div className="relative z-10">
                    <h2 className="font-display text-3xl md:text-5xl font-black mb-4 flex items-center gap-3">
                        <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-harvest" />
                        AI Market Insights
                    </h2>
                    <p className="text-white/80 font-body text-sm md:text-lg max-w-2xl leading-relaxed">
                        Precision-engineered recommendations based on real-time market data, AI price modeling, and historical profitability benchmarks.
                    </p>
                </div>
            </div>

            {/* Highlights Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-harvest" />
                    <h3 className="font-display text-2xl font-bold text-forest">🔥 Top 3 Recommended Today</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {top3.map((crop, idx) => (
                        <div key={idx} className="relative transition-transform hover:scale-105">
                            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-forest shadow-lg">
                                RANK #{idx + 1}
                            </div>
                            <CropSuggestionCard crop={crop} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Interactive Controls */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-cream space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Search Bar */}
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-forest" />
                        <input 
                            type="text" 
                            placeholder="Search by crop, fruit, or vegetable name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-cream/30 border-none font-body text-forest focus:ring-2 focus:ring-forest/20 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest hidden md:block">Sort By:</span>
                        <div className="relative min-w-[200px]">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full appearance-none bg-forest text-white pl-4 pr-10 py-4 rounded-2xl font-display font-bold text-sm border-none focus:ring-2 focus:ring-forest/20 cursor-pointer"
                            >
                                <option value="profit">Highest Profitability</option>
                                <option value="price">Highest Price</option>
                                <option value="trend">Trending Up</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Desktop Category Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <ListFilter className="w-4 h-4 text-gray-400 mr-2" />
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat.toLowerCase())}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                category === cat.toLowerCase()
                                ? "bg-forest text-white border-forest shadow-md shadow-forest/20"
                                : "bg-white text-gray-500 border-cream hover:bg-cream/50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCrops.map((crop, idx) => (
                    <CropSuggestionCard key={idx} crop={crop} />
                ))}
                
                {filteredCrops.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[40px] border-2 border-dashed border-cream">
                        <div className="p-4 bg-cream/30 rounded-full w-fit mx-auto">
                            <LayoutGrid className="w-12 h-12 text-forest/20" />
                        </div>
                        <h4 className="font-display text-xl font-bold text-forest">No matching AI insights</h4>
                        <p className="text-gray-400 font-body text-sm max-w-xs mx-auto">
                            Try adjusting your filters or search terms to find relevant market suggestions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropSuggestions;
