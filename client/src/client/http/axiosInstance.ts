import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true, // Cookie göndermek için gerekli
});

// Request interceptor - Access token'ı header'a ekle
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

// Response interceptor - 401 hatası durumunda token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 hatası ve henüz retry yapılmamışsa
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Zaten refresh işlemi devam ediyorsa, kuyruğa ekle
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh token endpoint'ini çağır (cookie otomatik gönderilir)
                const response = await axiosInstance.post('/refresh');
                const newAccessToken = response.data.user.token;

                // Yeni access token'ı kaydet
                localStorage.setItem('access_token', newAccessToken);

                // Başarılı refresh sonrası kuyruğu işle
                processQueue();

                // Original request'i yeni token ile tekrarla
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh başarısız oldu, logout yap
                processQueue(refreshError);

                // Token'ları temizle
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                // Login sayfasına yönlendir
                window.location.href = '/login';

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
