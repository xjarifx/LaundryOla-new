const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/response");

// Registration is handled in authController with full validation and password hashing

exports.getProfile = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM view_customer_complete WHERE customer_id = ?",
      [req.user.id]
    );
    res.json(success(result[0]));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const [result] = await db.query('CALL sp_get_dashboard("CUSTOMER", ?)', [
      req.user.id,
    ]);
    res.json({
      success: true,
      profile: result[0][0],
      recent_orders: result[1],
    });
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const [result] = await db.query(
      "CALL sp_update_customer_profile(?, ?, ?, ?)",
      [req.user.id, name, phone, address]
    );
    res.json(success(result[0][0], "Profile updated successfully"));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.addMoney = async (req, res) => {
  const { amount } = req.body;
  try {
    const [result] = await db.query("CALL sp_add_money(?, ?)", [
      req.user.id,
      amount,
    ]);
    res.json(success(null, result[0][0].message));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.getBalance = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT wallet_balance FROM Customers WHERE customer_id = ?",
      [req.user.id]
    );
    res.json(success(result[0]));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM view_wallet_transactions WHERE customer_id = ? LIMIT 20",
      [req.user.id]
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.getTransactionsLimited = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const [result] = await db.query(
      "SELECT * FROM view_wallet_transactions WHERE customer_id = ? LIMIT ?",
      [req.user.id, limit]
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM view_all_orders WHERE customer_id = ? ORDER BY order_datetime DESC",
      [req.user.id]
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};
