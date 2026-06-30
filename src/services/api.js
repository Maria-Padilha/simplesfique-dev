import axios from "axios";

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || "http://192.168.10.20:8000"
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

