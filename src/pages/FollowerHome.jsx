import { useEffect, useState } from "react";
import { Link } from "react-router";
import Container from "../components/Container";
import Menu from "../components/Menu";
import { getErrorMessage } from "../services/api";
import { publicacionService } from "../services/publicacionService";

const FollowerHome = () => {
    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        publicacionService.feed()
            .then(setPublicaciones)
            .catch((error) => alert(getErrorMessage(error)));
    }, []);

    return (
        <>
            <Menu />
            <Container>
                <h1 className="text-2xl font-semibold text-gray-900">Feed</h1>
                <p className="text-sm text-gray-600">Publicaciones de creadores a los que ya apoyaste.</p>

                <div className="mt-6 space-y-4">
                    {publicaciones.map((publicacion) => (
                        <article key={publicacion.id} className="rounded-md border border-gray-200 p-4">
                            <Link to={`/creadores/${publicacion.perfilCreadorId}`} className="font-semibold text-blue-700">
                                {publicacion.perfilCreador?.nombrePublico}
                            </Link>
                            {publicacion.imagenUrl && <img src={publicacion.imagenUrl} alt="" className="my-3 max-h-96 w-full rounded-md object-cover" />}
                            <p>{publicacion.texto}</p>
                        </article>
                    ))}
                    {publicaciones.length === 0 && (
                        <p>
                            Todavia no tienes publicaciones en el feed. <Link to="/creadores" className="text-blue-700">Explora creadores</Link> y envia un flan para desbloquearlas.
                        </p>
                    )}
                </div>
            </Container>
        </>
    );
};

export default FollowerHome;
