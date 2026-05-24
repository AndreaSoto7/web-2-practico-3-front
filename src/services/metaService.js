import api from "./api";

export const metaService = {
    create: (data) => api.post("/metas", data).then((response) => response.data),
    update: (id, data) => api.put(`/metas/${id}`, data).then((response) => response.data),
    remove: (id) => api.delete(`/metas/${id}`).then((response) => response.data),
};
