import axios from "axios";
import { getToken, removeToken } from "../utils/TokenUtilities";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
        }
        return Promise.reject(error);
    }
);

export const getErrorMessage = (error) => {
    return error.response?.data?.message || "Ocurrio un error inesperado";
};

export default api;
