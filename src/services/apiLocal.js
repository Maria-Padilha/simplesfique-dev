import axios from "axios";

const apiLocal = axios.create({
    baseURL: "http://192.168.10.20:8000"
});

export default apiLocal;
