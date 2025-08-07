const app = require("./config/app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

// Test DB connection on startup
(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
})();

app.get("/", (req, res) => {
  res.send("LaundryOla API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
