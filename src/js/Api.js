import axios from "axios";

// Use base URL from env variable or fallback
const api = axios.create({
    headers: { "Content-Type": "application/json" }
});

export default api;