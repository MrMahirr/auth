import {axiosInstance} from "./http/axiosInstance";

export class ApiClient {
    async get<T>(url: string, config = {}) {
        return axiosInstance.get<T>(url, config);
    }

    async post<T>(url: string, data?: any, config = {}) {
        return axiosInstance.post<T>(url, data, config);
    }

    put<T>(url: string, data?: any, config = {}) {
        return axiosInstance.put<T>(url, data, config);
    }

    delete<T>(url: string, config = {}) {
        return axiosInstance.delete<T>(url, config);
    }


}

export const apiClient = new ApiClient();
