import { useEffect, useState } from "react";
import { Link } from "react-router";
import Button from "../components/Button";
import Container from "../components/Container";
import Menu from "../components/Menu";
import { getErrorMessage } from "../services/api";
import { favoritoService } from "../services/favoritoService";

const FavoritesPage = () => {
    const [favoritos, setFavoritos] = useState([]);

    const loadFavoritos = () => {
        favoritoService.list().then(setFavoritos).catch((error) => alert(getErrorMessage(error)));
    };

    useEffect(() => {
        loadFavoritos();
    }, []);

    const removeFavorite = (creadorId) => {
        favoritoService.remove(creadorId).then(loadFavoritos).catch((error) => alert(getErrorMessage(error)));
    };

    return (
        <>
            <Menu />
            <Container>
                <h1 className="text-2xl font-semibold text-gray-900">Favoritos</h1>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favoritos.map((favorito) => (
                        <article key={favorito.id} className="rounded-md border border-gray-200 p-4">
                            <h2 className="text-lg font-semibold">{favorito.perfilCreador?.nombrePublico}</h2>
                            <p className="mt-2 text-sm text-gray-600">{favorito.perfilCreador?.biografia || "Sin biografia"}</p>
                            <div className="mt-3 flex gap-2">
                                <Link className="inline-flex items-center text-sm font-medium text-blue-700" to={`/creadores/${favorito.perfilCreadorId}`}>
                                    Ver perfil
                                </Link>
                                <Button variant="danger" onClick={() => removeFavorite(favorito.perfilCreadorId)}>Quitar</Button>
                            </div>
                        </article>
                    ))}
                    {favoritos.length === 0 && <p>No tienes creadores favoritos.</p>}
                </div>
            </Container>
        </>
    );
};

export default FavoritesPage;
