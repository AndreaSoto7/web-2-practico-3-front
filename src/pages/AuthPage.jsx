import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as yup from "yup";
import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Menu from "../components/Menu";
import { authService } from "../services/authService";
import { getErrorMessage } from "../services/api";
import { saveToken } from "../utils/TokenUtilities";

const loginSchema = yup.object({
    email: yup.string().email("Email invalido").required("El email es requerido"),
    password: yup.string().required("La contrasena es requerida"),
});

const registerSchema = yup.object({
    email: yup.string().email("Email invalido").required("El email es requerido"),
    password: yup.string().min(6, "La contrasena debe tener al menos 6 caracteres").required("La contrasena es requerida"),
    rol: yup.string().oneOf(["creador", "seguidor"]).required("El rol es requerido"),
});

const AuthPage = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const form = useForm({
        resolver: yupResolver(isRegister ? registerSchema : loginSchema),
        defaultValues: { rol: "seguidor" },
        mode: "onChange",
    });

    const goHomeByRole = (user) => {
        navigate(user.rol === "creador" ? "/creador" : "/feed");
    };

    const onLogin = (data) => {
        authService.login(data.email, data.password)
            .then((response) => {
                saveToken(response.token);
                return authService.me();
            })
            .then(goHomeByRole)
            .catch((error) => alert(getErrorMessage(error)));
    };

    const onRegister = (data) => {
        authService.register(data.email, data.password, data.rol)
            .then(() => authService.login(data.email, data.password))
            .then((response) => {
                saveToken(response.token);
                return authService.me();
            })
            .then(goHomeByRole)
            .catch((error) => alert(getErrorMessage(error)));
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        form.reset({ email: "", password: "", rol: "seguidor" });
    };

    const onSubmit = (data) => {
        if (isRegister) {
            onRegister(data);
        } else {
            onLogin(data);
        }
    };

    return (
        <>
            <Menu />
            <Container>
                <section className="mx-auto max-w-md">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isRegister ? "Crear cuenta" : "Iniciar sesion"}
                    </h1>
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="email">Email</label>
                            <Input id="email" type="email" {...form.register("email")} />
                            {form.formState.errors.email && <span className="error">{form.formState.errors.email.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password">Contrasena</label>
                            <Input id="password" type="password" {...form.register("password")} />
                            {form.formState.errors.password && <span className="error">{form.formState.errors.password.message}</span>}
                        </div>
                        {isRegister && (
                            <div>
                                <label htmlFor="rol">Rol</label>
                                <select id="rol" className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" {...form.register("rol")}>
                                    <option value="seguidor">Seguidor</option>
                                    <option value="creador">Creador</option>
                                </select>
                                {form.formState.errors.rol && <span className="error">{form.formState.errors.rol.message}</span>}
                            </div>
                        )}
                        <Button variant="primary" type="submit">
                            {isRegister ? "Registrarme" : "Ingresar"}
                        </Button>
                    </form>

                    <p className="mt-4 text-sm text-gray-600">
                        {isRegister ? "Ya tienes una cuenta?" : "No tienes una cuenta?"}{" "}
                        <button type="button" onClick={toggleMode} className="font-medium text-blue-700 hover:text-blue-800 cursor-pointer">
                            {isRegister ? "Inicia sesion aqui" : "Registrate aqui"}
                        </button>
                    </p>
                </section>
            </Container>
        </>
    );
};

export default AuthPage;
