import api from "./api";

export const quoteService = {
    getDailyQuote: async () => {
        const response = await api.get("daily-quote");
        return response.data;
    }
};
