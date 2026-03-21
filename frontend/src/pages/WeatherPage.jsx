import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { quoteService } from '../services/quoteService';
import { CloudSun, Droplets, Wind, MapPin, Quote, Sparkles, Loader } from 'lucide-react';

const WeatherPage = () => {
    const [weather, setWeather] = useState(null);
    const [quote, setQuote] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [wData, qData] = await Promise.all([
                weatherService.getWeather(),
                quoteService.getDailyQuote()
            ]);
            setWeather(wData);
            setQuote(qData.quote);
        } catch (err) {
            console.error("Weather/Quote fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-forest font-bold font-display">Gathering weather and wisdom...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="font-display text-3xl font-bold text-forest mb-2 flex items-center gap-3">
                    <CloudSun className="w-8 h-8 text-harvest" />
                    Weather Today
                </h2>
                <p className="text-gray-600 font-body text-sm">Real-time agricultural weather advisory and motivational insights.</p>
            </div>

            {/* Weather Card */}
            {weather && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-olive/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CloudSun className="w-32 h-32 text-forest" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-forest font-bold">
                                <MapPin className="w-5 h-5" />
                                <span className="text-xl">{weather.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-7xl font-display font-bold text-forest">{weather.temperature}°</span>
                                <span className="text-2xl text-olive font-bold mb-4">C</span>
                            </div>
                            <p className="text-lg font-bold text-harvest uppercase tracking-widest">{weather.condition}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Droplets className="w-5 h-5 text-olive" />
                                    <span className="text-sm font-bold">Humidity</span>
                                </div>
                                <span className="text-2xl font-mono font-bold text-forest">{weather.humidity}%</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Wind className="w-5 h-5 text-olive" />
                                    <span className="text-sm font-bold">Wind Speed</span>
                                </div>
                                <span className="text-2xl font-mono font-bold text-forest">{weather.wind_speed} <span className="text-sm">km/h</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quote Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-forest font-bold text-sm uppercase tracking-widest px-2">
                    <Sparkles className="w-4 h-4 text-harvest" />
                    Daily Wisdom for Farmers
                </div>
                
                <div className="bg-forest rounded-3xl p-10 relative overflow-hidden group">
                    <Quote className="absolute -top-4 -left-4 w-32 h-32 text-white/5 -rotate-12 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <p className="text-2xl md:text-3xl text-cream font-display italic leading-relaxed text-center">
                            "{quote}"
                        </p>
                        <div className="w-24 h-1 bg-harvest mx-auto mt-8 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center pt-4">
                <button 
                    onClick={fetchData}
                    className="bg-cream border border-forest/20 text-forest font-bold py-3 px-8 rounded-2xl hover:bg-forest hover:text-white transition-all flex items-center gap-2 shadow-sm"
                >
                    <Sparkles className="w-5 h-5" />
                    Refresh Wisdom
                </button>
            </div>
        </div>
    );
};

export default WeatherPage;
