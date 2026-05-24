import api from "./api";

export const authService = {
    register: (email, password, rol) => api.post("/auth/register", { email, password, rol }).then((response) => response.data),
    login: (email, password) => api.post("/auth/login", { email, password }).then((response) => response.data),
    logout: () => api.post("/auth/logout").then((response) => response.data),
    me: () => api.get("/auth/me").then((response) => response.data),
};
