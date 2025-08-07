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
    const [result] = await db.query(
      'SELECT * FROM view_all_orders WHERE status = "Pending" ORDER BY order_date ASC'
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
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
