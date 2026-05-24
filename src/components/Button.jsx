
const Button = ({
    type = "button",
    className = "",
    variant,
    children,
    ...props
}) => {
    const getVariantColor = (variant) => {
        switch (variant) {
            case "primary":
                return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
            case "danger":
                return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            default:
                return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
        }
    };

    return (
        <button
            type={type}
            className={`
                cursor-pointer
                my-2
        inline-flex items-center justify-center
        px-4 py-2
        text-sm font-medium text-white
        ${getVariantColor(variant)}
        border border-transparent
        rounded-md
        shadow-sm
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;