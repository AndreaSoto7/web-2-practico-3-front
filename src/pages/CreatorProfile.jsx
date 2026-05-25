import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import * as yup from "yup";
import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Menu from "../components/Menu";
import { getErrorMessage } from "../services/api";
import { creadorService } from "../services/creadorService";
import { donacionService } from "../services/donacionService";
import { favoritoService } from "../services/favoritoService";
import { publicacionService } from "../services/publicacionService";

const donacionSchema = yup.object({
    cantidadFlanes: yup.number().typeError("Debe ser un numero").integer().min(1).required("La cantidad es requerida"),
});

const CreatorProfile = () => {
    const { id } = useParams();
    const [creador, setCreador] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [bloqueado, setBloqueado] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [comentarios, setComentarios] = useState({});
    const form = useForm({ resolver: yupResolver(donacionSchema), defaultValues: { cantidadFlanes: 1 }, mode: "onChange" });

    const loadProfile = () => {
        creadorService.getById(id).then(setCreador).catch((error) => alert(getErrorMessage(error)));
        publicacionService.byCreator(id)
            .then((data) => {
                setPublicaciones(data);
                setBloqueado(false);
            })
            .catch((error) => {
                setPublicaciones([]);
                setBloqueado(error.response?.status === 403);
            });
    };

    useEffect(() => {
        creadorService.getById(id).then(setCreador).catch((error) => alert(getErrorMessage(error)));
        publicacionService.byCreator(id)
            .then((data) => {
                setPublicaciones(data);
                setBloqueado(false);
            })
            .catch((error) => {
                setPublicaciones([]);
                setBloqueado(error.response?.status === 403);
            });
    }, [id]);

    const donar = (data) => {
        donacionService.create({ creadorId: Number(id), cantidadFlanes: Number(data.cantidadFlanes) })
            .then(() => {
                setMensaje("Donacion registrada. Ya puedes ver sus publicaciones.");
                loadProfile();
            })
            .catch((error) => alert(getErrorMessage(error)));
    };

    const addFavorite = () => {
        favoritoService.add(id)
            .then(() => setMensaje("Creador marcado como favorito"))
            .catch((error) => alert(getErrorMessage(error)));
    };

    const changeComentario = (publicacionId, value) => {
        setComentarios((prev) => ({ ...prev, [publicacionId]: value }));
    };

    const comment = (event, publicacionId) => {
        event.preventDefault();
        const texto = comentarios[publicacionId]?.trim();
        if (!texto) return;
        publicacionService.comment(publicacionId, { texto })
            .then(() => {
                setComentarios((prev) => ({ ...prev, [publicacionId]: "" }));
                loadProfile();
            })
            .catch((error) => alert(getErrorMessage(error)));
    };

    return (
        <>
            <Menu />
            <Container>
                {!creador && <p>Cargando perfil...</p>}
                {creador && (
                    <>
                        <div className="overflow-hidden rounded-md border border-gray-200">
                            <div className="h-44 bg-gray-200">
                                {creador.bannerUrl && <img src={creador.bannerUrl} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div className="p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                                            {creador.fotoPerfilUrl && <img src={creador.fotoPerfilUrl} alt="" className="h-full w-full object-cover" />}
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-semibold text-gray-900">{creador.nombrePublico}</h1>
                                            <p className="text-sm text-gray-600">{creador.biografia}</p>
                                        </div>
                                    </div>
                                    <Button variant="primary" onClick={addFavorite}>Favorito</Button>
                                </div>
                            </div>
                        </div>

                        {mensaje && <p className="mt-4 text-sm text-blue-700">{mensaje}</p>}

                        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <section>
                                <h2 className="text-xl font-semibold">Metas de apoyo</h2>
                                <div className="mt-3 grid gap-3">
                                    {(creador.metas || []).map((meta) => (
                                        <article key={meta.id} className="rounded-md border border-gray-200 p-4">
                                            <h3 className="font-semibold">{meta.titulo}</h3>
                                            <p className="text-sm text-gray-600">{meta.descripcion}</p>
                                        </article>
                                    ))}
                                </div>

                                <h2 className="mt-8 text-xl font-semibold">Publicaciones</h2>
                                {bloqueado && <p className="mt-3 text-gray-600">Debes enviar al menos un flan para ver las publicaciones.</p>}
                                <div className="mt-3 space-y-4">
                                    {publicaciones.map((publicacion) => (
                                        <article key={publicacion.id} className="rounded-md border border-gray-200 p-4">
                                            {publicacion.imagenUrl && <img src={publicacion.imagenUrl} alt="" className="mb-3 max-h-80 w-full rounded-md object-cover" />}
                                            <p>{publicacion.texto}</p>
                                            <form onSubmit={(event) => comment(event, publicacion.id)} className="mt-3 flex flex-col gap-2 sm:flex-row">
                                                <Input
                                                    aria-label="Comentario para el creador"
                                                    placeholder="Comentario para el creador"
                                                    value={comentarios[publicacion.id] || ""}
                                                    onChange={(event) => changeComentario(publicacion.id, event.target.value)}
                                                />
                                                <Button variant="primary" type="submit" className="my-0 sm:w-auto">
                                                    Comentar
                                                </Button>
                                            </form>
                                        </article>
                                    ))}
                                </div>
                            </section>

                            <aside className="rounded-md border border-gray-200 p-4">
                                <h2 className="text-xl font-semibold">Enviar flanes</h2>
                                <p className="mt-2 text-sm text-gray-600">Cada flan equivale a Bs 10.</p>
                                <form onSubmit={form.handleSubmit(donar)} noValidate className="mt-4 space-y-3">
                                    <Input type="number" min="1" {...form.register("cantidadFlanes")} />
                                    {form.formState.errors.cantidadFlanes && <span className="error">{form.formState.errors.cantidadFlanes.message}</span>}
                                    <Button variant="primary" type="submit">Donar</Button>
                                </form>
                                <Link to="/creadores" className="mt-3 inline-block text-sm text-blue-700">Volver a creadores</Link>
                            </aside>
                        </div>
                    </>
                )}
            </Container>
        </>
    );
};

export default CreatorProfile;
