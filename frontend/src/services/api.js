import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-logout and detailed logging on errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extensive debug logging
        if (error.response) {
            console.error("API ERROR [RESPONSE]:", error.response.status, error.response.data);
            
            if (error.response.status === 401) {
                console.warn("Unauthorized! Clearing token and redirecting to login...");
                localStorage.removeItem("token");
                
                // Use a small delay to allow current component error states to set 
                // but then force the redirect to the login page.
                setTimeout(() => {
                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }
                }, 500);
            }
        } else if (error.request) {
            console.error("API ERROR [NETWORK]: No response received.", error.request);
        } else {
            console.error("API ERROR [SETUP]:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
