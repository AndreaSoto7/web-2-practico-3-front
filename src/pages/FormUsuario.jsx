import axios from "axios";
import { useEffect } from "react";
import Menu from "../components/Menu";
import { useNavigate, useParams } from "react-router";
import Input from "../components/Input";
import Button from "../components/Button";
import Container from "../components/Container";
import moment from "moment";
import { getToken } from "../utils/TokenUtilities";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const userSchema = yup.object({
    email: yup.string().email("Email inválido").required("El email es requerido"),
    password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
    nombre: yup.string().required("El nombre es requerido"),
    apellido: yup.string().required("El apellido es requerido"),
    edad: yup.number().typeError('La edad debe ser un número').positive("La edad debe ser un número positivo").integer("La edad debe ser un número entero").required("La edad es requerida"),
    ciudad: yup.string().required("La ciudad es requerida"),
    fechaNacimiento: yup.string().required("La fecha de nacimiento es requerida").matches(/^\d{4}-\d{2}-\d{2}$/, "La fecha de nacimiento debe tener el formato YYYY-MM-DD"),
}).required();

const FormUsuario = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userSchema),
        mode: "onChange"
    })

    useEffect(() => {
        if (!id) {
            return;
        }
        const fetchUserById = (id) => {
            axios.get(`http://localhost:3000/personas/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
                .then((response) => {
                    const persona = response.data;
                    setValue("email", persona.usuario.email);
                    setValue("nombre", persona.nombre);
                    setValue("apellido", persona.apellido);
                    setValue("edad", persona.edad);
                    setValue("ciudad", persona.ciudad);
                    setValue("fechaNacimiento", moment.utc(persona.fechaNacimiento).format('YYYY-MM-DD'));
                });
        };
        fetchUserById(id);
    }, [id, setValue]);

    const registerUser = (data) => {
        axios.post("http://localhost:3000/auth/register", {
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad,
            ciudad: data.ciudad,
            fechaNacimiento: data.fechaNacimiento,
            email: data.email,
            password: data.password
        }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                console.log('Usuario creado:', response.data);
                navigate('/');
            })
            .catch((error) => {
                console.error('Error al crear el usuario:', error);
                alert('Error al crear el usuario');
            });
    }
    const updateUser = (data) => {
        axios.put(`http://localhost:3000/auth/update/${id}`, {
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad,
            ciudad: data.ciudad,
            fechaNacimiento: data.fechaNacimiento,
            email: data.email
        }, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                console.log('Usuario actualizado:', response.data);
                navigate('/');
            })
            .catch((error) => {
                console.error('Error al actualizar el usuario:', error);
                alert('Error al actualizar el usuario');
            });
    }
    const onFormUsuarioSubmitted = (data) => {
        console.log('Usuario Enviado:', data);
        if (id) {
            updateUser(data);
        } else {
            registerUser(data);
        }

    }
    return (
        <>
            <Menu />
            <Container>

                <h1 className="text-xl">Formulario de Usuario</h1>
                <form onSubmit={handleSubmit(onFormUsuarioSubmitted)} noValidate className="w-xs">
                    <div>
                        <label htmlFor="email">Email:</label>
                        <Input type="email" id="email" name="email"
                            {...register("email")}
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}

                    </div>
                    {!id && (
                        <div>
                            <label htmlFor="password">Password:</label>
                            <Input type="password" id="password"
                                {...register("password")}
                            />
                            {errors.password && <span className="error">{errors.password.message}</span>}
                        </div>
                    )}
                    <div>
                        <label htmlFor="nombre">Nombre:</label>
                        <Input type="text" id="nombre"
                            {...register("nombre")}
                        />
                        {errors.nombre && <span className="error">{errors.nombre.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="apellido">Apellido:</label>
                        <Input type="text" id="apellido"
                            {...register("apellido")}
                        />
                        {errors.apellido && <span className="error">{errors.apellido.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="edad">Edad:</label>
                        <Input type="number" id="edad"
                            {...register("edad")}

                        />
                        {errors.edad && <span className="error">{errors.edad.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="ciudad">Ciudad:</label>
                        <Input type="text" id="ciudad"
                            {...register("ciudad")}
                        />
                        {errors.ciudad && <span className="error">{errors.ciudad.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
                        <Input type="date" id="fechaNacimiento"
                            {...register("fechaNacimiento")}

                        />
                        {errors.fechaNacimiento && <span className="error">{errors.fechaNacimiento.message}</span>}
                    </div>
                    <Button variant="primary" type="submit">Enviar</Button>
                </form>
            </Container>
        </>
    );
}

export default FormUsuario;
