const TrHeader = ({ children }) => {
    return (
        <tr className="bg-black border-b border-gray-300">
            {children}
        </tr>
    );
}

export default TrHeader;