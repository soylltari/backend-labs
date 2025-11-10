const express = require("express");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");
const recordRoutes = require("./routes/record.route");
const authRoutes = require("./routes/auth.route");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome! Go to /healthcheck to see the status of the server");
});

app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "OK",
    date: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
