import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "../components/Button";
import Container from "../components/Container";
import Input from "../components/Input";
import Menu from "../components/Menu";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";
import { creadorService } from "../services/creadorService";
import { metaService } from "../services/metaService";
import { publicacionService } from "../services/publicacionService";

const perfilSchema = yup.object({
    nombrePublico: yup.string().min(2).required("El nombre publico es requerido"),
    biografia: yup.string().nullable(),
    fotoPerfilUrl: yup.string().url("Debe ser una URL valida").nullable().transform((value) => value || null),
    bannerUrl: yup.string().url("Debe ser una URL valida").nullable().transform((value) => value || null),
});

const metaSchema = yup.object({
    titulo: yup.string().min(2).required("El titulo es requerido"),
    descripcion: yup.string().min(2).required("La descripcion es requerida"),
});

const postSchema = yup.object({
    texto: yup.string().min(1).required("El texto es requerido"),
    imagenUrl: yup.string().url("Debe ser una URL valida").nullable().transform((value) => value || null),
});

const CreatorDashboard = () => {
    const { user, loading } = useAuth();
    const [panel, setPanel] = useState(null);
    const [ingresos, setIngresos] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [ingresosFiltros, setIngresosFiltros] = useState({
        fechaInicio: "",
        fechaFin: "",
    });
    const perfilForm = useForm({ resolver: yupResolver(perfilSchema), mode: "onChange" });
    const metaForm = useForm({ resolver: yupResolver(metaSchema), mode: "onChange" });
    const postForm = useForm({ resolver: yupResolver(postSchema), mode: "onChange" });

    const donacionesFiltradas = (ingresos?.donaciones || []).filter((donacion) => {
        const fechaDonacion = new Date(donacion.createdAt);
        if (ingresosFiltros.fechaInicio) {
            const fechaInicio = new Date(`${ingresosFiltros.fechaInicio}T00:00:00`);
            if (fechaDonacion < fechaInicio) return false;
        }
        if (ingresosFiltros.fechaFin) {
            const fechaFin = new Date(`${ingresosFiltros.fechaFin}T23:59:59`);
            if (fechaDonacion > fechaFin) return false;
        }
        return true;
    });

    const totalFlanesFiltrado = donacionesFiltradas.reduce((total, donacion) => total + donacion.cantidadFlanes, 0);

    const loadPanel = () => {
        creadorService.panel()
            .then((data) => {
                setPanel(data);
                perfilForm.reset({
                    nombrePublico: data.nombrePublico || "",
                    biografia: data.biografia || "",
                    fotoPerfilUrl: data.fotoPerfilUrl || "",
                    bannerUrl: data.bannerUrl || "",
                });
                return creadorService.ingresos();
            })
            .then(setIngresos)
            .catch((error) => {
                setPanel(null);
                setIngresos(null);
                if (error.response?.status !== 404) {
                    setMensaje(getErrorMessage(error));
                }
            });
    };

    useEffect(() => {
        if (!loading && user?.rol === "creador") {
            creadorService.panel()
                .then((data) => {
                    setPanel(data);
                    perfilForm.reset({
                        nombrePublico: data.nombrePublico || "",
                        biografia: data.biografia || "",
                        fotoPerfilUrl: data.fotoPerfilUrl || "",
                        bannerUrl: data.bannerUrl || "",
                    });
                    return creadorService.ingresos();
                })
                .then(setIngresos)
                .catch((error) => {
                    setPanel(null);
                    setIngresos(null);
                    if (error.response?.status !== 404) {
                        setMensaje(getErrorMessage(error));
                    }
                });
        }
    }, [loading, user?.rol, perfilForm]);

    const savePerfil = (data) => {
        const request = panel ? creadorService.updatePerfil(data) : creadorService.createPerfil(data);
        request
            .then(() => {
                setMensaje("Perfil guardado correctamente");
                loadPanel();
            })
            .catch((error) => alert(getErrorMessage(error)));
    };

    const saveMeta = (data) => {
        metaService.create({ ...data, activa: true })
            .then(() => {
                metaForm.reset({ titulo: "", descripcion: "" });
                loadPanel();
            })
            .catch((error) => alert(getErrorMessage(error)));
    };

    const savePost = (data) => {
        publicacionService.create(data)
            .then(() => {
                postForm.reset({ texto: "", imagenUrl: "" });
                loadPanel();
            })
            .catch((error) => alert(getErrorMessage(error)));
    };

    const deletePost = (id) => {
        if (!window.confirm("Eliminar esta publicacion?")) return;
        publicacionService.remove(id).then(loadPanel).catch((error) => alert(getErrorMessage(error)));
    };

    const updateIngresosFiltro = (event) => {
        setIngresosFiltros({
            ...ingresosFiltros,
            [event.target.name]: event.target.value,
        });
    };

    const limpiarIngresosFiltros = () => {
        setIngresosFiltros({ fechaInicio: "", fechaFin: "" });
    };

    if (!loading && user?.rol !== "creador") {
        return (
            <>
                <Menu />
                <Container><p>Esta seccion es solo para creadores.</p></Container>
            </>
        );
    }

    return (
        <>
            <Menu />
            <Container>
                <h1 className="text-2xl font-semibold text-gray-900">Panel del creador</h1>
                {mensaje && <p className="mt-3 text-sm text-blue-700">{mensaje}</p>}

                <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
                    <section>
                        <h2 className="text-xl font-semibold">Perfil publico</h2>
                        <form onSubmit={perfilForm.handleSubmit(savePerfil)} noValidate className="mt-4 grid gap-4">
                            <div>
                                <label htmlFor="nombrePublico">Nombre publico</label>
                                <Input id="nombrePublico" {...perfilForm.register("nombrePublico")} />
                                {perfilForm.formState.errors.nombrePublico && <span className="error">{perfilForm.formState.errors.nombrePublico.message}</span>}
                            </div>
                            <div>
                                <label htmlFor="biografia">Biografia</label>
                                <textarea id="biografia" className="block min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" {...perfilForm.register("biografia")} />
                            </div>
                            <div>
                                <label htmlFor="fotoPerfilUrl">Foto de perfil URL</label>
                                <Input id="fotoPerfilUrl" {...perfilForm.register("fotoPerfilUrl")} />
                                {perfilForm.formState.errors.fotoPerfilUrl && <span className="error">{perfilForm.formState.errors.fotoPerfilUrl.message}</span>}
                            </div>
                            <div>
                                <label htmlFor="bannerUrl">Banner URL</label>
                                <Input id="bannerUrl" {...perfilForm.register("bannerUrl")} />
                                {perfilForm.formState.errors.bannerUrl && <span className="error">{perfilForm.formState.errors.bannerUrl.message}</span>}
                            </div>
                            <Button variant="primary" type="submit">Guardar perfil</Button>
                        </form>
                    </section>

                    <aside className="rounded-md border border-gray-200 p-4">
                        <h2 className="text-xl font-semibold">Reporte de ingresos</h2>
                        <div className="mt-4 grid gap-3">
                            <div>
                                <label htmlFor="ingresos-fecha-inicio">Fecha inicio</label>
                                <Input
                                    id="ingresos-fecha-inicio"
                                    name="fechaInicio"
                                    type="date"
                                    value={ingresosFiltros.fechaInicio}
                                    onChange={updateIngresosFiltro}
                                />
                            </div>
                            <div>
                                <label htmlFor="ingresos-fecha-fin">Fecha final</label>
                                <Input
                                    id="ingresos-fecha-fin"
                                    name="fechaFin"
                                    type="date"
                                    value={ingresosFiltros.fechaFin}
                                    onChange={updateIngresosFiltro}
                                />
                            </div>
                            <Button onClick={limpiarIngresosFiltros}>Limpiar filtros</Button>
                        </div>
                        <p className="mt-5 text-3xl font-semibold">{totalFlanesFiltrado} flanes</p>
                        <p className="text-sm text-gray-600">Total en el rango seleccionado</p>
                        <div className="mt-4 space-y-2">
                            {donacionesFiltradas.length === 0 && (
                                <p className="border-t border-gray-100 pt-2 text-sm text-gray-500">No hay donaciones en esas fechas.</p>
                            )}
                            {donacionesFiltradas.map((donacion) => (
                                <div key={donacion.id} className="border-t border-gray-100 pt-2 text-sm">
                                    <strong>{donacion.cantidadFlanes} flanes</strong> de {donacion.seguidor?.email}
                                    <p className="text-xs text-gray-500">{new Date(donacion.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                {panel && (
                    <div className="mt-10 grid gap-8 lg:grid-cols-2">
                        <section>
                            <h2 className="text-xl font-semibold">Metas de apoyo</h2>
                            <form onSubmit={metaForm.handleSubmit(saveMeta)} noValidate className="mt-4 grid gap-4">
                                <Input placeholder="Titulo" {...metaForm.register("titulo")} />
                                {metaForm.formState.errors.titulo && <span className="error">{metaForm.formState.errors.titulo.message}</span>}
                                <textarea className="block min-h-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Descripcion" {...metaForm.register("descripcion")} />
                                {metaForm.formState.errors.descripcion && <span className="error">{metaForm.formState.errors.descripcion.message}</span>}
                                <Button variant="primary" type="submit">Agregar meta</Button>
                            </form>
                            <div className="mt-4 space-y-3">
                                {(panel.metas || []).map((meta) => (
                                    <article key={meta.id} className="rounded-md border border-gray-200 p-4">
                                        <h3 className="font-semibold">{meta.titulo}</h3>
                                        <p className="text-sm text-gray-600">{meta.descripcion}</p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold">Publicaciones</h2>
                            <form onSubmit={postForm.handleSubmit(savePost)} noValidate className="mt-4 grid gap-4">
                                <textarea className="block min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Texto de la publicacion" {...postForm.register("texto")} />
                                {postForm.formState.errors.texto && <span className="error">{postForm.formState.errors.texto.message}</span>}
                                <Input placeholder="Imagen URL opcional" {...postForm.register("imagenUrl")} />
                                {postForm.formState.errors.imagenUrl && <span className="error">{postForm.formState.errors.imagenUrl.message}</span>}
                                <Button variant="primary" type="submit">Publicar</Button>
                            </form>
                            <div className="mt-4 space-y-4">
                                {(panel.publicaciones || []).map((publicacion) => (
                                    <article key={publicacion.id} className="rounded-md border border-gray-200 p-4">
                                        {publicacion.imagenUrl && <img src={publicacion.imagenUrl} alt="" className="mb-3 max-h-64 w-full rounded-md object-cover" />}
                                        <p>{publicacion.texto}</p>
                                        <div className="mt-3">
                                            <h4 className="text-sm font-semibold">Comentarios</h4>
                                            {(publicacion.comentarios || []).length === 0 && <p className="text-sm text-gray-500">Sin comentarios</p>}
                                            {(publicacion.comentarios || []).map((comentario) => (
                                                <p key={comentario.id} className="mt-1 text-sm text-gray-600">{comentario.seguidor?.email}: {comentario.texto}</p>
                                            ))}
                                        </div>
                                        <Button variant="danger" onClick={() => deletePost(publicacion.id)}>Eliminar</Button>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </Container>
        </>
    );
};

export default CreatorDashboard;
