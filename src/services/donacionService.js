import api from "./api";

export const donacionService = {
    create: (data) => api.post("/donaciones", data).then((response) => response.data),
    historial: (filters) => api.get("/donaciones/historial", { params: filters }).then((response) => response.data),
};
