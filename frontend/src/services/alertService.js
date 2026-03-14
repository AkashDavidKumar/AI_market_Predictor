import api from "./api";

export const alertService = {
    createAlert: async (alertData) => {
        // { crop, condition, targetPrice }
        const response = await api.post("/alerts/create", alertData);
        return response.data;
    },
    getUserAlerts: async () => {
        const response = await api.get("/alerts/user");
        return response.data || [];
    },
};
