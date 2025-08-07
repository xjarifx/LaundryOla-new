const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.placeOrder = async (req, res) => {
  const { service_id, quantity } = req.body;
  try {
    const [result] = await db.query("CALL sp_place_order(?, ?, ?)", [
      req.user.id,
      service_id,
      quantity,
    ]);
    res.json(success(result[0][0]));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.getPending = async (req, res) => {
  try {
    console.log("[GET /api/orders/pending] Checking database connection...");
    await db.query("SELECT 1"); // Test connection

    console.log("[GET /api/orders/pending] Checking if view exists...");
    const [views] = await db.query(
      "SELECT TABLE_NAME FROM information_schema.views WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'view_all_orders'"
    );

    if (views.length === 0) {
      throw new Error("view_all_orders does not exist in the database");
    }

    console.log("[GET /api/orders/pending] Querying pending orders...");
    const [result] = await db.query(
      "SELECT * FROM view_all_orders WHERE status = ?",
      ["Pending"]
    );

    console.log(
      "[GET /api/orders/pending] Query result:",
      Array.isArray(result) ? `Found ${result.length} orders` : "No results"
    );

    res.json(success(result || []));
  } catch (err) {
    console.error("[GET /api/orders/pending] Error:", err);
    res.status(500).json(error(err.message || "Database error"));
  }
};

exports.manageOrder = async (req, res) => {
  const { action } = req.body;
  try {
    const [result] = await db.query("CALL sp_manage_order(?, ?, ?)", [
      action,
      req.user.id,
      req.params.id,
    ]);
    res.json(success(null, result[0][0].message));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.getOne = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM view_all_orders WHERE order_id = ?",
      [req.params.id]
    );
    res.json(success(result[0]));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};
