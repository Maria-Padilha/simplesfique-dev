import axios from "axios";

const apiLocal = axios.create({
    baseURL: "http://192.168.10.100:9010"
});

export default apiLocal;
