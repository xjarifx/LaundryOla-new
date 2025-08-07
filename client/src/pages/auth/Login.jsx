import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { validateLogin, validateEmail } from "../../utils/validation";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    const errors = validateLogin(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors below");
      setLoading(false);
      return;
    }

    try {
      const endpoint = `/auth/${formData.userType}s/login`;
      const response = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        console.log("Login response:", response.data); // Debug log

        // The actual data is nested inside response.data.data
        const responseData = response.data.data;
        const { token } = responseData;
        const userData =
          formData.userType === "customer"
            ? responseData.customer
            : responseData.employee;

        console.log("Extracted token:", token); // Debug log
        console.log("Extracted userData:", userData); // Debug log

        if (!token) {
          setError("No authentication token received from server");
          return;
        }

        if (!userData) {
          setError("No user data received from server");
          return;
        }

        // Add role to user data for navigation
        const userWithRole = {
          ...userData,
          role: formData.userType.toUpperCase(),
        };

        // Store token and user data WITH role
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userWithRole));

        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Update user state
        setUser(userWithRole);

        setValidationErrors({});

        // Redirect based on user type
        const redirectPath =
          userWithRole.role === "CUSTOMER"
            ? "/customer/dashboard"
            : "/employee/dashboard";
        navigate(redirectPath);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);

      // Handle server validation errors
      if (error.response?.data?.details) {
        const serverErrors = {};
        error.response.data.details.forEach((detail) => {
          const field = detail.path?.[0];
          if (field) {
            serverErrors[field] = detail.message;
          }
        });
        setValidationErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    if (name === "email") {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        const emailError = validateEmail(value);
        if (emailError) newErrors.email = emailError;
        else delete newErrors.email;
        return newErrors;
      });
    }

    if (name === "password") {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (!value) {
          newErrors.password = "Password is required";
        } else {
          delete newErrors.password;
        }
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login as
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={formData.userType === "customer"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Customer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="employee"
                    checked={formData.userType === "employee"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Employee</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none ${
                  validationErrors.email
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : formData.email && !validationErrors.email
                    ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter your email (example: user@domain.com)"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none ${
                    validationErrors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : formData.password && !validationErrors.password
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600" id="password-error">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                formData.userType === "customer"
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to={
                  formData.userType === "customer"
                    ? "/register/customer"
                    : "/register/employee"
                }
                className={`font-medium ${
                  formData.userType === "customer"
                    ? "text-blue-600 hover:text-blue-500"
                    : "text-green-600 hover:text-green-500"
                } transition-colors`}
              >
                Sign up as {formData.userType}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
