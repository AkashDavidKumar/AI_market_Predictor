import api from "./api";

export const predictionService = {
    predictPrice: async (predictionQuery) => {
        // { crop, market, date }
        const response = await api.post("/predict-price", predictionQuery);
        return response.data;
    },
    getCropSuggestions: async () => {
        const response = await api.get("/crop/suggestions");
        return response.data || [];
    },
};
