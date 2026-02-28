import API from "./axios";

export const getDashboardStatsApi = () => API.get("/stats");
