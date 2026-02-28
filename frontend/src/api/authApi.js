import API from "./axios";

export const loginApi = (credentials) => API.post("/auth/login", credentials);
export const registerApi = (data) => API.post("/auth/register", data);
export const getMeApi = () => API.get("/auth/me");
