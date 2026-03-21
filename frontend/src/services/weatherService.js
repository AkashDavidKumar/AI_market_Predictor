import api from "./api";

const FALLBACK_LOCATION = "Tirupattur, Tamil Nadu, India";

export const weatherService = {
    getWeather: async (options = null) => {
        let params = options;
        
        // If no options provided, try to get current coordinates
        if (!params) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
                });
                params = { lat: position.coords.latitude, lon: position.coords.longitude };
            } catch (err) {
                console.warn("Weather location detection failed, using fallback", err);
                params = { location: FALLBACK_LOCATION };
            }
        }

        const { location, lat, lon } = params;
        let url = "weather";
        if (lat && lon) {
            url += `?lat=${lat}&lon=${lon}`;
        } else if (location) {
            url += `?location=${encodeURIComponent(location)}`;
        }
        
        const response = await api.get(url);
        return response.data;
    }
};
