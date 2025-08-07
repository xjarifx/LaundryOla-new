const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/response");

exports.customerRegister = async (req, res) => {
  const { name, phone, email, password, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS || "10")
    );

    const [result] = await db.query(
      "CALL sp_register_customer(?, ?, ?, ?, ?)",
      [name, phone, email, hashedPassword, address]
    );

    // Generate JWT token for immediate login after registration
    const customerId = result[0][0].customer_id;
    const token = jwt.sign(
      { id: customerId, type: "customer", email: email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json(
      success({
        message: "Customer registered successfully",
        token,
        customer: {
          id: customerId,
          name,
          phone,
          email,
          address,
          wallet_balance: 0.0,
        },
      })
    );
  } catch (err) {
    if (err.message.includes("Duplicate entry")) {
      return res.status(409).json(error("Email already exists", 409));
    }
    res.status(400).json(error(err.message));
  }
};

exports.customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Get customer data by email only
    const [result] = await db.query("CALL sp_customer_login(?)", [email]);

    if (!result[0] || result[0].length === 0) {
      return res.status(401).json(error("Invalid credentials", 401));
    }

    const customer = result[0][0];

    // Compare plain text password with hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch) {
      return res.status(401).json(error("Invalid credentials", 401));
    }

    // Remove password from response data
    const { password: _, ...customerData } = customer;

    // Generate JWT token
    const token = jwt.sign(
      { id: customer.customer_id, type: "customer", email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json(
      success({
        message: "Login successful",
        token,
        customer: customerData,
      })
    );
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.employeeRegister = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS || "10")
    );

    const [result] = await db.query("CALL sp_register_employee(?, ?, ?, ?)", [
      name,
      phone,
      email,
      hashedPassword,
    ]);

    // Generate JWT token for immediate login after registration
    const employeeId = result[0][0].employee_id;
    const token = jwt.sign(
      { id: employeeId, type: "employee", email: email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json(
      success({
        message: "Employee registered successfully",
        token,
        employee: {
          id: employeeId,
          name,
          phone,
          email,
          total_earnings: 0.0,
        },
      })
    );
  } catch (err) {
    if (err.message.includes("Duplicate entry")) {
      return res.status(409).json(error("Email already exists", 409));
    }
    res.status(400).json(error(err.message));
  }
};

exports.employeeLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Get employee data by email only
    const [result] = await db.query("CALL sp_employee_login(?)", [email]);

    if (!result[0] || result[0].length === 0) {
      return res.status(401).json(error("Invalid credentials", 401));
    }

    const employee = result[0][0];

    // Compare plain text password with hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, employee.password);

    if (!passwordMatch) {
      return res.status(401).json(error("Invalid credentials", 401));
    }

    // Remove password from response data
    const { password: _, ...employeeData } = employee;

    // Generate JWT token
    const token = jwt.sign(
      { id: employee.employee_id, type: "employee", email: employee.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json(
      success({
        message: "Login successful",
        token,
        employee: employeeData,
      })
    );
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.logout = (req, res) => {
  // Token blacklist can be implemented if needed
  res.json(success(null, "Logged out successfully"));
};
