import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  validateCustomerRegistration,
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validateAddress,
  getInputValidationProps,
} from "../../utils/validation";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    const errors = validateCustomerRegistration(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors below");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/auth/customers/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      });

      if (response.data.success) {
        setSuccess("Registration successful! Please login to continue.");
        setValidationErrors({});
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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
    setValidationErrors((prev) => {
      const newErrors = { ...prev };

      // Clear the error for this field if it becomes valid
      switch (name) {
        case "name":
          const nameError = validateName(value);
          if (nameError) newErrors.name = nameError;
          else delete newErrors.name;
          break;
        case "email":
          const emailError = validateEmail(value);
          if (emailError) newErrors.email = emailError;
          else delete newErrors.email;
          break;
        case "phone":
          const phoneError = validatePhone(value);
          if (phoneError) newErrors.phone = phoneError;
          else delete newErrors.phone;
          break;
        case "password":
          const passwordError = validatePassword(value);
          if (passwordError) newErrors.password = passwordError;
          else delete newErrors.password;

          // Also check confirm password if it exists
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else if (
            formData.confirmPassword &&
            value === formData.confirmPassword
          ) {
            delete newErrors.confirmPassword;
          }
          break;
        case "confirmPassword":
          if (value !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
          break;
        case "address":
          const addressError = validateAddress(value);
          if (addressError) newErrors.address = addressError;
          else delete newErrors.address;
          break;
      }

      return newErrors;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Customer Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join LaundryOla for premium laundry services
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                {...getInputValidationProps(
                  "name",
                  formData.name,
                  validationErrors
                )}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600" id="name-error">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                {...getInputValidationProps(
                  "email",
                  formData.email,
                  validationErrors
                )}
                placeholder="Enter your email (example: user@domain.com)"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                {...getInputValidationProps(
                  "phone",
                  formData.phone,
                  validationErrors
                )}
                placeholder="Enter phone number (digits only, 10-15 characters)"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600" id="phone-error">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none ${
                  validationErrors.address
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : formData.address && !validationErrors.address
                    ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter your complete address"
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600" id="address-error">
                  {validationErrors.address}
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
                  placeholder="Create a password (min 8 characters)"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none ${
                    validationErrors.confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : formData.confirmPassword &&
                        !validationErrors.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p
                  className="mt-1 text-sm text-red-600"
                  id="confirmPassword-error"
                >
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Want to join as an employee?{" "}
              <Link
                to="/register/employee"
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Employee Registration
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;
