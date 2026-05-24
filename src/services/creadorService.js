import api from "./api";

export const creadorService = {
    list: (q = "") => api.get("/creadores", { params: q ? { q } : {} }).then((response) => response.data),
    getById: (id) => api.get(`/creadores/${id}`).then((response) => response.data),
    panel: () => api.get("/creadores/me/panel").then((response) => response.data),
    ingresos: () => api.get("/creadores/me/ingresos").then((response) => response.data),
    createPerfil: (data) => api.post("/creadores/perfil", data).then((response) => response.data),
    updatePerfil: (data) => api.put("/creadores/perfil", data).then((response) => response.data),
};
