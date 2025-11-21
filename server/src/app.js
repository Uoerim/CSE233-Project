const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const facilitiesRoutes = require("./routes/facilitiesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilitiesRoutes);


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "UMS backend is running" });
});

module.exports = app;
