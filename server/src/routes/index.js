const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/customers", require("./customers"));
router.use("/employees", require("./employees"));
router.use("/services", require("./services"));
router.use("/orders", require("./orders"));

module.exports = router;
