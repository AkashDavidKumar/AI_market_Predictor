import api from "./api";

export const cropService = {
  getCropSuggestions: async () => {
    const response = await api.get("crop/suggestions");
    return response.data;
  },
  
  getCropDetails: async (cropName) => {
    const response = await api.get(`crop/details/${cropName}`);
    return response.data;
  }
};
