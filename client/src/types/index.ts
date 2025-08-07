// Type definitions based on API documentation

export interface CustomerProfile {
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  wallet_balance: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  lifetime_spent: number;
  last_order_date: string;
}

export interface EmployeeProfile {
  employee_id: number;
  name: string;
  phone: string;
  email: string;
  earnings_balance: number;
  total_orders_handled: number;
  completed_orders: number;
  in_progress_orders: number;
}

export interface Service {
  service_id: number;
  service_name: string;
  price_per_item: number;
}

export interface Order {
  order_id: number;
  customer_id: number;
  service_id: number;
  employee_id?: number;
  quantity: number;
  total_amount: number;
  order_status: OrderStatus;
  order_date: string;
  completion_date?: string;
  service_name?: string;
  customer_name?: string;
  employee_name?: string;
}

export interface Transaction {
  transaction_id: number;
  customer_id: number;
  transaction_type: "DEBIT" | "CREDIT";
  amount: number;
  transaction_date: string;
  description: string;
}

export type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Completed";
export type UserRole = "CUSTOMER" | "EMPLOYEE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  address?: string; // Only for customers
}

export interface RegisterCustomerForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
}

export interface RegisterEmployeeForm {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  code?: number;
}
