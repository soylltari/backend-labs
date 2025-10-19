const express = require("express");
const router = express.Router();
const data = require("../data/data.js");

router.post("/", (req, res) => {
  const { name } = req.body;
  const newUser = data.createUser(name);
  res.status(201).json(newUser);
});

router.get("/", (req, res) => {
  const userList = data.getUsers();
  res.status(200).json(userList);
});

module.exports = router;
