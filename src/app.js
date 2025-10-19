const express = require("express");
const app = express();

const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");

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

app.use("/user", userRoutes);
app.use("/users", userRoutes);
app.use("/category", categoryRoutes);
app.use("/categories", categoryRoutes);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
