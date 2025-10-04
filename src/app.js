const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome! Go to /healthcheck to see the status of the server");
});

app.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "OK",
    date: new Date().toISOString(),
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
