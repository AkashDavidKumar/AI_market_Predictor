import api from "./api";

export const marketService = {
    getMarkets: async () => {
        const response = await api.get("markets");
        return response.data.markets || response.data || [];
    },
    getMarketTrends: async (crop, market) => {
        // query parameters
        const response = await api.get(`market-trends?crop=${crop}&market=${market}`);
        return response.data;
    },
    getRecommendMarket: async (crop) => {
        const response = await api.get(`markets/recommend?crop=${crop}`);
        return response.data;
    },
    getAnalytics: async (crop, market) => {
        let url = `charts?crop=${crop}`;
        if (market) url += `&market=${market}`;
        const response = await api.get(url);
        return response.data;
    },
    getCropDetails: async (cropName) => {
        const response = await api.get(`crop/details/${cropName}`);
        const data = response.data;
        if (data.crop) {
            data.crop = {
                ...data.crop,
                score: data.crop.score || data.crop.profitability || 0,
                expectedPrice: data.crop.expectedPrice || data.crop.expected_price || 0,
                trend: data.crop.trend || "stable"
            };
        }
        return data;
    },
    getSellRecommendation: async (crop) => {
        const response = await api.get(`sell-recommendation/${crop}`);
        return response.data;
    },
    getSellReport: async (crop) => {
        const response = await api.get(`sell-recommendation/report/${crop}`);
        return response.data;
    }
};
