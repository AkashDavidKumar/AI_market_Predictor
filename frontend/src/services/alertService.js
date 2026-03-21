import api from "./api";

export const alertService = {
    createAlert: async (alertData) => {
        // Map frontend fields to backend names
        const payload = {
            crop_name: alertData.crop,
            condition: alertData.condition,
            target_price: alertData.targetPrice
        };
        const response = await api.post("alerts/create", payload);
        return response.data;
    },
    getUserAlerts: async () => {
        const response = await api.get("alerts/user");
        // Backend returns { "alerts": [...] } with crop_name and target_price
        const alerts = response.data.alerts || [];
        return alerts.map(a => ({
            ...a,
            crop: a.crop_name,
            targetPrice: a.target_price,
            status: a.is_active ? "active" : "triggered"
        }));
    },
    deleteAlert: async (id) => {
        const response = await api.delete(`alerts/${id}`);
        return response.data;
    },
};
