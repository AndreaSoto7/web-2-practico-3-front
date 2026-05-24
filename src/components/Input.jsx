const Input = ({ className, ...props }) => {
    return (
        <input
            className={className + " " +
                "block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"}
            {...props}
        />
    );
}

export default Input;