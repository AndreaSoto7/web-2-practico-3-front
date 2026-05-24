import { useEffect, useState } from "react";
import Container from "../components/Container";
import Input from "../components/Input";
import Menu from "../components/Menu";
import Button from "../components/Button";
import { getErrorMessage } from "../services/api";
import { donacionService } from "../services/donacionService";

const DonationHistory = () => {
    const [donaciones, setDonaciones] = useState([]);
    const [filters, setFilters] = useState({
        fechaInicio: "",
        fechaFin: "",
        creador: "",
    });

    const loadHistorial = () => {
        const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
        donacionService.historial(params).then(setDonaciones).catch((error) => alert(getErrorMessage(error)));
    };

    useEffect(() => {
        donacionService.historial({})
            .then(setDonaciones)
            .catch((error) => alert(getErrorMessage(error)));
    }, []);

    const updateFilter = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.value });
    };

    return (
        <>
            <Menu />
            <Container>
                <h1 className="text-2xl font-semibold text-gray-900">Historial de donaciones</h1>
                <form onSubmit={(event) => { event.preventDefault(); loadHistorial(); }} className="mt-4 grid gap-4 md:grid-cols-4">
                    <div>
                        <label htmlFor="fechaInicio">Fecha inicio</label>
                        <Input id="fechaInicio" name="fechaInicio" type="date" value={filters.fechaInicio} onChange={updateFilter} />
                    </div>
                    <div>
                        <label htmlFor="fechaFin">Fecha fin</label>
                        <Input id="fechaFin" name="fechaFin" type="date" value={filters.fechaFin} onChange={updateFilter} />
                    </div>
                    <div>
                        <label htmlFor="creador">Creador</label>
                        <Input id="creador" name="creador" value={filters.creador} onChange={updateFilter} />
                    </div>
                    <div className="flex items-end">
                        <Button variant="primary" type="submit">Filtrar</Button>
                    </div>
                </form>

                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left">Fecha</th>
                                <th className="px-3 py-2 text-left">Creador</th>
                                <th className="px-3 py-2 text-left">Flanes</th>
                                <th className="px-3 py-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donaciones.map((donacion) => (
                                <tr key={donacion.id} className="border-t border-gray-200">
                                    <td className="px-3 py-2">{new Date(donacion.createdAt).toLocaleDateString()}</td>
                                    <td className="px-3 py-2">{donacion.perfilCreador?.nombrePublico}</td>
                                    <td className="px-3 py-2">{donacion.cantidadFlanes}</td>
                                    <td className="px-3 py-2">Bs {donacion.cantidadFlanes * donacion.montoUnitario}</td>
                                </tr>
                            ))}
                            {donaciones.length === 0 && (
                                <tr>
                                    <td className="px-3 py-4" colSpan="4">No hay donaciones con esos filtros.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    );
};

export default DonationHistory;
