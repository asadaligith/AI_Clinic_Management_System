import API from "./axios";

export const getUsersApi = (params) => API.get("/admin/users", { params });

export const updateUserApi = (id, data) => API.put(`/admin/users/${id}`, data);

export const createDoctorApi = (data) => API.post("/admin/doctors", data);

export const createReceptionistApi = (data) => API.post("/admin/receptionists", data);
