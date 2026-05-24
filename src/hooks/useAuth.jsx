import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../services/authService";
import { getToken, removeToken } from "../utils/TokenUtilities";

export const useAuth = () => {
    const token = getToken();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(Boolean(token));
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            return;
        }

        authService.me()
            .then((response) => {
                setUser(response);
            })
            .catch(() => {
                removeToken();
                navigate("/");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, navigate]);

    const logout = () => {
        authService.logout().catch(() => {});
        removeToken();
        setUser(null);
        navigate("/");
    };

    return { user, token, loading, logout };
};
