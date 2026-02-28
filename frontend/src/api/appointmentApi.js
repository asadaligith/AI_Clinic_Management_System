import API from "./axios";

export const createAppointmentApi = (data) => API.post("/appointments", data);

export const getAppointmentsApi = (params) =>
  API.get("/appointments", { params });

export const updateAppointmentStatusApi = (id, status) =>
  API.put(`/appointments/${id}/status`, { status });

export const deleteAppointmentApi = (id) => API.delete(`/appointments/${id}`);

export const getDoctorsApi = () => API.get("/doctors");

export const getPatientsApi = (params) => API.get("/patients", { params });
