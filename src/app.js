const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
