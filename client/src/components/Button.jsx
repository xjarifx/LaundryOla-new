import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
    secondary:
      "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-300",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-300",
    warning:
      "text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300",
    outline:
      "text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-300",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
    xl: "px-6 py-3 text-lg",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
