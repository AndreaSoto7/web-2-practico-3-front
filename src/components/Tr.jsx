const Tr = (params) => {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50" {...params}>
            {params.children}
        </tr>
    );
}

export default Tr;