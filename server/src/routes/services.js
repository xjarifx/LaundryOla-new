const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const {
  authenticateToken,
  requireEmployee,
} = require("../middlewares/jwtAuth");
const validate = require("../middlewares/validate");
const serviceValidator = require("../validators/serviceValidator");

router.get("/", serviceController.getAll);
router.post(
  "/",
  authenticateToken,
  requireEmployee,
  validate(serviceValidator.create),
  serviceController.create
);
router.put(
  "/:id",
  authenticateToken,
  requireEmployee,
  validate(serviceValidator.update),
  serviceController.update
);
router.delete(
  "/:id",
  authenticateToken,
  requireEmployee,
  serviceController.delete
);
router.get("/:id", serviceController.getOne);

module.exports = router;
