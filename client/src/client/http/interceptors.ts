// src/client/http/interceptors.ts
import axios, { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
};

export function setupInterceptors() {
    // REQUEST — Token ekleme
    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // RESPONSE — Refresh mekanizması
    axiosInstance.interceptors.response.use(
        res => res,
        async (error: AxiosError) => {
            const originalRequest = error.config as any;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                isRefreshing = true;

                try {
                    const refreshToken = localStorage.getItem("refresh_token");
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh`,
                        { refresh_token: refreshToken }
                    );

                    const newAccessToken = data.access_token;
                    localStorage.setItem("access_token", newAccessToken);

                    axiosInstance.defaults.headers.common.Authorization =
                        `Bearer ${newAccessToken}`;

                    processQueue(null, newAccessToken);

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        }
    );
}
