import API from "./axios";

export const createPatientApi = (data) => API.post("/patients", data);

export const getPatientsApi = (params) => API.get("/patients", { params });

export const getPatientApi = (id) => API.get(`/patients/${id}`);

export const updatePatientApi = (id, data) => API.put(`/patients/${id}`, data);

export const getMyProfileApi = () => API.get("/patients/my-profile");

export const updateMyProfileApi = (data) => API.put("/patients/my-profile", data);
