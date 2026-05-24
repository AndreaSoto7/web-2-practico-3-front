import { useEffect, useState } from "react";
import { Link } from "react-router";
import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Menu from "../components/Menu";
import { getErrorMessage } from "../services/api";
import { creadorService } from "../services/creadorService";

const CreatorsList = () => {
    const [creadores, setCreadores] = useState([]);
    const [q, setQ] = useState("");

    const loadCreadores = () => {
        creadorService.list(q)
            .then(setCreadores)
            .catch((error) => alert(getErrorMessage(error)));
    };

    useEffect(() => {
        creadorService.list()
            .then(setCreadores)
            .catch((error) => alert(getErrorMessage(error)));
    }, []);

    return (
        <>
            <Menu />
            <Container>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Creadores</h1>
                        <p className="text-sm text-gray-600">Listado alfabetico de perfiles publicos.</p>
                    </div>
                    <form onSubmit={(event) => { event.preventDefault(); loadCreadores(); }} className="flex gap-2">
                        <Input placeholder="Buscar por nombre" value={q} onChange={(event) => setQ(event.target.value)} />
                        <Button variant="primary" type="submit">Buscar</Button>
                    </form>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {creadores.map((creador) => (
                        <article key={creador.id} className="rounded-md border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold">{creador.nombrePublico}</h2>
                            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{creador.biografia || "Sin biografia"}</p>
                            <Link className="mt-3 inline-block text-sm font-medium text-blue-700" to={`/creadores/${creador.id}`}>
                                Ver perfil
                            </Link>
                        </article>
                    ))}
                    {creadores.length === 0 && <p>No hay creadores registrados.</p>}
                </div>
            </Container>
        </>
    );
};

export default CreatorsList;
