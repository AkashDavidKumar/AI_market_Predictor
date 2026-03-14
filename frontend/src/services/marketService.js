import api from "./api";

export const marketService = {
    getMarkets: async () => {
        const response = await api.get("/markets");
        return response.data || [];
    },
    getMarketTrends: async (crop, market) => {
        // query parameters
        const response = await api.get(`/market-trends?crop=${crop}&market=${market}`);
        return response.data;
    },
    getRecommendMarket: async (crop) => {
        const response = await api.get(`/markets/recommend?crop=${crop}`);
        return response.data;
    },
    getAnalytics: async (crop) => {
        const response = await api.get(`/charts?crop=${crop}`);
        return response.data;
    },
};
