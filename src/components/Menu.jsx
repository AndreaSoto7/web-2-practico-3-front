import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";

const NavItem = ({ href, children }) => {
    return (
        <NavLink
            to={href}
            className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md ${isActive ? "bg-blue-700 text-white" : "text-blue-50 hover:bg-blue-500"}`
            }
        >
            {children}
        </NavLink>
    );
};

const Menu = () => {
    const { token, user, logout } = useAuth();
    const homePath = user?.rol === "creador" ? "/creador" : "/feed";

    return (
        <nav className="bg-blue-600 border-b border-blue-700 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <NavLink to={token ? homePath : "/"} className="text-xl font-semibold text-white">
                        OnlyFlans
                    </NavLink>

                    <div className="flex flex-wrap items-center gap-2">
                        {token && user?.rol === "creador" && (
                            <NavItem href="/creador">Panel creador</NavItem>
                        )}
                        {token && user?.rol === "seguidor" && (
                            <>
                                <NavItem href="/feed">Feed</NavItem>
                                <NavItem href="/creadores">Creadores</NavItem>
                                <NavItem href="/favoritos">Favoritos</NavItem>
                                <NavItem href="/donaciones">Donaciones</NavItem>
                            </>
                        )}
                        {!token && <NavItem href="/">Ingresar</NavItem>}
                        {token && (
                            <button
                                onClick={logout}
                                className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-500 cursor-pointer"
                            >
                                Cerrar sesion
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Menu;
