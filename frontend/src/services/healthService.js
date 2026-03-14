import api from "./api";

export const healthService = {
    checkBackendHealth: async () => {
        try {
            // Intentionally wrapped in try-catch so it doesn't break app boot on failure
            const response = await api.get("/health");
            return response.status === 200;
        } catch (error) {
            console.error("Health check failed:", error);
            return false;
        }
    },
};
