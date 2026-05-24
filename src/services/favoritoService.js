import api from "./api";

export const favoritoService = {
    list: () => api.get("/favoritos").then((response) => response.data),
    add: (creadorId) => api.post(`/favoritos/${creadorId}`).then((response) => response.data),
    remove: (creadorId) => api.delete(`/favoritos/${creadorId}`).then((response) => response.data),
};
