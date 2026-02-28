import API from "./axios";

export const getUsersApi = (params) => API.get("/admin/users", { params });

export const updateUserApi = (id, data) => API.put(`/admin/users/${id}`, data);
