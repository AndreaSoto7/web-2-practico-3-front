import axios from "axios";
import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import Table from "../components/Table";
import Th from "../components/Th";
import Tr from "../components/Tr";
import Container from "../components/Container";
import Td from "../components/Td";
import TrHeader from "../components/TrHeader";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import moment from "moment";
import { getToken } from "../utils/TokenUtilities";

const PersonaList = () => {
    const [personas, setPersonas] = useState([]);

    const navigate = useNavigate();


    const fetchPersonas = () => {
        axios.get("http://localhost:3000/personas", {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((response) => {
                console.log(response.data);
                setPersonas(response.data);
            });
    }
    //hooks
    useEffect(() => {
        fetchPersonas();
    }, []);
    const onEditarClick = (persona) => {
        console.log('Editar persona', persona);
        navigate(`/personas/${persona.id}`);
    }
    const onEliminarClick = (persona) => {
        console.log('Eliminar persona', persona);
        const confirm = window.confirm(`¿Estás seguro de eliminar a ${persona.nombre} ${persona.apellido}?`);
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/auth/${persona.id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then(() => {
                fetchPersonas();
            })
            .catch((error) => {
                console.error('Error al eliminar la persona:', error);
                alert('Error al eliminar la persona');
            });
    }
    return (
        <>
            <Menu />
            <Container>
                {personas.length === 0 ? <p>No hay personas registradas</p> :
                    (<Table>
                        <thead>
                            <TrHeader>
                                <Th>Id</Th>
                                <Th>Nombre</Th>
                                <Th>Apellido</Th>
                                <Th>Edad</Th>
                                <Th>Ciudad</Th>
                                <Th>Fecha de nacimiento</Th>
                                <Th>Usuario</Th>
                                <Th></Th>
                                <Th></Th>
                            </TrHeader>
                        </thead>
                        <tbody>
                            {personas.map((persona) => (
                                <Tr key={persona.id}>
                                    <Td>{persona.id}</Td>
                                    <Td>{persona.nombre}</Td>
                                    <Td>{persona.apellido}</Td>
                                    <Td>{persona.edad}</Td>
                                    <Td>{persona.ciudad}</Td>
                                    <Td>{moment.utc(persona.fechaNacimiento).format('DD/MM/YYYY')}</Td>
                                    <Td>{persona.usuario.email}</Td>
                                    <Td><Button variant="primary" onClick={() => { onEditarClick(persona) }}>Editar</Button></Td>
                                    <Td><Button variant="danger" onClick={() => { onEliminarClick(persona) }}>Eliminar</Button></Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>)
                }
            </Container>
        </>
    );
}



export default PersonaList;