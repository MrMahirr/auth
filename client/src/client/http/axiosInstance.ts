import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Add Authorization token if available
        const token = localStorage.getItem("access_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Only set Content-Type if not FormData (FormData sets its own with boundary)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else if (config.headers && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
