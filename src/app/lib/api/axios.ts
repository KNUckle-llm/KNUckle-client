import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_SERVER_URL || "http://localhost:8000",
});

export default api;
