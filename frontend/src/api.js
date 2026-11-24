import axios from "axios";

const api = axios.create({ baseURL: "https://linkedin-dummy-22dd.onrender.com/api"});

api.interceptors.request.use((cfg) => {
    const t = localStorage.getItem("token");
    if(t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
});

export default api;
