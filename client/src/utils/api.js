import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with base configuration
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  registerCustomer: (data) =>
    API.post("/auth/register/customer", data).then((res) => res.data),

  registerEmployee: (data) =>
    API.post("/auth/register/employee", data).then((res) => res.data),

  loginCustomer: (data) =>
    API.post("/auth/login/customer", data).then((res) => res.data),

  loginEmployee: (data) =>
    API.post("/auth/login/employee", data).then((res) => res.data),
};

// Customer API
export const customerApi = {
  getProfile: () => API.get("/customers/profile").then((res) => res.data),

  updateProfile: (data) =>
    API.put("/customers/profile", data).then((res) => res.data),

  addMoney: (data) =>
    API.post("/customers/wallet/add", data).then((res) => res.data),

  getOrders: () => API.get("/customers/orders").then((res) => res.data),

  getTransactions: () =>
    API.get("/customers/transactions").then((res) => res.data),
};

// Employee API
export const employeeApi = {
  getProfile: () => API.get("/employees/profile").then((res) => res.data),

  updateProfile: (data) =>
    API.put("/employees/profile", data).then((res) => res.data),

  getOrders: () => API.get("/employees/orders").then((res) => res.data),
};

// Order API
export const orderApi = {
  placeOrder: (data) => API.post("/orders", data).then((res) => res.data),

  getPendingOrders: () => API.get("/orders/pending").then((res) => res.data),

  manageOrder: (orderId, action) =>
    API.put(`/orders/${orderId}/manage`, { action }).then((res) => res.data),
};

// Service API
export const serviceApi = {
  getServices: () => API.get("/services").then((res) => res.data),

  createService: (data) => API.post("/services", data).then((res) => res.data),

  updateService: (serviceId, data) =>
    API.put(`/services/${serviceId}`, data).then((res) => res.data),

  deleteService: (serviceId) =>
    API.delete(`/services/${serviceId}`).then((res) => res.data),
};

export default API;
