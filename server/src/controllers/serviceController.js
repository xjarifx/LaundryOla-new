const db = require("../config/db");
const { success, error } = require("../utils/response");

exports.getAll = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM view_available_services");
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

exports.create = async (req, res) => {
  const { service_name, price } = req.body;
  try {
    const [result] = await db.query("CALL sp_manage_service(?, NULL, ?, ?)", [
      "CREATE",
      service_name,
      price,
    ]);
    res.json(success(null, result[0][0].message));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.update = async (req, res) => {
  const { service_name, price } = req.body;
  try {
    const [result] = await db.query("CALL sp_manage_service(?, ?, ?, ?)", [
      "UPDATE",
      req.params.id,
      service_name,
      price,
    ]);
    res.json(success(null, result[0][0].message));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.delete = async (req, res) => {
  try {
    const [result] = await db.query(
      "CALL sp_manage_service(?, ?, NULL, NULL)",
      ["DELETE", req.params.id]
    );
    res.json(success(null, result[0][0].message));
  } catch (err) {
    res.status(400).json(error(err.message));
  }
};

exports.getOne = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM view_available_services WHERE service_id = ?",
      [req.params.id]
    );
    res.json(success(result[0]));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};
