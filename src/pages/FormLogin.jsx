import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Menu from "../components/Menu";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { authService } from "../services/authService";
import { saveToken } from "../utils/TokenUtilities";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

const loginSchema = yup.object({
    email: yup.string().email("Email inválido").required("El email es requerido"),
    password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
}).required();

const FormLogin = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange" // Validación en tiempo real
    })


    const onFormLoginSubmitted = (data) => {
        console.log(data);
        authService.login(data.email, data.password)
            .then((response) => {
                saveToken(response.token);
                navigate('/personas');
            })
            .catch((error) => {
                alert("Error al iniciar sesión: " + error.response.data.message);
            });
    }
    return (
        <>
            <Menu />
            <Container>

                <h1 className="text-xl">Iniciar sesión</h1>
                <form onSubmit={handleSubmit(onFormLoginSubmitted)} noValidate className="w-xs">
                    <div>
                        <label htmlFor="email">Email:</label>
                        <Input type="email" id="email"
                            {...register("email")}
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <Input type="password" id="password"
                            aria-invalid={errors.password ? "true" : "false"}
                            {...register("password")}
                        />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>

                    <Button variant="primary" type="submit">Iniciar sesión</Button>
                </form>
            </Container>
        </>
    );
}

export default FormLogin;