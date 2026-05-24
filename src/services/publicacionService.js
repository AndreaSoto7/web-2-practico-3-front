import api from "./api";

export const publicacionService = {
    feed: () => api.get("/publicaciones/feed").then((response) => response.data),
    mis: () => api.get("/publicaciones/mis").then((response) => response.data),
    byCreator: (creadorId) => api.get(`/publicaciones/creador/${creadorId}`).then((response) => response.data),
    create: (data) => api.post("/publicaciones", data).then((response) => response.data),
    update: (id, data) => api.put(`/publicaciones/${id}`, data).then((response) => response.data),
    remove: (id) => api.delete(`/publicaciones/${id}`).then((response) => response.data),
    comment: (id, data) => api.post(`/publicaciones/${id}/comentarios`, data).then((response) => response.data),
};
