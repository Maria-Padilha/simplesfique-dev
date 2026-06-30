import axios from "axios";

const apiLocal = axios.create({
    baseURL: process.env.VUE_APP_API_LOCAL_URL || "http://192.168.10.20:8000"
});

apiLocal.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiLocal;
