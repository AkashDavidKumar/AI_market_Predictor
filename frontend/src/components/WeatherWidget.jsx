import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherService';
import { CloudSun, Droplets, Wind, MapPin } from 'lucide-react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await weatherService.getWeather();
                setWeather(data);
            } catch (err) {
                console.error("Weather fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <div className="p-4 animate-pulse bg-forest/20 rounded-2xl h-32"></div>;
    if (!weather) return null;

    return (
        <div className="bg-forest/10 p-4 rounded-2xl border border-olive/20 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest font-bold">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{weather.location}</span>
                </div>
                <CloudSun className="w-8 h-8 text-harvest" />
            </div>
            
            <div className="flex items-end gap-1">
                <span className="text-3xl font-display font-bold text-forest">{weather.temperature}°</span>
                <span className="text-xs text-olive font-bold mb-1">{weather.condition}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-olive/10">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Droplets className="w-3 h-3 text-olive" />
                    <span>{weather.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Wind className="w-3 h-3 text-olive" />
                    <span>{weather.wind_speed} km/h</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
