const Mensaje = ({ texto }) => {
    return (<div>{texto ?? "Mensaje por defecto"}</div>);
}

export default Mensaje;