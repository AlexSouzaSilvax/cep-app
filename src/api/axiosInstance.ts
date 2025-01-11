import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_CEP_BASE_URL || "http://localhost:8080/api/",
  //baseURL: "http://192.168.1.13:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
