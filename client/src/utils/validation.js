// Frontend validation utilities

// Email validation - must match xyz@xyz.xyz pattern
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return "Email address is required";
  }

  if (!emailRegex.test(email)) {
    return "Email must be in format xyz@xyz.xyz (example: user@domain.com)";
  }

  return null; // Valid
};

// Phone validation - must be digits only, 10-15 characters
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;

  if (!phone) {
    return "Phone number is required";
  }

  if (!phoneRegex.test(phone)) {
    return "Phone number must contain only digits and be 10-15 characters long";
  }

  return null; // Valid
};

// Name validation
export const validateName = (name) => {
  if (!name) {
    return "Name is required";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (name.length > 50) {
    return "Name cannot exceed 50 characters";
  }

  return null; // Valid
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (password.length > 100) {
    return "Password cannot exceed 100 characters";
  }

  return null; // Valid
};

// Address validation
export const validateAddress = (address) => {
  if (!address) {
    return "Address is required";
  }

  if (address.length < 5) {
    return "Address must be at least 5 characters long";
  }

  if (address.length > 200) {
    return "Address cannot exceed 200 characters";
  }

  return null; // Valid
};

// Validate all form fields for customer registration
export const validateCustomerRegistration = (formData) => {
  const errors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const addressError = validateAddress(formData.address);
  if (addressError) errors.address = addressError;

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

// Validate all form fields for employee registration
export const validateEmployeeRegistration = (formData) => {
  const errors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

// Validate login form
export const validateLogin = (formData) => {
  const errors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  if (!formData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

// Real-time input validation for better UX
export const getInputValidationProps = (fieldName, value, errors) => {
  const hasError = errors[fieldName];
  const isValid = value && !hasError;

  return {
    className: `block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none ${
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : isValid
        ? "border-green-300 focus:ring-green-500 focus:border-green-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    }`,
    "aria-invalid": hasError ? "true" : "false",
    "aria-describedby": hasError ? `${fieldName}-error` : undefined,
  };
};
