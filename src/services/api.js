import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.10.100:9005/"
});

export default api;

