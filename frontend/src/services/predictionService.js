import api from "./api";

export const predictionService = {
    predictPrice: async (predictionQuery) => {
        // { crop, market, date } -> maps to { crop_name, market, date }
        const payload = {
            crop_name: predictionQuery.crop,
            market: predictionQuery.market,
            date: predictionQuery.date
        };
        const response = await api.post("predict-price", payload);
        const data = response.data;
        
        // Map backend response to what the UI expects
        return {
            price: data.predicted_price,
            trend: data.trend,
            confidence: data.confidence,
            unit: data.unit,
            recommendedMarket: data.market || "Local Market",
            ...data
        };
    },
    getCropSuggestions: async () => {
        const response = await api.get("crop/suggestions");
        return response.data || [];
    },
    getItems: async () => {
        const response = await api.get("crop");
        return response.data || {};
    },
};
