import api from "./api";

export const predictionService = {
    predictPrice: async (predictionQuery) => {
        // { crop, market, date } -> maps to { crop_name, market, date }
        const payload = {
            crop_name: predictionQuery.crop,
            market: predictionQuery.market,
            date: predictionQuery.date
        };
        const response = await api.post("/predict-price", payload);
        return response.data;
    },
    getCropSuggestions: async () => {
        const response = await api.get("/crop/suggestions");
        return response.data || [];
    },
};
