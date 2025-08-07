const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.getDashboard = async (req, res) => {
  try {
    const [result] = await db.query("CALL sp_get_dashboard('EMPLOYEE', ?)", [
      req.user.id,
    ]);
    res.json({
      success: true,
      employee_stats: result[0][0],
      pending_orders: result[1],
      current_work: result[2],
    });
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM view_all_orders WHERE employee_id = ?",
      [req.user.id]
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.updateProfile = async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const [result] = await db.query(
      "CALL sp_update_employee_profile(?, ?, ?, ?)",
      [req.user.id, name, phone, email]
    );
    res.json(success(result[0][0], "Profile updated successfully"));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM Employee_Earnings WHERE employee_id = ?",
      [req.user.id]
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};
