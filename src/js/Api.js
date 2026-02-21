import axios from "axios";

// Use base URL from env variable or fallback
const api = axios.create({
    baseURL: "https://192.168.1.3",
    headers: { "Content-Type": "application/json" }
});

export default api;