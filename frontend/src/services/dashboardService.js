import api from "./api";

export const dashboardService = {
    getDashboardData: async () => {
        const response = await api.get("dashboard");
        const data = response.data;

        // Map alerts
        if (data && Array.isArray(data.alerts)) {
            data.alerts = data.alerts.map(a => ({
                ...a,
                crop: a.crop || a.crop_name || "Unknown",
                targetPrice: a.targetPrice || a.target_price || 0,
                condition: a.condition || "above",
                status: a.status || (a.is_active ? "active" : "triggered") || "active"
            }));
        } else if (data) {
            data.alerts = [];
        }

        // Map crop suggestions
        if (data && Array.isArray(data.cropSuggestions)) {
            data.cropSuggestions = data.cropSuggestions.map(c => ({
                ...c,
                name: c.name || "Unknown Asset",
                type: c.type || "crops",
                market: c.market || "Main Market",
                expected_price: c.expected_price || 0,
                current_price: c.current_price || 0,
                unit: c.unit || "₹/kg",
                trend: c.trend || "stable",
                profitability_score: c.profitability_score || 0,
                recommendation: c.recommendation || "HOLD"
            }));
        } else if (data) {
            data.cropSuggestions = [];
        }

        return data;
    },

    getAssets: async () => {
        const response = await api.get("crops/assets");
        return response.data;
    }
};
