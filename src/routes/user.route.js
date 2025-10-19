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

router.get("/:id", (req, res) => {
  const user = data.getUserByID(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User is not found" });
  }
  res.status(200).json(user);
});

router.delete("/:id", async (req, res) => {
  const wasDeleted = data.deleteUser(req.params.id);

  if (!wasDeleted) {
    return res.status(404).json({ error: "User is not found" });
  } else {
    res.json({ message: "User was deleted successfully" });
  }
});

module.exports = router;
