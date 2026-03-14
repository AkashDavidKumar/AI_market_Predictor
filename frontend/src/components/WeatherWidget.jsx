import React, { useState, useEffect } from "react";
import { Sun, CloudRain, Droplets, Wind, AlertTriangle, CheckCircle } from "lucide-react";
import api from "../services/api";
// Assuming we might have a weather service later, but for now we'll simulate or use a dummy endpoint 
// since the spec mentioned `GET /api/weather` but it wasn't strictly in the initial API list.
// We will mock the fetching process as per standard widget design.

const WeatherWidget = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/weather?location=Delhi")
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error("Weather fetch failed", err);
                setData({
                    temp: 30,
                    condition: "Sunny",
                    humidity: 50,
                    rainfall: 0,
                    wind: 10,
                    advisory: "Error loading weather",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-harvest h-full flex items-center justify-center animate-pulse">
                <div className="w-10 h-10 border-4 border-cream border-t-olive rounded-full animate-spin"></div>
            </div>
        );
    }

    const isGood = data.advisory === "Good for farming";

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(74,92,26,0.12)] border-l-4 border-harvest p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-display text-forest text-lg font-bold mb-1">Local Weather</h3>
                    <p className="font-body text-gray-500 text-sm">Farm Conditions</p>
                </div>
                <div className="p-3 bg-olive/10 rounded-full">
                    {data.condition === "Sunny" ? (
                        <Sun className="w-6 h-6 text-olive" />
                    ) : (
                        <CloudRain className="w-6 h-6 text-olive" />
                    )}
                </div>
            </div>

            <div className="flex items-end gap-2 mb-6">
                <span className="font-mono text-5xl font-bold text-harvest">{data.temp}°</span>
                <span className="font-body text-forest font-semibold mb-1 text-lg">C</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-forest" />
                    <div>
                        <p className="text-xs text-gray-400 font-body">Humidity</p>
                        <p className="font-mono font-bold text-forest">{data.humidity}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Wind className="w-5 h-5 text-forest" />
                    <div>
                        <p className="text-xs text-gray-400 font-body">Wind</p>
                        <p className="font-mono font-bold text-forest">{data.wind} km/h</p>
                    </div>
                </div>
            </div>

            <div className={`mt-auto p-3 rounded-xl flex items-center gap-3 border ${isGood ? 'bg-olive/10 border-olive/30 text-olive' : 'bg-rust/10 border-rust/30 text-rust'
                }`}>
                {isGood ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                <span className="font-body font-bold text-sm tracking-wide">
                    {data.advisory}
                </span>
            </div>
        </div>
    );
};

export default WeatherWidget;
