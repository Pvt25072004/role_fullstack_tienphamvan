import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const api = axios.create({ baseURL: SERVER_URL });

export const fetchSessions = () => api.get("/api/sessions").then((res) => res.data);
export const fetchArticles = () => api.get("/api/articles").then((res) => res.data);
export { SERVER_URL };
