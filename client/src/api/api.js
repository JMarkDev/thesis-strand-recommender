import axios from "axios";

const api = axios.create({
    baseURL: "https://jmarkdev.com",
});

export default api;