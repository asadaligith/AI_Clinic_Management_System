import API from "./axios";

export const createPrescriptionApi = (data) => API.post("/prescriptions", data);

export const getPrescriptionsApi = (params) =>
  API.get("/prescriptions", { params });

export const getPrescriptionApi = (id) => API.get(`/prescriptions/${id}`);
